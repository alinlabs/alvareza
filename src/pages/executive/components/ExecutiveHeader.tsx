import React, { useState } from 'react';
import {
  MessageCircle,
  Mail,
  Instagram,
  Linkedin,
  Share2,
  Check,
  Sliders,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { EXECUTIVE_PROFILE, getWhatsappUrl } from '../constants';

export interface ExecutiveHeaderProps {
  language?: 'in' | 'en' | 'id';
  toggleLanguage?: () => void;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
  onNavigateToPdf?: () => void;
  onNavigateToPortfolio?: () => void;
  onNavigateToCertifications?: () => void;
  onNavigateToAcademic?: (docId?: 'skl' | 'transkrip') => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  language = 'in',
  isAdmin = false,
  onOpenAdmin,
}) => {
  const [copied, setCopied] = useState(false);
  const whatsappUrl = getWhatsappUrl(language === 'en' ? 'en' : 'in');

  const handleShare = async () => {
    const shareData = {
      title: `${EXECUTIVE_PROFILE.fullName} — Digital Profile`,
      text: 'Profil Profesional & Portofolio Alvareza Hilka Pratama',
      url: window.location.href,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard if share was canceled or unsupported
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Ignore clipboard errors
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs py-2.5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand with optional Admin Access indicator if in admin mode */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight leading-none">
              Digital Profile
            </span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5">
              Alvareza H. Pratama
            </span>
          </div>
          {isAdmin && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'en' ? 'Admin Access' : 'Akses Admin'}</span>
            </span>
          )}
        </div>

        {/* Right Controls: WhatsApp, Email, Instagram, LinkedIn, and Share */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/90 hover:border-emerald-300 text-slate-600 hover:text-emerald-600 transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </a>

          {/* Email */}
          <a
            href={`mailto:${EXECUTIVE_PROFILE.email}`}
            title="Email"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/90 hover:border-blue-300 text-slate-600 hover:text-blue-600 transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
          >
            <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </a>

          {/* Instagram */}
          <a
            href={EXECUTIVE_PROFILE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram (@varezza_)"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-pink-50 border border-slate-200/90 hover:border-pink-300 text-slate-600 hover:text-pink-600 transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
          >
            <Instagram className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </a>

          {/* LinkedIn */}
          <a
            href={EXECUTIVE_PROFILE.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/90 hover:border-sky-300 text-slate-600 hover:text-sky-600 transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
          >
            <Linkedin className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </a>

          {/* Share Icon Button (Paling Kanan) */}
          <button
            type="button"
            onClick={handleShare}
            title={copied ? 'Tautan Disalin!' : 'Bagikan Profil'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer relative"
          >
            {copied ? (
              <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            )}

            {/* Micro Copied Tooltip Badge */}
            {copied && (
              <span className="absolute -bottom-7 right-0 text-[10px] font-semibold text-white bg-slate-900 px-2 py-0.5 rounded shadow-sm whitespace-nowrap animate-fade-in pointer-events-none">
                Tautan disalin!
              </span>
            )}
          </button>

          {/* Button to Enter Admin: Only rendered when isAdmin is true */}
          {isAdmin && onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="ml-2 inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-[#0062E3] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer group hover:shadow-md"
              title={language === 'en' ? 'Open Admin Workspace' : 'Buka Halaman Admin'}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Admin' : 'Admin'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform hidden sm:inline-block" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
