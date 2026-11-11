import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Mail,
  Instagram,
  Linkedin,
  Share2,
  Sliders,
  ShieldCheck,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { EXECUTIVE_PROFILE, getWhatsappUrl } from './constants';
import { ExecutiveShareModal } from './section-share';

export interface ExecutiveHeaderProps {
  language?: 'in' | 'en' | 'id';
  toggleLanguage?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
  onNavigateToPdf?: () => void;
  onNavigateToPortfolio?: () => void;
  onNavigateToCertifications?: () => void;
  onNavigateToAcademic?: (docId?: 'skl' | 'transkrip') => void;
}

const CallCenterIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Headband */}
    <path d="M3 11a9 9 0 0 1 18 0" />
    {/* Left Earpad */}
    <rect x="2" y="11" width="3.5" height="6" rx="1.5" fill="currentColor" />
    {/* Right Earpad */}
    <rect x="18.5" y="11" width="3.5" height="6" rx="1.5" fill="currentColor" />
    {/* Mic Boom Arm */}
    <path d="M19 16v1a3 3 0 0 1-3 3h-3" />
    {/* Mic Tip */}
    <circle cx="11" cy="20" r="1.5" fill="currentColor" />
  </svg>
);

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  language = 'in',
  toggleLanguage,
  isDarkMode = false,
  toggleTheme,
  isAdmin = false,
  onOpenAdmin,
}) => {
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const contactMenuRef = useRef<HTMLDivElement>(null);

  const whatsappUrl = getWhatsappUrl(language === 'en' ? 'en' : 'in');

  // Close popup menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contactMenuRef.current && !contactMenuRef.current.contains(event.target as Node)) {
        setIsContactMenuOpen(false);
      }
    };
    if (isContactMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isContactMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 shrink-0 backdrop-blur-md border-b transition-colors duration-200 py-2.5 w-full ${
          isDarkMode
            ? 'bg-slate-950/90 border-slate-800 shadow-slate-950/60 text-slate-100'
            : 'bg-white/95 border-slate-200/90 shadow-2xs text-slate-900'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand with optional Admin Access indicator if in admin mode */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-left">
              <span
                className={`font-extrabold text-lg sm:text-xl tracking-tight leading-none ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                Digital Profile
              </span>
              <span
                className={`text-[11px] font-medium mt-0.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Alvareza H. Pratama
              </span>
            </div>
            {isAdmin && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                  isDarkMode
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : 'bg-blue-50 text-blue-700 border border-blue-200/80'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>{language === 'en' ? 'Admin Access' : 'Akses Admin'}</span>
              </span>
            )}
          </div>

          {/* Right Controls: Language Toggle (Single Flag), Call Center, Theme Toggle (Left of Share), Share, Admin */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Toggle Button with single Flag icon */}
            {toggleLanguage && (
              <button
                type="button"
                onClick={toggleLanguage}
                title={
                  language === 'en'
                    ? 'English (Klik untuk ganti ke Bahasa Indonesia)'
                    : 'Bahasa Indonesia (Click to switch to English)'
                }
                aria-label={
                  language === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'
                }
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200/90'
                }`}
              >
                <img
                  src={language === 'en' ? 'https://flagcdn.com/id.svg' : 'https://flagcdn.com/gb.svg'}
                  alt={language === 'en' ? 'Bendera Indonesia (Ganti ke Bahasa Indonesia)' : 'UK Flag (Switch to English)'}
                  className="w-5 h-3.5 object-cover rounded-xs shadow-2xs select-none"
                />
              </button>
            )}

            {/* Theme Toggle Button (Light/Dark Mode) */}
            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                title={
                  isDarkMode
                    ? language === 'en'
                      ? 'Switch to Light Mode (&mode=light)'
                      : 'Ganti ke Mode Terang (&mode=light)'
                    : language === 'en'
                    ? 'Switch to Dark Mode (&mode=dark)'
                    : 'Ganti ke Mode Gelap (&mode=dark)'
                }
                aria-label="Toggle theme mode"
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200/90 text-slate-700'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                )}
              </button>
            )}

            {/* Card & Icon Call Center (Menu Popup Kontak) */}
            <div className="relative" ref={contactMenuRef}>
              <button
                type="button"
                onClick={() => setIsContactMenuOpen((prev) => !prev)}
                title={language === 'en' ? 'Contact Center' : 'Layanan Kontak'}
                aria-expanded={isContactMenuOpen}
                aria-label="Layanan Kontak"
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer ${
                  isContactMenuOpen
                    ? isDarkMode
                      ? 'bg-blue-950 border-blue-500 text-blue-400 ring-2 ring-blue-500/20'
                      : 'bg-blue-50 border-blue-400 text-blue-600 ring-2 ring-blue-500/20'
                    : isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-blue-400'
                    : 'bg-slate-50 hover:bg-blue-50/70 border-slate-200/90 hover:border-blue-300 text-slate-700 hover:text-blue-600'
                }`}
              >
                <CallCenterIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Popup Menu Dropdown */}
              {isContactMenuOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-56 sm:w-64 rounded-2xl shadow-xl border p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/80'
                      : 'bg-white border-slate-200/90 text-slate-900'
                  }`}
                >
                  <div
                    className={`px-3 py-2 border-b flex items-center justify-between ${
                      isDarkMode ? 'border-slate-800 text-slate-200' : 'border-slate-100 text-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold">Contact Me</span>
                  </div>

                  <div className="p-1 space-y-0.5">
                    {/* WhatsApp */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsContactMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors group cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs transition-colors ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-400 group-hover:text-emerald-400'
                            : 'bg-white border-slate-200/90 text-slate-500 group-hover:text-emerald-600'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold group-hover:text-emerald-500 transition-colors">
                          WhatsApp
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">Chat via WhatsApp</div>
                      </div>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${EXECUTIVE_PROFILE.email}`}
                      onClick={() => setIsContactMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors group cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs transition-colors ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-400 group-hover:text-blue-400'
                            : 'bg-white border-slate-200/90 text-slate-500 group-hover:text-blue-600'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold group-hover:text-blue-500 transition-colors">
                          Email
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{EXECUTIVE_PROFILE.email}</div>
                      </div>
                    </a>

                    {/* Instagram */}
                    <a
                      href={EXECUTIVE_PROFILE.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsContactMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors group cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs transition-colors ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-400 group-hover:text-pink-400'
                            : 'bg-white border-slate-200/90 text-slate-500 group-hover:text-pink-600'
                        }`}
                      >
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold group-hover:text-pink-500 transition-colors">
                          Instagram
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">@varezza_</div>
                      </div>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={EXECUTIVE_PROFILE.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsContactMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors group cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs transition-colors ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-400 group-hover:text-blue-400'
                            : 'bg-white border-slate-200/90 text-slate-500 group-hover:text-blue-600'
                        }`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold group-hover:text-blue-500 transition-colors">
                          LinkedIn
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">Alvareza Hilka Pratama</div>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Share Icon Button */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              title="Bagikan Profil"
              aria-label="Bagikan Profil"
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
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

      {/* Standalone Executive Share Modal with Motion animations */}
      <ExecutiveShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};

