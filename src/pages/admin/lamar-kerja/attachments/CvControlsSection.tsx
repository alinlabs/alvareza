import React, { useState, useRef, useEffect } from 'react';
import {
  Eye,
  RotateCw,
  Download,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignJustify,
  Check,
  X,
} from 'lucide-react';
import { ALL_ROLE_PRESETS } from '../../../../data/preset/RoleConfig';
import { CvDesignType, CvTextAlignType } from '../../types';
import { HEADER_COLOR_PRESETS } from '../../constants';
import {
  PresetCombobox,
  CvDesignCombobox,
  CV_DESIGN_OPTIONS,
} from '../JobApplyComboboxes';

export interface CvControlsSectionProps {
  selectedCvPreset: string;
  setSelectedCvPreset?: (val: string) => void;
  setIsPresetAuto?: (val: boolean) => void;
  onPresetChangeWithDraft?: (newPreset: string) => void;
  cvDesignPreset: CvDesignType;
  setCvDesignPreset: (val: CvDesignType) => void;
  cvHeaderColor: string;
  setCvHeaderColor: (val: string) => void;
  cvTextAlign: CvTextAlignType;
  setCvTextAlign: (val: CvTextAlignType) => void;
  handlePreviewCvPdf?: () => void;
  isPreviewingCv?: boolean;
  onOpenCvPreviewModal?: () => void;
  showCvBreakdown?: boolean;
  setShowCvBreakdown?: React.Dispatch<React.SetStateAction<boolean>>;
  language?: 'in' | 'en' | 'id';
  onToggleLanguage?: () => void;
  onSelectLanguage?: (lang: 'id' | 'en') => void;
}

export const CvControlsSection: React.FC<CvControlsSectionProps> = ({
  selectedCvPreset,
  setSelectedCvPreset,
  setIsPresetAuto,
  onPresetChangeWithDraft,
  cvDesignPreset,
  setCvDesignPreset,
  cvHeaderColor,
  setCvHeaderColor,
  cvTextAlign,
  setCvTextAlign,
  handlePreviewCvPdf,
  isPreviewingCv = false,
  onOpenCvPreviewModal,
  showCvBreakdown = false,
  setShowCvBreakdown,
  language = 'in',
  onToggleLanguage,
  onSelectLanguage,
}) => {
  // Local state for color picker popover
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
  const colorPickerContainerRef = useRef<HTMLDivElement | null>(null);

  // Close color picker on outside click
  useEffect(() => {
    const handleClickOutsideColorPicker = (event: MouseEvent) => {
      if (
        colorPickerContainerRef.current &&
        !colorPickerContainerRef.current.contains(event.target as Node)
      ) {
        setIsColorPickerOpen(false);
      }
    };
    if (isColorPickerOpen) {
      document.addEventListener('mousedown', handleClickOutsideColorPicker);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideColorPicker);
    };
  }, [isColorPickerOpen]);

  // Current active Preset & Design definitions for labels
  const currentPreset =
    ALL_ROLE_PRESETS.find((p) => p.key === selectedCvPreset) || ALL_ROLE_PRESETS[0];
  const currentDesign =
    CV_DESIGN_OPTIONS.find((d) => d.key === cvDesignPreset) || CV_DESIGN_OPTIONS[0];

  const handleToggleCvDrawer = () => {
    if (setShowCvBreakdown) {
      setShowCvBreakdown((prev) => !prev);
    }
  };

  // Format CV Subtitle: [Code role capital], [Design code uppercase], [Lang], [color] -> e.g. HRS, Blok, In, #000000
  const roleCodeUpper = (currentPreset?.code || 'OPT').toUpperCase();
  const designNameFormatted = currentDesign?.label
    ? currentDesign.label.charAt(0).toUpperCase() + currentDesign.label.slice(1)
    : 'Blok';
  const langFormatted = language === 'en' ? 'En' : 'In';
  const colorFormatted = cvHeaderColor || '#000000';
  const cvSubtitle = `${roleCodeUpper}, ${designNameFormatted}, ${langFormatted}, ${colorFormatted}`;

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div
          onClick={handleToggleCvDrawer}
          className="min-w-0 flex-1 cursor-pointer select-none"
        >
          <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <span>Curriculum Vitae</span>
          </h4>
          <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
            {cvSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* 1. Unduh / Preview CV ATS Button (Icon Download di kiri icon mata) */}
          {handlePreviewCvPdf && (
            <button
              type="button"
              onClick={handlePreviewCvPdf}
              disabled={isPreviewingCv}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Unduh & Periksa Berkas CV ATS"
              aria-label="Unduh & Periksa Berkas CV ATS"
            >
              {isPreviewingCv ? (
                <RotateCw className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          )}

          {/* 2. Pratinjau Modal CV (Icon Mata di kiri dropdown) */}
          {onOpenCvPreviewModal && (
            <button
              type="button"
              onClick={onOpenCvPreviewModal}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              title="Lihat Pratinjau Curriculum Vitae"
              aria-label="Lihat Pratinjau Curriculum Vitae"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {/* 3. Toggle Drawer Button */}
          <button
            type="button"
            onClick={handleToggleCvDrawer}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title={showCvBreakdown ? 'Sembunyikan opsi Curriculum Vitae' : 'Tampilkan opsi Curriculum Vitae'}
            aria-label="Toggle Curriculum Vitae Breakdown"
          >
            {showCvBreakdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Breakdown Drawer: Kustomisasi Lengkap CV (Role, Desain, Warna, Rata Kanan Kiri) */}
      {showCvBreakdown && (
        <div className="pt-1.5 text-xs animate-in fade-in duration-150">
          {/* Controls Form: 2 Baris di Mobile (Baris 1: Bendera, Role, Desain | Baris 2: Warna, Rata Teks) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-2.5 w-full">
            {/* Baris 1 di Mobile: Bendera (ID & EN), Preset Role (OPT), Jenis Desain (Blok) */}
            <div className="flex items-center gap-2 md:gap-2.5 flex-1 md:flex-[1.35] min-w-0 w-full">
              {/* 1. 2 Card Bendera Bahasa (Kiri: Indonesia, Kanan: Inggris) */}
              {(onSelectLanguage || onToggleLanguage) && (
                <div className="flex items-center gap-1 shrink-0">
                  {/* Card Bendera Kiri: Indonesia */}
                  <button
                    type="button"
                    id="btn-cv-language-in"
                    onClick={() => {
                      if (onSelectLanguage) {
                        onSelectLanguage('in');
                      } else if (onToggleLanguage && language !== 'in') {
                        onToggleLanguage();
                      }
                    }}
                    className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 transition-all select-none ${
                      language === 'in'
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/40 shadow-xs'
                        : 'border-slate-300 bg-white hover:bg-slate-50 opacity-45 hover:opacity-90'
                    }`}
                    title="Bahasa Indonesia (CV & Draf Lamaran IN)"
                    aria-label="Pilih Bahasa Indonesia"
                  >
                    <img
                      src="https://flagcdn.com/id.svg"
                      alt="Bendera Indonesia"
                      className={`w-5 h-3.5 object-cover rounded-xs shadow-2xs border border-black/10 block pointer-events-none transition-transform ${
                        language === 'in' ? 'scale-105' : 'scale-95'
                      }`}
                      referrerPolicy="no-referrer"
                      loading="eager"
                    />
                  </button>

                  {/* Card Bendera Kanan: Inggris / UK */}
                  <button
                    type="button"
                    id="btn-cv-language-en"
                    onClick={() => {
                      if (onSelectLanguage) {
                        onSelectLanguage('en');
                      } else if (onToggleLanguage && language !== 'en') {
                        onToggleLanguage();
                      }
                    }}
                    className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 transition-all select-none ${
                      language === 'en'
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/40 shadow-xs'
                        : 'border-slate-300 bg-white hover:bg-slate-50 opacity-45 hover:opacity-90'
                    }`}
                    title="English (CV & Application Draft EN)"
                    aria-label="Select English"
                  >
                    <img
                      src="https://flagcdn.com/gb.svg"
                      alt="UK Flag"
                      className={`w-5 h-3.5 object-cover rounded-xs shadow-2xs border border-black/10 block pointer-events-none transition-transform ${
                        language === 'en' ? 'scale-105' : 'scale-95'
                      }`}
                      referrerPolicy="no-referrer"
                      loading="eager"
                    />
                  </button>
                </div>
              )}

              {/* 2. Preset Role CV Combobox */}
              <div className="flex-1 min-w-0">
                <PresetCombobox
                  value={selectedCvPreset}
                  onChange={(newPreset) => {
                    setSelectedCvPreset?.(newPreset);
                    setIsPresetAuto?.(false);
                    onPresetChangeWithDraft?.(newPreset);
                  }}
                  direction="down"
                />
              </div>

              {/* 3. Jenis Desain CV Combobox */}
              <div className="flex-1 min-w-0">
                <CvDesignCombobox
                  value={cvDesignPreset}
                  onChange={(newDesign) => setCvDesignPreset(newDesign)}
                  direction="down"
                />
              </div>
            </div>

            {/* Baris 2 di Mobile: Warna Tema Header CV & Perataan Teks */}
            <div className="flex items-center gap-2 md:gap-2.5 flex-1 md:flex-1 min-w-0 w-full">
              {/* 4. Warna Tema Header CV (Circle button + palette modal) */}
              <div className="flex-1 min-w-0">
                <div
                  className={`relative w-full ${isColorPickerOpen ? 'z-[100]' : 'z-10'}`}
                  ref={colorPickerContainerRef}
                >
                  <button
                    type="button"
                    id="btn-cv-color-circle-trigger"
                    onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                    className="w-full h-10 px-2.5 sm:px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between cursor-pointer shadow-2xs active:scale-95 transition-all select-none"
                    title={`Warna Header CV: ${cvHeaderColor}`}
                    aria-label="Pilih Warna Header CV"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-4 h-4 rounded-full border border-black/15 shadow-2xs block shrink-0"
                        style={{ backgroundColor: cvHeaderColor }}
                      />
                      <span className="text-[11px] font-mono font-semibold text-slate-700 uppercase tracking-tight truncate">
                        {cvHeaderColor.startsWith('#') ? cvHeaderColor : `#${cvHeaderColor}`}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5 transition-transform duration-200 ${
                        isColorPickerOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isColorPickerOpen && (
                    <div className="absolute left-0 md:left-auto md:right-0 top-full mt-1.5 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-[100] animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: cvHeaderColor }}
                          />
                          <span className="text-xs font-bold text-slate-900">
                            Warna Header CV
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsColorPickerOpen(false)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium mb-2.5">
                        Pilih warna tema header section CV:
                      </p>

                      <div className="grid grid-cols-6 gap-2 mb-3">
                        {HEADER_COLOR_PRESETS.map((preset) => {
                          const isSelected =
                            cvHeaderColor.toLowerCase() === preset.hex.toLowerCase();
                          return (
                            <button
                              key={preset.hex}
                              type="button"
                              onClick={() => {
                                setCvHeaderColor(preset.hex);
                              }}
                              title={preset.label}
                              className={`w-7 h-7 rounded-full transition-all flex items-center justify-center border cursor-pointer ${
                                isSelected
                                  ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-white scale-110 border-white shadow-xs'
                                  : 'border-slate-200 hover:scale-105'
                              }`}
                              style={{ backgroundColor: preset.hex }}
                            >
                              {isSelected && (
                                <Check
                                  className="w-3.5 h-3.5 text-white drop-shadow-xs"
                                  strokeWidth={3}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                        <label className="text-[11px] font-bold text-slate-500 shrink-0">
                          HEX
                        </label>
                        <div className="relative flex-1 flex items-center">
                          <input
                            type="text"
                            maxLength={7}
                            value={
                              cvHeaderColor.startsWith('#')
                                ? cvHeaderColor
                                : `#${cvHeaderColor}`
                            }
                            onChange={(e) => {
                              let val = e.target.value;
                              if (!val.startsWith('#')) {
                                val = '#' + val.replace(/#/g, '');
                              }
                              const hexPart = val.slice(1).replace(/[^0-9A-Fa-f]/g, '');
                              if (hexPart.length <= 6) {
                                setCvHeaderColor(`#${hexPart}`);
                              }
                            }}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-normal outline-none uppercase transition-all"
                            placeholder="#0062E3"
                          />
                        </div>
                        <input
                          type="color"
                          value={
                            cvHeaderColor.startsWith('#') && cvHeaderColor.length === 7
                              ? cvHeaderColor
                              : '#0062E3'
                          }
                          onChange={(e) => setCvHeaderColor(e.target.value.toUpperCase())}
                          className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden shrink-0"
                          title="Pilih warna khusus"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Perataan Teks (Rata Kiri & Rata Kanan Kiri / Justify) */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 h-10 px-1.5 rounded-xl border border-slate-300 bg-white shadow-2xs w-full">
                  <button
                    type="button"
                    onClick={() => setCvTextAlign('left')}
                    className={`h-7 flex-1 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                      cvTextAlign === 'left'
                        ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold'
                        : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-transparent'
                    }`}
                    title="Perataan Teks: Rata Kiri"
                    aria-label="Rata Kiri"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCvTextAlign('justify')}
                    className={`h-7 flex-1 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                      cvTextAlign === 'justify'
                        ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold'
                        : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-transparent'
                    }`}
                    title="Perataan Teks: Rata Kanan Kiri (Justify)"
                    aria-label="Rata Kanan Kiri"
                  >
                    <AlignJustify className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
