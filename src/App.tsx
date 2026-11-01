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
import { decodeRoute, autoCorrectLocationToShort } from './utils/shortLinkCodec';

interface InitialRouteState {
  isFullPagePdf: boolean;
  isPortfolioView: boolean;
  isCertificationView: boolean;
  isAcademicView: boolean;
  isIdentityView: boolean;
  isToolsView: boolean;
  academicDocId: 'skl' | 'transkrip';
  fullPagePresetKey: string;
  portfolioPresetKey: string;
  certificationPresetKey: string;
  initialPreset: string;
}

function getInitialRouteState(): InitialRouteState {
  const defaultState: InitialRouteState = {
    isFullPagePdf: false,
    isPortfolioView: false,
    isCertificationView: false,
    isAcademicView: false,
    isIdentityView: false,
    isToolsView: false,
    academicDocId: 'skl',
    fullPagePresetKey: 'optimal',
    portfolioPresetKey: 'all',
    certificationPresetKey: 'all',
    initialPreset: 'optimal',
  };

  if (typeof window === 'undefined') {
    return defaultState;
  }

  // Trigger auto-correction so any long URL in address bar is seamlessly replaced with short URL
  autoCorrectLocationToShort();

  const decoded = decodeRoute();
  const { canonicalPathname, pageParam, fileParam, presetParam } = decoded;

  // 1. Strictly authorized Admin Workspace: /search?page=admin OR /sr?pg=adm
  if (canonicalPathname === 'search' && pageParam === 'admin') {
    try {
      localStorage.setItem('mycivy_last_view', 'admin');
    } catch {}
    return {
      ...defaultState,
      isToolsView: true,
    };
  }

  // 2. Strictly authorized Profile in Admin Session: /search?page=profile OR /sr?pg=prf
  if (canonicalPathname === 'search' && pageParam === 'profile') {
    return defaultState;
  }

  // 3. Strictly authorized Standardized PDF Previews: /preview?file=... OR /prev?f=...
  if (canonicalPathname === 'preview') {
    if (fileParam === 'portofolio' || fileParam === 'portfolio' || fileParam === 'p') {
      const resolved = presetParam ? resolvePresetFromQuery(presetParam) : 'all';
      return {
        ...defaultState,
        isPortfolioView: true,
        portfolioPresetKey: resolved || 'all',
        initialPreset: resolved || 'optimal',
      };
    }

    if (
      fileParam === 'sertifikasi' ||
      fileParam === 'certification' ||
      fileParam === 'sertifikat' ||
      fileParam === 's'
    ) {
      const resolved = presetParam ? resolvePresetFromQuery(presetParam) : 'all';
      return {
        ...defaultState,
        isCertificationView: true,
        certificationPresetKey: resolved || 'all',
        initialPreset: resolved || 'optimal',
      };
    }

    if (fileParam === 'akademik' || fileParam === 'academic' || fileParam === 'a') {
      const docId = resolveAcademicDocFromUrl();
      return {
        ...defaultState,
        isAcademicView: true,
        academicDocId: docId,
      };
    }

    if (
      fileParam === 'identitas' ||
      fileParam === 'identity' ||
      fileParam === 'foto' ||
      fileParam === 'pas-foto' ||
      fileParam === 'id' ||
      fileParam === 'ft'
    ) {
      return {
        ...defaultState,
        isIdentityView: true,
      };
    }

    if (fileParam === 'cv') {
      const resolved = presetParam ? resolvePresetFromQuery(presetParam) : null;
      const activeKey = resolved || 'optimal';
      return {
        ...defaultState,
        isFullPagePdf: true,
        fullPagePresetKey: activeKey,
        initialPreset: activeKey,
      };
    }

    // Invalid or missing file parameter on /preview -> redirect cleanly to /
    try {
      window.history.replaceState({}, '', '/');
    } catch {}
    return defaultState;
  }

  // 4. Any old / legacy link access:
  // e.g. /?pages=admin, /?page=admin, /admin, /tools, /cv, /portofolio, /sertifikasi, /akademik, /identitas, /[preset-slug]
  // Block access and clean URL to '/' so legacy links are NOT accessible:
  const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
  const params = new URLSearchParams(window.location.search);
  if (pathname || params.has('pages') || params.has('page') || params.has('admin')) {
    try {
      window.history.replaceState({}, '', '/');
    } catch {}
    return defaultState;
  }

  // 5. Default Public Landing Page: /
  const p = (params.get('pr') || params.get('preset') || params.get('role') || params.get('p') || '').trim().toLowerCase();
  const resolved = p ? resolvePresetFromQuery(p) : null;
  return {
    ...defaultState,
    initialPreset: resolved || 'optimal',
  };
}

function MainApp() {
  const { language } = useLanguage();
  const initialRoute = useMemo(() => getInitialRouteState(), []);

  const [isFullPagePdf, setIsFullPagePdf] = useState(initialRoute.isFullPagePdf);
  const [isPortfolioView, setIsPortfolioView] = useState(initialRoute.isPortfolioView);
  const [isCertificationView, setIsCertificationView] = useState(initialRoute.isCertificationView);
  const [isAcademicView, setIsAcademicView] = useState(initialRoute.isAcademicView);
  const [isIdentityView, setIsIdentityView] = useState(initialRoute.isIdentityView);
  const [isToolsView, setIsToolsView] = useState(initialRoute.isToolsView);
  const [academicDocId, setAcademicDocId] = useState<'skl' | 'transkrip'>(initialRoute.academicDocId);
  const [fullPagePresetKey, setFullPagePresetKey] = useState<string>(initialRoute.fullPagePresetKey);
  const [portfolioPresetKey, setPortfolioPresetKey] = useState<string>(initialRoute.portfolioPresetKey);
  const [certificationPresetKey, setCertificationPresetKey] = useState<string>(initialRoute.certificationPresetKey);

  // Check if admin mode or profile with admin is active: strictly /search?page=admin or /sr?pg=adm / /sr?pg=prf
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const decoded = decodeRoute();
    return decoded.canonicalPathname === 'search' && (decoded.pageParam === 'admin' || decoded.pageParam === 'profile');
  });

  useEffect(() => {
    const handleCheckAdmin = () => {
      if (typeof window === 'undefined') return;
      const decoded = decodeRoute();
      const adminActive = decoded.canonicalPathname === 'search' && (decoded.pageParam === 'admin' || decoded.pageParam === 'profile');
      setIsAdmin(adminActive);
    };

    handleCheckAdmin();
    window.addEventListener('popstate', handleCheckAdmin);
    return () => window.removeEventListener('popstate', handleCheckAdmin);
  }, []);

  // Dynamic meta tags for the main web builder interface (only active when on builder/landing)
  useMetaTags({
    enabled: !isFullPagePdf && !isPortfolioView && !isCertificationView && !isAcademicView && !isIdentityView,
    isFullPdf: false,
    pageType: isToolsView ? 'admin' : 'home',
    canonicalPath: isToolsView ? '/sr?pg=adm' : '/',
    language,
  });

  // Parse direct route path
  const checkRoutePath = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Auto-correct any long link in browser address bar to short URL
    autoCorrectLocationToShort();

    const decoded = decodeRoute();
    const { canonicalPathname, pageParam, fileParam, presetParam } = decoded;

    // 1. Strictly authorized Admin Workspace: ONLY /search?page=admin or /sr?pg=adm
    if (canonicalPathname === 'search' && pageParam === 'admin') {
      try {
        localStorage.setItem('mycivy_last_view', 'admin');
      } catch {}
      setIsToolsView(true);
      setIsFullPagePdf(false);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      setIsIdentityView(false);
      setIsAdmin(true);
      return;
    }

    // 2. Profile in Admin Session: ONLY /search?page=profile or /sr?pg=prf
    if (canonicalPathname === 'search' && pageParam === 'profile') {
      setIsToolsView(false);
      setIsFullPagePdf(false);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      setIsIdentityView(false);
      setIsAdmin(true);
      return;
    }

    // 3. Strictly authorized Standardized PDF Previews: /preview?file=... or /prev?f=...
    if (canonicalPathname === 'preview') {
      if (fileParam === 'portofolio' || fileParam === 'portfolio' || fileParam === 'p') {
        const resolved = presetParam ? resolvePresetFromQuery(presetParam) : 'all';
        setPortfolioPresetKey(resolved || 'all');
        setIsPortfolioView(true);
        setIsFullPagePdf(false);
        setIsCertificationView(false);
        setIsAcademicView(false);
        setIsIdentityView(false);
        setIsToolsView(false);
        return;
      }

      if (
        fileParam === 'sertifikasi' ||
        fileParam === 'sertifikat' ||
        fileParam === 'certification' ||
        fileParam === 'certifications' ||
        fileParam === 's'
      ) {
        const resolved = presetParam ? resolvePresetFromQuery(presetParam) : 'all';
        setCertificationPresetKey(resolved || 'all');
        setIsCertificationView(true);
        setIsPortfolioView(false);
        setIsFullPagePdf(false);
        setIsAcademicView(false);
        setIsIdentityView(false);
        setIsToolsView(false);
        return;
      }

      if (fileParam === 'akademik' || fileParam === 'academic' || fileParam === 'a') {
        const docId = resolveAcademicDocFromUrl();
        setAcademicDocId(docId);
        setIsAcademicView(true);
        setIsPortfolioView(false);
        setIsCertificationView(false);
        setIsFullPagePdf(false);
        setIsIdentityView(false);
        setIsToolsView(false);
        return;
      }

      if (
        fileParam === 'identitas' ||
        fileParam === 'identity' ||
        fileParam === 'foto' ||
        fileParam === 'pas-foto' ||
        fileParam === 'id' ||
        fileParam === 'ft'
      ) {
        setIsIdentityView(true);
        setIsAcademicView(false);
        setIsPortfolioView(false);
        setIsCertificationView(false);
        setIsFullPagePdf(false);
        setIsToolsView(false);
        return;
      }

      if (fileParam === 'cv') {
        const resolved = presetParam ? resolvePresetFromQuery(presetParam) : null;
        const activeKey = resolved || 'optimal';
        setFullPagePresetKey(activeKey);
        setIsFullPagePdf(true);
        setIsPortfolioView(false);
        setIsCertificationView(false);
        setIsAcademicView(false);
        setIsIdentityView(false);
        setIsToolsView(false);
        return;
      }

      // Invalid file parameter on preview -> redirect cleanly to /
      window.history.replaceState({}, '', '/');
      setIsFullPagePdf(false);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAcademicView(false);
      setIsIdentityView(false);
      setIsToolsView(false);
      setIsAdmin(false);
      return;
    }

    // 4. Any old / legacy link access:
    // e.g. /?pages=admin, /?page=admin, /admin, /tools, /cv, /portofolio, /sertifikasi, /akademik, /identitas, /[preset-slug]
    // Block access and clean URL to '/' so legacy links are NOT accessible:
    const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
    const params = new URLSearchParams(window.location.search);
    if (pathname || params.has('pages') || params.has('page') || params.has('admin')) {
      window.history.replaceState({}, '', '/');
    }

    setIsToolsView(false);
    setIsFullPagePdf(false);
    setIsPortfolioView(false);
    setIsCertificationView(false);
    setIsAcademicView(false);
    setIsIdentityView(false);
    setIsAdmin(false);
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
    try {
      localStorage.setItem('mycivy_last_view', 'home');
    } catch {}
    if (typeof window !== 'undefined') {
      // Jika kembali dari admin workspace atau sedang dalam sesi admin, kembali ke /sr?pg=prf
      if (isToolsView || isAdmin) {
        window.history.pushState({}, '', '/sr?pg=prf');
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
    try {
      localStorage.setItem('mycivy_last_view', 'admin');
    } catch {}
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/sr?pg=adm');
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
      window.history.pushState({}, '', '/prev?f=cv');
    }
    setIsFullPagePdf(true);
    setIsPortfolioView(false);
    setIsCertificationView(false);
    setIsAcademicView(false);
    setIsIdentityView(false);
    setIsToolsView(false);
  };

  const handleNavigateToPortfolio = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/prev?f=p');
    }
    setIsPortfolioView(true);
    setIsFullPagePdf(false);
    setIsCertificationView(false);
    setIsAcademicView(false);
    setIsIdentityView(false);
    setIsToolsView(false);
  };

  const handleNavigateToCertifications = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/prev?f=s');
    }
    setIsCertificationView(true);
    setIsPortfolioView(false);
    setIsFullPagePdf(false);
    setIsAcademicView(false);
    setIsIdentityView(false);
    setIsToolsView(false);
  };

  const handleNavigateToAcademic = (docId: 'skl' | 'transkrip' = 'skl') => {
    if (typeof window !== 'undefined') {
      const spec = docId === 'transkrip' ? 'trk' : 'skl';
      window.history.pushState({}, '', `/prev?f=a&spec=${spec}`);
    }
    setAcademicDocId(docId);
    setIsAcademicView(true);
    setIsIdentityView(false);
    setIsCertificationView(false);
    setIsPortfolioView(false);
    setIsFullPagePdf(false);
    setIsToolsView(false);
  };

  const handleNavigateToIdentity = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/prev?f=id');
    }
    setIsIdentityView(true);
    setIsAcademicView(false);
    setIsCertificationView(false);
    setIsPortfolioView(false);
    setIsFullPagePdf(false);
    setIsToolsView(false);
  };

  if (isIdentityView || isAcademicView || isPortfolioView || isCertificationView || isFullPagePdf) {
    const activeView: 'identity' | 'academic' | 'portfolio' | 'certification' | 'pdf' = isIdentityView
      ? 'identity'
      : isAcademicView
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
