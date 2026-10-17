import React, { useState } from 'react';
import { HeaderNavbar } from './HeaderNavbar';
import { PrintableView } from './PrintableView';
import { LamarKerjaContainer } from './lamar-kerja';
import { GasSettingsModal } from './modal-setting';
import { useJobApply } from '../../hooks/useJobApply';
import { ToolsWorkspacePageProps } from './types';
import { useLanguage } from '../../context/LanguageContext';

export interface ToolsContainerProps extends ToolsWorkspacePageProps {}

/**
 * ToolsContainer
 * Central stateful container managing workspace data, modals, flyer OCR, and print actions.
 */
export const ToolsContainer: React.FC<ToolsContainerProps> = ({
  onNavigateHome,
  onNavigateToPdf,
  onNavigateToPortfolio,
  onNavigateToCertifications,
  onNavigateToAcademic,
  initialPreset = 'optimal',
  isAdmin = true,
}) => {
  const { language } = useLanguage();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [, setActivePresetRole] = useState<string>(initialPreset);

  // Job Apply OCR & Dispatcher Hook
  const {
    isModalOpen,
    selectedFile,
    isScanning,
    scanStage,
    ocrProgress,
    scanResult,
    scanError,
    openApplyModal,
    handleClearFile,
    processImageFile,
    handleCloseModal,
  } = useJobApply();

  const handleOpenPreview = () => setIsPreviewOpen(true);
  const handleClosePreview = () => setIsPreviewOpen(false);
  const handleOpenGasSettings = () => setIsGasModalOpen(true);
  const handleCloseGasSettings = () => setIsGasModalOpen(false);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 selection:bg-blue-100 selection:text-[#0F172A] relative pb-24 font-sans">
      {/* Navigation Header */}
      <HeaderNavbar
        onOpenPreviewModal={handleOpenPreview}
        onOpenGasSettings={handleOpenGasSettings}
        onOpenApplyModal={openApplyModal}
        isAdmin={isAdmin}
        onNavigateHome={onNavigateHome}
      />

      {/* Primary Interface: ATS Section Selection & PDF Builder View */}
      <main className="pb-12 w-full">
        <PrintableView
          isPreviewOpen={isPreviewOpen}
          onClosePreview={handleClosePreview}
          onOpenPreview={handleOpenPreview}
          onPresetChange={(preset) => setActivePresetRole(preset)}
        />
      </main>

      {/* Unified Lamar Kerja Container: Bottom Bar & Modal Sheet */}
      <LamarKerjaContainer
        showBottomBar
        onOpenApplyModal={openApplyModal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedFile={selectedFile}
        scanResult={scanResult}
        isScanning={isScanning}
        scanStage={scanStage}
        ocrProgress={ocrProgress}
        onRescanFile={(file) => processImageFile(file)}
        onClearFile={handleClearFile}
        error={scanError}
      />

      {/* Standalone 6 GAS Accounts Settings Modal */}
      <GasSettingsModal
        isOpen={isGasModalOpen}
        onClose={handleCloseGasSettings}
      />

      {/* Hidden container specifically for clean standard browser printing */}
      <div className="hidden print:block">
        <PrintableView disableUrlActions />
      </div>
    </div>
  );
};

export default ToolsContainer;
