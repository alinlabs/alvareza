import React, { useRef, useEffect } from 'react';
import { ChevronUp, Check, X, AlignLeft, AlignJustify, Send } from 'lucide-react';
import { PresetCombobox, CvDesignCombobox, EmailOptionCombobox, HEADER_COLOR_PRESETS } from './JobApplyComboboxes';
import { CvDesignType, CvTextAlignType } from './types';
import { GasAccountConfig } from '../../../types/gasSender';

interface JobApplyFooterProps {
  gasSendState: 'idle' | 'generating' | 'sending' | 'success' | 'error';
  sendProgress: number;
  isCvOptionsOpen: boolean;
  setIsCvOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCvPreset: string;
  setSelectedCvPreset: (val: string) => void;
  setIsPresetAuto: (val: boolean) => void;
  cvDesignPreset: CvDesignType;
  setCvDesignPreset: (val: CvDesignType) => void;
  cvHeaderColor: string;
  setCvHeaderColor: (val: string) => void;
  cvTextAlign: CvTextAlignType;
  setCvTextAlign: (val: CvTextAlignType) => void;
  emailOption: string;
  handleEmailOptionChange: (val: string) => void;
  gasAccounts: GasAccountConfig[];
  handleSaveToDraft: () => void;
  draftSaveFeedback: boolean;
  activeEditingDraft: any;
  handleOpenMailClient: () => void;
  handleSendViaGas: () => void;
  onPresetChangeWithDraft: (newPreset: string) => void;
}

export const JobApplyFooter: React.FC<JobApplyFooterProps> = ({
  gasSendState,
  sendProgress,
  isCvOptionsOpen,
  setIsCvOptionsOpen,
  selectedCvPreset,
  setSelectedCvPreset,
  setIsPresetAuto,
  cvDesignPreset,
  setCvDesignPreset,
  cvHeaderColor,
  setCvHeaderColor,
  cvTextAlign,
  setCvTextAlign,
  emailOption,
  handleEmailOptionChange,
  gasAccounts,
  handleSaveToDraft,
  draftSaveFeedback,
  activeEditingDraft,
  handleOpenMailClient,
  handleSendViaGas,
  onPresetChangeWithDraft,
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = React.useState<boolean>(false);
  const colorPickerContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Action Buttons Footer: Saat proses kirim, digantikan dengan bar progress di paling bawah
  if (gasSendState === 'generating' || gasSendState === 'sending') {
    return (
      <div className="px-5 py-4 border-t border-slate-200 bg-white flex items-center gap-3.5 shrink-0 animate-in fade-in duration-200">
        <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner border border-slate-200/60">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${Math.min(100, Math.max(5, sendProgress))}%` }}
          />
        </div>
        <span className="text-xs sm:text-sm font-bold text-slate-700 font-mono tracking-tight shrink-0 min-w-[42px] text-right">
          {sendProgress}%
        </span>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-200 bg-slate-50/90 flex flex-col shrink-0 relative z-40">
      {/* Expanded CV Options in a SINGLE horizontal row without title labels or layout shifts */}
      {isCvOptionsOpen && (
        <div className="px-4 sm:px-5 pt-3 pb-1.5 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap py-0.5">
            {/* 1. Preset Role CV Combobox (Button: "OPT v") */}
            <div className="shrink-0">
              <PresetCombobox
                value={selectedCvPreset}
                onChange={(newPreset) => {
                  setSelectedCvPreset(newPreset);
                  setIsPresetAuto(false);
                  onPresetChangeWithDraft(newPreset);
                }}
              />
            </div>

            {/* 2. Jenis Desain CV Combobox (Button: "Blok v") */}
            <div className="shrink-0 min-w-[100px]">
              <CvDesignCombobox
                value={cvDesignPreset}
                onChange={(newDesign) => setCvDesignPreset(newDesign)}
              />
            </div>

            {/* 3. Warna Tema Header CV (Direct circle button without input box or text!) */}
            <div
              className={`relative shrink-0 ${isColorPickerOpen ? 'z-[100]' : 'z-10'}`}
              ref={colorPickerContainerRef}
            >
              <button
                type="button"
                id="btn-cv-color-circle-trigger"
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="h-10 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 transition-all"
                title={`Warna Header CV: ${cvHeaderColor}`}
                aria-label="Pilih Warna Header CV"
              >
                <span
                  className="w-5 h-5 rounded-full border border-black/10 shadow-2xs block shrink-0"
                  style={{ backgroundColor: cvHeaderColor }}
                />
              </button>

              {isColorPickerOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-[100] animate-in fade-in zoom-in-95">
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

            {/* 4. Perataan Teks (Direct Icon Toggle Buttons with Fixed Dimensions to Prevent Jitter) */}
            <div className="flex items-center gap-1 h-10 px-1.5 rounded-xl border border-slate-300 bg-white shadow-2xs shrink-0">
              <button
                type="button"
                onClick={() => setCvTextAlign('left')}
                className={`h-7 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
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
                className={`h-7 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
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
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-2">
        {/* Tombol Chevron Icon di Kiri & Kolom Opsi Email Pengiriman */}
        <div className={`flex items-center gap-1.5 ${activeEditingDraft ? 'shrink-0' : 'flex-1 min-w-0'}`}>
          {/* Bare Icon Chevron Button (No card wrapper) */}
          <button
            type="button"
            id="btn-toggle-cv-options"
            onClick={() => setIsCvOptionsOpen((prev) => !prev)}
            className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0 select-none flex items-center justify-center active:scale-95"
            title={
              isCvOptionsOpen
                ? 'Sembunyikan Opsi Kustomisasi CV'
                : 'Tampilkan Opsi Kustomisasi CV (Preset, Desain, Warna, Rata Teks)'
            }
            aria-label="Toggle Opsi Kustomisasi CV"
          >
            <ChevronUp
              className={`w-5 h-5 transition-transform duration-200 ${
                isCvOptionsOpen ? 'rotate-180 text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            />
          </button>

          {!activeEditingDraft && (
            <EmailOptionCombobox
              value={emailOption}
              onChange={handleEmailOptionChange}
              gasAccounts={gasAccounts}
            />
          )}
        </div>

        {/* Tombol Draft / Simpan & Tombol Kirim */}
        <div className={`flex items-center gap-2 ${activeEditingDraft ? 'flex-1 min-w-0' : 'shrink-0'}`}>
          <button
            type="button"
            id="btn-save-draft-action"
            onClick={handleSaveToDraft}
            disabled={gasSendState === 'generating' || gasSendState === 'sending'}
            className={`h-10 px-3.5 rounded-xl flex items-center justify-center font-bold text-xs tracking-wide transition-all shadow-2xs cursor-pointer disabled:opacity-50 border select-none ${
              activeEditingDraft ? 'flex-1 min-w-0' : 'shrink-0'
            } ${
              draftSaveFeedback
                ? 'bg-emerald-100 text-emerald-800 border-emerald-400 ring-2 ring-emerald-400'
                : activeEditingDraft
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100/80 active:scale-95'
                : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100/80 active:scale-95'
            }`}
            title={
              activeEditingDraft
                ? 'Simpan perubahan draf tersimpan ini'
                : 'Simpan data formulir ini ke Draf baru'
            }
            aria-label={activeEditingDraft ? 'Simpan Perubahan Draf' : 'Simpan Draf Baru'}
          >
            {draftSaveFeedback
              ? 'TERSIMPAN!'
              : activeEditingDraft
              ? 'SIMPAN'
              : 'DRAFT'}
          </button>

          {/* Samping Paling Kanan: Tombol Kirim Presisi */}
          <button
            type="button"
            id="btn-send-email-action"
            onClick={() => {
              if (emailOption === 'mailto') {
                handleOpenMailClient();
              } else {
                handleSendViaGas();
              }
            }}
            disabled={gasSendState === 'generating' || gasSendState === 'sending'}
            className={`h-10 rounded-xl flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/30 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-blue-500/20 ${
              activeEditingDraft
                ? 'flex-1 min-w-0 px-3.5 font-bold text-xs tracking-wide'
                : 'w-10 sm:w-11 shrink-0'
            }`}
            title={emailOption === 'mailto' ? 'Buka Aplikasi Email' : 'Kirim Email Lamaran'}
            aria-label={emailOption === 'mailto' ? 'Buka Aplikasi Email' : 'Kirim Email Lamaran'}
          >
            {activeEditingDraft ? (
              <span>KIRIM</span>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
