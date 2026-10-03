import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  ChevronDown,
  Search,
  Check,
  LayoutTemplate,
  X,
  AlignLeft,
  AlignJustify,
} from 'lucide-react';
import { ALL_ROLE_PRESETS } from '../../../data/rolePresetsConfig';
import { GasAccountConfig } from '../../../types/gasSender';
import { CvDesignType, CvTextAlignType, HeaderColorPreset } from './types';

export const HEADER_COLOR_PRESETS: HeaderColorPreset[] = [
  { hex: '#0062E3', label: 'Primary Blue' },
  { hex: '#0F172A', label: 'Navy Dark' },
  { hex: '#1E293B', label: 'Slate Gray' },
  { hex: '#047857', label: 'Emerald Green' },
  { hex: '#B91C1C', label: 'Crimson Red' },
  { hex: '#6D28D9', label: 'Royal Purple' },
  { hex: '#C2410C', label: 'Burnt Orange' },
  { hex: '#0369A1', label: 'Ocean Blue' },
  { hex: '#334155', label: 'Charcoal' },
  { hex: '#15803D', label: 'Forest Green' },
  { hex: '#A21CAF', label: 'Deep Magenta' },
  { hex: '#4338CA', label: 'Indigo' },
];

// Subcomponent: Combobox for selecting ATS CV Preset by 3-character code
export const PresetCombobox: React.FC<{
  value: string;
  onChange: (key: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const comboboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPreset = ALL_ROLE_PRESETS.find((p) => p.key === value) || ALL_ROLE_PRESETS[0];

  const filteredPresets = ALL_ROLE_PRESETS.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.code.toLowerCase().includes(q) ||
      p.titleId.toLowerCase().includes(q) ||
      p.key.toLowerCase().includes(q) ||
      (p.tag && p.tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`relative shrink-0 ${isOpen ? 'z-[100]' : 'z-10'}`} ref={comboboxRef}>
      <button
        type="button"
        id="cv-preset-combobox-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pilih Preset CV ATS"
        title={`Preset Saat Ini: ${currentPreset.code} (${currentPreset.tag || currentPreset.titleId})`}
        className="h-10 px-3 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs flex items-center gap-1.5 cursor-pointer select-none"
      >
        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="font-mono text-xs font-bold text-blue-700 tracking-wide">
          {currentPreset.code}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:right-0 bottom-full mb-1.5 w-64 sm:w-72 bg-white rounded-xl border border-slate-200 shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
          {/* Search bar inside combobox */}
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode preset (e.g. OPT, ADM, HRS)..."
              className="w-full px-2 py-1 text-xs bg-transparent text-slate-900 focus:outline-none placeholder:text-slate-400"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          {/* Options list */}
          <div className="max-h-52 overflow-y-auto p-1 divide-y divide-slate-100">
            {filteredPresets.length === 0 ? (
              <div className="p-3 text-[11px] text-slate-400 text-center">
                Kode preset tidak ditemukan
              </div>
            ) : (
              filteredPresets.map((preset) => {
                const isSelected = preset.key === value;
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => {
                      onChange(preset.key);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {preset.code}
                      </span>
                      <div className="min-w-0">
                        <div className="font-medium text-xs truncate leading-snug">
                          {preset.tag || preset.titleId}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent: Combobox for selecting CV Design Layout Template
export const CV_DESIGN_OPTIONS: { key: CvDesignType; label: string; desc: string }[] = [
  { key: 'block', label: 'Blok', desc: 'Header Blok Biru Solid' },
  { key: 'line', label: 'Garis', desc: 'Underline Minimalis ATS' },
  { key: 'badge', label: 'Badge', desc: 'Kapsul Header Pill' },
  { key: 'plain', label: 'Polos', desc: 'Minimalis Murni' },
];

export const CvDesignCombobox: React.FC<{
  value: CvDesignType;
  onChange: (design: CvDesignType) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOpt = CV_DESIGN_OPTIONS.find((o) => o.key === value) || CV_DESIGN_OPTIONS[0];

  return (
    <div className={`relative flex-1 min-w-0 ${isOpen ? 'z-[100]' : 'z-10'}`} ref={containerRef}>
      <button
        type="button"
        id="cv-design-combobox-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pilih Jenis Desain CV"
        title={`Desain CV: ${currentOpt.label} (${currentOpt.desc})`}
        className="w-full h-9 px-2.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <LayoutTemplate className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate text-xs font-semibold text-slate-800">{currentOpt.label}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-1.5 w-52 bg-white rounded-xl border border-slate-200 shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-1 divide-y divide-slate-100">
          {CV_DESIGN_OPTIONS.map((opt) => {
            const isSelected = opt.key === value;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  onChange(opt.key);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div>
                  <div className="font-semibold">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{opt.desc}</div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Subcomponent: Combobox for selecting CV Header Theme Color
export const CvColorPickerCombobox: React.FC<{
  value: string;
  onChange: (color: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1 min-w-0" ref={containerRef}>
      <button
        type="button"
        id="cv-color-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pilih Warna Tema CV"
        title={`Warna Header CV: ${value}`}
        className="w-full h-9 px-2.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
            style={{ backgroundColor: value }}
          />
          <span className="truncate text-xs font-mono font-medium text-slate-700">{value}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                style={{ backgroundColor: value }}
              />
              <span className="text-xs font-bold text-slate-900">Warna Header CV</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
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
              const isSelected = value.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => {
                    onChange(preset.hex);
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
                    <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" strokeWidth={3} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
            <label className="text-[11px] font-bold text-slate-500 shrink-0">HEX</label>
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                maxLength={7}
                value={value.startsWith('#') ? value : `#${value}`}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith('#')) {
                    val = '#' + val.replace(/#/g, '');
                  }
                  const hexPart = val.slice(1).replace(/[^0-9A-Fa-f]/g, '');
                  if (hexPart.length <= 6) {
                    onChange(`#${hexPart}`);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-normal outline-none uppercase transition-all"
                placeholder="#0062E3"
              />
            </div>
            <input
              type="color"
              value={value.startsWith('#') && value.length === 7 ? value : '#0062E3'}
              onChange={(e) => onChange(e.target.value.toUpperCase())}
              className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden shrink-0"
              title="Pilih warna khusus"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent: Combobox for selecting CV text alignment (Rata Kiri vs Rata Kanan-Kiri)
export const CvTextAlignCombobox: React.FC<{
  value: CvTextAlignType;
  onChange: (align: CvTextAlignType) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isJustify = value === 'justify';

  return (
    <div className="relative flex-1 min-w-0" ref={containerRef}>
      <button
        type="button"
        id="cv-text-align-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pilih Perataan Teks CV"
        title={`Perataan Teks: ${isJustify ? 'Rata Kanan Kiri (Justify)' : 'Rata Kiri (Left)'}`}
        className="w-full h-9 px-2.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isJustify ? (
            <AlignJustify className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          ) : (
            <AlignLeft className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          )}
          <span className="truncate text-xs font-semibold text-slate-800">
            {isJustify ? 'Rata Kanan-Kiri' : 'Rata Kiri'}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-1 divide-y divide-slate-100">
          <button
            type="button"
            onClick={() => {
              onChange('left');
              setIsOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
              value === 'left' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlignLeft className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <div>
                <div className="font-semibold">Rata Kiri</div>
                <div className="text-[10px] text-slate-400 font-normal">Standar ATS</div>
              </div>
            </div>
            {value === 'left' && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
          </button>

          <button
            type="button"
            onClick={() => {
              onChange('justify');
              setIsOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
              value === 'justify' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlignJustify className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <div>
                <div className="font-semibold">Rata Kanan-Kiri</div>
                <div className="text-[10px] text-slate-400 font-normal">Justified Sejajar</div>
              </div>
            </div>
            {value === 'justify' && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
          </button>
        </div>
      )}
    </div>
  );
};

// Subcomponent: Custom Combobox/Popup menu for selecting Sender Email Option
export const EmailOptionCombobox: React.FC<{
  value: string;
  onChange: (val: string) => void;
  gasAccounts: GasAccountConfig[];
}> = ({ value, onChange, gasAccounts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayLabel = () => {
    if (value === 'rotate') return 'Rotasi Otomatis';
    if (value === 'mailto') return 'Manual Gmail';
    const acc = gasAccounts.find((a) => a.id === value || a.email === value);
    if (acc) {
      return acc.email ? acc.email.replace(/@gmail\.com$/i, '') : acc.name;
    }
    return 'Rotasi Otomatis';
  };

  return (
    <div className="relative flex-1 min-w-0" ref={comboboxRef}>
      <button
        type="button"
        id="email-send-option-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pilih Opsi Email Pengiriman"
        title={`Opsi Email: ${getDisplayLabel()}`}
        className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs flex items-center justify-between cursor-pointer"
      >
        <span className="truncate text-xs font-bold text-slate-800">
          {getDisplayLabel()}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-1.5 w-full min-w-[190px] bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col p-1">
          {/* 1. Rotasi Otomatis */}
          <button
            type="button"
            onClick={() => {
              onChange('rotate');
              setIsOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
              value === 'rotate'
                ? 'bg-blue-50 text-blue-900 font-bold'
                : 'hover:bg-slate-50 text-slate-700 font-medium'
            }`}
          >
            <span className="truncate">Rotasi Otomatis</span>
            {value === 'rotate' && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
          </button>

          {/* 2. List 6 GAS Accounts (Individual emails) */}
          <div className="py-0.5 my-0.5 border-y border-slate-100 max-h-48 overflow-y-auto space-y-0.5">
            {gasAccounts.map((acc) => {
              const label = acc.email ? acc.email.replace(/@gmail\.com$/i, '') : acc.name;
              const isSelected = value === acc.id || value === acc.email;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    onChange(acc.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  <span className="truncate">{label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          {/* 3. Manual Gmail */}
          <button
            type="button"
            onClick={() => {
              onChange('mailto');
              setIsOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
              value === 'mailto'
                ? 'bg-blue-50 text-blue-900 font-bold'
                : 'hover:bg-slate-50 text-slate-700 font-medium'
            }`}
          >
            <span className="truncate">Manual Gmail</span>
            {value === 'mailto' && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
          </button>
        </div>
      )}
    </div>
  );
};
