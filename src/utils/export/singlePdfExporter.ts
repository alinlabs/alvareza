/**
 * Utility Pembuatan PDF Individual Bertanda Tangan Digital Kriptografi (PAdES)
 * Mengubah setiap lembar berkas WebP/JPEG menjadi dokumen PDF mandiri yang sah,
 * proporsional, dan ditandatangani secara kriptografis atas nama Lembaga Penerbit Resmi Spesifik.
 */

import { PDFDocument } from 'pdf-lib';
import { convertImageToJpeg, JpegConversionOptions } from './imageConverter';
import { signPdfBuffer } from '../crypto/pdfDigitalSigner';
import { ZipFileEntry } from './zipArchiver';
import { getItemIssuerCredentials } from '../../config/config-esign';

export interface SinglePdfExportItem {
  id?: string;
  src: string;
  filename: string;
  title?: string;
  isPortrait?: boolean;
}

/**
 * Membangun 1 berkas PDF individual dari sumber gambar dan menyematkan tanda tangan digital Penerbit Resmi Spesifik.
 */
export async function buildSingleSignedPdfFromImage(
  item: SinglePdfExportItem,
  options: JpegConversionOptions = {}
): Promise<ZipFileEntry> {
  const cleanBaseName = item.filename.replace(/\.[^/.]+$/, '');

  // 1. Dapatkan berkas JPEG berkualitas tinggi & terkompresi
  const jpegItem = await convertImageToJpeg(item.src, cleanBaseName, options);
  const jpegBytes = new Uint8Array(await jpegItem.blob.arrayBuffer());

  // 2. Buat dokumen PDF menggunakan pdf-lib
  const pdfDoc = await PDFDocument.create();
  const embeddedImage = await pdfDoc.embedJpg(jpegBytes);

  const imgWidth = embeddedImage.width;
  const imgHeight = embeddedImage.height;
  const isPortrait = item.isPortrait ?? imgHeight > imgWidth;

  // Ukuran standar A4 dalam poin (72 pt / inch): 595.28 x 841.89 pt
  const a4Width = isPortrait ? 595.28 : 841.89;
  const a4Height = isPortrait ? 841.89 : 595.28;

  const page = pdfDoc.addPage([a4Width, a4Height]);

  // Hitung skala "contain" agar gambar terpasang sempurna di dalam lembar A4 tanpa terpotong
  const scale = Math.min(a4Width / imgWidth, a4Height / imgHeight);
  const drawWidth = imgWidth * scale;
  const drawHeight = imgHeight * scale;
  const xOffset = (a4Width - drawWidth) / 2;
  const yOffset = (a4Height - drawHeight) / 2;

  page.drawImage(embeddedImage, {
    x: xOffset,
    y: yOffset,
    width: drawWidth,
    height: drawHeight,
  });

  // Simpan berkas PDF biner awal
  const unsignedPdfBytes = await pdfDoc.save({ useObjectStreams: false });

  // 3. Sematkan Tanda Tangan Digital Kriptografi Penerbit Resmi Spesifik
  const docTitle = item.title || cleanBaseName;
  const issuerCreds = getItemIssuerCredentials(item.id, item.filename, docTitle);

  const signedPdfBytes = await signPdfBuffer(unsignedPdfBytes, {
    level: 'UNIT_CREDENTIAL',
    title: `${docTitle} - Alvareza Hilka Pratama`,
    author: issuerCreds.signer.commonName,
    subject: issuerCreds.reason,
    keywords: [
      'Digital Profile',
      docTitle,
      issuerCreds.authority.commonName,
      issuerCreds.signer.commonName,
      ...(issuerCreds.coSigner?.commonName ? [issuerCreds.coSigner.commonName] : []),
      ...(issuerCreds.certificateNumber ? [issuerCreds.certificateNumber] : []),
      'Verified Unit Credential',
      'PAdES',
    ],
    reason: issuerCreds.reason,
    authorityProfile: issuerCreds.authority,
    signerProfile: issuerCreds.signer,
  });

  return {
    name: `${cleanBaseName}_Signed.pdf`,
    data: signedPdfBytes,
  };
}

/**
 * Menghasilkan kumpulan berkas PDF bertanda tangan digital secara berurutan (Sequential Batch)
 */
export async function buildBatchSingleSignedPdfs(
  items: SinglePdfExportItem[],
  options: JpegConversionOptions = {},
  onProgress?: (current: number, total: number, title: string) => void
): Promise<ZipFileEntry[]> {
  const results: ZipFileEntry[] = [];
  const total = items.length;

  for (let i = 0; i < total; i++) {
    const item = items[i];
    const displayTitle = item.title || item.filename;

    if (onProgress) {
      onProgress(i + 1, total, displayTitle);
    }

    const signedPdfEntry = await buildSingleSignedPdfFromImage(item, options);
    results.push(signedPdfEntry);

    // Yield sesaat ke event loop
    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  return results;
}
