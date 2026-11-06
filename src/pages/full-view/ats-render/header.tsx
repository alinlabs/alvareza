import React from 'react';
import { AtsSectionProps } from './types';
import { PRESET_HEADLINES } from '../../../data/preset/HeadlinesSummaries';
import { resolvePresetFromQuery } from '../../../data/preset/RoleConfig';

export const AtsHeader: React.FC<AtsSectionProps> = ({ cvData, headline, preset, language, designPreset }) => {
  const canonicalPreset = (preset && resolvePresetFromQuery(preset)) || preset;
  const isHeadlineExplicit = headline !== undefined;
  const activeHeadline = isHeadlineExplicit
    ? headline
    : (canonicalPreset && PRESET_HEADLINES[canonicalPreset]?.[language]) ||
      (preset && PRESET_HEADLINES[preset]?.[language]) ||
      cvData.personalInfo.headline;

  if (designPreset === 'modern') {
    return (
      <header className="pb-3 mb-3 border-b border-slate-200 flex flex-col sm:flex-row items-center sm:items-center gap-4">
        {/* Pas Foto 3x4 di Kiri */}
        <div className="shrink-0">
          <div className="w-[84px] h-[112px] rounded-md overflow-hidden border border-slate-300 shadow-2xs bg-slate-100 flex items-center justify-center">
            <img
              src="/identitas/pas-foto-3x4.webp"
              alt={cvData.personalInfo.fullName}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>

        {/* Informasi Kandidat di Kanan */}
        <div className="flex-1 min-w-0 text-left pt-0.5">
          <h1 className="text-[14pt] tracking-tight uppercase leading-snug font-extrabold text-[#0F172A] break-words">
            {cvData.personalInfo.fullName}
          </h1>

          {activeHeadline && activeHeadline.trim() ? (
            <p className="text-xs sm:text-[13px] tracking-tight font-bold text-[#0F172A] mt-1 break-words">
              {activeHeadline}
            </p>
          ) : null}

          {/* Kontak Tabular Berjarak (Tanpa Dash / Separator) */}
          <div className="mt-2 text-xs text-slate-600 font-normal space-y-1">
            {/* Baris 1: [Nomor]   [Email]   [Web] */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <span>{cvData.personalInfo.phone}</span>
              <a href={`mailto:${cvData.personalInfo.email}`} className="text-slate-900 hover:underline">
                {cvData.personalInfo.email}
              </a>
              <a href={`https://${cvData.personalInfo.website}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline">
                {cvData.personalInfo.website}
              </a>
            </div>

            {/* Baris 2: [LinkedIn] */}
            <div>
              <a href={`https://${cvData.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline font-bold">
                {cvData.personalInfo.linkedin}
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="pb-2.5 mb-2 border-b border-slate-200 text-center">
      <h1 className="text-xl sm:text-2xl md:text-[26px] tracking-tight uppercase leading-tight font-extrabold text-[#0F172A] break-words">
        {cvData.personalInfo.fullName}
      </h1>

      {activeHeadline && activeHeadline.trim() ? (
        <p className="text-xs sm:text-[13px] tracking-tight font-bold text-[#0F172A] break-words">
          {activeHeadline}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-600 mt-2.5 font-normal">
        <span>{cvData.personalInfo.phone}</span>
        <span className="text-slate-300">|</span>
        <a href={`mailto:${cvData.personalInfo.email}`} className="text-slate-900 hover:underline">
          {cvData.personalInfo.email}
        </a>
        <span className="text-slate-300">|</span>
        <a href={`https://${cvData.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline font-bold">
          {cvData.personalInfo.linkedin}
        </a>
        <span className="text-slate-300">|</span>
        <a href={`https://${cvData.personalInfo.website}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline font-medium">
          {cvData.personalInfo.website}
        </a>
      </div>
    </header>
  );
};

export const Header = AtsHeader;
