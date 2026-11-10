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
  isAwardsView: boolean;
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
    isAwardsView: false,
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

  const decoded = decodeRoute();
  const { canonicalPathname, pageParam, fileParam, presetParam } = decoded;

  const rawPath = typeof window !== 'undefined' ? window.location.pathname.replace(/^\/+/, '').trim().toLowerCase() : '';
  const rawSearch = typeof window !== 'undefined' ? window.location.search.toLowerCase() : '';
  const isPwaAdmin = rawSearch.includes('pwa=admin') ||
                     (typeof window !== 'undefined' && (window.navigator as any)?.standalone && localStorage.getItem('digitalprofile_last_view') === 'admin');

  // 1. Strictly authorized Admin Workspace: /search?page=admin OR /sr?pg=adm OR /sr?pg=a OR /admin OR PWA Admin
  if (
    (canonicalPathname === 'search' && (pageParam === 'admin' || pageParam === 'a')) ||
    rawPath === 'admin' ||
    rawPath.startsWith('admin') ||
    rawPath === 'tools' ||
    rawPath.startsWith('tools') ||
    rawSearch.includes('page=admin') ||
    rawSearch.includes('pg=adm') ||
    rawSearch.includes('pg=a') ||
    isPwaAdmin
  ) {
    try {
      localStorage.setItem('digitalprofile_last_view', 'admin');
    } catch {}
    return {
      ...defaultState,
      isToolsView: true,
    };
  }

  // 2. Strictly authorized Executive / Profile Page: /search?page=executive OR /search?page=profile OR /sr?pg=exec OR /sr?pg=prf
  if (
    canonicalPathname === 'search' &&
    (pageParam === 'executive' || pageParam === 'profile' || pageParam === 'exec' || pageParam === 'ex')
  ) {
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

    if (
      fileParam === 'penghargaan' ||
      fileParam === 'award' ||
      fileParam === 'awards' ||
      fileParam === 'prestasi' ||
      fileParam === 'awd'
    ) {
      return {
        ...defaultState,
        isAwardsView: true,
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
  // Block access and clean URL to executive landing so legacy links are NOT accessible:
  const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
  const params = new URLSearchParams(window.location.search);
  if (
    (pathname && pathname !== 'search' && pathname !== 'sr' && pathname !== 'preview' && pathname !== 'prev') ||
    params.has('pages') ||
    (params.has('page') && pageParam !== 'admin' && pageParam !== 'executive' && pageParam !== 'profile') ||
    params.has('admin')
  ) {
    try {
      window.history.replaceState({}, '', '/search?page=executive&lang=in');
    } catch {}
    return defaultState;
  }

  // 5. Default Public Landing Page: direct link to /search?page=executive
  const rawLang = (params.get('lang') || params.get('lng') || params.get('language') || params.get('bahasa') || '').toLowerCase().trim();
  const targetLang = (rawLang === 'en' || rawLang === 'english') ? 'en' : 'in';

  const rawMode = (params.get('mode') || params.get('theme') || params.get('th') || '').toLowerCase().trim();
  let targetMode = rawMode === 'dark' ? 'dark' : rawMode === 'light' ? 'light' : '';
  if (!targetMode) {
    try {
      const saved = localStorage.getItem('digitalprofile_theme_preference');
      if (saved === 'dark' || saved === 'light') targetMode = saved;
    } catch {}
  }
  const modePart = targetMode ? `&mode=${targetMode}` : '';
  const targetUrl = `/search?page=executive&lang=${targetLang}${modePart}`;

  try {
    window.history.replaceState(null, '', targetUrl);
  } catch {}

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
  const [isAwardsView, setIsAwardsView] = useState(initialRoute.isAwardsView);
  const [isAcademicView, setIsAcademicView] = useState(initialRoute.isAcademicView);
  const [isIdentityView, setIsIdentityView] = useState(initialRoute.isIdentityView);
  const [isToolsView, setIsToolsView] = useState(initialRoute.isToolsView);
  const [academicDocId, setAcademicDocId] = useState<'skl' | 'transkrip'>(initialRoute.academicDocId);
  const [fullPagePresetKey, setFullPagePresetKey] = useState<string>(initialRoute.fullPagePresetKey);
  const [portfolioPresetKey, setPortfolioPresetKey] = useState<string>(initialRoute.portfolioPresetKey);
  const [certificationPresetKey, setCertificationPresetKey] = useState<string>(initialRoute.certificationPresetKey);

  // Check if admin mode or profile with admin is active: strictly /search?page=admin or /sr?pg=adm / /sr?pg=a or pwa=admin / /sr?pg=prf
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const decoded = decodeRoute();
    const rawPath = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
    const rawSearch = window.location.search.toLowerCase();
    const isPwaAdmin = rawSearch.includes('pwa=admin') ||
                       ((window.navigator as any)?.standalone && localStorage.getItem('digitalprofile_last_view') === 'admin');
    return (
      (decoded.canonicalPathname === 'search' && (decoded.pageParam === 'admin' || decoded.pageParam === 'a' || decoded.pageParam === 'profile')) ||
      rawPath === 'admin' ||
      rawPath.startsWith('admin') ||
      rawPath === 'tools' ||
      rawSearch.includes('page=admin') ||
      rawSearch.includes('pg=adm') ||
      rawSearch.includes('pg=a') ||
      isPwaAdmin
    );
  });

  useEffect(() => {
    const handleCheckAdmin = () => {
      if (typeof window === 'undefined') return;
      const decoded = decodeRoute();
      const rawPath = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
      const rawSearch = window.location.search.toLowerCase();
      const isPwaAdmin = rawSearch.includes('pwa=admin') ||
                         ((window.navigator as any)?.standalone && localStorage.getItem('digitalprofile_last_view') === 'admin');
      const adminActive = (decoded.canonicalPathname === 'search' && (decoded.pageParam === 'admin' || decoded.pageParam === 'a' || decoded.pageParam === 'profile')) ||
                          rawPath === 'admin' ||
                          rawPath.startsWith('admin') ||
                          rawPath === 'tools' ||
                          rawSearch.includes('page=admin') ||
                          rawSearch.includes('pg=adm') ||
                          rawSearch.includes('pg=a') ||
                          isPwaAdmin;
      setIsAdmin(adminActive);
    };

    handleCheckAdmin();
    window.addEventListener('popstate', handleCheckAdmin);
    return () => window.removeEventListener('popstate', handleCheckAdmin);
  }, []);

  // Dynamic meta tags for the main web builder interface (only active when on builder/landing)
  useMetaTags({
    enabled: !isFullPagePdf && !isPortfolioView && !isCertificationView && !isAwardsView && !isAcademicView && !isIdentityView,
    isFullPdf: false,
    pageType: isToolsView ? 'admin' : 'home',
    canonicalPath: isToolsView ? '/search?page=admin' : '/search?page=executive',
    language,
  });

  // Parse direct route path
  const checkRoutePath = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Auto-correct any long link in browser address bar to short URL
    autoCorrectLocationToShort();

    const decoded = decodeRoute();
    const { canonicalPathname, pageParam, fileParam, presetParam } = decoded;

    const rawPath = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
    const rawSearch = window.location.search.toLowerCase();
    const isPwaAdmin = rawSearch.includes('pwa=admin') ||
                       ((window.navigator as any)?.standalone && localStorage.getItem('digitalprofile_last_view') === 'admin');

    // 1. Strictly authorized Admin Workspace: ONLY /search?page=admin, /sr?pg=adm, /admin, or pwa=admin
    if (
      (canonicalPathname === 'search' && pageParam === 'admin') ||
      rawPath === 'admin' ||
      rawPath.startsWith('admin') ||
      rawPath === 'tools' ||
      rawPath.startsWith('tools') ||
      rawSearch.includes('page=admin') ||
      rawSearch.includes('pg=adm') ||
      isPwaAdmin
    ) {
      try {
        localStorage.setItem('digitalprofile_last_view', 'admin');
      } catch {}
      setIsToolsView(true);
      setIsFullPagePdf(false);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAwardsView(false);
      setIsAcademicView(false);
      setIsIdentityView(false);
      setIsAdmin(true);
      return;
    }

    // 2. Executive Page: /search?page=executive OR /search?page=profile OR /sr?pg=exec OR /sr?pg=ex
    if (
      (canonicalPathname === 'search' && (pageParam === 'executive' || pageParam === 'profile' || pageParam === 'exec' || pageParam === 'ex')) ||
      rawSearch.includes('page=executive') ||
      rawSearch.includes('pg=exec') ||
      rawSearch.includes('pg=ex')
    ) {
      setIsToolsView(false);
      setIsFullPagePdf(false);
      setIsPortfolioView(false);
      setIsCertificationView(false);
      setIsAwardsView(false);
      setIsAcademicView(false);
      setIsIdentityView(false);
      setIsAdmin(false);
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
        setIsAwardsView(false);
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
        setIsAwardsView(false);
        setIsFullPagePdf(false);
        setIsAcademicView(false);
        setIsIdentityView(false);
        setIsToolsView(false);
        return;
      }

      if (
        fileParam === 'penghargaan' ||
        fileParam === 'award' ||
        fileParam === 'awards' ||
        fileParam === 'prestasi' ||
        fileParam === 'awd'
      ) {
        setIsAwardsView(true);
        setIsCertificationView(false);
        setIsPortfolioView(false);
        setIsAcademicView(false);
        setIsIdentityView(false);
        setIsFullPagePdf(false);
        setIsToolsView(false);
        return;
      }

      if (fileParam === 'akademik' || fileParam === 'academic' || fileParam === 'a') {
        const docId = resolveAcademicDocFromUrl();
        setAcademicDocId(docId);
        setIsAcademicView(true);
        setIsPortfolioView(false);
        setIsCertificationView(false);
        setIsAwardsView(false);
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
        setIsAwardsView(false);
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
        setIsAwardsView(false);
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
      setIsAwardsView(false);
      setIsAcademicView(false);
      setIsIdentityView(false);
      setIsToolsView(false);
      setIsAdmin(false);
      return;
    }

    // 4. Default / root or legacy link redirect to Executive page
    const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
    const params = new URLSearchParams(window.location.search);
    if (pathname === 'search' && (params.get('page') === 'executive' || params.get('page') === 'admin')) {
      // Valid page, keep as-is
    } else if (pathname === 'sr' && (params.get('pg') === 'exec' || params.get('pg') === 'ex' || params.get('pg') === 'a' || params.get('pg') === 'adm')) {
      // Valid short route, keep as-is
    } else {
      const currentMode = localStorage.getItem('digitalprofile_theme_preference') === 'dark' ? 'dark' : 'light';
      const rawLang = (params.get('lang') || params.get('lng') || params.get('bahasa') || 'in').toLowerCase();
      const currentLang = rawLang === 'en' ? 'en' : 'in';
      window.history.replaceState({}, '', `/search?page=executive&lang=${currentLang}&mode=${currentMode}`);
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
      localStorage.setItem('digitalprofile_last_view', 'home');
    } catch {}
    if (typeof window !== 'undefined') {
      const currentMode = localStorage.getItem('digitalprofile_theme_preference') === 'dark' ? 'dark' : 'light';
      const targetLang = language === 'en' ? 'en' : 'in';
      window.history.pushState({}, '', `/search?page=executive&lang=${targetLang}&mode=${currentMode}`);
      setIsAdmin(false);
    }
    setIsToolsView(false);
    setIsFullPagePdf(false);
    setIsPortfolioView(false);
    setIsCertificationView(false);
    setIsAwardsView(false);
    setIsAcademicView(false);
    setIsIdentityView(false);
  };

  const handleNavigateToTools = () => {
    try {
      localStorage.setItem('digitalprofile_last_view', 'admin');
    } catch {}
    if (typeof window !== 'undefined') {
      const currentMode = localStorage.getItem('digitalprofile_theme_preference') === 'dark' ? 'dark' : 'light';
      window.history.pushState({}, '', `/search?page=admin&mode=${currentMode}`);
    }
    setIsToolsView(true);
    setIsAdmin(true);
    setIsFullPagePdf(false);
    setIsPortfolioView(false);
    setIsCertificationView(false);
    setIsAwardsView(false);
    setIsAcademicView(false);
  };

  const handleNavigateToPdf = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/prev?f=cv');
    }
    setIsFullPagePdf(true);
    setIsPortfolioView(false);
    setIsCertificationView(false);
    setIsAwardsView(false);
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
    setIsAwardsView(false);
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
    setIsAwardsView(false);
    setIsFullPagePdf(false);
    setIsAcademicView(false);
    setIsIdentityView(false);
    setIsToolsView(false);
  };

  const handleNavigateToAwards = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/prev?f=awd');
    }
    setIsAwardsView(true);
    setIsCertificationView(false);
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
    setIsAwardsView(false);
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
    setIsAwardsView(false);
    setIsAcademicView(false);
    setIsCertificationView(false);
    setIsPortfolioView(false);
    setIsFullPagePdf(false);
    setIsToolsView(false);
  };

  if (isIdentityView || isAcademicView || isPortfolioView || isCertificationView || isAwardsView || isFullPagePdf) {
    const activeView: 'identity' | 'academic' | 'portfolio' | 'certification' | 'awards' | 'pdf' = isIdentityView
      ? 'identity'
      : isAcademicView
      ? 'academic'
      : isPortfolioView
      ? 'portfolio'
      : isCertificationView
      ? 'certification'
      : isAwardsView
      ? 'awards'
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
        onNavigateToAwards={handleNavigateToAwards}
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
