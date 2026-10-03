import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const DesignModal = ({
  isOpen,
  onClose,
  language,
  designPreset,
  setDesignPreset,
  DESIGN_OPTIONS
}: any) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="design-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 w-full h-full min-h-[100dvh] flex items-end sm:items-center justify-center bg-slate-950/10 backdrop-blur-md p-0 sm:py-6 px-0 sm:px-6 pt-[60px] sm:pt-0"
        >
          {/* Backdrop dismiss */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Container (Bottom Sheet on mobile, Centered Modal on Desktop) */}
          <motion.div
            key="design-modal-container"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full max-w-6xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-60px)] sm:h-auto sm:max-h-[90vh] z-10"
          >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h3 className="text-base font-bold text-slate-900">
            {language === 'en' ? 'Design Theme' : 'Tema Design'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable List */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 overscroll-contain">
          {DESIGN_OPTIONS.map((opt: any) => {
            const isSelected = designPreset === opt.key;
            return (
              <label
                key={opt.key}
                className={`relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer select-none
                  ${isSelected
                    ? 'border-[#0062E3] bg-[#0062E3]/5 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-[#0062E3]/40 hover:bg-slate-50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="design-theme"
                  value={opt.key}
                  checked={isSelected}
                  onChange={() => {
                    setDesignPreset(opt.key);
                    onClose();
                  }}
                  className="sr-only"
                />

                <div className="flex-1">
                  <div className={`text-sm font-bold leading-tight ${isSelected ? 'text-[#0062E3]' : 'text-slate-900'}`}>
                    {language === 'en' ? opt.titleEn : opt.titleId}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    {language === 'en' ? opt.descEn : opt.descId}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
