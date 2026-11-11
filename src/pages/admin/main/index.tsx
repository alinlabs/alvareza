import React, { useState, useEffect } from 'react';
import { HeaderNav } from './navigation-header';
import { BottomNav } from './navigation-bottom';
import { Builder, BuilderProps } from './builder';
import { LamarKerjaContainer } from '../lamar-kerja';
import { GasSettingsModal } from '../lamar-kerja-setting';
import { MindmapModal } from '../direct-link';
import { useJobApply } from '../../../hooks/useJobApply';
import { ToolsWorkspacePageProps } from './types';
import { useLanguage } from '../../../context/bahasa';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { forceUnlockScroll } from '../../../utils/scrollLock';

export * from './types';
export * from './constants';
export * from './navigation-header';
export * from './navigation-bottom';
export * from './builder';
export * from '../pdf-preview';
export * from '../lamar-kerja-setting';
export * from '../direct-link';
export * from '../lamar-kerja-draft';
export * from '../lamar-kerja';
export * from '../section';

export interface ToolsContainerProps extends ToolsWorkspacePageProps {}

/**
 * ToolsContainer
 * Central stateful container managing workspace data, modals, and navigation.
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
  const { isDarkMode } = useThemeMode();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [isMindmapModalOpen, setIsMindmapModalOpen] = useState(false);
  const [, setActivePresetRole] = useState<string>(initialPreset);
  const [currentCvItems, setCurrentCvItems] = useState<import('../../../data/preset/config/item-seleksi').ItemSelectionState | null>(null);

  // Sync mode parameter to URL on admin page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      const isSearchAdmin = url.pathname.includes('/search') && url.searchParams.get('page') === 'admin';
      const isSrAdmin = url.pathname.includes('/sr') && (url.searchParams.get('pg') === 'a' || url.searchParams.get('pg') === 'admin');
      if (isSearchAdmin || isSrAdmin) {
        url.searchParams.set('mode', isDarkMode ? 'dark' : 'light');
        url.searchParams.delete('theme');
        url.searchParams.delete('th');
        window.history.replaceState(null, '', url.toString());
      }
    } catch {}
  }, [isDarkMode]);

  // Job Apply & Dispatcher Hook
  const {
    isModalOpen,
    openApplyModal,
    handleCloseModal,
  } = useJobApply();

  const handleOpenPreview = () => setIsPreviewOpen(true);
  const handleClosePreview = () => setIsPreviewOpen(false);
  const handleOpenGasSettings = () => setIsGasModalOpen(true);
  const handleCloseGasSettings = () => setIsGasModalOpen(false);
  const handleOpenMindmap = () => setIsMindmapModalOpen(true);
  const handleCloseMindmap = () => setIsMindmapModalOpen(false);

  // Safety watchdog: ensure page scroll is fully active when all modals are closed
  useEffect(() => {
    if (!isPreviewOpen && !isGasModalOpen && !isMindmapModalOpen && !isModalOpen) {
      forceUnlockScroll();
    }
  }, [isPreviewOpen, isGasModalOpen, isMindmapModalOpen, isModalOpen]);

  return (
    <div className="h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-[#0F172A] relative font-sans transition-colors flex flex-col overflow-hidden w-full">
      {/* Navigation Header */}
      <HeaderNav
        onOpenPreviewModal={handleOpenPreview}
        onOpenGasSettings={handleOpenGasSettings}
        onOpenMindmapModal={handleOpenMindmap}
        onOpenApplyModal={openApplyModal}
        isAdmin={isAdmin}
        onNavigateHome={onNavigateHome}
      />

      {/* Primary Interface: Scroll Container (Vertical Scrollbar starts UNDER header) */}
      <div className="flex-1 overflow-y-auto overflow-x-clip relative pb-20 md:pb-24 w-full">
        <main className="pt-1.5 sm:pt-2 pb-2 w-full">
          <Builder
            isPreviewOpen={isPreviewOpen}
            onClosePreview={handleClosePreview}
            onOpenPreview={handleOpenPreview}
            onPresetChange={(preset) => setActivePresetRole(preset)}
            onSelectionChange={setCurrentCvItems}
          />
        </main>
      </div>

      {/* Unified Lamar Kerja Container: Bottom Bar & Modal Sheet */}
      <LamarKerjaContainer
        showBottomBar
        onOpenApplyModal={openApplyModal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        cvItems={currentCvItems}
      />

      {/* Standalone 6 GAS Accounts Settings Modal */}
      <GasSettingsModal
        isOpen={isGasModalOpen}
        onClose={handleCloseGasSettings}
      />

      {/* Mindmap Direct Links & Generator Modal */}
      <MindmapModal
        isOpen={isMindmapModalOpen}
        onClose={handleCloseMindmap}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        onNavigateHome={onNavigateHome}
        onOpenMindmapModal={handleOpenMindmap}
        onOpenApplyModal={openApplyModal}
        onOpenPreviewModal={handleOpenPreview}
        onOpenGasSettings={handleOpenGasSettings}
      />

      {/* Hidden container specifically for clean standard browser printing */}
      <div className="hidden print:block">
        <Builder disableUrlActions />
      </div>
    </div>
  );
};

// Aliases for clean backward compatibility
export const ToolsWorkspacePage = ToolsContainer;
export const ToolsPage = ToolsContainer;
export const DigitalProfilePage = ToolsContainer;
export const AdminWorkspacePage = ToolsContainer;
export const AdminContainer = ToolsContainer;
export const ToolsWorkspace: React.FC<ToolsContainerProps> = (props) => <ToolsContainer {...props} />;

export default ToolsContainer;
