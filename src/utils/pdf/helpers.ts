import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFStyleOptions } from './types';
import { buildATSPDFDocument } from './coreGenerator';

// Configure pdfjs worker source
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('Could not set pdfjs workerSrc:', e);
}

/**
 * Builds and downloads the ATS PDF directly to the user's filesystem.
 */
export const generateATSPDF = (
  languageOrOptions?: 'id' | 'en' | (PDFStyleOptions & { language?: 'id' | 'en' }),
  optionsArg?: PDFStyleOptions
) => {
  const { doc, filename } = buildATSPDFDocument(languageOrOptions, optionsArg);
  doc.save(filename);
};

/**
 * Builds the ATS PDF and returns an object URL string for in-browser preview without downloading.
 */
export const getATSPDFBlobUrl = (
  languageOrOptions?: 'id' | 'en' | (PDFStyleOptions & { language?: 'id' | 'en' }),
  optionsArg?: PDFStyleOptions
): { blobUrl: string; filename: string; totalPages: number } => {
  const { doc, filename, totalPages } = buildATSPDFDocument(languageOrOptions, optionsArg);
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  return { blobUrl, filename, totalPages };
};

/**
 * Triggers standard browser print tailored by print CSS.
 */
export const triggerBrowserPrint = () => {
  window.print();
};

/**
 * Renders all pages of a jsPDF document into PNG data URLs for crisp multi-page previewing.
 */
export const renderPdfToPageImages = async (doc: jsPDF): Promise<string[]> => {
  try {
    const arrayBuffer = doc.output('arraybuffer');
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;

    const pageImageUrls: string[] = [];
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 }); // Crisp 2x scaling

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        await page.render({ canvasContext: context, viewport, canvas }).promise;
        pageImageUrls.push(canvas.toDataURL('image/png'));
      }
    }
    return pageImageUrls;
  } catch (err) {
    console.error('Failed to render PDF page images:', err);
    return [];
  }
};
