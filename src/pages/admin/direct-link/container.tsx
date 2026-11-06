import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CardId,
  CardStateCV,
  CardStateGeneric,
  DirectLinkModalProps,
} from './types';
import { getSafeOrigin, generateCvUrl, generateGenericUrl, copyToClipboard } from './utils';
import { DirectLinkHeader } from './components/DirectLinkHeader';
import {
  CvSection,
  PortfolioSection,
  CertificationSection,
  AcademicSection,
  IdentitySection,
  PhotoSection,
} from './sections';
import { useScrollLock } from '../../../utils/scrollLock';

export const DirectLinkModalContainer: React.FC<DirectLinkModalProps> = ({
  isOpen,
  onClose,
}) => {
  // 1. State for CV card with rich specific controls (Preset, Language, Align, Color)
  const [cvState, setCvState] = useState<CardStateCV>({
    preset: 'optimal',
    lang: 'id',
    align: 'left',
    color: '#0062E3',
    design: 'block',
  });

  // 2. Generic state for the other 5 cards (Default: BW / isColor=false, Compressed / isCompressed=true)
  const [genericStates, setGenericStates] = useState<Record<Exclude<CardId, 'cv'>, CardStateGeneric>>({
    portofolio: { specific: 'all', isColor: false, isCompressed: true },
    sertifikasi: { specific: 'all', isColor: false, isCompressed: true },
    akademik: { specific: 'all', isColor: false, isCompressed: true },
    identitas: { specific: 'all', isColor: false, isCompressed: true },
    foto: { specific: 'all', isColor: false, isCompressed: true },
  });

  // 3. Accordion state for 6 main cards (default collapsed/hidden)
  const [openCards, setOpenCards] = useState<Record<CardId, boolean>>({
    cv: false,
    portofolio: false,
    sertifikasi: false,
    akademik: false,
    identitas: false,
    foto: false,
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleCard = (id: CardId) => {
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const areAllOpen = Object.values(openCards).every(Boolean);

  const handleToggleAll = () => {
    const nextState = !areAllOpen;
    setOpenCards({
      cv: nextState,
      portofolio: nextState,
      sertifikasi: nextState,
      akademik: nextState,
      identitas: nextState,
      foto: nextState,
    });
  };

  useScrollLock(isOpen, 'direct-link');

  const origin = getSafeOrigin();

  const handleCopyLink = async (cardId: CardId, url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedId(cardId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const cvUrl = generateCvUrl(cvState, origin);
  const portofolioUrl = generateGenericUrl('portofolio', genericStates.portofolio, origin);
  const sertifikasiUrl = generateGenericUrl('sertifikasi', genericStates.sertifikasi, origin);
  const akademikUrl = generateGenericUrl('akademik', genericStates.akademik, origin);
  const identitasUrl = generateGenericUrl('identitas', genericStates.identitas, origin);
  const fotoUrl = generateGenericUrl('foto', genericStates.foto, origin);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mindmap-modal-backdrop"
          id="mindmap-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-md flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 pt-[60px] md:pt-0 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="mindmap-modal-container"
            id="mindmap-modal-container"
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full md:max-w-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[calc(100vh-60px)] md:max-h-[88vh] overflow-hidden"
          >
            {/* Modal Header Bar */}
            <DirectLinkHeader
              areAllOpen={areAllOpen}
              onToggleAll={handleToggleAll}
              onClose={onClose}
            />

            {/* Modal Body: 6 Sections List without Cards */}
            <div className="overflow-y-auto px-4 sm:px-6 py-2 flex-1 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex flex-col">
                {/* 1. CV Section */}
                <CvSection
                  isOpen={openCards.cv}
                  onToggle={() => toggleCard('cv')}
                  cvState={cvState}
                  setCvState={setCvState}
                  cvUrl={cvUrl}
                  isCopied={copiedId === 'cv'}
                  onCopy={() => handleCopyLink('cv', cvUrl)}
                />

                {/* 2. Portfolio Section */}
                <PortfolioSection
                  isOpen={openCards.portofolio}
                  onToggle={() => toggleCard('portofolio')}
                  state={genericStates.portofolio}
                  onChange={(updater) =>
                    setGenericStates((prev) => ({
                      ...prev,
                      portofolio: updater(prev.portofolio),
                    }))
                  }
                  url={portofolioUrl}
                  isCopied={copiedId === 'portofolio'}
                  onCopy={() => handleCopyLink('portofolio', portofolioUrl)}
                />

                {/* 3. Certification Section */}
                <CertificationSection
                  isOpen={openCards.sertifikasi}
                  onToggle={() => toggleCard('sertifikasi')}
                  state={genericStates.sertifikasi}
                  onChange={(updater) =>
                    setGenericStates((prev) => ({
                      ...prev,
                      sertifikasi: updater(prev.sertifikasi),
                    }))
                  }
                  url={sertifikasiUrl}
                  isCopied={copiedId === 'sertifikasi'}
                  onCopy={() => handleCopyLink('sertifikasi', sertifikasiUrl)}
                />

                {/* 4. Academic Section */}
                <AcademicSection
                  isOpen={openCards.akademik}
                  onToggle={() => toggleCard('akademik')}
                  state={genericStates.akademik}
                  onChange={(updater) =>
                    setGenericStates((prev) => ({
                      ...prev,
                      akademik: updater(prev.akademik),
                    }))
                  }
                  url={akademikUrl}
                  isCopied={copiedId === 'akademik'}
                  onCopy={() => handleCopyLink('akademik', akademikUrl)}
                />

                {/* 5. Identity Section */}
                <IdentitySection
                  isOpen={openCards.identitas}
                  onToggle={() => toggleCard('identitas')}
                  state={genericStates.identitas}
                  onChange={(updater) =>
                    setGenericStates((prev) => ({
                      ...prev,
                      identitas: updater(prev.identitas),
                    }))
                  }
                  url={identitasUrl}
                  isCopied={copiedId === 'identitas'}
                  onCopy={() => handleCopyLink('identitas', identitasUrl)}
                />

                {/* 6. Photo Section */}
                <PhotoSection
                  isOpen={openCards.foto}
                  onToggle={() => toggleCard('foto')}
                  state={genericStates.foto}
                  onChange={(updater) =>
                    setGenericStates((prev) => ({
                      ...prev,
                      foto: updater(prev.foto),
                    }))
                  }
                  url={fotoUrl}
                  isCopied={copiedId === 'foto'}
                  onCopy={() => handleCopyLink('foto', fotoUrl)}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DirectLinkModalContainer;
