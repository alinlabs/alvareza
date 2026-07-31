import { ApiService } from '../services/api';
import React, { useState, useEffect } from 'react';
import { Home, Zap, Briefcase, FolderGit2, Mail, Award } from 'lucide-react';

export default function BottomNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasPortfolio, setHasPortfolio] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    ApiService.get<any>('portofolio').then(res => res.data)
      .then(data => setHasPortfolio(Array.isArray(data) && data.some(p => p && p.id && p.id.trim() !== "" && p.judul && p.judul.trim() !== "")))
      .catch(err => console.error("Failed to load portfolio data", err));
  }, []);

  useEffect(() => {
    const checkModalState = () => {
      const isLocked = document.body.style.overflow === 'hidden' || document.documentElement.style.overflow === 'hidden';
      setIsModalOpen(isLocked);
    };
    
    // Check initial state
    checkModalState();

    const observer = new MutationObserver(() => {
      checkModalState();
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#', icon: Home },
    { name: 'Keahlian', href: '#skills', icon: Zap },
    { name: 'Kontak', href: '#contact', icon: Mail },
    { name: 'Pengalaman', href: '#experience', icon: Briefcase },
    hasPortfolio 
      ? { name: 'Portofolio', href: '#portofolio', icon: FolderGit2 }
      : { name: 'Prestasi', href: '#pencapaian', icon: Award }
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

  if (isModalOpen) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[40] bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 px-2 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] transition-all duration-300 translate-y-0 opacity-100 rounded-t-3xl">
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => handleScrollTo(e, link.href)}
            className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-slate-400 hover:text-accent transition-colors flex-1"
          >
            <Icon size={20} strokeWidth={2} />
            <span className="text-[10px] font-medium">{link.name}</span>
          </a>
        );
      })}
    </nav>
  );
}
