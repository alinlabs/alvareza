import React, { Suspense, lazy, useState, useEffect } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import SplashScreen from './components/SplashScreen';

// Lazy load components to improve initial load performance
const Achievements = lazy(() => import('./components/Achievements'));
const Skills = lazy(() => import('./components/Skills'));
const Experience = lazy(() => import('./components/Experience'));
const Education = lazy(() => import('./components/Education'));
const Pencapaian = lazy(() => import('./components/Pencapaian'));
const Portofolio = lazy(() => import('./components/Portofolio'));
const Contact = lazy(() => import('./components/Contact'));
const AdminPage = lazy(() => import('./pages/admin'));

// Smooth loading indicator centered vertically and horizontally
const LoadingFallback = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-xs z-[9999]">
    <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex space-x-2">
        <div className="w-3.5 h-3.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3.5 h-3.5 bg-accent/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3.5 h-3.5 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 animate-pulse tracking-wide">
        Memuat konten...
      </span>
    </div>
  </div>
);

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Clean up any stray hash fragments from the URL (except /admin)
    const scrubHash = () => {
      if (window.location.hash && window.location.hash !== '#/admin') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    
    // Check initially
    scrubHash();
    
    // Keep checking on hashchange
    window.addEventListener('hashchange', scrubHash);
    
    return () => window.removeEventListener('hashchange', scrubHash);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen to standard popstate changes
    window.addEventListener('popstate', handleLocationChange);

    // Support single page navigation updates without full refresh
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  // Simple Router check for the /admin pathname
  if (currentPath === '/admin' || window.location.hash === '#/admin') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AdminPage />
      </Suspense>
    );
  }

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.5s ease-in-out', pointerEvents: showSplash ? 'none' : 'auto' }}>
        <Layout>
          <Hero />
          <Suspense fallback={<LoadingFallback />}>
            <Achievements />
            <Skills />
            <Experience />
            <Education />
            <Pencapaian />
            <Portofolio />
            <Contact />
          </Suspense>
        </Layout>
      </div>
    </>
  );
}

