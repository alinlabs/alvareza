import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  X,
  Share2,
  Copy,
  CheckCheck,
  QrCode,
  Loader2,
  Moon,
  Sun,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ALL_ACADEMIC_DOCS, downloadAcademicDocs, getAcademicAttachment } from '../../data/akademik';
import { useMetaTags } from '../../hooks/useMetaTags';
import { useThemeMode } from '../../hooks/useThemeMode';
import { resolveAkademikSpesifik } from '../../utils/spesifikParamResolver';
import { FullViewExportMenu, FullViewExportItem } from './menu-export';
import { FullViewQrModal } from './modal-qr';

/**
 * Resolves active academic document strictly from the direct link/URL with smart tolerance & auto-correction
 */
export function resolveAcademicDocFromUrl(): 'skl' | 'transkrip' {
  if (typeof window === 'undefined') return 'skl';
  const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
  const params = new URLSearchParams(window.location.search);

  // 1. High priority: Check "spec" / "spesifik" query parameter with strict auto-correction
  const spesifikVal = params.get('spec') || params.get('spesifik') || params.get('spesifikasi');
  if (spesifikVal) {
    const resolved = resolveAkademikSpesifik(spesifikVal);
    if (resolved) {
      return resolved;
    }
  }

  // 2. Check "doc" / "type" parameter
  const docVal = params.get('doc') || params.get('type') || params.get('id') || params.get('p');
  if (docVal) {
    const resolved = resolveAkademikSpesifik(docVal);
    if (resolved) {
      return resolved;
    }
  }

  // 3. Fallback for pathname / legacy routes
  if (pathname.includes('transkrip') || pathname.includes('trk')) {
    return 'transkrip';
  }
  if (pathname.includes('skl')) {
    return 'skl';
  }

  return 'skl';
}

/**
 * Parses URL flags strictly from the link:
 * - isColor: default FALSE (Hitam Putih / BW), becomes TRUE only if ?cl=true or ?color=true
 * - isOri: default FALSE (Sedikit di-kompresi), becomes TRUE only if ?q=ori or ?ori=true
 */
export function parseAcademicUrlFlags(): { isColor: boolean; isOri: boolean } {
  if (typeof window === 'undefined') return { isColor: false, isOri: false };
  const search = window.location.search.toLowerCase();
  const params = new URLSearchParams(window.location.search);

  const colorParam = params.get('cl') || params.get('color');
  const isColor =
    colorParam === 'true' ||
    colorParam === '1' ||
    search.includes('cl=true') ||
    search.includes('color=true') ||
    search.includes('warna=true');

  const qParam = params.get('q') || params.get('quality') || params.get('ori');
  const isOri =
    qParam === 'ori' ||
    qParam === 'true' ||
    search.includes('q=ori') ||
    search.includes('quality=ori') ||
    search.includes('ori=true');

  return { isColor, isOri };
}

/**
 * Constructs the canonical shareable URL preserving active link query parameters
 * Standard: https://[domain]/prev?f=a&cl=[true]&spec=[skl/trk]&q=ori&mode=[dark/light]
 */
export function buildAcademicShareUrl(
  docId: 'skl' | 'transkrip',
  isColor: boolean,
  isOri: boolean,
  mode?: 'dark' | 'light'
): string {
  if (typeof window === 'undefined') return `https://alvareza.app/prev?f=a`;
  const origin = window.location.origin;
  const params: string[] = ['f=a'];
  if (isColor) params.push('cl=true');
  if (docId) params.push(`spec=${docId === 'transkrip' ? 'trk' : 'skl'}`);
  if (isOri) params.push('q=ori');
  if (mode) params.push(`mode=${mode}`);
  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return `${origin}/prev${qs}`;
}

interface FullPageAcademicViewProps {
  initialDocId?: 'skl' | 'transkrip';
}

export const FullPageAcademicView: React.FC<FullPageAcademicViewProps> = ({
  initialDocId,
}) => {
  const [activeDocId, setActiveDocId] = useState<'skl' | 'transkrip'>(() => {
    return initialDocId || resolveAcademicDocFromUrl();
  });

  const [isColor, setIsColor] = useState<boolean>(() => parseAcademicUrlFlags().isColor);
  const [isOri, setIsOri] = useState<boolean>(() => parseAcademicUrlFlags().isOri);
  const { isDarkMode, toggleTheme } = useThemeMode();
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // Sync mode parameter in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', isDarkMode ? 'dark' : 'light');
      url.searchParams.delete('theme');
      url.searchParams.delete('th');
      url.searchParams.delete('ui');
      window.history.replaceState(null, '', url.toString());
    } catch {}
  }, [isDarkMode]);

  const currentDoc = useMemo(() => {
    return (
      ALL_ACADEMIC_DOCS.find((d) => d.id === activeDocId) || ALL_ACADEMIC_DOCS[0]
    );
  }, [activeDocId]);

  useEffect(() => {
    const handlePopState = () => {
      const doc = resolveAcademicDocFromUrl();
      const flags = parseAcademicUrlFlags();
      setActiveDocId(doc);
      setIsColor(flags.isColor);
      setIsOri(flags.isOri);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = buildAcademicShareUrl(activeDocId, isColor, isOri, isDarkMode ? 'dark' : 'light');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await downloadAcademicDocs([activeDocId], isColor);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  useMetaTags({
    enabled: true,
    isFullPdf: true,
    canonicalPath: `/preview?file=akademik&doc=${activeDocId}`,
    language: 'in',
  });

  const exportItems: FullViewExportItem[] = useMemo(() => {
    return [
      {
        id: currentDoc.id,
        title: currentDoc.title,
        src: isColor ? currentDoc.url : currentDoc.urlBw,
        filename: `${currentDoc.id}.webp`,
        isPortrait: true,
      },
    ];
  }, [currentDoc, isColor]);

  const shareUrl = buildAcademicShareUrl(activeDocId, isColor, isOri, isDarkMode ? 'dark' : 'light');

  const headerSubtitle =
    activeDocId === 'transkrip' ? 'Transkrip - Digital Profile' : 'SKL - Digital Profile';

  return (
    <div
      className={`h-screen ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100 selection:bg-blue-900 selection:text-white'
          : 'bg-slate-200 text-slate-900 selection:bg-blue-100 selection:text-slate-900'
      } flex flex-col font-sans w-full overflow-hidden`}
    >
      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-50 shrink-0 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-xs w-full transition-colors ${
          isDarkMode
            ? 'bg-slate-900/95 border-b border-slate-800 text-slate-100 backdrop-blur-md'
            : 'bg-white border-b border-slate-200 text-slate-900'
        }`}
      >
        {/* Left Section: Name & Document Title */}
        <div className="flex flex-col min-w-0">
          <h1
            className={`text-sm sm:text-base font-bold truncate leading-tight ${
              isDarkMode ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            Alvareza H. Pratama
          </h1>
          <p
            className={`text-[10px] sm:text-xs font-medium truncate leading-tight ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {headerSubtitle}
          </p>
        </div>

        {/* Right Section: Theme Toggle | Share Card */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 relative">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title={isDarkMode ? 'Ganti ke Mode Terang (mode=light)' : 'Ganti ke Mode Gelap (mode=dark)'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-white" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Share & Export Dropdown 2-Layer Menu */}
          <FullViewExportMenu
            documentCategory="academic"
            documentTitle={activeDocId === 'transkrip' ? 'Transkrip_Nilai' : 'Surat_Keterangan_Lulus'}
            shareableUrl={shareUrl}
            isDarkMode={isDarkMode}
            isColorMode={isColor}
            items={exportItems}
            onOpenQrCode={() => setShowQrCode(true)}
            onBuildCompletePdf={async (onProgress) => {
              onProgress(1, 1, `Menyusun dokumen PDF ${currentDoc.title}...`);
              const att = await getAcademicAttachment(activeDocId, isColor);
              if (att && att.base64) {
                return att.base64;
              }
              throw new Error('Gagal menghasilkan dokumen PDF Akademik');
            }}
          />
        </div>
      </header>

      {/* Main Full-Page View */}
      <main
        className={`flex-1 overflow-y-auto ${
          isDarkMode ? 'bg-slate-950' : 'bg-slate-200'
        } px-3 sm:px-8 py-6 flex flex-col items-center justify-start w-full relative transition-colors`}
      >
        <div className="flex flex-col gap-6 sm:gap-8 items-center w-full max-w-4xl my-auto py-2">
          <div
            className={`w-full bg-white rounded-xl overflow-hidden transition-all duration-200 ${
              isDarkMode
                ? 'shadow-2xl shadow-blue-950/40 border border-slate-800'
                : 'shadow-xl border border-slate-300'
            }`}
          >
            <img
              src={currentDoc.url}
              alt={currentDoc.title}
              className={`w-full h-auto block select-none ${!isColor ? 'grayscale contrast-105' : ''}`}
              loading="eager"
            />
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      <FullViewQrModal
        isOpen={showQrCode}
        onClose={() => setShowQrCode(false)}
        title={`QR Code - ${currentDoc.title}`}
        description={`Pindai kode untuk mengakses berkas digital resmi ${currentDoc.title}`}
        shareableUrl={shareUrl}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export const AcademicView = FullPageAcademicView;
