import React from 'react';
import { EXECUTIVE_PROFILE } from '../constants';

interface ExecutiveHeroProps {
  language: 'in' | 'en' | 'id';
}

export const ExecutiveHero: React.FC<ExecutiveHeroProps> = ({ language }) => {
  return (
    <div className="flex flex-col space-y-3">
      <div>
        <h1 className="text-[2.2rem] sm:text-4xl md:text-5xl font-black tracking-tight text-[#2A3395] leading-[1.12]">
          {EXECUTIVE_PROFILE.fullName}
        </h1>
        <p className="mt-2 text-sm sm:text-base md:text-lg font-bold text-slate-600 leading-snug">
          {/* Mobile Tagline Khusus Mobile */}
          <span className="block sm:hidden">
            {language === 'en'
              ? 'Business Consulting, Human Resources, Digital Transformation & Systems Efficiency'
              : 'Konsultasi Bisnis, Human Resource, Transformasi Digital & Efesiensi Sistem'}
          </span>
          {/* Desktop / Tablet Tagline */}
          <span className="hidden sm:block">
            {language === 'en'
              ? 'Business Management Consultant & Project Manager, Human Resources, Digital Transformation, AI Automation & Integrated Systems Efficiency'
              : 'Konsultan Manajemen Bisnis & Project Manager, Human Resources, Transformasi Digital, Otomasi Ai & Efisiensi Sistem Terintegrasi'}
          </span>
        </p>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal text-justify">
        {language === 'en' ? (
          <>
            A business professional bridging strategic management, Human Resources governance, and project management with digital transformation and systems automation. Experienced in streamlining operational workflows, standardizing continuous improvement SOPs, optimizing talent development, and engineering custom digital solutions to maximize process efficiency and corporate growth across diverse business sectors.
          </>
        ) : (
          <>
            Profesional bisnis yang memadukan keahlian konsultasi manajemen, tata kelola Human Resources, dan manajemen proyek dengan transformasi digital serta otomasi sistem. Berpengalaman dalam merancang efisiensi alur kerja operasional, standardisasi SOP berbasis continuous improvement, tata kelola talenta SDM, serta pembangunan solusi aplikasi kustom guna memacu efisiensi proses dan pertumbuhan kinerja perusahaan di berbagai lini bisnis.
          </>
        )}
      </p>
    </div>
  );
};
