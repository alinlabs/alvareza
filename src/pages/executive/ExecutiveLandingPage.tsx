import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
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
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-[#0F172A] relative">
      {/* Background Subtle Gradient Blobs (Light Mode) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden opacity-50 z-0">
        <div className="absolute -top-32 right-1/4 w-[480px] h-[480px] bg-blue-100/70 rounded-full blur-[140px]" />
        <div className="absolute top-48 left-1/4 w-[400px] h-[400px] bg-indigo-100/60 rounded-full blur-[140px]" />
      </div>

      {/* Sticky Top Header: Selalu tampil dan sticky di atas, tanpa tombol admin di https://domain */}
      <ExecutiveHeader
        language={language}
        toggleLanguage={toggleLanguage}
        isAdmin={isAdmin}
        onOpenAdmin={onOpenBuilder}
        onNavigateToPdf={onNavigateToPdf}
        onNavigateToPortfolio={onNavigateToPortfolio}
        onNavigateToCertifications={onNavigateToCertifications}
        onNavigateToAcademic={onNavigateToAcademic}
      />

      {/* Khusus Mode Mobile: Running Ticker tepat di bawah Header */}
      <div className="block md:hidden bg-transparent border-none">
        <ExecutiveRunningTicker language={language} />
      </div>

      {/* Main Hero & Profile Section */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-20 flex flex-col justify-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-center">
          {/* Left Column: Title, Subtitle, Bio, Compact CV Highlight Metrics & Maha Karya (16 Portofolios) */}
          <div className="order-2 lg:order-1 lg:col-span-8 flex flex-col space-y-4 -mt-10 sm:-mt-12 lg:mt-0 relative z-20">
            <ExecutiveHero language={language} />
            <ExecutiveMetricsGrid language={language} />
            <ExecutiveMahaKarya language={language} onNavigateToPortfolio={onNavigateToPortfolio} />
          </div>

          {/* Right Column: Profile Image from /gambar/ */}
          <ExecutiveProfilePhoto />
        </div>
      </main>

      {/* Mode Desktop / Tablet: Seamless Running Ticker of Projects & Work Experiences (di atas Footer) */}
      <div className="hidden md:block bg-transparent border-none">
        <ExecutiveRunningTicker language={language} />
      </div>

      {/* Clean Minimalist Footer */}
      <ExecutiveFooter language={language} />
    </div>
  );
};
