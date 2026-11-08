import { PDFDocument } from 'pdf-lib';
import { GasAttachment } from '../types/gasSender';

export interface AcademicDocItem {
  id: 'skl' | 'transkrip';
  title: string;
  subtitle: string;
  filename: string;
  filenameBw: string;
  url: string;
  urlBw: string;
}

export const ALL_ACADEMIC_DOCS: AcademicDocItem[] = [
  {
    id: 'skl',
    title: 'Surat Keterangan Lulus',
    subtitle: 'Surat Keterangan Lulus (SKL) Resmi',
    filename: 'skl-alvareza.pdf',
    filenameBw: 'skl-alvareza-bw.pdf',
    url: '/akademik/skl.webp',
    urlBw: '/akademik/skl.webp',
  },
  {
    id: 'transkrip',
    title: 'Transkrip Nilai',
    subtitle: 'Transkrip Nilai Akademik Resmi (IPK 3,63 • Dengan Pujian)',
    filename: 'transkrip.pdf',
    filenameBw: 'transkrip-bw.pdf',
    url: '/akademik/transkrip.webp',
    urlBw: '/akademik/transkrip.webp',
  },
];

/**
 * Loads an image from URL and returns a JPEG Uint8Array buffer (with optional grayscale applied)
 */
async function getJpgBytesFromImageUrl(imageUrl: string, isColorPrint: boolean = true): Promise<Uint8Array> {
  if (typeof window === 'undefined') {
    const res = await fetch(imageUrl);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 1240;
        canvas.height = img.naturalHeight || img.height || 1754;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (!isColorPrint) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
          }
          ctx.putImageData(imgData, 0, 0);
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64Data = dataUrl.split(',')[1];
        const binaryStr = atob(base64Data);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        resolve(bytes);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
}

/**
 * Fetch a single academic document from /akademik/ (.webp) and return as lightweight PDF GasAttachment.
 */
export async function getAcademicAttachment(
  docId: string,
  isColorPrint: boolean = false
): Promise<GasAttachment | null> {
  const doc = ALL_ACADEMIC_DOCS.find((d) => d.id === docId);
  if (!doc) return null;

  const targetFilename = isColorPrint ? doc.filename : doc.filenameBw;

  try {
    const jpgBytes = await getJpgBytesFromImageUrl(doc.url, isColorPrint);

    const pdfDoc = await PDFDocument.create();
    const embeddedImg = await pdfDoc.embedJpg(jpgBytes);

    const imgWidth = embeddedImg.width;
    const imgHeight = embeddedImg.height;

    let pageWidth = 595.28;
    let pageHeight = 841.89;
    if (imgWidth > imgHeight) {
      pageWidth = 841.89;
      pageHeight = 595.28;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    page.drawImage(embeddedImg, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

    let binary = '';
    const len = pdfBytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(pdfBytes[i]);
    }
    const base64 = btoa(binary);

    return {
      filename: targetFilename,
      mimeType: 'application/pdf',
      base64,
      sizeBytes: pdfBytes.byteLength,
    };
  } catch (err) {
    console.error(`Failed to generate academic PDF attachment (${docId}):`, err);
    return null;
  }
}

/**
 * Merge both Surat Keterangan Lulus (SKL) and Transkrip Nilai into a lightweight single PDF.
 */
export async function getMergedAcademicAttachment(
  isColorPrint: boolean = false
): Promise<GasAttachment | null> {
  try {
    const sklDocObj = ALL_ACADEMIC_DOCS.find((d) => d.id === 'skl') || ALL_ACADEMIC_DOCS[0];
    const transkripDocObj = ALL_ACADEMIC_DOCS.find((d) => d.id === 'transkrip') || ALL_ACADEMIC_DOCS[1];

    const [sklJpg, transkripJpg] = await Promise.all([
      getJpgBytesFromImageUrl(sklDocObj.url, isColorPrint),
      getJpgBytesFromImageUrl(transkripDocObj.url, isColorPrint),
    ]);

    const pdfDoc = await PDFDocument.create();

    // Halaman 1: SKL
    const sklImg = await pdfDoc.embedJpg(sklJpg);
    let pw1 = 595.28, ph1 = 841.89;
    if (sklImg.width > sklImg.height) { pw1 = 841.89; ph1 = 595.28; }
    const page1 = pdfDoc.addPage([pw1, ph1]);
    const scale1 = Math.min(pw1 / sklImg.width, ph1 / sklImg.height);
    const w1 = sklImg.width * scale1;
    const h1 = sklImg.height * scale1;
    page1.drawImage(sklImg, {
      x: (pw1 - w1) / 2,
      y: (ph1 - h1) / 2,
      width: w1,
      height: h1,
    });

    // Halaman 2: Transkrip
    const transkripImg = await pdfDoc.embedJpg(transkripJpg);
    let pw2 = 595.28, ph2 = 841.89;
    if (transkripImg.width > transkripImg.height) { pw2 = 841.89; ph2 = 595.28; }
    const page2 = pdfDoc.addPage([pw2, ph2]);
    const scale2 = Math.min(pw2 / transkripImg.width, ph2 / transkripImg.height);
    const w2 = transkripImg.width * scale2;
    const h2 = transkripImg.height * scale2;
    page2.drawImage(transkripImg, {
      x: (pw2 - w2) / 2,
      y: (ph2 - h2) / 2,
      width: w2,
      height: h2,
    });

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

    let binary = '';
    const len = pdfBytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(pdfBytes[i]);
    }
    const base64 = btoa(binary);

    return {
      filename: isColorPrint ? 'akademik-alvareza.pdf' : 'akademik-alvareza-bw.pdf',
      mimeType: 'application/pdf',
      base64,
      sizeBytes: pdfBytes.byteLength,
    };
  } catch (err) {
    console.error('Failed to merge academic PDFs:', err);
    return null;
  }
}

/**
 * Resolves academic attachments based on selection and color mode:
 */
export async function getAcademicAttachments(
  docIds: string[],
  isColorPrint: boolean = false
): Promise<GasAttachment[]> {
  if (!docIds || docIds.length === 0) return [];

  const hasSkl = docIds.includes('skl');
  const hasTranskrip = docIds.includes('transkrip');

  if (hasSkl && hasTranskrip) {
    const merged = await getMergedAcademicAttachment(isColorPrint);
    if (merged) return [merged];
  }

  const attachments: GasAttachment[] = [];
  for (const docId of docIds) {
    const att = await getAcademicAttachment(docId, isColorPrint);
    if (att) {
      attachments.push(att);
    }
  }
  return attachments;
}

/**
 * Download selected academic document(s) as lightweight PDF:
 */
export async function downloadAcademicDocs(
  docIds: string[],
  isColorPrint: boolean = false
): Promise<void> {
  if (!docIds || docIds.length === 0) return;

  const hasSkl = docIds.includes('skl');
  const hasTranskrip = docIds.includes('transkrip');

  if (hasSkl && hasTranskrip) {
    const merged = await getMergedAcademicAttachment(isColorPrint);
    if (merged) {
      triggerDownloadBase64Pdf(
        merged.base64,
        isColorPrint ? 'akademik-alvareza.pdf' : 'akademik-alvareza-bw.pdf'
      );
      return;
    }
  }

  for (const docId of docIds) {
    const att = await getAcademicAttachment(docId, isColorPrint);
    if (att) {
      triggerDownloadBase64Pdf(att.base64, att.filename);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
}

function triggerDownloadBase64Pdf(base64: string, filename: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
