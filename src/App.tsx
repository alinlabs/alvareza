import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FullPagePdfView,
  FullPagePortfolioView,
  FullPageCertificationView,
  FullPageAcademicView,
  resolveAcademicDocFromUrl,
  FullViewContainer,
} from './pages/full-view';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { resolvePresetFromQuery } from './data/preset/RoleConfig';
import { useMetaTags } from './hooks/useMetaTags';
import { ExecutiveLandingPage } from './pages/executive';
import { ToolsWorkspacePage } from './pages/admin';

interface InitialRouteState {
  isFullPagePdf: boolean;
  isPortfolioView: boolean;
  isCertificationView: boolean;
  isAcademicView: boolean;
  isToolsView: boolean;
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
      isToolsView: false,
      academicDocId: 'skl',
      fullPagePresetKey: 'optimal',
      portfolioPresetKey: 'all',
      certificationPresetKey: 'all',
      initialPreset: 'optimal',
    };
  }

  const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const pagesParam = (params.get('pages') || params.get('page') || '').toLowerCase().trim();
  const presetParam = (params.get('preset') || params.get('role') || params.get('p') || '').trim().toLowerCase();

  // Tools & Admin route: strictly ?pages=admin
  if (pagesParam === 'admin') {
    return {
      isFullPagePdf: false,
      isPortfolioView: false,
      isCertificationView: false,
      isAcademicView: false,
      isToolsView: true,
      academicDocId: 'skl',
      fullPagePresetKey: 'optimal',
      portfolioPresetKey: 'all',
      certificationPresetKey: 'all',
      initialPreset: 'optimal',
    };
  }

  if (!pathname) {
    const resolved = presetParam ? resolvePresetFromQuery(presetParam) : null;
    return {
      isFullPagePdf: false,
      isPortfolioView: false,
      isCertificationView: false,
      isAcademicView: false,
      isToolsView: false,
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
      isToolsView: false,
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
      isToolsView: false,
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
      isToolsView: false,
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
      isToolsView: false,
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
      isToolsView: false,
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
      isToolsView: false,
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
    isToolsView: false,
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

  const [isFullPagePdf, setIsFullPagePdf] = useState(initialRoute.isFullPagePdf);
  const [isPortfolioView, setIsPortfolioView] = useState(initialRoute.isPortfolioView);
  const [isCertificationView, setIsCertificationView] = useState(initialRoute.isCertificationView);
  const [isAcademicView, setIsAcademicView] = useState(initialRoute.isAcademicView);
  const [isToolsView, setIsToolsView] = useState(initialRoute.isToolsView);
  const [academicDocId, setAcademicDocId] = useState<'skl' | 'transkrip'>(initialRoute.academicDocId);
  const [fullPagePresetKey, setFullPagePresetKey] = useState<string>(initialRoute.fullPagePresetKey);
  const [portfolioPresetKey, setPortfolioPresetKey] = useState<string>(initialRoute.portfolioPresetKey);
  const [certificationPresetKey, setCertificationPresetKey] = useState<string>(initialRoute.certificationPresetKey);

  // Check if admin mode or profile with admin is active: strictly ?pages=admin or ?pages=profile
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const pages = (params.get('pages') || params.get('page') || '').toLowerCase().trim();
    return pages === 'admin' || pages === 'profile';
  });

  useEffect(() => {
    const handleCheckAdmin = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const pages = (params.get('pages') || params.get('page') || '').toLowerCase().trim();
      const adminActive = pages === 'admin' || pages === 'profile';
      setIsAdmin(adminActive);
    };

    handleCheckAdmin();
    window.addEventListener('popstate', handleCheckAdmin);
    return () => window.removeEventListener('popstate', handleCheckAdmin);
  }, []);

  // Dynamic meta tags for the main web builder interface (only active when on builder/landing)
  useMetaTags({
    enabled: !isFullPagePdf && !isPortfolioView && !isCertificationView && !isAcademicView,
    isFullPdf: false,
    pageType: isToolsView ? 'admin' : 'home',
    canonicalPath: isToolsView ? '/admin' : '/',
    language,
  });

  // Parse direct route path
  const checkRoutePath = useCallback(() => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const pages = (params.get('pages') || params.get('page') || '').toLowerCase().trim();

    // Route to Tools / Admin Workspace: strictly ?pages=admin
    if (pages === 'admin') {
      setIsToolsView(true);
      setIsFullPagePdf(false);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      setIsAdmin(true);
      return;
    }

    if (!pathname) {
      setIsToolsView(false);
      setIsFullPagePdf(false);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      setIsAdmin(pages === 'profile');
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
      setIsToolsView(false);
      return;
    }

    if (
      pathname === 'portofolio' ||
      pathname === 'portfolio' ||
      pathname.startsWith('portofolio/') ||
      pathname.startsWith('portfolio/')
    ) {
      const sub = pathname.includes('/') ? pathname.split('/')[1] : '';
      const presetParam = (params.get('preset') || params.get('role') || params.get('p') || sub || '').trim().toLowerCase();
      const resolved = presetParam ? resolvePresetFromQuery(presetParam) : 'all';
      setPortfolioPresetKey(resolved || 'all');
      setIsPortfolioView(true);
      setIsFullPagePdf(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      setIsToolsView(false);
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
      const presetParam = (params.get('preset') || params.get('role') || params.get('p') || sub || '').trim().toLowerCase();
      const resolved = presetParam ? resolvePresetFromQuery(presetParam) : 'all';
      setCertificationPresetKey(resolved || 'all');
      setIsCertificationView(true);
      setIsPortfolioView(false);
      setIsFullPagePdf(false);
      setIsAcademicView(false);
      setIsToolsView(false);
      return;
    }

    if (pathname === 'cv') {
      const presetParam = (params.get('preset') || params.get('role') || params.get('p') || '').trim().toLowerCase();
      const resolved = presetParam ? resolvePresetFromQuery(presetParam) : null;
      const activeKey = resolved || 'optimal';
      setFullPagePresetKey(activeKey);
      setIsFullPagePdf(true);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      setIsToolsView(false);
      return;
    }

    const resolved = resolvePresetFromQuery(pathname);
    if (resolved) {
      setFullPagePresetKey(resolved);
      setIsFullPagePdf(true);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      setIsToolsView(false);
    } else if (['preview', 'pdf', 'full', 'all'].includes(pathname)) {
      setFullPagePresetKey('all');
      setIsFullPagePdf(true);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      setIsToolsView(false);
    } else {
      // Path acak / tidak valid -> redirect otomatis ke root /
      const search = window.location.search;
      window.history.replaceState({}, '', '/' + (search ? search : ''));
      setIsFullPagePdf(false);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      setIsToolsView(false);
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

  const handleNavigateHome = () => {
    if (typeof window !== 'undefined') {
      // Jika kembali dari admin workspace atau sedang dalam sesi admin, kembali ke /?pages=profile
      if (isToolsView || isAdmin) {
        window.history.pushState({}, '', '/?pages=profile');
        setIsAdmin(true);
      } else {
        window.history.pushState({}, '', '/');
        setIsAdmin(false);
      }
    }
    setIsToolsView(false);
    setIsFullPagePdf(false);
    setIsPortfolioView(false);
    setIsCertificationView(false);
    setIsAcademicView(false);
  };

  const handleNavigateToTools = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/?pages=admin');
    }
    setIsToolsView(true);
    setIsAdmin(true);
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
    setIsToolsView(false);
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
    setIsToolsView(false);
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
    setIsToolsView(false);
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
    setIsToolsView(false);
  };

  if (isAcademicView || isPortfolioView || isCertificationView || isFullPagePdf) {
    const activeView: 'academic' | 'portfolio' | 'certification' | 'pdf' = isAcademicView
      ? 'academic'
      : isPortfolioView
      ? 'portfolio'
      : isCertificationView
      ? 'certification'
      : 'pdf';

    const activePreset = isPortfolioView
      ? portfolioPresetKey
      : isCertificationView
      ? certificationPresetKey
      : fullPagePresetKey;

    return (
      <FullViewContainer
        activeView={activeView}
        initialPreset={activePreset}
        initialDocId={academicDocId}
        onNavigateToEditor={handleNavigateHome}
        onNavigateToPdf={handleNavigateToPdf}
        onNavigateToPortfolio={handleNavigateToPortfolio}
        onNavigateToCertifications={handleNavigateToCertifications}
      />
    );
  }

  // Tools & Admin Workspace Page: Dimuat dari src/pages/admin/*
  if (isToolsView) {
    return (
      <ToolsWorkspacePage
        onNavigateHome={handleNavigateHome}
        onNavigateToPdf={handleNavigateToPdf}
        onNavigateToPortfolio={handleNavigateToPortfolio}
        onNavigateToCertifications={handleNavigateToCertifications}
        onNavigateToAcademic={handleNavigateToAcademic}
        initialPreset={initialRoute.initialPreset}
        isAdmin={isAdmin}
      />
    );
  }

  // Halaman Utama: Executive Landing Page (src/pages/executive/*)
  return (
    <ExecutiveLandingPage
      onNavigateToPdf={handleNavigateToPdf}
      onNavigateToPortfolio={handleNavigateToPortfolio}
      onNavigateToCertifications={handleNavigateToCertifications}
      onNavigateToAcademic={handleNavigateToAcademic}
      onOpenBuilder={handleNavigateToTools}
      isAdmin={isAdmin}
    />
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
