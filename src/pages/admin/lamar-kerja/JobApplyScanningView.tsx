import React from 'react';

interface JobApplyScanningViewProps {
  isScanning: boolean;
  imagePreviewUrl: string | null;
  scanStage: 'idle' | 'ocr' | 'analyzing';
  ocrProgress: number;
}

export const JobApplyScanningView: React.FC<JobApplyScanningViewProps> = ({
  isScanning,
  imagePreviewUrl,
  scanStage,
  ocrProgress,
}) => {
  if (!isScanning) return null;

  return (
    <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
      {imagePreviewUrl && (
        <div className="relative inline-block max-w-[220px] rounded-xl overflow-hidden shadow-md border-2 border-blue-500/60 bg-white">
          <img
            src={imagePreviewUrl}
            alt="Preview Flyer"
            className="max-h-[220px] w-auto max-w-full block object-contain mx-auto"
          />
          {/* Up-and-Down Laser Scan Line */}
          <div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-500 shadow-[0_0_12px_#3b82f6,0_0_24px_#60a5fa]"
            style={{
              animation: 'scanBeam 2s ease-in-out infinite alternate',
            }}
          />
          <style>{`
            @keyframes scanBeam {
              0% { top: 2%; }
              100% { top: 95%; }
            }
          `}</style>
          <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
        </div>
      )}

      <div className="space-y-2 max-w-sm w-full">
        <div className="flex items-center justify-center text-blue-600 font-bold text-sm">
          <span>
            {scanStage === 'ocr'
              ? `Konversi Gambar ke Teks (OCR)... ${ocrProgress}%`
              : 'Merapikan Entitas & Draf Lamaran...'}
          </span>
        </div>

        {scanStage === 'ocr' && (
          <div className="w-full max-w-xs mx-auto bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-blue-600 h-full transition-all duration-200 rounded-full"
              style={{ width: `${Math.max(10, ocrProgress)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
