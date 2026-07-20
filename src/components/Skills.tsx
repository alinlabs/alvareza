import { ApiService } from '../services/api';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Cpu, 
  Palette, 
  Briefcase,
  Sparkles,
  X
} from 'lucide-react';
import { SkillGroup, Skill } from '../types';

import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

export default function Skills() {
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Track currently expanded skill
  const [selectedSkill, setSelectedSkill] = useState<{skill: Skill, category: string} | null>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  useBodyScrollLock(!!selectedSkill);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    ApiService.get<any>('keahlian').then(res => res.data)
      .then(data => {
        if (!data) {
          setSkills([]);
          return;
        }
        
        // Failsafe: if data is a flat array instead of grouped, group it here
        if (Array.isArray(data) && data.length > 0 && !data[0].hasOwnProperty('keahlian')) {
          const grouped: { [key: string]: SkillGroup } = {};
          data.forEach((skill: any) => {
            const cat = skill.kategori || 'Lainnya';
            if (!grouped[cat]) {
              grouped[cat] = {
                kategori: cat,
                tipeGrafik: 'line',
                keahlian: []
              };
            }
            
            let penguasaan = skill.penguasaan;
            if (typeof penguasaan === 'string') {
              try { penguasaan = JSON.parse(penguasaan); } catch(e) { penguasaan = []; }
            }
            
            grouped[cat].keahlian.push({
              bidang: skill.bidang || skill.nama,
              persentase: skill.persentase !== undefined ? Number(skill.persentase) : 80,
              deskripsi: skill.deskripsi || '',
              penguasaan: Array.isArray(penguasaan) ? penguasaan : []
            });
          });
          const groupedData = Object.values(grouped);
          setSkills(groupedData);
          if (groupedData.length > 0) setActiveCategories([groupedData[0].kategori]);
        } else if (Array.isArray(data)) {
          // It's already grouped (or is an empty array)
          setSkills(data);
          if (data.length > 0) setActiveCategories([data[0].kategori]);
        } else {
          setSkills([]);
        }
      })
      .catch(err => console.error("Failed to load keahlian data", err));
  }, []);

  const scrollToCategory = (categoryName: string) => {
    if (scrollContainerRef.current) {
      const slide = document.querySelector(`[data-category="${categoryName}"]`) as HTMLElement;
      if (slide) {
        scrollContainerRef.current.scrollTo({
          left: slide.offsetLeft - scrollContainerRef.current.offsetLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    if ((skills || []).length === 0 || !scrollContainerRef.current) return;
    
    const currentVisible = new Set<string>();
    
    const observer = new IntersectionObserver((entries) => {
      let hasChanges = false;
      entries.forEach(entry => {
        const cat = entry.target.getAttribute('data-category');
        if (!cat) return;
        
        if (entry.isIntersecting) {
          if (!currentVisible.has(cat)) {
            currentVisible.add(cat);
            hasChanges = true;
          }
        } else {
          if (currentVisible.has(cat)) {
            currentVisible.delete(cat);
            hasChanges = true;
          }
        }
      });
      
      if (hasChanges && currentVisible.size > 0) {
        const visibleArray = skills
          .map(g => g.kategori)
          .filter(c => currentVisible.has(c));
          
        setActiveCategories(visibleArray);
      }
    }, { root: scrollContainerRef.current, threshold: 0.3 });

    const slides = document.querySelectorAll('.skill-slide');
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [skills]);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if ((skills || []).length === 0) return null;

  // Helper to get category description
  const getCategoryDesc = (category: string) => {
    switch (category) {
      case 'Komunikasi':
        return "Kemampuan bernegosiasi, public speaking, dan menyampaikan ide secara efektif guna membangun kolaborasi strategis yang solid.";
      case 'Teknologi':
        return "Kombinasi keahlian teknis dalam rekayasa sistem, pengembangan aplikasi, serta implementasi kecerdasan buatan (AI) modern.";
      case 'Kreatif':
        return "Sensibilitas tinggi dalam merancang visual memikat, antarmuka pengguna (UI/UX) yang intuitif, serta produksi konten kreatif berdampak.";
      case 'Administrasi':
        return "Ketelitian tingkat tinggi dalam manajemen keuangan, pengelolaan operasional bisnis, dan tata kelola proyek secara terstruktur.";
      default:
        return "Keahlian profesional teruji yang mendukung efisiensi operasional dan pertumbuhan bisnis berkelanjutan.";
    }
  };

  // Helper to get category icon
  const getCategoryIcon = (category: string) => {
    const iconClass = "w-5 h-5 text-accent";
    switch (category) {
      case 'Komunikasi':
        return <MessageSquare className={iconClass} />;
      case 'Teknologi':
        return <Cpu className={iconClass} />;
      case 'Kreatif':
        return <Palette className={iconClass} />;
      case 'Administrasi':
        return <Briefcase className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <section id="skills" className="py-4 md:py-5 bg-slate-50 dark:bg-slate-900/50 border-t border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-6 md:mb-8 text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left md:w-auto">
            <h2 className="text-[20px] md:text-[25px] lg:text-[30px] font-extrabold text-slate-950 dark:text-slate-50 tracking-tight flex items-center justify-start gap-2">
              <Sparkles className="text-accent w-6 h-6 shrink-0" />
              <span>Keahlian</span>
            </h2>
          </div>
          
          {/* Quick tab filters at top */}
          <div className="flex flex-nowrap gap-1.5 justify-start md:justify-end bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm w-full md:w-auto overflow-x-auto md:overflow-visible">
            {(skills || []).map((group, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCategory(group.kategori)}
                className={`flex-1 md:flex-none whitespace-nowrap flex justify-center items-center px-3.5 py-2.5 md:py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                  activeCategories.includes(group.kategori) 
                    ? 'bg-accent text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 dark:text-slate-100 hover:bg-slate-50 dark:bg-slate-900'
                }`}
                title={group.kategori}
              >
                <span className="md:hidden">
                  {React.cloneElement(getCategoryIcon(group.kategori) as React.ReactElement, {
                    className: `w-5 h-5 ${activeCategories.includes(group.kategori) ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`
                  })}
                </span>
                <span className="hidden md:block">{group.kategori}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Slide Container */}
        <div className="relative">
          
          {/* Slider Content Wrapper */}
          <div 
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 lg:gap-8 pb-8 pt-2 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {(skills || []).map((group) => (
              <div 
                key={group.kategori} 
                data-category={group.kategori}
                className="skill-slide w-full lg:w-[calc(50%-1.5rem)] shrink-0 snap-start flex flex-col justify-between py-2 px-1"
              >


                {/* Footer: Indikator Keahlian */}
                <div className="space-y-3.5">
                  {group.keahlian.map((skill, sIdx) => {
                    return (
                      <div key={sIdx} className="flex flex-col gap-2">
                        <div 
                          className="relative w-full h-10 bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 flex items-center shadow-sm cursor-pointer transition-colors hover:border-accent/50"
                          onClick={() => setSelectedSkill({ skill, category: group.kategori })}
                        >
                          {/* Progress Fill */}
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.persentase}%` }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.85, ease: "easeOut", delay: sIdx * 0.05 }}
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-blue-500 rounded-r-lg"
                          />
                          {/* Inside-the-bar Information Layout */}
                          <div className="absolute inset-0 flex items-center justify-between px-4 z-10 pointer-events-none">
                            <span className="text-xs sm:text-sm font-bold text-white tracking-tight drop-shadow-sm">
                              {skill.bidang}
                            </span>
                            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-950/90 border border-white/50 dark:border-slate-800/50 px-2 py-0.5 rounded-lg shadow-sm">
                              {skill.persentase}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <AnimatePresence>
        {selectedSkill && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50"
            />
            
            {/* Modal / Bottom Sheet */}
            <motion.div
              initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
              animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
              exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={`fixed z-50 bg-white dark:bg-slate-950 shadow-2xl ${
                isMobile 
                  ? 'bottom-0 left-0 right-0 rounded-t-3xl max-h-[85vh] overflow-y-auto' 
                  : 'top-1/2 left-1/2 w-full max-w-md rounded-3xl overflow-hidden'
              }`}
            >
              {isMobile && (
                <div className="w-full flex justify-center pt-4 pb-2">
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
              )}

              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-lg text-xs font-bold mb-3">
                      {selectedSkill.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-accent flex items-center gap-3">
                      {selectedSkill.skill.bidang}
                      <span className="text-sm font-extrabold text-white bg-accent px-2 py-0.5 rounded-lg shadow-sm">
                        {selectedSkill.skill.persentase}%
                      </span>
                    </h3>
                  </div>
                  {!isMobile && (
                    <button 
                      onClick={() => setSelectedSkill(null)}
                      className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {selectedSkill.skill.deskripsi && (
                    <div>
                      <h4 className="text-sm font-bold text-accent mb-2">Deskripsi</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {selectedSkill.skill.deskripsi}
                      </p>
                    </div>
                  )}

                  {selectedSkill.skill.penguasaan && selectedSkill.skill.penguasaan.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-accent mb-3">Penguasaan Bidang</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedSkill.skill.penguasaan.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {isMobile && (
                  <button 
                    onClick={() => setSelectedSkill(null)}
                    className="w-full mt-8 py-3.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Tutup
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
