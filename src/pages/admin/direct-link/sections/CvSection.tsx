import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ChevronDown,
  Search,
  Check,
  AlignLeft,
  AlignJustify,
  User,
  LayoutTemplate,
  X,
} from 'lucide-react';
import { CardStateCV } from '../types';
import { UrlBox } from '../components/UrlBox';
import { HEADER_COLOR_PRESETS } from '../../constants';
import { ALL_ROLE_PRESETS } from '../../../../data/preset/RoleConfig';
import { CV_DESIGN_OPTIONS } from '../../lamar-kerja/JobApplyComboboxes';
import { CvDesignType } from '../../types';

interface CvSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  cvState: CardStateCV;
  setCvState: React.Dispatch<React.SetStateAction<CardStateCV>>;
  cvUrl: string;
  isCopied: boolean;
  onCopy: () => void;
}

export const CvSection: React.FC<CvSectionProps> = ({
  isOpen,
  onToggle,
  cvState,
  setCvState,
  cvUrl,
  isCopied,
  onCopy,
}) => {
  // Popover State Refs
  const [isCvColorPickerOpen, setIsCvColorPickerOpen] = useState(false);
  const cvColorPickerRef = useRef<HTMLDivElement | null>(null);

  const [isCvPresetPickerOpen, setIsCvPresetPickerOpen] = useState(false);
  const [cvPresetSearch, setCvPresetSearch] = useState('');
  const cvPresetPickerRef = useRef<HTMLDivElement | null>(null);

  const [isCvDesignPickerOpen, setIsCvDesignPickerOpen] = useState(false);
  const cvDesignPickerRef = useRef<HTMLDivElement | null>(null);

  // Close color, preset, or design popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cvColorPickerRef.current && !cvColorPickerRef.current.contains(e.target as Node)) {
        setIsCvColorPickerOpen(false);
      }
      if (cvPresetPickerRef.current && !cvPresetPickerRef.current.contains(e.target as Node)) {
        setIsCvPresetPickerOpen(false);
      }
      if (cvDesignPickerRef.current && !cvDesignPickerRef.current.contains(e.target as Node)) {
        setIsCvDesignPickerOpen(false);
      }
    };
    if (isCvColorPickerOpen || isCvPresetPickerOpen || isCvDesignPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCvColorPickerOpen, isCvPresetPickerOpen, isCvDesignPickerOpen]);

  // Selected CV preset details
  const selectedPresetObj = useMemo(() => {
    return ALL_ROLE_PRESETS.find((p) => p.key === cvState.preset) || null;
  }, [cvState.preset]);

  // Selected CV design details
  const selectedDesignObj = useMemo(() => {
    const activeKey = cvState.design || 'block';
    return (
      CV_DESIGN_OPTIONS.find((d) => d.key === activeKey) || CV_DESIGN_OPTIONS[0]
    );
  }, [cvState.design]);

  // Filtered preset list for custom popup menu
  const filteredPresets = useMemo(() => {
    const q = cvPresetSearch.toLowerCase().trim();
    if (!q) return ALL_ROLE_PRESETS;
    return ALL_ROLE_PRESETS.filter((p) => {
      const matchTitle =
        (p.titleIn || p.titleId || '').toLowerCase().includes(q) ||
        (p.titleEn || '').toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchTag = p.tag.toLowerCase().includes(q);
      const matchPos =
        (p.positionsIn || p.positionsId || '').toLowerCase().includes(q) ||
        (p.positionsEn || '').toLowerCase().includes(q);
      return matchTitle || matchCode || matchTag || matchPos;
    });
  }, [cvPresetSearch]);

  // Subtitle summary text (matching image_a58d4db2.png: "OPT, Blok, In, #0062E3")
  const roleCode = (selectedPresetObj?.code || 'OPT').toUpperCase();
  const designLabel = selectedDesignObj.label;
  const langText = cvState.lang === 'en' ? 'En' : 'In';
  const colorText = (cvState.color || '#0062E3').toUpperCase();
  const cvSubtitle = `${roleCode}, ${designLabel}, ${langText}, ${colorText}`;

  return (
    <div className="py-3 sm:py-3.5 border-b border-slate-200/80 last:border-b-0 px-1 sm:px-2 group transition-colors">
      {/* Section Header (Click to expand/collapse) */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between gap-3 cursor-pointer select-none"
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
            Curriculum Vitae
          </h3>
          <p className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
            {cvSubtitle}
          </p>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100 transition-colors shrink-0">
          <ChevronDown
            className={`w-4 h-4 stroke-[1.5] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600' : ''
            }`}
          />
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3 pt-3 border-t border-slate-100 space-y-3"
        >
          {/* Controls Form matching image_a58d4db2.png */}
          <div className="space-y-2.5">
            {/* Row 1: Language Flags + Role Preset Dropdown + Design Dropdown */}
            <div className="flex items-center gap-2 w-full">
              {/* Flag Language Selector */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setCvState((prev) => ({ ...prev, lang: 'id' }))}
                  className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 transition-all select-none ${
                    cvState.lang === 'id'
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/40 shadow-xs'
                      : 'border-slate-300 bg-white hover:bg-slate-50 opacity-50 hover:opacity-90'
                  }`}
                  title="Bahasa Indonesia"
                  aria-label="Pilih Bahasa Indonesia"
                >
                  <img
                    src="https://flagcdn.com/id.svg"
                    alt="Bendera Indonesia"
                    className={`w-5 h-3.5 object-cover rounded-xs shadow-2xs border border-black/10 block pointer-events-none transition-transform ${
                      cvState.lang === 'id' ? 'scale-105' : 'scale-95'
                    }`}
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setCvState((prev) => ({ ...prev, lang: 'en' }))}
                  className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 transition-all select-none ${
                    cvState.lang === 'en'
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/40 shadow-xs'
                      : 'border-slate-300 bg-white hover:bg-slate-50 opacity-50 hover:opacity-90'
                  }`}
                  title="English (UK)"
                  aria-label="Select English"
                >
                  <img
                    src="https://flagcdn.com/gb.svg"
                    alt="UK Flag"
                    className={`w-5 h-3.5 object-cover rounded-xs shadow-2xs border border-black/10 block pointer-events-none transition-transform ${
                      cvState.lang === 'en' ? 'scale-105' : 'scale-95'
                    }`}
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                </button>
              </div>

              {/* Preset Role Combobox Trigger (NORMAL TEXT CODE WITHOUT BADGE) */}
              <div className="flex-1 min-w-0 relative" ref={cvPresetPickerRef}>
                <button
                  type="button"
                  onClick={() => setIsCvPresetPickerOpen(!isCvPresetPickerOpen)}
                  className="w-full h-10 px-2.5 sm:px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between cursor-pointer shadow-2xs active:scale-98 transition-all select-none text-left"
                  title="Pilih Preset Peran ATS"
                  aria-label="Pilih Preset Peran ATS"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {/* Normal bold text code without badge box */}
                    <span className="font-mono text-xs font-bold text-blue-700 tracking-wide shrink-0">
                      {selectedPresetObj?.code || 'OPT'}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 transition-transform duration-200 ${
                      isCvPresetPickerOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Custom Menu Popup */}
                {isCvPresetPickerOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
                    {/* Search Bar */}
                    <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                      <input
                        type="text"
                        value={cvPresetSearch}
                        onChange={(e) => setCvPresetSearch(e.target.value)}
                        placeholder="Cari kode preset (e.g. OPT, ADM, H..."
                        className="w-full px-2 py-1 text-xs bg-transparent text-slate-900 focus:outline-none placeholder:text-slate-400"
                        autoFocus
                      />
                      {cvPresetSearch && (
                        <button
                          type="button"
                          onClick={() => setCvPresetSearch('')}
                          className="text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* Options List */}
                    <div className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-100">
                      {filteredPresets.length === 0 ? (
                        <div className="p-3 text-[11px] text-slate-400 text-center">
                          Kode preset tidak ditemukan
                        </div>
                      ) : (
                        filteredPresets.map((preset) => {
                          const isSelected = cvState.preset === preset.key;
                          const labelText =
                            preset.tag ||
                            (cvState.lang === 'en'
                              ? preset.titleEn
                              : preset.titleIn || preset.titleId);
                          return (
                            <button
                              key={preset.key}
                              type="button"
                              onClick={() => {
                                setCvState((prev) => ({ ...prev, preset: preset.key }));
                                setIsCvPresetPickerOpen(false);
                                setCvPresetSearch('');
                              }}
                              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer group ${
                                isSelected
                                  ? 'bg-blue-50 text-blue-900 font-bold'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {/* Normal code text without badge */}
                                <span className="font-mono text-xs font-bold text-[#0062E3] shrink-0">
                                  {preset.code}
                                </span>
                                <div className="min-w-0">
                                  <div className="font-medium text-xs truncate leading-snug">
                                    {labelText}
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Design Template Combobox Trigger & Card Menu Popup */}
              <div className="flex-1 min-w-0 relative" ref={cvDesignPickerRef}>
                <button
                  type="button"
                  onClick={() => setIsCvDesignPickerOpen(!isCvDesignPickerOpen)}
                  className="w-full h-10 px-2.5 sm:px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between cursor-pointer shadow-2xs active:scale-98 transition-all select-none text-left"
                  title={`Desain CV: ${selectedDesignObj.label}`}
                  aria-label="Pilih Desain CV"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <LayoutTemplate className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate text-xs font-semibold text-slate-800">
                      {selectedDesignObj.label}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 transition-transform duration-200 ${
                      isCvDesignPickerOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Card Menu Popup for Design Selection */}
                {isCvDesignPickerOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-1 divide-y divide-slate-100">
                    {CV_DESIGN_OPTIONS.map((opt) => {
                      const isSelected = (cvState.design || 'block') === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setCvState((prev) => ({
                              ...prev,
                              design: opt.key as CvDesignType,
                            }));
                            setIsCvDesignPickerOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 text-blue-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-700 font-medium'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{opt.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {opt.desc}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Header Color Picker + Alignment */}
            <div className="flex items-center gap-2 w-full">
              {/* Color Picker Trigger */}
              <div className="flex-1 min-w-0 relative" ref={cvColorPickerRef}>
                <button
                  type="button"
                  onClick={() => setIsCvColorPickerOpen(!isCvColorPickerOpen)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between cursor-pointer shadow-2xs active:scale-98 transition-all select-none"
                  title={`Warna Header CV: ${cvState.color}`}
                  aria-label="Pilih Warna Header CV"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full border border-black/15 shadow-2xs block shrink-0"
                      style={{ backgroundColor: cvState.color }}
                    />
                    <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-tight truncate">
                      {cvState.color.startsWith('#') ? cvState.color : `#${cvState.color}`}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 ml-1 transition-transform duration-200 ${
                      isCvColorPickerOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Popover Palet Warna */}
                {isCvColorPickerOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: cvState.color }}
                        />
                        <span className="text-xs font-bold text-slate-900">
                          Warna Header CV
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCvColorPickerOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium mb-2.5">
                      Pilih warna tema header CV:
                    </p>

                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {HEADER_COLOR_PRESETS.map((preset) => {
                        const isSelected =
                          cvState.color.toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => {
                              setCvState((prev) => ({ ...prev, color: preset.hex }));
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
                            cvState.color.startsWith('#')
                              ? cvState.color
                              : `#${cvState.color}`
                          }
                          onChange={(e) => {
                            let val = e.target.value;
                            if (!val.startsWith('#')) {
                              val = '#' + val.replace(/#/g, '');
                            }
                            const hexPart = val.slice(1).replace(/[^0-9A-Fa-f]/g, '');
                            if (hexPart.length <= 6) {
                              setCvState((prev) => ({ ...prev, color: `#${hexPart}` }));
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono outline-none uppercase transition-all"
                          placeholder="#0062E3"
                        />
                      </div>
                      <input
                        type="color"
                        value={
                          cvState.color.startsWith('#') && cvState.color.length === 7
                            ? cvState.color
                            : '#0062E3'
                        }
                        onChange={(e) =>
                          setCvState((prev) => ({
                            ...prev,
                            color: e.target.value.toUpperCase(),
                          }))
                        }
                        className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden shrink-0"
                        title="Pilih warna khusus"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Alignment Toggle */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 h-10 px-1 rounded-xl border border-slate-300 bg-white shadow-2xs w-full">
                  <button
                    type="button"
                    onClick={() => setCvState((prev) => ({ ...prev, align: 'left' }))}
                    className={`h-8 flex-1 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                      cvState.align === 'left'
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
                    onClick={() => setCvState((prev) => ({ ...prev, align: 'justify' }))}
                    className={`h-8 flex-1 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                      cvState.align === 'justify'
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

            {/* Parameter Link */}
            <div className="pt-1">
              <UrlBox
                url={cvUrl}
                isCopied={isCopied}
                onCopy={onCopy}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CvSection;
