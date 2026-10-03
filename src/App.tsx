import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LottiePlayer } from './components/common/LottiePlayer';
import systemBackgroundAnimationData from './assets/systemBackgroundLottie.json';
import { HeaderNavbar } from './components/HeaderNavbar';
import { PrintableView } from './components/PrintableView';
import { FullPagePdfView } from './components/FullPagePdfView';
import { FullPagePortfolioView } from './components/FullPagePortfolioView';
import { FullPageCertificationView } from './components/FullPageCertificationView';
import { FullPageAcademicView, resolveAcademicDocFromUrl } from './components/FullPageAcademicView';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { resolvePresetFromQuery } from './data/rolePresetsConfig';
import { useMetaTags } from './hooks/useMetaTags';
import { JobApplyBottomBar } from './components/JobApply/JobApplyBottomBar';
import { JobApplyModalSheet } from './components/JobApply/JobApplyModalSheet';
import { GlobalDragDropZone } from './components/JobApply/GlobalDragDropZone';
import { GasSettingsModal } from './components/JobApply/GasSettingsModal';
import { useJobApply } from './hooks/useJobApply';

interface InitialRouteState {
  isFullPagePdf: boolean;
  isPortfolioView: boolean;
  isCertificationView: boolean;
  isAcademicView: boolean;
  academicDocId: 'skl' | 'transkrip';
  fullPagePresetKey: string;
  portfolioPresetKey: string;
  certificationPresetKey: string;
  initialPreset: string;
}

function getInitialRouteState(): InitialRouteState {
  if (typeof window === 'undefined') {
    return {
      isFullPagePdf: false,
      isPortfolioView: false,
      isCertificationView: false,
      isAcademicView: false,
      academicDocId: 'skl',
      fullPagePresetKey: 'optimal',
      portfolioPresetKey: 'all',
      certificationPresetKey: 'all',
      initialPreset: 'optimal',
    };
  }

  const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const presetParam = (params.get('preset') || params.get('role') || params.get('p') || '').trim().toLowerCase();

  if (!pathname) {
    const resolved = presetParam ? resolvePresetFromQuery(presetParam) : null;
    return {
      isFullPagePdf: false,
      isPortfolioView: false,
      isCertificationView: false,
      isAcademicView: false,
      academicDocId: 'skl',
      fullPagePresetKey: 'optimal',
      portfolioPresetKey: 'all',
      certificationPresetKey: 'all',
      initialPreset: resolved || 'optimal',
    };
  }

  // Academic documents route: /akademik?=skl, /akademik?=transkrip, /skl, /transkrip
  if (
    pathname === 'akademik' ||
    pathname.startsWith('akademik/') ||
    pathname === 'skl' ||
    pathname === 'transkrip'
  ) {
    const docId = resolveAcademicDocFromUrl();
    return {
      isFullPagePdf: false,
      isPortfolioView: false,
      isCertificationView: false,
      isAcademicView: true,
      academicDocId: docId,
      fullPagePresetKey: 'optimal',
      portfolioPresetKey: 'all',
      certificationPresetKey: 'all',
      initialPreset: 'optimal',
    };
  }

  if (
    pathname === 'portofolio' ||
    pathname === 'portfolio' ||
    pathname.startsWith('portofolio/') ||
    pathname.startsWith('portfolio/')
  ) {
    const sub = pathname.includes('/') ? pathname.split('/')[1] : '';
    const query = presetParam || sub;
    const resolved = query ? resolvePresetFromQuery(query) : 'all';
    return {
      isFullPagePdf: false,
      isPortfolioView: true,
      isCertificationView: false,
      isAcademicView: false,
      academicDocId: 'skl',
      fullPagePresetKey: 'optimal',
      portfolioPresetKey: resolved || 'all',
      certificationPresetKey: 'all',
      initialPreset: resolved || 'optimal',
    };
  }

  if (
    pathname === 'sertifikasi' ||
    pathname === 'sertifikat' ||
    pathname === 'certification' ||
    pathname === 'certifications' ||
    pathname.startsWith('sertifikasi/') ||
    pathname.startsWith('sertifikat/') ||
    pathname.startsWith('certification/') ||
    pathname.startsWith('certifications/')
  ) {
    const sub = pathname.includes('/') ? pathname.split('/')[1] : '';
    const query = presetParam || sub;
    const resolved = query ? resolvePresetFromQuery(query) : 'all';
    return {
      isFullPagePdf: false,
      isPortfolioView: false,
      isCertificationView: true,
      isAcademicView: false,
      academicDocId: 'skl',
      fullPagePresetKey: 'optimal',
      portfolioPresetKey: 'all',
      certificationPresetKey: resolved || 'all',
      initialPreset: resolved || 'optimal',
    };
  }

  if (pathname === 'cv') {
    const resolved = presetParam ? resolvePresetFromQuery(presetParam) : null;
    const activeKey = resolved || 'optimal';
    return {
      isFullPagePdf: true,
      isPortfolioView: false,
      isCertificationView: false,
      isAcademicView: false,
      academicDocId: 'skl',
      fullPagePresetKey: activeKey,
      portfolioPresetKey: 'all',
      certificationPresetKey: 'all',
      initialPreset: activeKey,
    };
  }

  const resolved = resolvePresetFromQuery(pathname);
  if (resolved) {
    return {
      isFullPagePdf: true,
      isPortfolioView: false,
      isCertificationView: false,
      isAcademicView: false,
      academicDocId: 'skl',
      fullPagePresetKey: resolved,
      portfolioPresetKey: 'all',
      certificationPresetKey: 'all',
      initialPreset: resolved,
    };
  } else if (['preview', 'pdf', 'full', 'all'].includes(pathname)) {
    return {
      isFullPagePdf: true,
      isPortfolioView: false,
      isCertificationView: false,
      isAcademicView: false,
      academicDocId: 'skl',
      fullPagePresetKey: 'all',
      portfolioPresetKey: 'all',
      certificationPresetKey: 'all',
      initialPreset: 'optimal',
    };
  }

  return {
    isFullPagePdf: false,
    isPortfolioView: false,
    isCertificationView: false,
    isAcademicView: false,
    academicDocId: 'skl',
    fullPagePresetKey: 'optimal',
    portfolioPresetKey: 'all',
    certificationPresetKey: 'all',
    initialPreset: 'optimal',
  };
}

function MainApp() {
  const { language } = useLanguage();
  const initialRoute = useMemo(() => getInitialRouteState(), []);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [activePresetRole, setActivePresetRole] = useState<string>(initialRoute.initialPreset);
  const [isFullPagePdf, setIsFullPagePdf] = useState(initialRoute.isFullPagePdf);
  const [isPortfolioView, setIsPortfolioView] = useState(initialRoute.isPortfolioView);
  const [isCertificationView, setIsCertificationView] = useState(initialRoute.isCertificationView);
  const [isAcademicView, setIsAcademicView] = useState(initialRoute.isAcademicView);
  const [academicDocId, setAcademicDocId] = useState<'skl' | 'transkrip'>(initialRoute.academicDocId);
  const [fullPagePresetKey, setFullPagePresetKey] = useState<string>(initialRoute.fullPagePresetKey);
  const [portfolioPresetKey, setPortfolioPresetKey] = useState<string>(initialRoute.portfolioPresetKey);
  const [certificationPresetKey, setCertificationPresetKey] = useState<string>(initialRoute.certificationPresetKey);

  // Check if admin query param is present: ?admin=true
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('admin')?.toLowerCase() === 'true';
  });

  useEffect(() => {
    const handleCheckAdmin = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      setIsAdmin(params.get('admin')?.toLowerCase() === 'true');
    };

    handleCheckAdmin();
    window.addEventListener('popstate', handleCheckAdmin);
    return () => window.removeEventListener('popstate', handleCheckAdmin);
  }, []);

  // Job Apply Scan Hook
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

  // Dynamic meta tags for the main web builder interface (only active when on builder)
  useMetaTags({
    enabled: !isFullPagePdf && !isPortfolioView && !isCertificationView && !isAcademicView,
    isFullPdf: false,
    canonicalPath: '/',
    language,
  });

  // Parse direct route path (e.g. /all, /opt, /pmo, /swe, /adm, /fe, /portofolio, /sertifikasi, /akademik)
  const checkRoutePath = useCallback(() => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();

    if (!pathname) {
      setIsFullPagePdf(false);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      return;
    }

    if (
      pathname === 'akademik' ||
      pathname.startsWith('akademik/') ||
      pathname === 'skl' ||
      pathname === 'transkrip'
    ) {
      const docId = resolveAcademicDocFromUrl();
      setAcademicDocId(docId);
      setIsAcademicView(true);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsFullPagePdf(false);
      return;
    }

    if (
      pathname === 'portofolio' ||
      pathname === 'portfolio' ||
      pathname.startsWith('portofolio/') ||
      pathname.startsWith('portfolio/')
    ) {
      const sub = pathname.includes('/') ? pathname.split('/')[1] : '';
      const params = new URLSearchParams(window.location.search);
      const presetParam = (params.get('preset') || params.get('role') || params.get('p') || sub || '').trim().toLowerCase();
      const resolved = presetParam ? resolvePresetFromQuery(presetParam) : 'all';
      setPortfolioPresetKey(resolved || 'all');
      setIsPortfolioView(true);
      setIsFullPagePdf(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      return;
    }

    if (
      pathname === 'sertifikasi' ||
      pathname === 'sertifikat' ||
      pathname === 'certification' ||
      pathname === 'certifications' ||
      pathname.startsWith('sertifikasi/') ||
      pathname.startsWith('sertifikat/') ||
      pathname.startsWith('certification/') ||
      pathname.startsWith('certifications/')
    ) {
      const sub = pathname.includes('/') ? pathname.split('/')[1] : '';
      const params = new URLSearchParams(window.location.search);
      const presetParam = (params.get('preset') || params.get('role') || params.get('p') || sub || '').trim().toLowerCase();
      const resolved = presetParam ? resolvePresetFromQuery(presetParam) : 'all';
      setCertificationPresetKey(resolved || 'all');
      setIsCertificationView(true);
      setIsPortfolioView(false);
      setIsFullPagePdf(false);
      setIsAcademicView(false);
      return;
    }

    if (pathname === 'cv') {
      const params = new URLSearchParams(window.location.search);
      const presetParam = (params.get('preset') || params.get('role') || params.get('p') || '').trim().toLowerCase();
      const resolved = presetParam ? resolvePresetFromQuery(presetParam) : null;
      const activeKey = resolved || 'optimal';
      setFullPagePresetKey(activeKey);
      setIsFullPagePdf(true);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      return;
    }

    const resolved = resolvePresetFromQuery(pathname);
    if (resolved) {
      setFullPagePresetKey(resolved);
      setIsFullPagePdf(true);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
    } else if (['preview', 'pdf', 'full', 'all'].includes(pathname)) {
      setFullPagePresetKey('all');
      setIsFullPagePdf(true);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
    } else {
      // Path acak / tidak valid (misal /abcdefg) -> redirect otomatis kembali ke link utama (root /)
      const search = window.location.search;
      window.history.replaceState({}, '', '/' + (search ? search : ''));
      setIsFullPagePdf(false);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
    }
  }, []);

  useEffect(() => {
    checkRoutePath();

    const handlePopState = () => {
      checkRoutePath();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [checkRoutePath]);

  const handleNavigateToEditor = () => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      window.history.pushState({}, '', '/' + (search ? search : ''));
    }
    setIsFullPagePdf(false);
    setIsPortfolioView(false);
    setIsCertificationView(false);
    setIsAcademicView(false);
  };

  const handleNavigateToPdf = () => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      window.history.pushState({}, '', '/cv' + (search ? search : ''));
    }
    setIsFullPagePdf(true);
    setIsPortfolioView(false);
    setIsCertificationView(false);
    setIsAcademicView(false);
  };

  const handleNavigateToPortfolio = () => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      window.history.pushState({}, '', '/portofolio' + (search ? search : ''));
    }
    setIsPortfolioView(true);
    setIsFullPagePdf(false);
    setIsCertificationView(false);
    setIsAcademicView(false);
  };

  const handleNavigateToCertifications = () => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      window.history.pushState({}, '', '/sertifikasi' + (search ? search : ''));
    }
    setIsCertificationView(true);
    setIsPortfolioView(false);
    setIsFullPagePdf(false);
    setIsAcademicView(false);
  };

  const handleNavigateToAcademic = (docId: 'skl' | 'transkrip' = 'skl') => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/akademik?=${docId}`);
    }
    setAcademicDocId(docId);
    setIsAcademicView(true);
    setIsCertificationView(false);
    setIsPortfolioView(false);
    setIsFullPagePdf(false);
  };

  if (isAcademicView) {
    return <FullPageAcademicView initialDocId={academicDocId} />;
  }

  if (isPortfolioView) {
    return (
      <FullPagePortfolioView
        initialPreset={portfolioPresetKey}
        onNavigateToEditor={handleNavigateToEditor}
        onNavigateToPdf={handleNavigateToPdf}
        onNavigateToCertifications={handleNavigateToCertifications}
      />
    );
  }

  if (isCertificationView) {
    return (
      <FullPageCertificationView
        initialPreset={certificationPresetKey}
        onNavigateToEditor={handleNavigateToEditor}
        onNavigateToPdf={handleNavigateToPdf}
        onNavigateToPortfolio={handleNavigateToPortfolio}
      />
    );
  }

  if (isFullPagePdf) {
    return (
      <FullPagePdfView
        initialPreset={fullPagePresetKey}
        onNavigateToEditor={handleNavigateToEditor}
        onNavigateToPortfolio={handleNavigateToPortfolio}
        onNavigateToCertifications={handleNavigateToCertifications}
      />
    );
  }

  // Jika membuka link dasar website tanpa ?admin=true, lindungi data dengan menampilkan blank screen
  if (!isAdmin) {
    return (
      <div className="relative min-h-screen bg-slate-50/40 text-slate-900 flex flex-col items-center justify-center p-6 select-none overflow-hidden">
        {/* Soft Radial Ambient Aura Layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-gradient-to-tr from-blue-100/70 via-indigo-100/40 to-sky-100/30 blur-3xl opacity-75" />
        </div>

        {/* Ambient Moving Tech Orbit Ring Decorator (Smooth CSS backup & depth) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="relative w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] md:w-[580px] md:h-[580px] flex items-center justify-center">
            {/* Outer Slow Dash Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/40 animate-[spin_24s_linear_infinite]" />
            {/* Middle Reverse Ring */}
            <div className="absolute w-[80%] h-[80%] rounded-full border border-indigo-400/40 animate-[spin_18s_linear_infinite_reverse]" />
            {/* Satellite Node 1 */}
            <div className="absolute w-full h-full animate-[spin_12s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 shadow-md shadow-blue-400/60" />
            </div>
            {/* Satellite Node 2 */}
            <div className="absolute w-[80%] h-[80%] animate-[spin_16s_linear_infinite_reverse]">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-indigo-500 shadow-md shadow-indigo-400/50" />
            </div>
          </div>
        </div>

        {/* Subtle Ambient Lottie Background Animation Layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[620px] md:h-[620px] flex items-center justify-center">
            <LottiePlayer
              animationData={systemBackgroundAnimationData}
              loop={true}
              autoplay={true}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Protected System Welcome Content */}
        <div className="relative z-10 text-center space-y-2 sm:space-y-3 max-w-lg mx-auto">
          <p className="text-xs sm:text-sm md:text-base font-normal text-slate-500 tracking-wide">
            Selamat Datang Di Source Document System
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Alvareza H. Pratama
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Hubungi administrator untuk informasi lebih lanjut
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-[#0F172A] relative ${isAdmin ? 'pb-24' : 'pb-8'}`}>
      {/* Global Drag and Drop Zone for Job Application Flyers (Only in Admin Mode) */}
      {isAdmin && <GlobalDragDropZone onDropImage={(file) => processImageFile(file)} />}

      {/* Navigation Header */}
      <HeaderNavbar
        onOpenPreviewModal={() => setIsPreviewOpen(true)}
        onOpenGasSettings={() => setIsGasModalOpen(true)}
        onOpenApplyModal={openApplyModal}
        isAdmin={isAdmin}
      />

      {/* Primary Interface: ATS Section Selection & PDF Builder View */}
      <main className="pb-12">
        <PrintableView
          isPreviewOpen={isPreviewOpen}
          onClosePreview={() => setIsPreviewOpen(false)}
          onOpenPreview={() => setIsPreviewOpen(true)}
          onPresetChange={(preset) => setActivePresetRole(preset)}
        />
      </main>

      {/* Lamar Sekarang Bottom Bar: Pinned to bottom on both desktop & mobile (Only in Admin Mode: ?admin=true) */}
      {isAdmin && (
        <JobApplyBottomBar
          onOpenApplyModal={openApplyModal}
          isLoading={isScanning}
        />
      )}

      {/* Modal (Desktop) / Bottom Sheet (Mobile) */}
      {isAdmin && (
        <JobApplyModalSheet
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
      )}

      {/* Standalone 6 GAS Accounts Settings Modal */}
      {isAdmin && (
        <GasSettingsModal
          isOpen={isGasModalOpen}
          onClose={() => setIsGasModalOpen(false)}
        />
      )}

      {/* Hidden container specifically for clean standard browser printing */}
      <div className="hidden print:block">
        <PrintableView disableUrlActions />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

