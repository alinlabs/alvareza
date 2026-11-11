import React, { useState } from 'react';
import { X, Copy, CheckCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
// Embedded vector SVG badge for Digital Profile logo inside the QR Code (Text only, centered, crisp white background)
export const DIGITALPROFILE_QR_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 32" width="130" height="32">
  <rect width="130" height="32" rx="6" fill="#ffffff"/>
  <text x="65" y="16" text-anchor="middle" dominant-baseline="central" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="900" letter-spacing="-0.3">
    <tspan fill="#0062E3">Digital </tspan><tspan fill="#0F172A">Profile</tspan>
  </text>
</svg>`
)}`;

export interface FullViewQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  shareableUrl: string;
  isDarkMode: boolean;
  language?: 'in' | 'en' | 'id';
}

export const FullViewQrModal: React.FC<FullViewQrModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  shareableUrl,
  isDarkMode,
  language = 'id',
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (!shareableUrl) return;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(shareableUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareableUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const defaultTitle = 'QR Code - Digital Profile';
  const displayTitle = title || defaultTitle;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden overscroll-contain">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300 cursor-pointer touch-none"
        onClick={onClose}
      />
      {/* Container (Sheet on mobile, centered Modal on desktop) */}
      <div
        className={`relative w-full max-w-sm sm:max-w-[380px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-7 z-10 flex flex-col items-center animate-in slide-in-from-bottom sm:slide-in-from-none sm:zoom-in-95 duration-300 border ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top-right subtle close icon button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer ${
            isDarkMode
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title={language === 'en' ? 'Close' : 'Tutup'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Text */}
        <h3 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          {displayTitle}
        </h3>
        {description && (
          <p className={`text-xs mb-5 text-center px-4 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {description}
          </p>
        )}

        {/* QR Code Container with Centered Embedded SVG Logo */}
        <div className="relative bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
          <QRCodeSVG
            value={shareableUrl}
            size={240}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: '/logo.webp',
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        {/* URL Input Box with Right-aligned Copy Icon */}
        <div className="mt-5 w-full">
          <div
            className={`flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                : 'bg-slate-100/90 border-slate-200 text-slate-700'
            }`}
          >
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className={`w-full bg-transparent text-xs font-mono outline-none truncate select-all ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 cursor-pointer ${
                isDarkMode
                  ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-100'
                  : 'hover:bg-slate-200/80 text-slate-500 hover:text-slate-800'
              }`}
              title={isCopied ? 'Tersalin' : 'Salin Link'}
            >
              {isCopied ? (
                <CheckCheck className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ModalQr = FullViewQrModal;
export default FullViewQrModal;
