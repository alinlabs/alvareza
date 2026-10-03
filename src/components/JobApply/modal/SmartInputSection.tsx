import React from 'react';
import { X, Scan, Check, Copy, Trash2 } from 'lucide-react';

interface SmartInputSectionProps {
  isScanning: boolean;
  activeEditingDraft: any;
  quickInputText: string;
  setQuickInputText: (text: string) => void;
  handleQuickTextChange: (text: string) => void;
  triggerFileInput: () => void;
  handleDrop: (e: React.DragEvent) => void;
  isDropOver: boolean;
  setIsDropOver: (over: boolean) => void;
  isImageExpanded: boolean;
  setIsImageExpanded: (expanded: boolean) => void;
  imagePreviewUrl: string | null;
  ocrResultText: string;
  handleOcrTextChange: (text: string) => void;
  handleRemoveFile: () => void;
  handleCopy: (text: string, type: 'subject' | 'body' | 'all' | 'email' | 'cc' | 'phone') => void;
  copiedAll: boolean;
}

export const SmartInputSection: React.FC<SmartInputSectionProps> = ({
  isScanning,
  activeEditingDraft,
  quickInputText,
  setQuickInputText,
  handleQuickTextChange,
  triggerFileInput,
  handleDrop,
  isDropOver,
  setIsDropOver,
  isImageExpanded,
  setIsImageExpanded,
  imagePreviewUrl,
  ocrResultText,
  handleOcrTextChange,
  handleRemoveFile,
  handleCopy,
  copiedAll,
}) => {
  if (isScanning || activeEditingDraft) return null;

  return (
    <div
      className="space-y-1.5"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDropOver(true);
      }}
      onDragLeave={() => setIsDropOver(false)}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center justify-between">
          <label htmlFor="quick-job-input" className="block text-xs font-semibold text-slate-700">
            Smart Teks
          </label>
          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
            Format: Perusahaan, Posisi, Email, [CC], [Subjek]
          </span>
        </div>
        {/* Spacer to match OCR button width so alignment matches the input box precisely */}
        <div className="w-9.5 sm:w-10 shrink-0" aria-hidden="true" />
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`relative flex-1 flex items-center rounded-xl border transition-all ${
            isDropOver
              ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500'
              : 'border-slate-300 bg-white hover:border-slate-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500'
          } shadow-2xs`}
        >
          <input
            id="quick-job-input"
            type="text"
            value={quickInputText}
            onChange={(e) => handleQuickTextChange(e.target.value)}
            className="w-full pl-3.5 pr-8 py-2 text-xs sm:text-sm text-slate-900 bg-transparent border-none focus:outline-none"
          />

          {quickInputText && (
            <button
              type="button"
              onClick={() => {
                setQuickInputText('');
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Hapus teks"
              aria-label="Hapus teks"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tombol Scan OCR di luar kolom input dengan card pembungkus putih */}
        <button
          type="button"
          id="btn-pick-flyer-ocr"
          onClick={triggerFileInput}
          className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl border border-slate-300 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs shrink-0 flex items-center justify-center"
          title="Pindai flyer lowongan (OCR)"
          aria-label="Pindai flyer lowongan (OCR)"
        >
          <Scan className="w-4 h-4" />
        </button>
      </div>

      {/* Preview Gambar Utuh Penuh (di Luar Card & di Atas Kolom Input) */}
      {isImageExpanded && imagePreviewUrl && (
        <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Gambar Lowongan Kerja</span>
            <button
              type="button"
              onClick={() => setIsImageExpanded(false)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              Kecilkan Gambar
            </button>
          </div>
          <div
            onClick={() => setIsImageExpanded(false)}
            className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 p-1.5 flex items-center justify-center cursor-zoom-out shadow-xs hover:border-slate-300 transition-all"
            title="Klik gambar untuk memperkecil kembali"
          >
            <img
              src={imagePreviewUrl}
              alt="Flyer Lowongan Kerja Penuh"
              className="w-full max-h-[60vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Card Kolom Input Hasil OCR (dengan thumbnail gambar di sebelah kiri) */}
      {ocrResultText && (
        <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <label htmlFor="ocr-result-textarea" className="block text-xs font-semibold text-slate-700">
              Hasil OCR
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleCopy(ocrResultText, 'all')}
                className="p-1 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Salin Teks Hasil OCR"
                aria-label="Salin Teks Hasil OCR"
              >
                {copiedAll ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Hapus hasil OCR dan gambar"
                aria-label="Hapus hasil OCR dan gambar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-stretch gap-2.5 p-2 rounded-xl border border-slate-300 bg-white shadow-2xs focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            {/* Gambar di sebelah kiri dari kolom teks OCR (hanya jika tidak expanded) */}
            {!isImageExpanded && imagePreviewUrl && (
              <div className="shrink-0 relative self-stretch flex items-center">
                <img
                  src={imagePreviewUrl}
                  alt="Flyer"
                  onClick={() => setIsImageExpanded(true)}
                  title="Klik untuk melihat gambar utuh penuh"
                  className="w-16 sm:w-20 h-full min-h-[76px] max-h-32 object-cover rounded-lg border border-slate-200 shadow-2xs cursor-zoom-in hover:opacity-85 transition-opacity"
                />
              </div>
            )}

            {/* Textarea Hasil OCR di sebelah kanan gambar */}
            <textarea
              id="ocr-result-textarea"
              rows={3}
              value={ocrResultText}
              onChange={(e) => handleOcrTextChange(e.target.value)}
              className="flex-1 text-xs sm:text-sm text-slate-900 bg-transparent border-none focus:outline-none resize-y leading-relaxed min-h-[76px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
