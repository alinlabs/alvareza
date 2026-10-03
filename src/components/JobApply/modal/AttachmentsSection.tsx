import React from 'react';
import { RotateCw, Download, ChevronUp, ChevronDown, Sparkles, Trash2 } from 'lucide-react';
import {
  ALL_PORTFOLIO_SLIDES,
  ALL_CERTIFICATES_LIST,
  isHrPosition,
  isRecruitmentScreeningFocus,
  sortPortfolioSlideIds,
} from '../../../utils/gasAttachmentGenerator';
import { ALL_ACADEMIC_DOCS } from '../../../data/academicDocs';
import { CustomAttachmentItem } from './types';

interface AttachmentsSectionProps {
  selectedCvPreset: string;
  jobTitle: string;
  selectedAcademicIds: string[];
  showAcademicBreakdown: boolean;
  setShowAcademicBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewAcademicPdf: () => void;
  isPreviewingAcademic: boolean;
  handleToggleAcademicDoc: (docId: 'skl' | 'transkrip') => void;
  selectedPortfolioSlideIds: string[];
  showPortfolioBreakdown: boolean;
  setShowPortfolioBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewPortfolioPdf: () => void;
  isPreviewingPortfolio: boolean;
  handleTogglePortfolioSlide: (slideId: string) => void;
  selectedCertIds: string[];
  showCertsBreakdown: boolean;
  setShowCertsBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewCertsPdf: () => void;
  isPreviewingCerts: boolean;
  handleToggleCert: (certId: string) => void;
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
  selectedCvPreset,
  jobTitle,
  selectedAcademicIds,
  showAcademicBreakdown,
  setShowAcademicBreakdown,
  handlePreviewAcademicPdf,
  isPreviewingAcademic,
  handleToggleAcademicDoc,
  selectedPortfolioSlideIds,
  showPortfolioBreakdown,
  setShowPortfolioBreakdown,
  handlePreviewPortfolioPdf,
  isPreviewingPortfolio,
  handleTogglePortfolioSlide,
  selectedCertIds,
  showCertsBreakdown,
  setShowCertsBreakdown,
  handlePreviewCertsPdf,
  isPreviewingCerts,
  handleToggleCert,
  customAttachments,
  handleRemoveCustomAttachment,
  processUploadedFiles,
  setTargetCertIdForPick,
  attachmentInputRef,
  isAttachmentDropOver,
  setIsAttachmentDropOver,
  formatFileSize,
}) => {
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

      {/* Automated Document Sections (Akademik, Portofolio & Sertifikasi) */}
      <div className="space-y-4">
        {/* SECTION: DOKUMEN AKADEMIK */}
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
                  ? '2 Dokumen (Digabung: skl_transkrip_alvareza.pdf)'
                  : `${selectedAcademicIds.length} Dokumen`}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handlePreviewAcademicPdf}
                disabled={isPreviewingAcademic || selectedAcademicIds.length === 0}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title={
                  selectedAcademicIds.length === 0
                    ? 'Pilih minimal 1 dokumen akademik untuk diunduh'
                    : selectedAcademicIds.length === 2
                    ? 'Unduh & Periksa Berkas Gabungan (skl_transkrip_alvareza.pdf)'
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
                        ✨ Berkas otomatis digabung secara efisien menjadi: <strong className="font-mono">skl_transkrip_alvareza.pdf</strong>
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

        {/* SECTION: PORTOFOLIO ADAPTIF */}
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
                    Belum ada dokumen portofolio yang dipilih dari daftar checkbox.
                  </p>
                )}
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {['I', 'II', 'III', 'IV', 'V'].map((sectionCode) => {
                  const sectionSlides = ALL_PORTFOLIO_SLIDES.filter((s) => s.section === sectionCode);
                  if (sectionSlides.length === 0) return null;
                  const sectionLabel = sectionSlides[0].sectionLabel;

                  return (
                    <div key={sectionCode} className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 pt-1 border-t border-slate-100 first:border-0 first:pt-0">
                        {sectionLabel}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {sectionSlides.map((slide) => {
                          const isChecked = selectedPortfolioSlideIds.includes(slide.id);

                          return (
                            <label
                              key={slide.id}
                              className={`px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2 text-[11px] cursor-pointer transition-all ${
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
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200/60" />

        {/* SECTION: KOMPILASI SERTIFIKASI RESMI */}
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div
              onClick={() => setShowCertsBreakdown((prev) => !prev)}
              className="min-w-0 flex-1 cursor-pointer select-none"
            >
              <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors">
                Sertifikasi Resmi
              </h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {selectedCertIds.length} Dokumen
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handlePreviewCertsPdf}
                disabled={isPreviewingCerts || selectedCertIds.length === 0}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title={
                  selectedCertIds.length === 0
                    ? 'Pilih minimal 1 sertifikat untuk di-preview'
                    : 'Unduh & Periksa Kompilasi Sertifikasi'
                }
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
                          ? 'opacity-100 shadow-2xs'
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

      {/* SECTION: Lampiran Tambahan */}
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
