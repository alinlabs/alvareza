/**
 * FullViewExportMenu.tsx
 * Komponen Dropdown Menu Berbagi & Ekspor 2-Layer untuk Seluruh Halaman Full View.
 *
 * Layer 1: QR Code, Salin Link, Unduh (dengan transisi ke Layer 2)
 * Layer 2: Submenu Unduh (Gambar Terpisah .zip, PDF Terpisah .zip, PDF Lengkap .pdf)
 * Dilengkapi visual progress bar dan native digital signature encryption.
 */

import React, { useState } from 'react';
import {
  Share2,
  QrCode,
  Copy,
  CheckCheck,
  Download,
  ChevronRight,
  ArrowLeft,
  FileCheck,
  FileText,
  Images,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { convertBatchImagesToJpeg } from '../../../utils/export/imageConverter';
import { buildBatchSingleSignedPdfs } from '../../../utils/export/singlePdfExporter';
import { createAndDownloadZip } from '../../../utils/export/zipArchiver';
import { signPdfBuffer } from '../../../utils/crypto/pdfDigitalSigner';
import { getMasterDossierCredentials } from '../../../config/digitalSignatureConfig';
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
  // Handler kustom untuk PDF Lengkap jika sudah ada builder khusus (misal portofolio/penghargaan)
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

  // Status proses ekspor
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingType, setProcessingType] = useState<'images_zip' | 'pdfs_zip' | 'full_pdf' | null>(null);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

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
   * Opsi 1: Unduh Gambar Terpisah (.zip)
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
      setProgressStatus('Selesai! Berkas terunduh.');
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      console.error('Gagal mengunduh gambar ZIP:', err);
      setProgressStatus('Terjadi kesalahan saat memproses.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Opsi 2: Unduh PDF Terpisah (.zip) dengan Tanda Tangan Digital Kriptografi
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
      setProgressStatus('Selesai! Berkas terunduh.');
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      console.error('Gagal mengunduh PDF terpisah ZIP:', err);
      setProgressStatus('Terjadi kesalahan saat memproses PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Opsi 3: Unduh PDF Lengkap (.pdf) Terpadu dengan Master Digital Signature
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
          // Format Base64
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

      // Sematkan tanda tangan kriptografi tingkat Master Dossier dengan Metadata Lengkap
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

      // Trigger download
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
    <div className="relative">
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
              currentLayer === 'main' ? 'w-44' : 'w-72'
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
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
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
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Unduh</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
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
                  <span className="text-[11px] font-medium text-slate-400">Pilihan Unduh</span>
                </div>

                {/* Option 1: Gambar Terpisah (.zip) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadImagesZip}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isProcessing && processingType !== 'images_zip'
                      ? 'opacity-40 cursor-not-allowed'
                      : isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                    <Images className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold flex items-center justify-between">
                      <span>Gambar Terpisah</span>
                      <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        .ZIP
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      WebP dikonversi ke JPEG ringan & proporsional
                    </p>
                  </div>
                </button>

                {/* Option 2: PDF Terpisah (.zip) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadPdfsZip}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isProcessing && processingType !== 'pdfs_zip'
                      ? 'opacity-40 cursor-not-allowed'
                      : isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>PDF Terpisah</span>
                        <ShieldCheck className="w-3 h-3 text-blue-500" title="Tersertifikasi Kriptografi PAdES" />
                      </span>
                      <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        .ZIP
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      PDF mandiri bertanda tangan digital tersertifikasi
                    </p>
                  </div>
                </button>

                {/* Option 3: PDF Lengkap (.pdf) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadFullPdf}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isProcessing && processingType !== 'full_pdf'
                      ? 'opacity-40 cursor-not-allowed'
                      : isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500 shrink-0 mt-0.5">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>PDF Lengkap</span>
                        <ShieldCheck className="w-3 h-3 text-purple-500" title="Master Dossier Digital Signature" />
                      </span>
                      <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        .PDF
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      1 Dokumen terpadu dengan Master Digital Signature
                    </p>
                  </div>
                </button>

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
