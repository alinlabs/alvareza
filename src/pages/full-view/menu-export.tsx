/**
 * menu-export.tsx
 * Komponen Dropdown Menu Berbagi & Ekspor 2-Layer untuk Seluruh Halaman Full View.
 *
 * Layer 1: QR Code, Salin Link, Unduh (dengan transisi ke Layer 2)
 * Layer 2:
 *  - Jika 1 Berkas / Gambar Tunggal: Hanya "Gambar Asli" (.JPG) & "PDF" (.PDF berkredensial) tanpa ZIP.
 *  - Jika > 1 Berkas: "Gambar Asli" (.JPG), "PDF Lengkap" (.PDF), "Gambar Terpisah" (.ZIP), dan "PDF Terpisah" (.ZIP).
 * Dilengkapi visual progress bar dan native digital signature encryption.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Share2,
  QrCode,
  Copy,
  CheckCheck,
  Download,
  ArrowLeft,
  FileText,
  Images,
  Loader2,
  FolderArchive,
} from 'lucide-react';
import { convertImageToJpeg, convertBatchImagesToJpeg } from '../../utils/export/imageConverter';
import { buildSingleSignedPdfFromImage, buildBatchSingleSignedPdfs } from '../../utils/export/singlePdfExporter';
import { createAndDownloadZip } from '../../utils/export/zipArchiver';
import { signPdfBuffer } from '../../utils/crypto/pdfDigitalSigner';
import { getItemIssuerCredentials, getMasterDossierCredentials } from '../../config/config-esign';
import { PDFDocument } from 'pdf-lib';

export interface FullViewExportItem {
  id: string;
  title: string;
  src: string;
  filename: string;
  isPortrait?: boolean;
}

export interface FullViewExportMenuProps {
  documentCategory?: 'awards' | 'certification' | 'portfolio' | 'academic' | 'identity' | 'cv';
  documentTitle: string;
  shareableUrl: string;
  isDarkMode: boolean;
  isColorMode?: boolean;
  items: FullViewExportItem[];
  onOpenQrCode: () => void;
  // Handler kustom untuk PDF Lengkap/Tunggal jika sudah ada builder khusus
  onBuildCompletePdf?: (
    onProgress: (current: number, total: number, title: string) => void
  ) => Promise<Uint8Array | string>;
}

export const FullViewExportMenu: React.FC<FullViewExportMenuProps> = ({
  documentCategory,
  documentTitle,
  shareableUrl,
  isDarkMode,
  isColorMode = true,
  items,
  onOpenQrCode,
  onBuildCompletePdf,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentLayer, setCurrentLayer] = useState<'main' | 'download'>('main');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Ref container untuk mendeteksi klik di luar menu popup
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Status proses ekspor
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingType, setProcessingType] = useState<
    'single_image' | 'single_pdf' | 'images_non_zip' | 'images_zip' | 'pdfs_zip' | 'full_pdf' | null
  >(null);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Auto close saat klik di luar menu popup atau tekan tombol Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        if (!isProcessing) {
          setIsOpen(false);
          setCurrentLayer('main');
          setProgressStatus('');
          setProgressPercent(0);
          setProcessingType(null);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isProcessing) {
        setIsOpen(false);
        setCurrentLayer('main');
        setProgressStatus('');
        setProgressPercent(0);
        setProcessingType(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isProcessing]);

  // Cek apakah berkas yang ditampilkan adalah berkas tunggal (1 file / 1 gambar)
  const isSingleItem = items.length === 1;

  const handleClose = () => {
    if (isProcessing) return; // Mencegah penutupan tidak sengaja saat sedang memproses
    setIsOpen(false);
    setCurrentLayer('main');
    setProgressStatus('');
    setProgressPercent(0);
    setProcessingType(null);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      handleClose();
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareableUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      handleClose();
    }
  };

  /**
   * Helper: Dapatkan base filename bersih untuk berkas tunggal
   */
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
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      console.error('Gagal mengunduh gambar tunggal:', err);
      setProgressStatus('Terjadi kesalahan saat memproses gambar.');
    } finally {
      setIsProcessing(false);
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
        // Fallback generator single signed PDF dari gambar
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
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      console.error('Gagal mengunduh PDF tunggal:', err);
      setProgressStatus('Gagal menghasilkan dokumen PDF.');
    } finally {
      setIsProcessing(false);
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

        // Jeda 350ms antar unduhan agar browser mengeksekusi unduhan secara berurutan tanpa terblokir
        await new Promise((resolve) => setTimeout(resolve, 350));
        URL.revokeObjectURL(blobUrl);
      }

      setProgressPercent(100);
      setProgressStatus('Selesai! Semua gambar berhasil diunduh.');
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      console.error('Gagal mengunduh gambar berurutan non-ZIP:', err);
      setProgressStatus('Terjadi kesalahan saat mengunduh gambar.');
    } finally {
      setIsProcessing(false);
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
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      console.error('Gagal mengunduh gambar ZIP:', err);
      setProgressStatus('Terjadi kesalahan saat memproses ZIP.');
    } finally {
      setIsProcessing(false);
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
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      console.error('Gagal mengunduh PDF terpisah ZIP:', err);
      setProgressStatus('Terjadi kesalahan saat memproses PDF.');
    } finally {
      setIsProcessing(false);
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
        // Fallback generator multi-halaman jika onBuildCompletePdf tidak disediakan
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

      const masterCreds = getMasterDossierCredentials(documentCategory, documentTitle);

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
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      console.error('Gagal mengunduh PDF Lengkap:', err);
      setProgressStatus('Gagal menghasilkan PDF Lengkap.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div ref={menuContainerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            setIsOpen(true);
            setCurrentLayer('main');
          }
        }}
        className={`p-2 rounded-xl transition-colors border cursor-pointer flex items-center justify-center ${
          isDarkMode
            ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
        }`}
        title="Bagikan & Unduh Dokumen"
        aria-label="Bagikan Dokumen"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {/* Dropdown Menu Overlay & Backdrop */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClose} />

          <div
            className={`absolute right-0 top-full mt-2 rounded-2xl shadow-xl border p-2 z-50 transition-all duration-200 animate-in fade-in zoom-in-95 ${
              currentLayer === 'main' ? 'w-36 sm:w-40' : 'w-56 sm:w-60'
            } ${
              isDarkMode
                ? 'bg-slate-900 text-slate-100 border-slate-800 shadow-slate-950/80'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            {/* LAYER 1: Menu Utama */}
            {currentLayer === 'main' && (
              <div className="space-y-0.5">
                {/* QR Code Option */}
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onOpenQrCode();
                  }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>QR Code</span>
                </button>

                {/* Copy Link Option */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`w-full flex items-center p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isCopied ? (
                      <CheckCheck className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>{isCopied ? 'Tersalin!' : 'Salin Link'}</span>
                  </div>
                </button>

                {/* Download Navigation Button -> Enters Layer 2 */}
                <button
                  type="button"
                  onClick={() => setCurrentLayer('download')}
                  className={`w-full flex items-center p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Unduh</span>
                  </div>
                </button>
              </div>
            )}

            {/* LAYER 2: Submenu Unduh */}
            {currentLayer === 'download' && (
              <div className="space-y-1">
                {/* Header Submenu with Back Button */}
                <div
                  className={`flex items-center justify-between pb-2 mb-1 border-b px-1 ${
                    isDarkMode ? 'border-slate-800 text-slate-200' : 'border-slate-100 text-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (!isProcessing) setCurrentLayer('main');
                    }}
                    disabled={isProcessing}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      isProcessing
                        ? 'opacity-40 cursor-not-allowed'
                        : isDarkMode
                        ? 'text-slate-300 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali</span>
                  </button>
                  <span className="text-[11px] font-medium text-slate-400">
                    {isSingleItem ? 'Unduh Berkas' : 'Pilihan Unduh'}
                  </span>
                </div>

                {/* KONDISI 1: BERKAS TUNGGAL (HANYA 1 GAMBAR / 1 FILE DITAMPILKAN) */}
                {isSingleItem ? (
                  <>
                    {/* Opsi 1: Gambar Asli (.JPG) langsung tanpa ZIP -> Icon & Badge BIRU */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleDownloadSingleImage}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isProcessing && processingType !== 'single_image'
                          ? 'opacity-40 cursor-not-allowed'
                          : isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                        <Images className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 flex items-center justify-between">
                        <span className="text-xs font-semibold truncate">Gambar Asli</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold shrink-0 ml-1">
                          .JPG
                        </span>
                      </div>
                    </button>

                    {/* Opsi 2: PDF (.PDF) -> Icon & Badge MERAH (Tanpa Shield) */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleDownloadSinglePdf}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isProcessing && processingType !== 'single_pdf'
                          ? 'opacity-40 cursor-not-allowed'
                          : isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 dark:text-rose-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 flex items-center justify-between">
                        <span className="text-xs font-semibold truncate">PDF</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold shrink-0 ml-1">
                          .PDF
                        </span>
                      </div>
                    </button>
                  </>
                ) : (
                  /* KONDISI 2: BANYAK BERKAS (> 1 FILE / MULTI-HALAMAN) */
                  <>
                    {/* Opsi 1: Gambar Asli (.JPG) -> Icon Gambar & Badge BIRU */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleDownloadImagesNonZip}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isProcessing && processingType !== 'images_non_zip'
                          ? 'opacity-40 cursor-not-allowed'
                          : isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                        <Images className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 flex items-center justify-between">
                        <span className="text-xs font-semibold truncate">Gambar Asli</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold shrink-0 ml-1">
                          .JPG
                        </span>
                      </div>
                    </button>

                    {/* Opsi 2: PDF Lengkap (.PDF) -> Di bawah Gambar Asli, Icon & Badge MERAH (Tanpa Shield) */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleDownloadFullPdf}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isProcessing && processingType !== 'full_pdf'
                          ? 'opacity-40 cursor-not-allowed'
                          : isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 dark:text-rose-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 flex items-center justify-between">
                        <span className="text-xs font-semibold truncate">PDF Lengkap</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold shrink-0 ml-1">
                          .PDF
                        </span>
                      </div>
                    </button>

                    {/* Opsi 3: Gambar Terpisah (.ZIP) -> Icon Folder Archive & Badge KUNING / AMBER */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleDownloadImagesZip}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isProcessing && processingType !== 'images_zip'
                          ? 'opacity-40 cursor-not-allowed'
                          : isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 shrink-0">
                        <FolderArchive className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 flex items-center justify-between">
                        <span className="text-xs font-semibold truncate">Gambar Terpisah</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold shrink-0 ml-1">
                          .ZIP
                        </span>
                      </div>
                    </button>

                    {/* Opsi 4: PDF Terpisah (.ZIP) -> Icon Folder Archive (resleting) & Badge KUNING / AMBER (Tanpa Shield) */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleDownloadPdfsZip}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        isProcessing && processingType !== 'pdfs_zip'
                          ? 'opacity-40 cursor-not-allowed'
                          : isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 shrink-0">
                        <FolderArchive className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 flex items-center justify-between">
                        <span className="text-xs font-semibold truncate">PDF Terpisah</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold shrink-0 ml-1">
                          .ZIP
                        </span>
                      </div>
                    </button>
                  </>
                )}

                {/* Progress & Status Box */}
                {isProcessing && (
                  <div
                    className={`mt-2 p-2 rounded-xl border ${
                      isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
                      <span className="text-[11px] font-medium text-slate-300 truncate">
                        {progressStatus || 'Memproses...'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FullViewExportMenu;
