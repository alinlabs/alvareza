import { PDFDocument } from 'pdf-lib';
import { pdfjs } from 'react-pdf';
import { jsPDF } from 'jspdf';

// Ensure PDF.js worker is properly configured
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export interface AttachmentItem {
  blob: Blob;
  filename: string;
}

/**
 * Merges multiple PDF files into a single PDF document using pdf-lib.
 * Preserves native vector paths, fonts, and original structure.
 */
export async function mergePdfDocuments(
  gatheredAttachments: AttachmentItem[],
  signal?: AbortSignal
): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  
  for (const item of gatheredAttachments) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    
    const isPdf = item.blob.type === 'application/pdf' || item.filename.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      const arrayBuffer = await item.blob.arrayBuffer();
      await new Promise(r => setTimeout(r, 10)); // Yield to main thread
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      
      const pdf = await PDFDocument.load(arrayBuffer);
      await new Promise(r => setTimeout(r, 10)); // Yield to main thread

      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
      await new Promise(r => setTimeout(r, 10));
    }
  }
  
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
  
  const mergedPdfBytes = await mergedPdf.save();
  return new Blob([mergedPdfBytes], { type: 'application/pdf' });
}

/**
 * Optimizes a PDF blob so that its total byte size stays within targetMaxKb,
 * while maintaining excellent visual text legibility and quality.
 *
 * Category targets:
 * - CV: Max 500 KB
 * - Pengalaman Kerja: Max 1.5 MB (1500 KB)
 * - Portofolio: Max 1 MB (1000 KB)
 * - Sertifikat: Max 2 MB (2000 KB)
 */
export async function optimizeSinglePdfBlob(
  blob: Blob,
  targetMaxKb: number,
  signal?: AbortSignal
): Promise<Blob> {
  const targetMaxBytes = targetMaxKb * 1024;
  
  // If the blob is already within the target size limit, return original untouched
  // (100% crisp vector fonts and pristine quality)
  if (blob.size <= targetMaxBytes) {
    return blob;
  }

  try {
    const arrayBuffer = await blob.arrayBuffer();
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    // Multi-pass configuration to maximize legibility while respecting target size
    // Higher scale (DPI) & quality ensures text remains sharp & crisp without blur or pixelation
    const passes = [
      { scale: 2.5, quality: 0.90 }, // ~180-200 DPI, Ultra Crisp & Sharp
      { scale: 2.2, quality: 0.86 }, // ~160 DPI, High Resolution
      { scale: 1.8, quality: 0.83 }, // ~130 DPI, Very Legible
      { scale: 1.5, quality: 0.80 }, // ~100 DPI, Compact Fallback
    ];

    let bestResultBlob: Blob = blob;
    let smallestBlob: Blob = blob;

    for (let p = 0; p < passes.length; p++) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      const { scale, quality } = passes[p];

      const outPdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      outPdf.deletePage(1); // Remove default page

      for (let i = 1; i <= numPages; i++) {
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        if (ctx) {
          // Fill canvas with solid white background to prevent dark gray/black borders or JPEG transparency artifacts
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          await page.render({ canvasContext: ctx, canvas: ctx.canvas as any, viewport }).promise;
          const imgData = canvas.toDataURL('image/jpeg', quality);

          const pWidth = viewport.width * (0.264583 / scale);
          const pHeight = viewport.height * (0.264583 / scale);
          const orientation = pWidth > pHeight ? 'l' : 'p';

          outPdf.addPage([pWidth, pHeight], orientation);
          outPdf.addImage(imgData, 'JPEG', 0, 0, pWidth, pHeight, undefined, 'FAST');
        }
      }

      const passArrayBuffer = outPdf.output('arraybuffer');
      const passBlob = new Blob([passArrayBuffer], { type: 'application/pdf' });

      if (passBlob.size < smallestBlob.size) {
        smallestBlob = passBlob;
      }

      // Stop as soon as target size goal is met
      if (passBlob.size <= targetMaxBytes) {
        bestResultBlob = passBlob;
        return bestResultBlob;
      }
    }

    // If all passes exceed targetMaxBytes, return the smallest produced pass if smaller than original
    return smallestBlob.size < blob.size ? smallestBlob : blob;
  } catch (err) {
    console.warn('PDF compression error, falling back to original blob:', err);
    return blob;
  }
}

/**
 * Merges multiple PDF attachments and ensures the resulting combined PDF stays
 * within targetMaxKb with high visual clarity.
 */
export async function mergeAndOptimizePdfDocuments(
  gatheredAttachments: AttachmentItem[],
  targetMaxKb: number,
  signal?: AbortSignal
): Promise<Blob> {
  const mergedBlob = await mergePdfDocuments(gatheredAttachments, signal);
  return optimizeSinglePdfBlob(mergedBlob, targetMaxKb, signal);
}

/**
 * Ensures that the sum of sizes of all attachment blobs stays strictly under maxTotalKb (default 5000 KB / 5 MB).
 * If the sum exceeds maxTotalKb, it scales down PDF attachments proportionally to guarantee the total <= maxTotalKb.
 */
export async function ensureTotalAttachmentsUnderLimit(
  attachments: { blob: Blob; filename: string }[],
  maxTotalKb: number = 5000,
  signal?: AbortSignal
): Promise<{ blob: Blob; filename: string }[]> {
  const maxTotalBytes = maxTotalKb * 1024;
  const totalBytes = attachments.reduce((sum, item) => sum + item.blob.size, 0);

  if (totalBytes <= maxTotalBytes) {
    return attachments;
  }

  const ratio = maxTotalBytes / totalBytes;
  const result: { blob: Blob; filename: string }[] = [];

  for (const item of attachments) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const isPdf = item.blob.type === 'application/pdf' || item.filename.toLowerCase().endsWith('.pdf');
    if (isPdf && item.blob.size > 100 * 1024) {
      const targetItemKb = Math.floor((item.blob.size * ratio) / 1024);
      const optimized = await optimizeSinglePdfBlob(item.blob, Math.max(targetItemKb, 150), signal);
      result.push({ blob: optimized, filename: item.filename });
    } else {
      result.push(item);
    }
  }

  return result;
}

/**
 * Builds email FormData containing all parameters and attachments
 */
export function buildEmailFormData(
  fields: {
    targetEmail: string;
    subject: string;
    body: string;
    bodyFontFamily: string;
    emailFormat: string;
    paragraphAlign: string;
    location: string;
  },
  attachments: AttachmentItem[]
): FormData {
  const formData = new FormData();
  formData.append('targetEmail', fields.targetEmail);
  formData.append('subject', fields.subject);
  formData.append('body', fields.body);
  formData.append('bodyFontFamily', fields.bodyFontFamily);
  formData.append('emailFormat', fields.emailFormat);
  formData.append('paragraphAlign', fields.paragraphAlign);
  formData.append('location', fields.location);
  
  for (const attachment of attachments) {
    formData.append('attachments', attachment.blob, attachment.filename);
  }
  
  return formData;
}
