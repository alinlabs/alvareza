import React from 'react';
import { EXECUTIVE_PROFILE, getWhatsappUrl } from '../constants';

interface ExecutiveFooterProps {
  language: 'in' | 'en' | 'id';
  isDarkMode?: boolean;
}

export const ExecutiveFooter: React.FC<ExecutiveFooterProps> = ({
  language,
  isDarkMode = false,
}) => {
  const whatsappUrl = getWhatsappUrl(language);

  return (
    <footer
      className={`relative z-10 border-t py-6 text-center text-xs transition-colors duration-200 ${
        isDarkMode
          ? 'bg-slate-950/90 border-slate-800 text-slate-400'
          : 'bg-slate-50/80 border-slate-200/90 text-slate-500'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
          &copy; {new Date().getFullYear()} {EXECUTIVE_PROFILE.fullName}. All rights reserved.
        </p>
        <div
          className={`flex items-center gap-4 text-xs font-medium transition-colors ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-500 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:${EXECUTIVE_PROFILE.email}`}
            className="hover:text-blue-500 transition-colors"
          >
            Email
          </a>
          <a
            href={EXECUTIVE_PROFILE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
          >
            Instagram
          </a>
          <a
            href={EXECUTIVE_PROFILE.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};
