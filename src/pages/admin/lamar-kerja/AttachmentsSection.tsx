import React, { useState, useRef, useEffect } from 'react';
import {
  Eye,
  RotateCw,
  Download,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Trash2,
  FileText,
  AlignLeft,
  AlignJustify,
  Check,
  X,
} from 'lucide-react';
import {
  ALL_PORTFOLIO_SLIDES,
  ALL_CERTIFICATES_LIST,
  isHrPosition,
  isRecruitmentScreeningFocus,
  sortPortfolioSlideIds,
} from '../../../utils/gasAttachmentGenerator';
import { ALL_ACADEMIC_DOCS } from '../../../data/academicDocs';
import { ALL_ROLE_PRESETS } from '../../../data/preset/RoleConfig';
import { CustomAttachmentItem, CvDesignType, CvTextAlignType } from '../types';
import { HEADER_COLOR_PRESETS } from '../constants';
import {
  PresetCombobox,
  CvDesignCombobox,
  CV_DESIGN_OPTIONS,
} from './JobApplyComboboxes';

interface AttachmentsSectionProps {
  // Curriculum Vitae Section Props
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

  // Job Context
  jobTitle: string;
  jobDesk?: string;
  kualifikasi?: string;
  rawText?: string;
  language?: 'in' | 'en' | 'id';
  onToggleLanguage?: () => void;
  onSelectLanguage?: (lang: 'id' | 'en') => void;

  // Akademik Section Props
  selectedAcademicIds: string[];
  showAcademicBreakdown: boolean;
  setShowAcademicBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewAcademicPdf: () => void;
  isPreviewingAcademic: boolean;
  onOpenAcademicPreviewModal?: () => void;
  handleToggleAcademicDoc: (docId: 'skl' | 'transkrip') => void;

  // Portofolio Section Props
  selectedPortfolioSlideIds: string[];
  showPortfolioBreakdown: boolean;
  setShowPortfolioBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewPortfolioPdf: () => void;
  isPreviewingPortfolio: boolean;
  onOpenPortfolioPreviewModal?: () => void;
  handleTogglePortfolioSlide: (slideId: string) => void;

  // Sertifikasi Section Props
  selectedCertIds: string[];
  showCertsBreakdown: boolean;
  setShowCertsBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewCertsPdf: () => void;
  isPreviewingCerts: boolean;
  onOpenCertsPreviewModal?: () => void;
  handleToggleCert: (certId: string) => void;

  // Custom Attachments Props
  customAttachments: CustomAttachmentItem[];
  handleRemoveCustomAttachment: (id: string) => void;
  processUploadedFiles: (files: FileList | File[], forCertId?: string | null) => Promise<void>;
  setTargetCertIdForPick: (id: string | null) => void;
  attachmentInputRef: React.RefObject<HTMLInputElement | null>;
  isAttachmentDropOver: boolean;
  setIsAttachmentDropOver: (over: boolean) => void;
  formatFileSize: (bytes: number) => string;
}

export const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  // Curriculum Vitae
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

  // Job Context
  jobTitle,
  jobDesk,
  kualifikasi,
  rawText,
  language = 'in',
  onToggleLanguage,
  onSelectLanguage,

  // Akademik
  selectedAcademicIds,
  showAcademicBreakdown,
  setShowAcademicBreakdown,
  handlePreviewAcademicPdf,
  isPreviewingAcademic,
  onOpenAcademicPreviewModal,
  handleToggleAcademicDoc,

  // Portofolio
  selectedPortfolioSlideIds,
  showPortfolioBreakdown,
  setShowPortfolioBreakdown,
  handlePreviewPortfolioPdf,
  isPreviewingPortfolio,
  onOpenPortfolioPreviewModal,
  handleTogglePortfolioSlide,

  // Sertifikasi
  selectedCertIds,
  showCertsBreakdown,
  setShowCertsBreakdown,
  handlePreviewCertsPdf,
  isPreviewingCerts,
  onOpenCertsPreviewModal,
  handleToggleCert,

  // Custom Attachments
  customAttachments,
  handleRemoveCustomAttachment,
  processUploadedFiles,
  setTargetCertIdForPick,
  attachmentInputRef,
  isAttachmentDropOver,
  setIsAttachmentDropOver,
  formatFileSize,
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

  return (
    <div className="space-y-3 pt-2">
      {/* Hidden File Input for General Extra Attachments */}
      <input
        ref={attachmentInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.zip,.rar"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processUploadedFiles(e.target.files, null);
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Automated Document Sections (Curriculum Vitae, Akademik, Portofolio & Sertifikasi) */}
      <div className="space-y-4">
        {/* ======================================================== */}
        {/* SECTION 1: CURRICULUM VITAE (ATS Official Document) */}
        {/* ======================================================== */}
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
                Role : {(currentPreset?.code || 'opt').toLowerCase()}, Design : {(currentDesign?.label || 'blok').toLowerCase()}, Align : {cvTextAlign || 'left'}, Lang : {language || 'in'}, Color : {cvHeaderColor || '#0062E3'}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Pratinjau Modal CV (Icon Mata di Kiri Download) */}
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

              {/* Unduh / Preview CV ATS Button */}
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

              {/* Toggle Drawer Button */}
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
              {/* Controls Form: Role, Desain, Warna, Rata Kanan Kiri tanpa card pembungkus dan tanpa teks label - Full lebar kanan-kiri */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 w-full">
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

                {/* 2. Preset Role CV Combobox (Slot independen flex-1 agar lebih lebar dan lega) */}
                <div className="flex-1 min-w-[100px] sm:min-w-[110px]">
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
                <div className="flex-1 min-w-[95px] sm:min-w-[105px]">
                  <CvDesignCombobox
                    value={cvDesignPreset}
                    onChange={(newDesign) => setCvDesignPreset(newDesign)}
                    direction="down"
                  />
                </div>

                {/* 3. Warna Tema Header CV (Circle button + palette modal) */}
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
                        <span className="text-[11px] font-mono font-semibold text-slate-700 uppercase tracking-tight">
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
                      <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-[100] animate-in fade-in zoom-in-95">
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

                {/* 4. Perataan Teks (Rata Kiri & Rata Kanan Kiri / Justify) */}
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
          )}
        </div>

        <div className="border-t border-slate-200/60" />

        {/* ======================================================== */}
        {/* SECTION 2: DOKUMEN AKADEMIK */}
        {/* ======================================================== */}
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div
              onClick={() => setShowAcademicBreakdown((prev) => !prev)}
              className="min-w-0 flex-1 cursor-pointer select-none"
            >
              <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors">
                Akademik
              </h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {selectedAcademicIds.length === 2
                  ? '2 Dokumen (Digabung: akademik-alvareza.pdf)'
                  : `${selectedAcademicIds.length} Dokumen`}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Pratinjau Modal Akademik (Icon Mata di Kiri Download) */}
              {onOpenAcademicPreviewModal && (
                <button
                  type="button"
                  onClick={onOpenAcademicPreviewModal}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  title="Lihat Pratinjau Dokumen Akademik"
                  aria-label="Lihat Pratinjau Dokumen Akademik"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handlePreviewAcademicPdf}
                disabled={isPreviewingAcademic || selectedAcademicIds.length === 0}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title={
                  selectedAcademicIds.length === 0
                    ? 'Pilih minimal 1 dokumen akademik untuk diunduh'
                    : selectedAcademicIds.length === 2
                    ? 'Unduh & Periksa Berkas Gabungan (akademik-alvareza.pdf)'
                    : 'Unduh & Periksa Dokumen Akademik'
                }
              >
                {isPreviewingAcademic ? (
                  <RotateCw className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAcademicBreakdown((prev) => !prev)}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                title={showAcademicBreakdown ? 'Sembunyikan daftar dokumen akademik' : 'Tampilkan daftar dokumen akademik'}
              >
                {showAcademicBreakdown ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Breakdown Drawer: Badge Container & Sistem Checkbox Akademik */}
          {showAcademicBreakdown && (
            <div className="space-y-2 text-xs animate-in fade-in duration-150">
              {/* Read-only Badge Container for Selected Academic Documents */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 min-h-[44px] shadow-2xs space-y-1.5">
                {selectedAcademicIds.length > 0 ? (
                  <>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {selectedAcademicIds.map((docId) => {
                        const doc = ALL_ACADEMIC_DOCS.find((d) => d.id === docId);
                        if (!doc) return null;
                        return (
                          <span
                            key={doc.id}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-medium shadow-2xs"
                          >
                            {doc.title}
                          </span>
                        );
                      })}
                    </div>
                    {selectedAcademicIds.length === 2 && (
                      <p className="text-[10.5px] text-blue-700 font-medium pt-0.5">
                        ✨ Berkas otomatis digabung secara efisien menjadi: <strong className="font-mono">akademik-alvareza.pdf</strong>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-[11px] text-slate-400 italic py-0.5">
                    Belum ada dokumen akademik yang dipilih dari daftar checkbox.
                  </p>
                )}
              </div>

              {/* Checkbox Grid 2 Pilihan (Surat Keterangan Lulus & Transkrip Nilai) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {ALL_ACADEMIC_DOCS.map((doc) => {
                  const isChecked = selectedAcademicIds.includes(doc.id);

                  return (
                    <label
                      key={doc.id}
                      className={`px-2.5 py-2 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2 text-[11px] cursor-pointer transition-all ${
                        isChecked
                          ? 'opacity-100 shadow-2xs bg-blue-50/30 border-blue-200'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 w-full">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleAcademicDoc(doc.id as 'skl' | 'transkrip')}
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span
                            className={`block truncate ${
                              isChecked ? 'text-slate-900 font-semibold' : 'text-slate-600 font-medium'
                            }`}
                            title={doc.title}
                          >
                            {doc.title}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-mono truncate">
                            {doc.filename}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200/60" />

        {/* ======================================================== */}
        {/* SECTION 3: PORTOFOLIO ADAPTIF */}
        {/* ======================================================== */}
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div
              onClick={() => setShowPortfolioBreakdown((prev) => !prev)}
              className="min-w-0 flex-1 cursor-pointer select-none"
            >
              <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors">
                Portofolio Eksekutif
              </h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {selectedPortfolioSlideIds.length} Dokumen
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Pratinjau Modal Portofolio (Icon Mata di Kiri Download) */}
              {onOpenPortfolioPreviewModal && (
                <button
                  type="button"
                  onClick={onOpenPortfolioPreviewModal}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  title="Lihat Pratinjau Portofolio Eksekutif"
                  aria-label="Lihat Pratinjau Portofolio Eksekutif"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handlePreviewPortfolioPdf}
                disabled={isPreviewingPortfolio || selectedPortfolioSlideIds.length === 0}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Unduh & Periksa Portofolio Terpilih"
              >
                {isPreviewingPortfolio ? (
                  <RotateCw className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowPortfolioBreakdown((prev) => !prev)}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                title={showPortfolioBreakdown ? 'Sembunyikan daftar slide' : 'Tampilkan daftar slide'}
              >
                {showPortfolioBreakdown ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Breakdown Drawer: Badge Container & Sistem Checkbox Lengkap */}
          {showPortfolioBreakdown && (
            <div className="space-y-2 text-xs animate-in fade-in duration-150">
              {/* HR Specific Prioritization Helper Banner */}
              {isHrPosition(selectedCvPreset, jobTitle) && (
                <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-950 text-xs flex items-start gap-2 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-semibold text-[11px] text-blue-900">
                      {isRecruitmentScreeningFocus(selectedCvPreset, jobTitle)
                        ? 'Prioritas Portofolio HR (Rekrutmen & Screening): Talenty & HR Matrix'
                        : 'Prioritas Portofolio HR (Sistem Menyeluruh): HR Matrix & Talenty'}
                    </p>
                    <p className="text-[10px] text-blue-700 leading-relaxed">
                      {isRecruitmentScreeningFocus(selectedCvPreset, jobTitle)
                        ? 'Portofolio difokuskan pada aplikasi Talenty (proses rekrutmen, tes & asesmen, scoring pelamar) didukung HR Matrix (sistem HR menyeluruh).'
                        : 'Portofolio difokuskan pada aplikasi HR Matrix (sistem HR end-to-end pasca-onboarding: presensi QR, payroll, BPJS & KPI) didukung Talenty (rekrutmen & screening).'}
                    </p>
                  </div>
                </div>
              )}

              {/* Read-only Badge Container for Selected Portfolio Documents */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 min-h-[44px] shadow-2xs">
                {selectedPortfolioSlideIds.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {sortPortfolioSlideIds(selectedPortfolioSlideIds, selectedCvPreset, jobTitle)
                      .map((slideId) => {
                        const slide = ALL_PORTFOLIO_SLIDES.find((s) => s.id === slideId);
                        if (!slide) return null;
                        return (
                          <span
                            key={slide.id}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-medium shadow-2xs"
                          >
                            {slide.title}
                          </span>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic py-0.5">
                    Belum ada slide portofolio yang dipilih dari daftar checkbox.
                  </p>
                )}
              </div>

              {/* Checkbox Grid Portfolio Slides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {ALL_PORTFOLIO_SLIDES.map((slide) => {
                  const isChecked = selectedPortfolioSlideIds.includes(slide.id);

                  return (
                    <label
                      key={slide.id}
                      className={`px-2.5 py-2 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2 text-[11px] cursor-pointer transition-all ${
                        isChecked
                          ? 'opacity-100 shadow-2xs bg-blue-50/30 border-blue-200'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 w-full">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePortfolioSlide(slide.id)}
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                        />
                        <span
                          className={`truncate flex-1 ${
                            isChecked ? 'text-slate-900 font-semibold' : 'text-slate-600 font-medium'
                          }`}
                          title={slide.title}
                        >
                          {slide.title}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200/60" />

        {/* ======================================================== */}
        {/* SECTION 4: SERTIFIKASI TERKAIT */}
        {/* ======================================================== */}
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div
              onClick={() => setShowCertsBreakdown((prev) => !prev)}
              className="min-w-0 flex-1 cursor-pointer select-none"
            >
              <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors">
                Sertifikasi Terkait
              </h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {selectedCertIds.length} Sertifikat Fisik
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Pratinjau Modal Sertifikasi (Icon Mata di Kiri Download) */}
              {onOpenCertsPreviewModal && (
                <button
                  type="button"
                  onClick={onOpenCertsPreviewModal}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  title="Lihat Pratinjau Sertifikasi Terkait"
                  aria-label="Lihat Pratinjau Sertifikasi Terkait"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handlePreviewCertsPdf}
                disabled={isPreviewingCerts || selectedCertIds.length === 0}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Unduh & Periksa Berkas Kompilasi Sertifikat Fisik"
              >
                {isPreviewingCerts ? (
                  <RotateCw className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowCertsBreakdown((prev) => !prev)}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                title={showCertsBreakdown ? 'Sembunyikan daftar sertifikat' : 'Tampilkan daftar sertifikat'}
              >
                {showCertsBreakdown ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Breakdown Drawer: Badge Container & Sistem Checkbox Lengkap */}
          {showCertsBreakdown && (
            <div className="space-y-2 text-xs animate-in fade-in duration-150">
              {/* Read-only Badge Container for Selected Certificates */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 min-h-[44px] shadow-2xs">
                {selectedCertIds.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedCertIds.map((certId) => {
                      const cert = ALL_CERTIFICATES_LIST.find((c) => c.id === certId);
                      if (!cert) return null;
                      return (
                        <span
                          key={cert.id}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-medium shadow-2xs"
                        >
                          {cert.title}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic py-0.5">
                    Belum ada sertifikat yang dipilih dari daftar checkbox.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {ALL_CERTIFICATES_LIST.map((c) => {
                  const isChecked = selectedCertIds.includes(c.id);

                  return (
                    <label
                      key={c.id}
                      className={`px-2.5 py-2 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2 text-[11px] cursor-pointer transition-all ${
                        isChecked
                          ? 'opacity-100 shadow-2xs bg-blue-50/30 border-blue-200'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 w-full">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCert(c.id)}
                          className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                        />
                        <span
                          className={`truncate flex-1 ${
                            isChecked ? 'text-slate-900 font-semibold' : 'text-slate-600 font-medium'
                          }`}
                          title={c.title}
                        >
                          {c.title}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 5: LAMPIRAN TAMBAHAN */}
      {/* ======================================================== */}
      <div className="pt-2 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-xs font-bold text-slate-900">
            Lampiran Tambahan
          </h4>
          <button
            type="button"
            onClick={() => {
              setTargetCertIdForPick(null);
              if (attachmentInputRef.current) {
                attachmentInputRef.current.value = '';
                attachmentInputRef.current.click();
              }
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            Tambah Berkas
          </button>
        </div>

        {/* General Extra Attachments List or Empty Dropzone */}
        {customAttachments.filter((a) => !a.certId).length === 0 ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsAttachmentDropOver(true);
            }}
            onDragLeave={() => setIsAttachmentDropOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsAttachmentDropOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processUploadedFiles(e.dataTransfer.files, null);
              }
            }}
            onClick={() => {
              setTargetCertIdForPick(null);
              if (attachmentInputRef.current) {
                attachmentInputRef.current.value = '';
                attachmentInputRef.current.click();
              }
            }}
            className={`border-2 border-dashed rounded-xl p-2.5 text-center cursor-pointer transition-all ${
              isAttachmentDropOver
                ? 'border-blue-500 bg-blue-50/70'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
            }`}
          >
            <p className="text-xs font-medium text-slate-600">
              Sisipkan File Tambahan
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              PDF, DOCX, JPG, PNG, ZIP (Maks. 15MB)
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {customAttachments
              .filter((a) => !a.certId)
              .map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-800 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomAttachment(file.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                    title="Hapus lampiran ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
