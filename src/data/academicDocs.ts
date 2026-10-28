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
    url: '/akademik/skl_alvareza.pdf',
    urlBw: '/akademik/skl_alvareza_bw.pdf',
  },
  {
    id: 'transkrip',
    title: 'Transkrip Nilai',
    subtitle: 'Transkrip Nilai Akademik Resmi (IPK 3,63 • Dengan Pujian)',
    filename: 'transkrip.pdf',
    filenameBw: 'transkrip-bw.pdf',
    url: '/akademik/transkrip_alvareza.pdf',
    urlBw: '/akademik/transkrip_alvareza_bw.pdf',
  },
];

/**
 * Fetch a single academic document from /akademik/ and return as GasAttachment.
 * Respects isColorPrint: when false (default), retrieves the black-and-white (DeviceGray) version.
 */
export async function getAcademicAttachment(
  docId: string,
  isColorPrint: boolean = false
): Promise<GasAttachment | null> {
  const doc = ALL_ACADEMIC_DOCS.find((d) => d.id === docId);
  if (!doc) return null;

  const targetUrl = isColorPrint ? doc.url : doc.urlBw;
  const targetFilename = isColorPrint ? doc.filename : doc.filenameBw;

  try {
    const res = await fetch(targetUrl);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return {
      filename: targetFilename,
      mimeType: 'application/pdf',
      base64,
      sizeBytes: bytes.byteLength,
    };
  } catch (err) {
    console.error(`Failed to fetch academic document (${docId}):`, err);
    return null;
  }
}

/**
 * Merge both Surat Keterangan Lulus (SKL) and Transkrip Nilai into a lightweight single PDF.
 * When isColorPrint is false (default), merges the black-and-white (BW) source files.
 */
export async function getMergedAcademicAttachment(
  isColorPrint: boolean = false
): Promise<GasAttachment | null> {
  try {
    const sklPath = isColorPrint ? '/akademik/skl_alvareza.pdf' : '/akademik/skl_alvareza_bw.pdf';
    const transkripPath = isColorPrint
      ? '/akademik/transkrip_alvareza.pdf'
      : '/akademik/transkrip_alvareza_bw.pdf';

    const [sklRes, transkripRes] = await Promise.all([
      fetch(sklPath),
      fetch(transkripPath),
    ]);

    if (!sklRes.ok || !transkripRes.ok) {
      throw new Error('Gagal memuat berkas PDF akademik dari direktori public.');
    }

    const [sklBuffer, transkripBuffer] = await Promise.all([
      sklRes.arrayBuffer(),
      transkripRes.arrayBuffer(),
    ]);

    const mergedPdf = await PDFDocument.create();
    const sklDoc = await PDFDocument.load(sklBuffer);
    const transkripDoc = await PDFDocument.load(transkripBuffer);

    // Salin halaman SKL
    const sklPages = await mergedPdf.copyPages(sklDoc, sklDoc.getPageIndices());
    sklPages.forEach((page) => mergedPdf.addPage(page));

    // Salin halaman Transkrip Nilai
    const transkripPages = await mergedPdf.copyPages(transkripDoc, transkripDoc.getPageIndices());
    transkripPages.forEach((page) => mergedPdf.addPage(page));

    // Simpan dengan kompresi stream standar pdf-lib yang sangat ringan
    const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });

    let binary = '';
    const len = mergedPdfBytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(mergedPdfBytes[i]);
    }
    const base64 = btoa(binary);

    return {
      filename: isColorPrint ? 'akademik-alvareza.pdf' : 'akademik-alvareza-bw.pdf',
      mimeType: 'application/pdf',
      base64,
      sizeBytes: mergedPdfBytes.byteLength,
    };
  } catch (err) {
    console.error('Failed to merge academic PDFs:', err);
    return null;
  }
}

/**
 * Resolves academic attachments based on selection and color mode:
 * - If both 'skl' and 'transkrip' are selected, merges them into 'akademik-alvareza.pdf' (or 'akademik-alvareza-bw.pdf').
 * - If only one is selected, returns that single document in color or BW.
 * - If none, returns empty array.
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
 * Download selected academic document(s):
 * - If both 'skl' and 'transkrip' are selected, downloads merged 'akademik-alvareza.pdf' (or 'akademik-alvareza-bw.pdf').
 * - If only 1 selected, downloads that specific PDF in color or BW directly.
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
      const byteCharacters = atob(merged.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isColorPrint ? 'akademik-alvareza.pdf' : 'akademik-alvareza-bw.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }
  }

  for (const docId of docIds) {
    const doc = ALL_ACADEMIC_DOCS.find((d) => d.id === docId);
    if (doc) {
      const targetUrl = isColorPrint ? doc.url : doc.urlBw;
      const targetFilename = isColorPrint ? doc.filename : doc.filenameBw;
      const a = document.createElement('a');
      a.href = targetUrl;
      a.download = targetFilename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
}
