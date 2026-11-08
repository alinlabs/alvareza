import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useThemeMode } from '../../hooks/useThemeMode';
import { ExecutiveLandingPageProps } from './types';
import { ExecutiveHeader } from './components/ExecutiveHeader';
import { ExecutiveHero } from './components/ExecutiveHero';
import { ExecutiveMetricsGrid } from './components/ExecutiveMetricsGrid';
import { ExecutiveMahaKarya } from './components/ExecutiveMahaKarya';
import { ExecutiveProfilePhoto } from './components/ExecutiveProfilePhoto';
import { ExecutiveRunningTicker } from './components/ExecutiveRunningTicker';
import { ExecutiveFooter } from './components/ExecutiveFooter';

export const ExecutiveLandingPage: React.FC<ExecutiveLandingPageProps> = ({
  onNavigateToPdf,
  onNavigateToPortfolio,
  onNavigateToCertifications,
  onNavigateToAcademic,
  onOpenBuilder,
  isAdmin = false,
}) => {
  const { language, setLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useThemeMode();

  // Handle language switch and keep URL synced with &lang=in / &lang=en
  const handleToggleLanguage = () => {
    const nextLang = language === 'en' ? 'in' : 'en';
    setLanguage(nextLang);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', nextLang);
        url.searchParams.delete('lng');
        url.searchParams.delete('bahasa');
        window.history.replaceState(null, '', url.toString());
      } catch {}
    }
  };

  // Keep URL search params synced with &lang=in/en and &mode=dark/light on Executive page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      const isExecPage =
        (url.pathname.includes('/search') && (url.searchParams.get('page') === 'executive' || url.searchParams.get('page') === 'profile')) ||
        (url.pathname.includes('/sr') && (url.searchParams.get('pg') === 'exec' || url.searchParams.get('pg') === 'ex'));
      const isRoot = url.pathname === '/' || url.pathname === '';

      if (isExecPage || isRoot) {
        if (!url.pathname.includes('/sr')) {
          url.pathname = '/search';
          url.searchParams.set('page', 'executive');
          url.searchParams.set('lang', language === 'en' ? 'en' : 'in');
        } else {
          url.searchParams.set('lng', language === 'en' ? 'en' : 'in');
        }
        url.searchParams.set('mode', isDarkMode ? 'dark' : 'light');
        url.searchParams.delete('theme');
        url.searchParams.delete('th');
        window.history.replaceState(null, '', url.toString());
      }
    } catch {}
  }, [language, isDarkMode]);

  return (
    <div
      className={`h-screen w-full max-w-full ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100 selection:bg-blue-900 selection:text-white'
          : 'bg-white text-slate-900 selection:bg-blue-100 selection:text-[#0F172A]'
      } flex flex-col font-sans relative transition-colors duration-200 overflow-hidden`}
    >
      {/* Sticky Top Header: with Language and Dark/Light Mode Controls */}
      <ExecutiveHeader
        language={language}
        toggleLanguage={handleToggleLanguage}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isAdmin={isAdmin}
        onOpenAdmin={onOpenBuilder}
        onNavigateToPdf={onNavigateToPdf}
        onNavigateToPortfolio={onNavigateToPortfolio}
        onNavigateToCertifications={onNavigateToCertifications}
        onNavigateToAcademic={onNavigateToAcademic}
      />

      {/* Primary Scroll Container (Vertical Scrollbar starts UNDER header) */}
      <div className="flex-1 overflow-y-auto overflow-x-clip relative flex flex-col w-full">
        {/* Background Subtle Gradient Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden opacity-50 z-0">
          <div
            className={`absolute -top-32 right-1/4 w-[480px] h-[480px] ${
              isDarkMode ? 'bg-blue-950/40' : 'bg-blue-100/70'
            } rounded-full blur-[140px] transition-colors duration-300`}
          />
          <div
            className={`absolute top-48 left-1/4 w-[400px] h-[400px] ${
              isDarkMode ? 'bg-indigo-950/30' : 'bg-indigo-100/60'
            } rounded-full blur-[140px] transition-colors duration-300`}
          />
        </div>

        {/* Main Hero & Profile Section */}
        <main className="relative z-10 flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-16 flex flex-col justify-center w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-center w-full">
            {/* Left Column: Title, Subtitle, Bio, Compact CV Highlight Metrics & Maha Karya (16 Portofolios) */}
            <div className="order-2 lg:order-1 lg:col-span-8 flex flex-col space-y-4 -mt-10 sm:-mt-12 lg:mt-0 relative z-30">
              <ExecutiveHero language={language} isDarkMode={isDarkMode} />
              <ExecutiveMetricsGrid language={language} isDarkMode={isDarkMode} />
              <ExecutiveMahaKarya
                language={language}
                isDarkMode={isDarkMode}
                onNavigateToPortfolio={onNavigateToPortfolio}
              />
            </div>

            {/* Right Column: Profile Image from /gambar/ */}
            <ExecutiveProfilePhoto isDarkMode={isDarkMode} />
          </div>
        </main>

        {/* Mode Desktop / Tablet: Seamless Running Ticker of Projects & Work Experiences (di atas Footer) */}
        <div className="hidden md:block bg-transparent border-none max-w-6xl mx-auto px-4 sm:px-6 w-full shrink-0">
          <ExecutiveRunningTicker language={language} isDarkMode={isDarkMode} />
        </div>

        {/* Clean Minimalist Footer */}
        <ExecutiveFooter language={language} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};
