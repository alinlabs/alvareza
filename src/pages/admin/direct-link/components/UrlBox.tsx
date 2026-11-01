import React, { useRef, useEffect } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { UrlBoxProps } from '../types';

/**
 * Reusable Parameter Link Field with Copy and External Link buttons
 */
export const UrlBox: React.FC<UrlBoxProps> = ({
  label = 'Parameter Link',
  url,
  isCopied,
  onCopy,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure input scroll position is always reset to the beginning (left 0) on render/change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollLeft = 0;
    }
  }, [url]);

  return (
    <div className="space-y-1 select-none">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-slate-600 block">
          {label}
        </label>
      </div>
      <div className="w-full h-9 bg-slate-50/80 hover:bg-white border border-slate-300 hover:border-slate-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-xl px-2.5 flex items-center justify-between gap-1 transition-all shadow-2xs">
        <input
          ref={inputRef}
          type="text"
          readOnly
          value={url || ''}
          onClick={(e) => {
            (e.target as HTMLInputElement).select();
          }}
          className="w-full bg-transparent border-none text-[11px] font-mono text-slate-800 outline-none select-all overflow-x-auto whitespace-nowrap scrollbar-none pr-1"
          placeholder="Generating URL..."
        />
        <div className="flex items-center gap-1 shrink-0 border-l border-slate-200 pl-1.5">
          <button
            type="button"
            onClick={onCopy}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer active:scale-95 ${
              isCopied
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
            }`}
            title={isCopied ? 'Telah Disalin!' : 'Salin Link'}
            aria-label="Salin Link"
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
            title="Buka Dokumen"
            aria-label="Buka Dokumen"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default UrlBox;
