import React, { useState } from 'react';
import { EXECUTIVE_PROFILE } from '../constants';

interface ExecutiveHeroProps {
  language: 'in' | 'en' | 'id';
}

export const ExecutiveHero: React.FC<ExecutiveHeroProps> = ({ language }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const bioInPrefix =
    'Profesional bisnis berlatar belakang S1 Manajemen (Predikat Dengan Pujian) yang memadukan keahlian konsultasi manajemen, tata kelola Human Resources, dan manajemen proyek';
  const bioInSuffix =
    ' dengan transformasi digital serta otomasi sistem. Berpengalaman dalam merancang efisiensi alur kerja operasional, standardisasi SOP berbasis continuous improvement, tata kelola talenta SDM, serta pembangunan solusi aplikasi kustom guna memacu efisiensi proses dan pertumbuhan kinerja perusahaan di berbagai lini bisnis.';

  const bioEnPrefix =
    'A business professional with an academic foundation in Management (B.S. in Management, With Honors), bridging strategic management, Human Resources governance, and project management';
  const bioEnSuffix =
    ' with digital transformation and systems automation. Experienced in streamlining operational workflows, standardizing continuous improvement SOPs, optimizing talent development, and engineering custom digital solutions to maximize process efficiency and corporate growth across diverse business sectors.';

  const isEn = language === 'en';
  const prefix = isEn ? bioEnPrefix : bioInPrefix;
  const suffix = isEn ? bioEnSuffix : bioInSuffix;

  return (
    <div className="flex flex-col space-y-3">
      <div>
        <h1 className="text-[2.2rem] sm:text-4xl md:text-5xl font-black tracking-tight text-[#2A3395] leading-[1.12]">
          {EXECUTIVE_PROFILE.fullName}
        </h1>
        <p className="mt-2 text-sm sm:text-base md:text-lg font-bold text-slate-600 leading-snug">
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

      <div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal text-justify">
          {prefix}
          {!isExpanded ? (
            <>
              <span> ... </span>
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="inline text-slate-700 hover:text-slate-900 font-normal hover:underline cursor-pointer select-none focus:outline-none p-0 bg-transparent border-none"
              >
                {isEn ? 'read more' : 'lihat selengkapnya'}
              </button>
            </>
          ) : (
            <>
              {suffix}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="inline text-slate-700 hover:text-slate-900 font-normal hover:underline cursor-pointer select-none focus:outline-none p-0 ml-1.5 bg-transparent border-none"
              >
                {isEn ? 'show less' : 'sembunyikan'}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
