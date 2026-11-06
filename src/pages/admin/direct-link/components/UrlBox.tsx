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
        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
          {label}
        </label>
      </div>
      <div className="w-full h-9 bg-slate-50/80 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-850 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-xl px-2.5 flex items-center justify-between gap-1 transition-all shadow-2xs">
        <input
          ref={inputRef}
          type="text"
          readOnly
          value={url || ''}
          onClick={(e) => {
            (e.target as HTMLInputElement).select();
          }}
          className="w-full bg-transparent border-none text-[11px] font-mono text-slate-800 dark:text-slate-100 outline-none select-all overflow-x-auto whitespace-nowrap scrollbar-none pr-1"
          placeholder="Generating URL..."
        />
        <div className="flex items-center gap-1 shrink-0 border-l border-slate-200 dark:border-slate-700 pl-1.5">
          <button
            type="button"
            onClick={onCopy}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer active:scale-95 ${
              isCopied
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
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
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
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
