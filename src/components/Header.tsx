import { ApiService } from '../services/api';
import React, { useState, useEffect, useRef } from 'react';
import { ProfileData } from '../types';
import { Share2, X, Copy, ExternalLink, QrCode, User } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useBodyScrollLock(isShareOpen);

  useEffect(() => {
    // Force light mode
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    const headerActive = isScrolled || isMobile;

  return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    ApiService.get<any>('profil').then(res => res.data)
      .then(data => setProfile(data))
      .catch(err => console.error("Failed to load profil data", err));
  }, []);

  useEffect(() => {
    ApiService.get<any>('portofolio').then(res => res.data)
      .then(data => setHasPortfolio(Array.isArray(data) && data.some(p => p && p.id && p.id.trim() !== "" && p.judul && p.judul.trim() !== "")))
      .catch(err => console.error("Failed to load portfolio data", err));
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile ? `Portofolio ${profile.nama}` : 'Portofolio',
          text: 'Lihat portofolio profesional saya',
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    }
  };

  const navLinks = [
    { name: 'Keahlian', href: '#skills' },
    { name: 'Pengalaman', href: '#experience' },
    { name: 'Pendidikan', href: '#education' },
    ...(hasPortfolio ? [{ name: 'Portofolio', href: '#portofolio' }] : []),
    { name: 'Kontak', href: '#contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      if (targetId === '') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const headerActive = isScrolled || isMobile;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3.5 md:py-4 border-b rounded-b-2xl md:rounded-none ${
          headerActive ? 'translate-y-0 bg-white dark:bg-slate-950 shadow-sm border-slate-100 dark:border-slate-800'
            : 'translate-y-0 bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <a href="#" onClick={(e) => handleScrollTo(e, '#')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
              <img src="/gambar/profil.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-extrabold tracking-tight leading-none transition-colors ${headerActive ? 'text-slate-950 dark:text-slate-50 group-hover:text-accent' : 'text-white group-hover:text-white/90'}`}>
                {profile ? profile.nama.split(' ')[0] : '...'}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${headerActive ? 'text-accent' : 'text-white/80'}`}>Open To Work</span>
            </div>
          </a>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-8">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`text-sm font-medium transition-colors ${headerActive ? 'text-slate-600 dark:text-slate-400 hover:text-accent' : 'text-white/90 hover:text-white'}`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2 relative">
              <button
                onClick={() => {
                  window.history.pushState(null, '', '/admin');
                }}
                className={`p-2 transition-colors cursor-pointer ${headerActive ? 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 dark:text-slate-100' : 'text-white hover:text-white/80'}`}
                title="Masuk ke Halaman Admin"
              >
                <User size={20} />
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                className={`p-2 transition-colors cursor-pointer ${headerActive ? 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 dark:text-slate-100' : 'text-white hover:text-white/80'}`}
                title="Bagikan Portofolio"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isShareOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareOpen(false)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 z-[100] backdrop-blur-sm"
            />
            
            <div className={`fixed inset-0 z-[100] flex ${isMobile ? 'items-end' : 'items-center justify-center'} p-0 md:p-6 pointer-events-none`}>
              <motion.div
                initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 20 }}
                animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="bg-white dark:bg-slate-950 rounded-t-3xl md:rounded-2xl shadow-xl w-full md:max-w-md overflow-hidden flex flex-col pointer-events-auto"
              >
                {isMobile && (
                  <div className="w-full flex justify-center pt-3 pb-1 shrink-0 bg-white dark:bg-slate-950" onClick={() => setIsShareOpen(false)}>
                    <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  </div>
                )}
                
                <div className="px-5 md:px-6 pt-4 md:pt-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                      <img src="/gambar/profil.png" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">{profile ? profile.nama : 'Portofolio'}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold text-accent">Share Me | Open To Work</p>
                    </div>
                  </div>
                  {!isMobile && (
                    <button 
                      onClick={() => setIsShareOpen(false)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 rounded-full transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                
                <div className="p-6 md:p-8 flex flex-col items-center">
                  <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6 relative">
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white border-4 border-white dark:border-slate-950 shadow-sm z-10">
                      <QrCode size={14} />
                    </div>
                    <QRCodeCanvas 
                      value={window.location.href} 
                      size={180}
                      bgColor={"#ffffff"}
                      fgColor={"#0f172a"}
                      level={"H"}
                      includeMargin={false}
                      imageSettings={{
                        src: "/gambar/logo.ico",
                        height: 36,
                        width: 36,
                        excavate: true,
                      }}
                    />
                  </div>
                  
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-6 text-center">
                    Scan QR code ini untuk membuka<br/>portofolio di perangkat lain
                  </p>
                  
                  <div className="w-full flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all"
                    >
                      <Copy size={16} className={copied ? "text-green-500" : "text-slate-500 dark:text-slate-400"} />
                      {copied ? "Tersalin!" : "Salin Link"}
                    </button>
                    
                    {navigator.share ? (
                      <button
                        onClick={handleNativeShare}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-accent bg-accent hover:bg-accent/90 text-white font-bold text-sm transition-all shadow-sm"
                      >
                        <ExternalLink size={16} />
                        Bagikan
                      </button>
                    ) : (
                      <a
                        href={`mailto:?subject=Portofolio%20${profile?.nama || ''}&body=Lihat%20portofolio%20profesional%20saya%20di%20${window.location.href}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-accent bg-accent hover:bg-accent/90 text-white font-bold text-sm transition-all shadow-sm"
                      >
                        <ExternalLink size={16} />
                        Via Email
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
