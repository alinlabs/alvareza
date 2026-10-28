import React from 'react';
import { Mail, Linkedin, MessageCircle } from 'lucide-react';
import { EXECUTIVE_PROFILE, getWhatsappUrl } from '../constants';

interface ExecutiveContactActionsProps {
  language: 'in' | 'en' | 'id';
}

export const ExecutiveContactActions: React.FC<ExecutiveContactActionsProps> = ({ language }) => {
  const whatsappUrl = getWhatsappUrl(language);

  return (
    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* WhatsApp CTA */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md shadow-emerald-700/20 cursor-pointer active:scale-[0.98]"
      >
        <MessageCircle className="w-4 h-4 fill-current" />
        <span>{language === 'en' ? 'Contact via WhatsApp' : 'Hubungi via WhatsApp'}</span>
      </a>

      {/* Email CTA */}
      <a
        href={`mailto:${EXECUTIVE_PROFILE.email}`}
        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-700/20 cursor-pointer active:scale-[0.98]"
      >
        <Mail className="w-4 h-4" />
        <span>{language === 'en' ? 'Send Official Email' : 'Kirim Email Resmi'}</span>
      </a>

      {/* LinkedIn CTA */}
      <a
        href={EXECUTIVE_PROFILE.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all border border-slate-300 cursor-pointer"
        title="Buka LinkedIn"
      >
        <Linkedin className="w-4 h-4 text-blue-600" />
        <span className="sm:hidden">LinkedIn</span>
      </a>
    </div>
  );
};
