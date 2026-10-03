import React from 'react';
import { CVData } from '../types';
import { ItemSelectionState } from '../data/presetItemSelections';
import { DesignPreset } from './PrintableView/types';

import {
  AtsHeader,
  AtsSummary,
  AtsMetrics,
  AtsExperiences,
  AtsEducation,
  AtsSkills,
  AtsCertifications,
  AtsConsultingProjects,
  AtsDigitalSolutions,
  AtsOrganizations,
  AtsAchievements,
} from './AtsDocumentSheet/sections';

export interface AtsDocumentSheetProps {
  sectionOrders: any;
  cvData: CVData;
  items: ItemSelectionState;
  language: 'id' | 'en';
  totalActiveItems: number;
  headline?: string;
  summaryText?: string;
  designPreset?: DesignPreset;
  preset?: string | null;
  textAlign?: 'left' | 'justify';
  headerColor?: string;
}

/**
 * Reusable Paper Sheet Component for CV Document
 */
export const AtsDocumentSheet: React.FC<AtsDocumentSheetProps> = ({
  cvData,
  items,
  language,
  totalActiveItems,
  sectionOrders,
  headline,
  summaryText,
  designPreset = 'block',
  preset,
  textAlign = 'left',
  headerColor = '#0F172A',
}) => {
  const renderSectionHeader = (title: string) => {
    if (designPreset === 'line') {
      return (
        <div className="border-b-2 pb-1 mb-2 mt-4 flex items-center justify-between" style={{ borderColor: headerColor }}>
          <h2 className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wider" style={{ color: headerColor }}>
            {title}
          </h2>
        </div>
      );
    }
    
    if (designPreset === 'plain') {
      return (
        <div className="mb-2 mt-4 flex items-center justify-between">
          <h2 className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wider" style={{ color: headerColor }}>
            {title}
          </h2>
        </div>
      );
    }
    
    if (designPreset === 'badge') {
      return (
        <div className="mb-2 mt-4 flex items-start">
          <div className="px-2.5 py-1 rounded-[2px] inline-flex items-center" style={{ backgroundColor: headerColor }}>
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
              {title}
            </h2>
          </div>
        </div>
      );
    }
    
    // Default: 'block'
    return (
      <div className="text-white px-2.5 py-1 mb-2 mt-3 rounded-[2px] flex items-center justify-between" style={{ backgroundColor: headerColor }}>
        <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
          {title}
        </h2>
      </div>
    );
  };

  const sharedProps = {
    cvData,
    items,
    language,
    sectionOrders,
    renderSectionHeader,
    designPreset,
    preset,
    headline,
    summaryText,
    textAlign,
  };

  return (
    <div
      id="ats-document-root"
      className="bg-white p-4 sm:p-7 md:p-9 shadow-xl print:shadow-none border border-slate-200/90 print:border-none print:p-0 font-sans transition-all duration-200 mx-auto w-full max-w-3xl text-slate-900 rounded-lg overflow-x-hidden select-text"
      style={{ minHeight: '297mm' }}
    >
      <AtsHeader {...sharedProps} />
      <AtsSummary {...sharedProps} />
      <AtsMetrics {...sharedProps} />
      <AtsExperiences {...sharedProps} />
      <AtsEducation {...sharedProps} />
      <AtsSkills {...sharedProps} />
      <AtsCertifications {...sharedProps} />
      <AtsConsultingProjects {...sharedProps} />
      <AtsDigitalSolutions {...sharedProps} />
      <AtsOrganizations {...sharedProps} />
      <AtsAchievements {...sharedProps} />

      {totalActiveItems === 0 && (
        <div className="py-16 text-center text-slate-400">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><polyline points="16 8 10 14 8 12"/></svg>
          <p className="text-sm font-semibold text-slate-600">
            {language === 'en' ? 'No items selected.' : 'Belum ada item yang dipilih.'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'en' ? 'Please check at least one item above to build your PDF.' : 'Silakan centang minimal satu item di atas untuk membuat CV PDF Anda.'}
          </p>
        </div>
      )}
    </div>
  );
};
