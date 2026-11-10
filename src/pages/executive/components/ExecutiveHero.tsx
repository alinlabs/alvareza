import React, { useState } from 'react';
import { EXECUTIVE_PROFILE } from '../constants';

interface ExecutiveHeroProps {
  language: 'in' | 'en' | 'id';
  isDarkMode?: boolean;
}

export const ExecutiveHero: React.FC<ExecutiveHeroProps> = ({ language, isDarkMode = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isEn = language === 'en';

  // Text Indonesian
  const desktopPrefixIn =
    'Profesional bisnis berlatar belakang S1 Manajemen (Predikat Dengan Pujian) yang memadukan keahlian konsultasi manajemen, tata kelola Human Resources, dan manajemen proyek dengan';
  const desktopSuffixIn =
    ' transformasi digital serta otomasi sistem. Berpengalaman dalam merancang efisiensi alur kerja operasional, standardisasi SOP berbasis continuous improvement, tata kelola talenta SDM, serta pembangunan solusi aplikasi kustom guna memacu efisiensi proses dan pertumbuhan kinerja perusahaan di berbagai lini bisnis.';

  const mobilePrefixIn =
    'Profesional bisnis berlatar belakang S1 Manajemen (Predikat Dengan Pujian) yang memadukan keahlian konsultasi manajemen, tata kelola';
  const mobileSuffixIn =
    ' Human Resources, dan manajemen proyek dengan transformasi digital serta otomasi sistem. Berpengalaman dalam merancang efisiensi alur kerja operasional, standardisasi SOP berbasis continuous improvement, tata kelola talenta SDM, serta pembangunan solusi aplikasi kustom guna memacu efisiensi proses dan pertumbuhan kinerja perusahaan di berbagai lini bisnis.';

  // Text English
  const desktopPrefixEn =
    'A business professional with an academic foundation in Management (B.S. in Management, With Honors), bridging strategic management, Human Resources governance, and project management with';
  const desktopSuffixEn =
    ' digital transformation and systems automation. Experienced in streamlining operational workflows, standardizing continuous improvement SOPs, optimizing talent development, and engineering custom digital solutions to maximize process efficiency and corporate growth across diverse business sectors.';

  const mobilePrefixEn =
    'A business professional with an academic foundation in Management (B.S. in Management, With Honors), bridging strategic management, Human Resources governance';
  const mobileSuffixEn =
    ', and project management with digital transformation and systems automation. Experienced in streamlining operational workflows, standardizing continuous improvement SOPs, optimizing talent development, and engineering custom digital solutions to maximize process efficiency and corporate growth across diverse business sectors.';

  const fullTextIn = `${desktopPrefixIn}${desktopSuffixIn}`;
  const fullTextEn = `${desktopPrefixEn}${desktopSuffixEn}`;

  return (
    <div className="flex flex-col space-y-3 text-center items-center relative z-30">
      <div className="w-full text-center">
        <h1
          className={`text-[2.2rem] sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.12] transition-colors text-center ${
            isDarkMode ? 'text-blue-400' : 'text-[#2A3395]'
          }`}
        >
          {EXECUTIVE_PROFILE.fullName}
        </h1>
        <p
          className={`mt-2 text-sm sm:text-base md:text-lg font-bold leading-snug transition-colors text-center ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {/* Mobile Tagline Khusus Mobile */}
          <span className="block sm:hidden">
            {isEn
              ? 'Business Consulting, Human Resources, Digital Transformation & Systems Efficiency'
              : 'Konsultasi Bisnis, Human Resource, Transformasi Digital & Efesiensi Sistem'}
          </span>
          {/* Desktop / Tablet Tagline */}
          <span className="hidden sm:block">
            {isEn
              ? 'Business Management Consultant & Project Manager, Human Resources, Digital Transformation, AI Automation & Integrated Systems Efficiency'
              : 'Konsultan Manajemen Bisnis & Project Manager, Human Resources, Transformasi Digital, Otomasi Ai & Efisiensi Sistem Terintegrasi'}
          </span>
        </p>
      </div>

      <div className="w-full">
        <p
          className={`text-xs sm:text-sm leading-relaxed font-normal text-justify transition-colors ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {!isExpanded ? (
            <>
              {/* Desktop Truncated View */}
              <span className="hidden sm:inline">
                {isEn ? desktopPrefixEn : desktopPrefixIn}...
              </span>
              {/* Mobile Truncated View */}
              <span className="inline sm:hidden">
                {isEn ? mobilePrefixEn : mobilePrefixIn}...
              </span>
            </>
          ) : (
            <span>{isEn ? fullTextEn : fullTextIn}</span>
          )}

          {/* Inline Action Button: Seamlessly flows on the same line as the paragraph text, slightly darker shade */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className={`inline font-semibold ml-1.5 hover:underline cursor-pointer select-none focus:outline-none p-0 bg-transparent border-none transition-colors ${
              isDarkMode
                ? 'text-slate-100 hover:text-blue-400'
                : 'text-slate-900 hover:text-blue-700'
            }`}
          >
            {!isExpanded
              ? isEn
                ? 'read more'
                : 'lihat selengkapnya'
              : isEn
              ? 'show less'
              : 'sembunyikan'}
          </button>
        </p>
      </div>
    </div>
  );
};
