import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Minimize2, 
  Maximize2, 
  Copy, 
  Check, 
  Loader2 
} from 'lucide-react';

export interface JobApplication {
  id: string;
  companyName: string;
  positionName: string;
  targetEmail: string;
  subject: string;
  body: string;
  attachedFiles: string;
  status: 'draft' | 'terkirim';
  createdAt: string;
  addressedTo?: string;
  bodyFontFamily?: string;
  mergeAttachments?: boolean | number;
  location?: string;
}

interface EmbeddedLetterPreviewProps {
  job: JobApplication;
}

export function EmbeddedLetterPreview({ job }: EmbeddedLetterPreviewProps) {
  const [renderedHTML, setRenderedHTML] = useState<string>('');
  const [loadingHTML, setLoadingHTML] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewTab, setViewTab] = useState<'preview' | 'text'>('preview');
  const [layoutMode, setLayoutMode] = useState<'contained' | 'full'>('contained');

  useEffect(() => {
    if (!job.body) return;
    setLoadingHTML(true);
    fetch('/api/preview-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        body: job.body, 
        bodyFontFamily: job.bodyFontFamily || 'Arial, sans-serif',
        location: job.location
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Preview API failed');
        return res.json();
      })
      .then(data => {
        if (data.html) {
          setRenderedHTML(data.html);
        } else {
          setRenderedHTML('');
        }
      })
      .catch(err => {
        console.error('Failed to render email body HTML:', err);
        setRenderedHTML('');
      })
      .finally(() => {
        setLoadingHTML(false);
      });
  }, [job.body, job.bodyFontFamily]);

  const handleCopy = () => {
    navigator.clipboard.writeText(job.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col h-auto overflow-hidden">
      {/* Sub-header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 shrink-0 gap-2">
        <span className="text-[10px] uppercase tracking-wide font-extrabold text-slate-400 dark:text-slate-500 flex items-center">
          <FileText className="w-3.5 h-3.5 mr-1.5 text-accent" />
          Isi Surat Pengantar (Cover Letter Document)
        </span>
        
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
          {/* Layout Mode: Bungkus / Penuh Area */}
          <div className="flex bg-slate-150 dark:bg-slate-850 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setLayoutMode('contained')}
              className={`px-2 py-1 text-[9px] font-extrabold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                layoutMode === 'contained'
                  ? 'bg-white dark:bg-slate-750 text-slate-850 dark:text-white shadow-xs'
                  : 'text-slate-550 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Minimize2 className="w-2.5 h-2.5" />
              <span>Bungkus</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('full')}
              className={`px-2 py-1 text-[9px] font-extrabold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                layoutMode === 'full'
                  ? 'bg-white dark:bg-slate-750 text-slate-850 dark:text-white shadow-xs'
                  : 'text-slate-550 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Maximize2 className="w-2.5 h-2.5" />
              <span>Penuh Area</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-150 dark:bg-slate-850 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setViewTab('preview')}
              className={`px-2 py-1 text-[9px] font-extrabold rounded-md transition-all cursor-pointer ${
                viewTab === 'preview'
                  ? 'bg-white dark:bg-slate-750 text-slate-850 dark:text-white shadow-xs'
                  : 'text-slate-550 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Tampilan Desain
            </button>
            <button
              type="button"
              onClick={() => setViewTab('text')}
              className={`px-2 py-1 text-[9px] font-extrabold rounded-md transition-all cursor-pointer ${
                viewTab === 'text'
                  ? 'bg-white dark:bg-slate-750 text-slate-850 dark:text-white shadow-xs'
                  : 'text-slate-550 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Teks Polos
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`px-2 py-1 text-[9px] font-extrabold rounded-md border transition-all flex items-center gap-1 cursor-pointer ${
              copied 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 text-emerald-600 dark:text-emerald-400' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Disalin!' : 'Salin'}</span>
          </button>
        </div>
      </div>

      {/* Body with Preview/Text */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative flex flex-col">
        {viewTab === 'preview' ? (
          loadingHTML ? (
            <div className="flex flex-col items-center justify-center text-slate-400 py-16">
              <Loader2 className="w-6 h-6 animate-spin text-accent mb-1.5" />
              <p className="text-[10px] font-semibold">Menghasilkan preview surat...</p>
            </div>
          ) : renderedHTML ? (
            <iframe 
              title="Rendered Cover Letter Inline"
              srcDoc={renderedHTML}
              className={`w-full ${layoutMode === 'contained' ? 'h-[320px]' : 'h-[800px]'} border-0 block bg-white transition-all duration-300`}
            />
          ) : (
            <div className="p-4 bg-slate-100 dark:bg-slate-950 flex justify-center">
              <div className={`bg-white dark:bg-slate-900 w-full p-6 rounded-xl shadow-xs border border-slate-150 dark:border-slate-850 text-slate-800 dark:text-slate-250 leading-relaxed font-sans whitespace-pre-line text-xs ${layoutMode === 'contained' ? 'max-h-[320px] overflow-y-auto' : 'h-auto'}`}>
                {job.body}
              </div>
            </div>
          )
        ) : (
          <div className="p-4 bg-slate-100 dark:bg-slate-950 flex justify-center">
            <div className={`bg-white dark:bg-slate-900 w-full p-4 rounded-xl shadow-xs border border-slate-150 dark:border-slate-850 text-slate-800 dark:text-slate-250 leading-relaxed font-sans whitespace-pre-wrap text-[10px] text-left overflow-x-auto ${layoutMode === 'contained' ? 'max-h-[320px] overflow-y-auto' : 'h-auto'}`}>
              {job.body}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
