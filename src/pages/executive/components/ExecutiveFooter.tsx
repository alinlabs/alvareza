import React from 'react';
import { EXECUTIVE_PROFILE, getWhatsappUrl } from '../constants';

interface ExecutiveFooterProps {
  language: 'in' | 'en' | 'id';
}

export const ExecutiveFooter: React.FC<ExecutiveFooterProps> = ({ language }) => {
  const whatsappUrl = getWhatsappUrl(language);

  return (
    <footer className="relative z-10 border-t border-slate-200 bg-slate-50/80 py-6 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          &copy; {new Date().getFullYear()} {EXECUTIVE_PROFILE.fullName}. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-slate-600 text-xs font-medium">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-600 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:${EXECUTIVE_PROFILE.email}`}
            className="hover:text-blue-600 transition-colors"
          >
            Email
          </a>
          <a
            href={EXECUTIVE_PROFILE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-600 transition-colors"
          >
            Instagram
          </a>
          <a
            href={EXECUTIVE_PROFILE.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};
