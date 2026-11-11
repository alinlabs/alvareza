import { useState } from 'react';
import { convertImageToJpeg, convertBatchImagesToJpeg } from './imageConverter';
import { buildSingleSignedPdfFromImage, buildBatchSingleSignedPdfs } from './singlePdfExporter';
import { createAndDownloadZip } from './zipArchiver';
import { signPdfBuffer } from '../crypto/pdfDigitalSigner';
import { getItemIssuerCredentials, getMasterDossierCredentials } from '../../config/config-esign';
import { PDFDocument } from 'pdf-lib';

export interface DocumentExportItem {
  id: string;
  title: string;
  src: string;
  filename: string;
  isPortrait?: boolean;
}

export interface UseDownloadEngineProps {
  documentCategory?: 'awards' | 'certification' | 'portfolio' | 'academic' | 'identity' | 'cv' | 'cover-letter';
  documentTitle: string;
  items: DocumentExportItem[];
  isColorMode?: boolean;
  onBuildCompletePdf?: (
    onProgress: (current: number, total: number, title: string) => void
  ) => Promise<Uint8Array | string>;
  onFinish?: () => void;
}

export function useDownloadEngine({
  documentCategory,
  documentTitle,
  items,
  isColorMode = true,
  onBuildCompletePdf,
  onFinish,
}: UseDownloadEngineProps) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingType, setProcessingType] = useState<
    'single_image' | 'single_pdf' | 'images_non_zip' | 'images_zip' | 'pdfs_zip' | 'full_pdf' | null
  >(null);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const isSingleItem = items.length === 1;

  const resetState = () => {
    setIsProcessing(false);
    setProcessingType(null);
    setProgressStatus('');
    setProgressPercent(0);
  };

  const getSingleItemBaseName = (): string => {
    if (items.length === 0) return documentTitle.replace(/\s+/g, '_');
    const single = items[0];
    const raw = (single.title || single.filename.replace(/\.[^/.]+$/, '') || documentTitle)
      .replace(/[\s\(\)]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    const hasName = raw.toLowerCase().includes('alvareza');
    return hasName ? raw : `${raw}_Alvareza_H_Pratama`;
  };

  /**
   * BERKAS TUNGGAL: Unduh 1 Gambar format JPEG langsung tanpa ZIP
   */
  const handleDownloadSingleImage = async () => {
    if (items.length === 0) return;
    const item = items[0];
    try {
      setIsProcessing(true);
      setProcessingType('single_image');
      setProgressPercent(20);
      setProgressStatus(`Mengonversi ${item.title || 'gambar'} ke JPEG...`);

      const cleanBaseName = getSingleItemBaseName();
      const jpegItem = await convertImageToJpeg(
        item.src,
        cleanBaseName,
        { isGrayscale: !isColorMode, quality: 0.90, maxDimension: 2400 }
      );

      setProgressPercent(75);
      setProgressStatus('Mengunduh berkas gambar JPEG...');

      const blobUrl = URL.createObjectURL(jpegItem.blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const downloadName = `${cleanBaseName}${!isColorMode ? '_BW' : ''}.jpg`;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      setProgressPercent(100);
      setProgressStatus('Selesai! Gambar berhasil diunduh.');
      setTimeout(() => {
        resetState();
        onFinish?.();
      }, 1200);
    } catch (err) {
      console.error('Gagal mengunduh gambar tunggal:', err);
      setProgressStatus('Terjadi kesalahan saat memproses gambar.');
      setTimeout(() => resetState(), 2000);
    }
  };

  /**
   * BERKAS TUNGGAL: Unduh 1 Berkas PDF Bertanda Tangan Digital Kriptografi langsung tanpa ZIP
   */
  const handleDownloadSinglePdf = async () => {
    if (items.length === 0) return;
    const item = items[0];
    try {
      setIsProcessing(true);
      setProcessingType('single_pdf');
      setProgressPercent(15);
      setProgressStatus(`Menyusun dokumen PDF ${item.title || ''}...`);

      const cleanBaseName = getSingleItemBaseName();
      const downloadPdfName = `${cleanBaseName}${!isColorMode ? '_BW' : ''}.pdf`;

      if (onBuildCompletePdf) {
        const rawOutput = await onBuildCompletePdf((current, total, title) => {
          const pct = Math.round((current / total) * 55) + 15;
          setProgressPercent(pct);
          setProgressStatus(`Menyusun berkas PDF: ${title}`);
        });

        let unsignedBytes: Uint8Array;
        if (typeof rawOutput === 'string') {
          const binaryStr = atob(rawOutput);
          unsignedBytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            unsignedBytes[i] = binaryStr.charCodeAt(i);
          }
        } else {
          unsignedBytes = rawOutput;
        }

        setProgressPercent(75);
        setProgressStatus('Menyematkan Tanda Tangan Digital Kriptografi...');

        let finalPdfBytes = unsignedBytes;
        try {
          const docTitle = item.title || cleanBaseName;
          const issuerCreds = getItemIssuerCredentials(item.id, item.filename, docTitle);

          finalPdfBytes = await signPdfBuffer(unsignedBytes, {
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
        } catch (signErr) {
          console.warn('Signing step warning:', signErr);
        }

        setProgressPercent(90);
        setProgressStatus('Mengunduh dokumen PDF...');

        const signedBlob = new Blob([finalPdfBytes], { type: 'application/pdf' });
        const downloadUrl = URL.createObjectURL(signedBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = downloadPdfName;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        }, 1000);
      } else {
        const singleEntry = await buildSingleSignedPdfFromImage(
          {
            id: item.id,
            src: item.src,
            filename: item.filename,
            title: item.title,
            isPortrait: item.isPortrait,
          },
          { isGrayscale: !isColorMode, quality: 0.88, maxDimension: 1800 }
        );

        setProgressPercent(90);
        setProgressStatus('Mengunduh dokumen PDF...');

        const signedBlob = new Blob([singleEntry.data], { type: 'application/pdf' });
        const downloadUrl = URL.createObjectURL(signedBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = downloadPdfName;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        }, 1000);
      }

      setProgressPercent(100);
      setProgressStatus('Selesai! Dokumen PDF terunduh.');
      setTimeout(() => {
        resetState();
        onFinish?.();
      }, 1200);
    } catch (err) {
      console.error('Gagal mengunduh PDF tunggal:', err);
      setProgressStatus('Gagal menghasilkan dokumen PDF.');
      setTimeout(() => resetState(), 2000);
    }
  };

  /**
   * BANYAK BERKAS: Unduh Semua Gambar Secara Langsung dan Berurutan (Non-ZIP)
   */
  const handleDownloadImagesNonZip = async () => {
    try {
      setIsProcessing(true);
      setProcessingType('images_non_zip');
      setProgressPercent(5);
      setProgressStatus('Mengonversi berkas gambar ke JPEG...');

      const jpegItems = await convertBatchImagesToJpeg(
        items.map((item, idx) => ({
          src: item.src,
          filename: `${String(idx + 1).padStart(2, '0')}_${item.filename.replace(/\.[^/.]+$/, '')}.jpg`,
          title: item.title,
        })),
        { isGrayscale: !isColorMode, quality: 0.88, maxDimension: 1800 },
        (current, total, title) => {
          const pct = Math.round((current / total) * 50) + 5;
          setProgressPercent(pct);
          setProgressStatus(`Mengonversi ${current}/${total}: ${title}`);
        }
      );

      setProgressPercent(60);
      setProgressStatus('Mengunduh berkas gambar berurutan...');

      for (let i = 0; i < jpegItems.length; i++) {
        const item = jpegItems[i];
        const pct = 60 + Math.round(((i + 1) / jpegItems.length) * 38);
        setProgressPercent(pct);
        setProgressStatus(`Mengunduh (${i + 1}/${jpegItems.length}): ${item.name}`);

        const blobUrl = URL.createObjectURL(item.blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = item.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        await new Promise((resolve) => setTimeout(resolve, 350));
        URL.revokeObjectURL(blobUrl);
      }

      setProgressPercent(100);
      setProgressStatus('Selesai! Semua gambar berhasil diunduh.');
      setTimeout(() => {
        resetState();
        onFinish?.();
      }, 1200);
    } catch (err) {
      console.error('Gagal mengunduh gambar berurutan non-ZIP:', err);
      setProgressStatus('Terjadi kesalahan saat mengunduh gambar.');
      setTimeout(() => resetState(), 2000);
    }
  };

  /**
   * BANYAK BERKAS: Unduh Gambar Terpisah (.zip)
   */
  const handleDownloadImagesZip = async () => {
    try {
      setIsProcessing(true);
      setProcessingType('images_zip');
      setProgressPercent(10);
      setProgressStatus('Mengonversi berkas ke JPEG...');

      const jpegItems = await convertBatchImagesToJpeg(
        items.map((item, idx) => ({
          src: item.src,
          filename: `${String(idx + 1).padStart(2, '0')}_${item.filename.replace(/\.[^/.]+$/, '')}.jpg`,
          title: item.title,
        })),
        { isGrayscale: !isColorMode, quality: 0.84, maxDimension: 1600 },
        (current, total, title) => {
          const pct = Math.round((current / total) * 60) + 10;
          setProgressPercent(pct);
          setProgressStatus(`Mengonversi ${current}/${total}: ${title}`);
        }
      );

      setProgressPercent(75);
      setProgressStatus('Mengompresi berkas ke dalam .zip...');

      const zipEntries = jpegItems.map((j) => ({
        name: j.name,
        data: j.blob,
      }));

      const zipFileName = `${documentTitle.replace(/\s+/g, '_')}_Alvareza_H_Pratama_JPG.zip`;
      await createAndDownloadZip(zipEntries, zipFileName, (pct) => {
        setProgressPercent(75 + Math.round((pct * 25) / 100));
        setProgressStatus(`Mengompresi arsip ZIP... (${pct}%)`);
      });

      setProgressPercent(100);
      setProgressStatus('Selesai! Berkas ZIP terunduh.');
      setTimeout(() => {
        resetState();
        onFinish?.();
      }, 1200);
    } catch (err) {
      console.error('Gagal mengunduh gambar ZIP:', err);
      setProgressStatus('Terjadi kesalahan saat memproses ZIP.');
      setTimeout(() => resetState(), 2000);
    }
  };

  /**
   * BANYAK BERKAS: Unduh PDF Terpisah (.zip) dengan Tanda Tangan Digital Kriptografi
   */
  const handleDownloadPdfsZip = async () => {
    try {
      setIsProcessing(true);
      setProcessingType('pdfs_zip');
      setProgressPercent(10);
      setProgressStatus('Menghasilkan berkas PDF bertanda tangan digital...');

      const singlePdfEntries = await buildBatchSingleSignedPdfs(
        items.map((item, idx) => ({
          id: item.id,
          src: item.src,
          filename: `${String(idx + 1).padStart(2, '0')}_${item.filename.replace(/\.[^/.]+$/, '')}.pdf`,
          title: item.title,
          isPortrait: item.isPortrait,
        })),
        { isGrayscale: !isColorMode, quality: 0.82, maxDimension: 1600 },
        (current, total, title) => {
          const pct = Math.round((current / total) * 70) + 10;
          setProgressPercent(pct);
          setProgressStatus(`Menandatangani PDF ${current}/${total}: ${title}`);
        }
      );

      setProgressPercent(82);
      setProgressStatus('Mengompresi PDF bertanda tangan ke .zip...');

      const zipFileName = `${documentTitle.replace(/\s+/g, '_')}_Alvareza_H_Pratama_PDF_Terpisah.zip`;
      await createAndDownloadZip(singlePdfEntries, zipFileName, (pct) => {
        setProgressPercent(82 + Math.round((pct * 18) / 100));
        setProgressStatus(`Mengompresi arsip ZIP... (${pct}%)`);
      });

      setProgressPercent(100);
      setProgressStatus('Selesai! Berkas ZIP terunduh.');
      setTimeout(() => {
        resetState();
        onFinish?.();
      }, 1200);
    } catch (err) {
      console.error('Gagal mengunduh PDF terpisah ZIP:', err);
      setProgressStatus('Terjadi kesalahan saat memproses PDF.');
      setTimeout(() => resetState(), 2000);
    }
  };

  /**
   * BANYAK BERKAS: Unduh PDF Lengkap (.pdf) Terpadu dengan Master Digital Signature
   */
  const handleDownloadFullPdf = async () => {
    try {
      setIsProcessing(true);
      setProcessingType('full_pdf');
      setProgressPercent(15);
      setProgressStatus('Menyusun lembar berkas PDF lengkap...');

      let unsignedBytes: Uint8Array;

      if (onBuildCompletePdf) {
        const rawOutput = await onBuildCompletePdf((current, total, title) => {
          const pct = Math.round((current / total) * 60) + 15;
          setProgressPercent(pct);
          setProgressStatus(`Menyusun halaman ${current}/${total}: ${title}`);
        });

        if (typeof rawOutput === 'string') {
          const binaryStr = atob(rawOutput);
          unsignedBytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            unsignedBytes[i] = binaryStr.charCodeAt(i);
          }
        } else {
          unsignedBytes = rawOutput;
        }
      } else {
        const pdfDoc = await PDFDocument.create();
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          setProgressStatus(`Memuat lembar ${i + 1}/${items.length}: ${item.title}`);
          setProgressPercent(15 + Math.round(((i + 1) / items.length) * 60));

          const res = await fetch(item.src);
          const blob = await res.blob();
          const arrayBuf = await blob.arrayBuffer();

          let embeddedImg;
          if (item.src.endsWith('.png')) {
            embeddedImg = await pdfDoc.embedPng(arrayBuf);
          } else {
            embeddedImg = await pdfDoc.embedJpg(arrayBuf);
          }

          const isPortrait = item.isPortrait ?? embeddedImg.height > embeddedImg.width;
          const a4W = isPortrait ? 595.28 : 841.89;
          const a4H = isPortrait ? 841.89 : 595.28;
          const p = pdfDoc.addPage([a4W, a4H]);

          const scale = Math.min(a4W / embeddedImg.width, a4H / embeddedImg.height);
          const dw = embeddedImg.width * scale;
          const dh = embeddedImg.height * scale;
          p.drawImage(embeddedImg, {
            x: (a4W - dw) / 2,
            y: (a4H - dh) / 2,
            width: dw,
            height: dh,
          });
        }
        unsignedBytes = await pdfDoc.save({ useObjectStreams: false });
      }

      setProgressPercent(80);
      setProgressStatus('Menyematkan Master Digital Signature (PKCS#7)...');

      const masterCreds = getMasterDossierCredentials(documentCategory as any, documentTitle);

      const signedBytes = await signPdfBuffer(unsignedBytes, {
        level: 'MASTER_DOSSIER',
        title: `${documentTitle} - Alvareza Hilka Pratama`,
        author: masterCreds.signer.commonName,
        subject: masterCreds.reason,
        keywords: [
          'Digital Profile',
          documentTitle,
          'Master Dossier',
          masterCreds.authority.commonName,
          masterCreds.signer.commonName,
          'Verified Credential',
          'PAdES',
        ],
        reason: masterCreds.reason,
        authorityProfile: masterCreds.authority,
        signerProfile: masterCreds.signer,
      });

      setProgressPercent(95);
      setProgressStatus('Mengunduh dokumen PDF...');

      const signedBlob = new Blob([signedBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(signedBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const baseFilename = `${documentTitle.replace(/\s+/g, '_')}_Alvareza_H_Pratama_Lengkap`;
      a.download = `${baseFilename}${!isColorMode ? '_BW' : ''}.pdf`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }, 1000);

      setProgressPercent(100);
      setProgressStatus('Selesai! PDF Lengkap terunduh.');
      setTimeout(() => {
        resetState();
        onFinish?.();
      }, 1200);
    } catch (err) {
      console.error('Gagal mengunduh PDF Lengkap:', err);
      setProgressStatus('Gagal menghasilkan PDF Lengkap.');
      setTimeout(() => resetState(), 2000);
    }
  };

  return {
    isSingleItem,
    isProcessing,
    processingType,
    progressStatus,
    progressPercent,
    resetState,
    handleDownloadSingleImage,
    handleDownloadSinglePdf,
    handleDownloadImagesNonZip,
    handleDownloadFullPdf,
    handleDownloadImagesZip,
    handleDownloadPdfsZip,
  };
}
