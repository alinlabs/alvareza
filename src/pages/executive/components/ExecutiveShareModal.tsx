import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export interface ExecutiveShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveShareModal: React.FC<ExecutiveShareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://alvareza.app';

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        // Fallback copy logic
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="executive-share-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-md flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Modal / Bottom Sheet Container with Motion */}
          <motion.div
            key="executive-share-modal-container"
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full sm:max-w-md bg-white text-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200/90 p-5 sm:p-6 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Bagikan Profil
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Alvareza Hilka Pratama
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code Container (No inner white card wrapper) */}
            <div className="flex flex-col items-center justify-center bg-slate-50/80 rounded-2xl p-5 border border-slate-200/60 mb-5">
              <QRCodeSVG
                value={currentUrl}
                size={180}
                level="H"
                includeMargin={false}
                aria-label="Scan QR Code"
              />
              <span className="text-xs font-light text-slate-500 mt-3 tracking-wide">
                Scan QR Code
              </span>
            </div>

            {/* URL Input & Icon-Only Copy Button */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Tautan Profil Website
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 bg-slate-100/90 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 outline-none font-mono truncate select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title={copied ? 'Tautan Disalin!' : 'Salin Link'}
                  aria-label={copied ? 'Tautan Disalin!' : 'Salin Link'}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0 active:scale-95 ${
                    copied
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-[#0062E3] hover:bg-blue-700 text-white'
                  }`}
                >
                  {copied ? (
                    <Check className="w-4.5 h-4.5 text-white animate-in zoom-in-50 duration-150" />
                  ) : (
                    <Copy className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
