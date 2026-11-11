import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Share2,
  Copy,
  CheckCheck,
  QrCode,
  Moon,
  Sun,
  Trophy,
  Download,
  Loader2,
  Award,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../../context/bahasa';
import { useThemeMode } from '../../hooks/useThemeMode';
import { useMetaTags } from '../../hooks/useMetaTags';
import { FullViewExportMenu, FullViewExportItem } from './menu-export';
import { FullViewQrModal } from './modal-qr';
import {
  ALL_AWARDS_LIST,
  AwardItemConfig,
  AWARDS_IMAGES,
  sortAwardsChronologicalDesc,
} from '../../data/penghargaan';
import { buildAwardsCompilationPdf } from '../../utils/pdf-engine/portofolio';
import { downloadBase64Pdf } from '../../utils/google-apps-script/preview';

interface FullPageAwardsViewProps {
  onNavigateToEditor?: () => void;
  onNavigateToPdf?: () => void;
  onNavigateToPortfolio?: () => void;
  onNavigateToCertification?: () => void;
}

export const FullPageAwardsView: React.FC<FullPageAwardsViewProps> = ({
  onNavigateToEditor,
  onNavigateToPdf,
  onNavigateToPortfolio,
  onNavigateToCertification,
}) => {
  const { language } = useLanguage();
  const { isDarkMode, toggleTheme } = useThemeMode();

  const getInitialColorMode = (): boolean => {
    if (typeof window === 'undefined') return false; // Default BW
    const params = new URLSearchParams(window.location.search);
    const colorParam = (params.get('cl') || params.get('color') || params.get('c') || '').toLowerCase().trim();
    return colorParam === 'true' || colorParam === '1' || colorParam === 'berwarna';
  };

  const getInitialCompressedMode = (): boolean => {
    if (typeof window === 'undefined') return true; // Default compressed
    const params = new URLSearchParams(window.location.search);
    const qualityParam = (params.get('q') || params.get('quality') || '').toLowerCase().trim();
    if (qualityParam === 'ori' || qualityParam === 'full' || qualityParam === 'original') {
      return false;
    }
    const compressParam = (params.get('compress') || params.get('compressed') || '').toLowerCase().trim();
    if (compressParam === 'false' || compressParam === '0') {
      return false;
    }
    return true;
  };

  const [isColorMode, setIsColorMode] = useState<boolean>(getInitialColorMode);
  const [isCompressedMode, setIsCompressedMode] = useState<boolean>(getInitialCompressedMode);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [selectedAward, setSelectedAward] = useState<AwardItemConfig | null>(null);

  // Synchronize on popstate (browser back / forward button)
  useEffect(() => {
    const handlePopState = () => {
      setIsColorMode(getInitialColorMode());
      setIsCompressedMode(getInitialCompressedMode());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Integrated Meta Tags hook for Awards
  useMetaTags({
    pageType: 'awards',
    canonicalPath: '/preview?file=penghargaan',
    language,
  });

  // Sync URL search params with active color, compress, and theme without page reload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const cleanPath = url.pathname.replace(/^\/+/, '').trim().toLowerCase();
    const isShort = cleanPath === 'prev' || (!cleanPath.startsWith('preview') && url.searchParams.has('f'));

    if (isShort) {
      url.pathname = '/prev';
      url.searchParams.set('f', 'awd');
      url.searchParams.delete('file');
    } else {
      url.pathname = '/preview';
      url.searchParams.set('file', 'penghargaan');
      url.searchParams.delete('f');
    }

    // Sync color parameter (Default BW: omit color param unless isColorMode is true)
    if (isColorMode) {
      if (isShort) {
        url.searchParams.set('cl', 'true');
        url.searchParams.delete('color');
      } else {
        url.searchParams.set('color', 'true');
        url.searchParams.delete('cl');
      }
    } else {
      url.searchParams.delete('cl');
      url.searchParams.delete('color');
      url.searchParams.delete('c');
      url.searchParams.delete('bw');
    }

    // Sync quality/compress parameter (Default Compressed: omit quality param unless isCompressedMode is false)
    if (!isCompressedMode) {
      if (isShort) {
        url.searchParams.set('q', 'ori');
        url.searchParams.delete('quality');
      } else {
        url.searchParams.set('quality', 'ori');
        url.searchParams.delete('q');
      }
      url.searchParams.delete('compress');
      url.searchParams.delete('compressed');
    } else {
      url.searchParams.delete('q');
      url.searchParams.delete('quality');
      url.searchParams.delete('compress');
      url.searchParams.delete('compressed');
    }

    // Sync mode parameter (dark / light)
    url.searchParams.set('mode', isDarkMode ? 'dark' : 'light');
    url.searchParams.delete('theme');
    url.searchParams.delete('th');
    url.searchParams.delete('ui');

    window.history.replaceState({}, '', url.toString());
  }, [isColorMode, isCompressedMode, isDarkMode]);

  // Update Page Title and Meta Tags
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const title =
      language === 'en'
        ? `Achievements & Awards (${ALL_AWARDS_LIST.length} Credentials) - Alvareza Hilka Pratama | Digital Profile`
        : `Sertifikat Penghargaan & Prestasi (${ALL_AWARDS_LIST.length} Dokumen) - Alvareza Hilka Pratama | Digital Profile`;
    document.title = title;

    const desc =
      language === 'en'
        ? `Official achievement credentials and awards of Alvareza Hilka Pratama (${ALL_AWARDS_LIST.length} verified physical certificates), including Duta GenRe, Governor Cup WSC, Student Council Leadership, and speech/academic recognitions.`
        : `Daftar piagam penghargaan dan kejuaraan resmi Alvareza Hilka Pratama (${ALL_AWARDS_LIST.length} sertifikat fisik terverifikasi), termasuk Juara 1 Duta GenRe, Event Manager Piala Gubernur Jabar, Ketua BEM, dan kompetisi daerah.`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);
  }, [language]);

  const getPublicShareUrl = (): string => {
    if (typeof window === 'undefined') return 'https://alvareza.my.id/prev?f=awd';
    const origin = window.location.origin;
    const params = new URLSearchParams();
    params.set('f', 'awd');
    if (isColorMode) {
      params.set('cl', 'true');
    }
    if (!isCompressedMode) {
      params.set('q', 'ori');
    }
    params.set('mode', isDarkMode ? 'dark' : 'light');
    const qs = params.toString();
    return `${origin}/prev?${qs}`;
  };

  const handleCopyLink = async () => {
    const url = getPublicShareUrl();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDownloadAwardsPDF = async () => {
    try {
      setIsDownloadingPdf(true);
      const attachment = await buildAwardsCompilationPdf({
        isCompressed: isCompressedMode,
        isGrayscale: !isColorMode,
      });

      if (attachment?.base64) {
        downloadBase64Pdf(
          attachment.base64,
          attachment.filename || 'penghargaan-alvareza.pdf'
        );
      }
    } catch (err) {
      console.error('Gagal mengunduh dokumen penghargaan:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Pengurutan sertifikat secara kronologis dari waktu terbaru ke terlama
  const chronologicalAwardsList = useMemo(() => {
    return sortAwardsChronologicalDesc(ALL_AWARDS_LIST);
  }, []);

  const exportItems: FullViewExportItem[] = useMemo(() => {
    return chronologicalAwardsList.map((awd) => ({
      id: awd.id,
      title: awd.title,
      src: AWARDS_IMAGES[awd.id] || `/penghargaan/${awd.filename}`,
      filename: awd.filename,
      isPortrait: Boolean(awd.isPortrait),
    }));
  }, [chronologicalAwardsList]);

  const shareableUrl = getPublicShareUrl();

  return (
    <div
      className={`h-screen ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100 selection:bg-blue-900 selection:text-white'
          : 'bg-slate-200 text-slate-900 selection:bg-blue-100 selection:text-slate-900'
      } flex flex-col font-sans w-full overflow-hidden`}
    >
      {/* Top Standalone Header Bar */}
      <header
        className={`sticky top-0 z-50 shrink-0 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-xs w-full transition-colors ${
          isDarkMode
            ? 'bg-slate-900/95 border-b border-slate-800 text-slate-100 backdrop-blur-md'
            : 'bg-white border-b border-slate-200 text-slate-900'
        }`}
      >
        {/* Left Section: Name & Subtitle */}
        <div className="flex flex-col min-w-0">
          <h1 className={`text-sm sm:text-base font-bold truncate leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Alvareza H. Pratama
          </h1>
          <p className={`text-[10px] sm:text-xs font-medium truncate leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Penghargaan & Prestasi - Digital Profile
          </p>
        </div>

        {/* Right Section: Theme Toggle | Share Card */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 relative">
          {/* Theme Toggle Button (Light/Dark mode) */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title={
              isDarkMode
                ? 'Ganti ke Mode Terang (mode=light)'
                : 'Ganti ke Mode Gelap (mode=dark)'
            }
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Share & Export Dropdown 2-Layer Menu */}
          <FullViewExportMenu
            documentCategory="awards"
            documentTitle="Penghargaan_Prestasi"
            shareableUrl={shareableUrl}
            isDarkMode={isDarkMode}
            isColorMode={isColorMode}
            items={exportItems}
            onOpenQrCode={() => setShowQrCode(true)}
            onBuildCompletePdf={async (onProgress) => {
              const result = await buildAwardsCompilationPdf({
                isCompressed: false,
                isGrayscale: !isColorMode,
                onProgress: (curr, tot, tit) => onProgress(curr, tot, tit),
              });
              return result.base64;
            }}
          />
        </div>
      </header>

      {/* Main Full-Page Awards Content Canvas Body */}
      <main
        className={`flex-1 overflow-y-auto ${
          isDarkMode ? 'bg-slate-950' : 'bg-slate-200'
        } px-3 sm:px-8 py-6 flex flex-col items-center justify-start w-full relative transition-colors`}
      >
        <div className="flex flex-col gap-6 sm:gap-8 items-center w-full max-w-4xl my-auto py-2">
          {chronologicalAwardsList.map((awd, index) => {
            const imageSrc = AWARDS_IMAGES[awd.id] || `/penghargaan/${awd.filename}`;
            const isFirstTwo = index < 2;

            return (
              <div
                key={awd.id}
                onClick={() => setSelectedAward(awd)}
                className={`w-full bg-white rounded-xl overflow-hidden transition-all cursor-pointer group hover:scale-[1.005] active:scale-[0.995] duration-200 ${
                  isDarkMode
                    ? 'shadow-2xl shadow-blue-950/40 border border-slate-800 hover:border-blue-500/50'
                    : 'shadow-xl border border-slate-300 hover:border-blue-500/60'
                }`}
                title={language === 'en' ? 'Click to view details' : 'Klik untuk melihat detail'}
              >
                <img
                  src={imageSrc}
                  alt={`Sertifikat: ${awd.title}`}
                  className={`w-full h-auto block select-none transition-all duration-200 ${
                    !isColorMode ? 'filter grayscale contrast-105' : ''
                  }`}
                  loading={isFirstTwo ? 'eager' : 'lazy'}
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* Detail Modal (Desktop) / Bottom Sheet (Mobile) */}
      {selectedAward && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden overscroll-contain">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300 cursor-pointer touch-none"
            onClick={() => setSelectedAward(null)}
          />

          {/* Modal / Bottom Sheet Container */}
          <div
            className={`relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-none sm:zoom-in-95 duration-300 border max-h-[85vh] overflow-hidden ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Sticky Header */}
            <div
              className={`p-5 sm:p-6 border-b shrink-0 flex items-start justify-between gap-3 ${
                isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
              }`}
            >
              <div>
                {/* Level Badge above title */}
                {selectedAward.level && (
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-white bg-blue-600 dark:bg-blue-600 border border-blue-500/40 shadow-xs">
                      <Trophy className="w-3.5 h-3.5 text-white fill-white shrink-0" />
                      <span>Tingkat {selectedAward.level}</span>
                    </span>
                  </div>
                )}
                <h3 className={`text-base sm:text-lg font-bold leading-snug ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {selectedAward.title}
                </h3>
                <p className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedAward.issuer} • {selectedAward.year} {selectedAward.level ? `(${selectedAward.level})` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAward(null)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                  isDarkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={language === 'en' ? 'Close' : 'Tutup'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Description */}
              {selectedAward.description && (
                <p className={`text-xs sm:text-sm leading-relaxed text-justify ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {selectedAward.description}
                </p>
              )}

              {/* Metadata Details Grid */}
              <div className={`rounded-2xl p-4 border space-y-2.5 text-xs ${
                isDarkMode ? 'bg-slate-800/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200/80 text-slate-700'
              }`}>
                {selectedAward.category && (
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Kategori</span>
                    <span className="font-semibold text-right">{selectedAward.category}</span>
                  </div>
                )}
                {selectedAward.role && (
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Peran Penerima</span>
                    <span className="font-semibold text-right">{selectedAward.role}</span>
                  </div>
                )}
                {selectedAward.certificateNumber && (
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">No. Sertifikat</span>
                    <span className="font-mono font-semibold text-right text-[11px] text-blue-600 dark:text-blue-400">
                      {selectedAward.certificateNumber}
                    </span>
                  </div>
                )}
                {selectedAward.date && (
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Tanggal Terbit</span>
                    <span className="font-medium text-right">{selectedAward.date}</span>
                  </div>
                )}
              </div>

              {/* Signers Information */}
              {selectedAward.signers && selectedAward.signers.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Pejabat Penandatangan ({selectedAward.signatureType || 'RESMI'})
                  </h4>
                  <div className="space-y-2">
                    {selectedAward.signers.map((s, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex flex-col gap-0.5 ${
                          isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {s.nama_lengkap}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {s.jabatan}
                        </span>
                        {s.nip_nik_id && (
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                            {s.nip_nik_id}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Overlay */}
      <FullViewQrModal
        isOpen={showQrCode}
        onClose={() => setShowQrCode(false)}
        title="QR Code - Penghargaan"
        shareableUrl={shareableUrl}
        isDarkMode={isDarkMode}
        language={language}
      />
    </div>
  );
};

export default FullPageAwardsView;
