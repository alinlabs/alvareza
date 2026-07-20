import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Pilih...",
  searchable = true
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: React.ReactNode; searchValue?: string; selectedLabel?: React.ReactNode }[];
  placeholder?: string;
  searchable?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  // Determine what to display in the closed state
  let displayContent: React.ReactNode = placeholder;
  if (selectedOption) {
    displayContent = selectedOption.selectedLabel !== undefined ? selectedOption.selectedLabel : selectedOption.label;
  }

  const filteredOptions = options.filter(opt => {
    if (!searchTerm) return true;
    const textToSearch = opt.searchValue || (typeof opt.label === 'string' ? opt.label : opt.value);
    return textToSearch.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={`relative w-full ${isOpen ? 'z-[51]' : 'z-10'}`} ref={ref}>
      <div 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && searchable) {
            setSearchTerm('');
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border ${isOpen ? 'border-slate-300 dark:border-slate-700' : 'border-slate-200 dark:border-slate-800'} rounded-xl text-xs font-normal text-[#1e293b] dark:text-[#f8fafc] cursor-pointer flex justify-between items-center shadow-inner transition-colors`}
      >
        <div className="flex-1 overflow-hidden">
          {isOpen && searchable ? (
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent border-none outline-none text-[#1e293b] dark:text-[#f8fafc] placeholder:text-slate-400"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="truncate pointer-events-none">
              {displayContent}
            </div>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-[#475569] dark:text-[#94a3b8] transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 text-xs font-normal cursor-pointer transition-colors ${
                  opt.value === value 
                    ? 'bg-accent/10 text-accent border-l-2 border-accent' 
                    : 'text-[#1e293b] dark:text-[#cbd5e1] hover:bg-slate-100 dark:hover:bg-slate-800/50 border-l-2 border-transparent'
                }`}
              >
                {opt.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-xs text-slate-500 text-center">
              Tidak ada hasil ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ModernToggle = ({
  id,
  checked,
  onChange,
  label,
  description,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) => {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:border-accent/40 cursor-pointer select-none group"
    >
      <div className="flex flex-col pr-3">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </span>
        {description && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            {description}
          </span>
        )}
      </div>
      <div
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-accent' : 'bg-slate-200/60 dark:bg-slate-800'
        }`}
      >
        <motion.span
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
        />
      </div>
    </div>
  );
};

export const formatFileSize = (file: File | null, defaultLabel = "Bawaan (System)") => {
  if (!file) return defaultLabel;
  const sizeInKb = file.size / 1024;
  if (sizeInKb > 1024) {
    return `${(sizeInKb / 1024).toFixed(2)} MB`;
  }
  return `${sizeInKb.toFixed(1)} KB`;
};
