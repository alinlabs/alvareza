/**
 * Utility Pembuatan Arsip ZIP di Browser menggunakan JSZip
 * Mendukung kompresi DEFLATE, progress callback, dan auto-trigger download.
 */

import JSZip from 'jszip';

export interface ZipFileEntry {
  name: string;
  data: Blob | Uint8Array | ArrayBuffer | string;
}

/**
 * Membundel array berkas (Blob / Uint8Array) ke dalam satu berkas .zip dan mengunduhnya.
 */
export async function createAndDownloadZip(
  files: ZipFileEntry[],
  zipFileName: string,
  onProgress?: (percent: number, currentTask: string) => void
): Promise<void> {
  const zip = new JSZip();

  // Tambahkan setiap berkas ke dalam ZIP
  files.forEach((file) => {
    zip.file(file.name, file.data);
  });

  // Hasilkan Blob arsip ZIP terkompresi
  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6,
      },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent), metadata.currentFile || 'Mengompresi berkas...');
      }
    }
  );

  // Trigger unduhan otomatis ke browser
  const downloadUrl = URL.createObjectURL(zipBlob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = zipFileName.endsWith('.zip') ? zipFileName : `${zipFileName}.zip`;
  document.body.appendChild(anchor);
  anchor.click();

  // Bersihkan elemen dan Object URL
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(downloadUrl);
  }, 1000);
}
