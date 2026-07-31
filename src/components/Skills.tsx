import { ApiService } from '../services/api';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Cpu, 
  Palette, 
  Briefcase,
  Sparkles,
  X,
  LineChart,
  CircleDot,
  Hexagon
} from 'lucide-react';
import { SkillGroup, Skill } from '../types';

import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

interface RadarChartProps {
  keahlian: { bidang: string; persentase: number; deskripsi?: string; penguasaan?: string[] }[];
  onSkillClick: (skill: any) => void;
}

const RadarChartComponent = ({ keahlian, onSkillClick }: RadarChartProps) => {
  const numSkills = keahlian.length;
  const angleStep = (2 * Math.PI) / numSkills;

  // Center & Radius in a 300x300 canvas
  const cx = 150;
  const cy = 150;
  const r = 85; // maximum radius of 85 to leave padding for labels

  const getCoordinates = (index: number, factor: number) => {
    // Offset by -Math.PI / 2 to make the first point at top center
    const angle = index * angleStep - Math.PI / 2;
    const x = cx + r * factor * Math.cos(angle);
    const y = cy + r * factor * Math.sin(angle);
    return { x, y };
  };

  // Concentric background grid polygons (levels: 25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1];

  const getGridPolygonPoints = (factor: number) => {
    return Array.from({ length: numSkills })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, factor);
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Data point coordinate string
  const dataPoints = keahlian
    .map((skill, i) => {
      const factor = skill.persentase / 100;
      const { x, y } = getCoordinates(i, factor);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full max-w-[280px] mx-auto py-2">
      <svg viewBox="0 0 300 300" className="w-full h-auto overflow-visible">
        {/* Definition for elegant radial gradient */}
        <defs>
          <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#02227E" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#02227E" stopOpacity="0.25" />
          </radialGradient>
        </defs>

        {/* Concentric Polygons */}
        {gridLevels.map((level, lIdx) => (
          <polygon
            key={`grid-${lIdx}`}
            points={getGridPolygonPoints(level)}
            className="fill-none stroke-slate-200 dark:stroke-slate-800/80"
            strokeWidth="1"
            strokeDasharray={level === 1 ? "none" : "2 2"}
          />
        ))}

        {/* Axis Lines from center */}
        {Array.from({ length: numSkills }).map((_, i) => {
          const outer = getCoordinates(i, 1);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              className="stroke-slate-200 dark:stroke-slate-800/80"
              strokeWidth="1"
            />
          );
        })}

        {/* Actual Data Filled Area */}
        <polygon
          points={dataPoints}
          fill="url(#radarGrad)"
          className="stroke-blue-600 dark:stroke-blue-400 fill-[#02227E]/15"
          strokeWidth="2"
        />

        {/* Data point dots */}
        {keahlian.map((skill, i) => {
          const factor = skill.persentase / 100;
          const { x, y } = getCoordinates(i, factor);
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r="4.5"
              className="fill-blue-600 dark:fill-blue-400 stroke-white dark:stroke-slate-950 cursor-pointer hover:scale-125 transition-transform"
              strokeWidth="1.5"
              onClick={() => onSkillClick(skill)}
            />
          );
        })}

        {/* Dynamic Skill Labels */}
        {keahlian.map((skill, i) => {
          const { x, y } = getCoordinates(i, 1.2);
          let textAnchor = 'middle';
          
          // Adjust anchor based on x coordinate
          if (x < cx - 15) textAnchor = 'end';
          else if (x > cx + 15) textAnchor = 'start';

          return (
            <text
              key={`lbl-${i}`}
              x={x}
              y={y + 3}
              textAnchor={textAnchor}
              className="text-[10px] font-extrabold fill-slate-700 dark:fill-slate-300 select-none cursor-pointer hover:fill-[#02227E] dark:hover:fill-blue-400 transition-colors"
              onClick={() => onSkillClick(skill)}
            >
              {skill.bidang} ({skill.persentase})
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default function Skills() {
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Track visual view mode for each category group: 'line', 'circle', or 'hexagonal'
  const [viewModes, setViewModes] = useState<Record<string, 'line' | 'circle' | 'hexagonal'>>({});
  
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
    <section id="skills" className="py-2 md:py-12 bg-slate-50 dark:bg-slate-900/50 border-t-0 border-b-0 md:border-t md:border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
        
        {/* Carousel Slide Container */}
        <div className="relative">
          
          {/* Slider Content Wrapper */}
          <div 
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 lg:gap-8 pb-3 pt-2 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {(skills || []).map((group) => (
              <div 
                key={group.kategori} 
                data-category={group.kategori}
                className="skill-slide w-full md:w-[calc(50%-12px)] lg:w-[calc(50%-16px)] shrink-0 snap-start flex flex-col justify-start py-2 px-1"
              >
                {/* Group Category Header with view switcher */}
                <div className="mb-4 pb-1 flex items-center justify-between gap-2">
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-slate-50 tracking-tight">
                    {group.kategori}
                  </h3>
                  
                  {/* Switcher Buttons */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg shrink-0">
                    {(['line', 'hexagonal'] as const).map((mode) => {
                      const isActive = (viewModes[group.kategori] || 'line') === mode;
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setViewModes(prev => ({ ...prev, [group.kategori]: mode }))}
                          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer ${
                            isActive
                              ? 'bg-white dark:bg-slate-800 text-[#02227E] dark:text-blue-400 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                          title={`Tampilan ${mode}`}
                        >
                          {mode === 'line' && <LineChart className="w-3.5 h-3.5" />}
                          {mode === 'hexagonal' && <Hexagon className="w-3.5 h-3.5" />}
                          <span className="hidden xs:inline capitalize">{mode === 'hexagonal' ? 'hexagonal' : 'line'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Render based on selected view Mode */}
                <div className="min-h-[220px] flex flex-col justify-center">
                  {(viewModes[group.kategori] || 'line') === 'line' && (
                    <div className="space-y-4">
                      {group.keahlian.map((skill, sIdx) => {
                        return (
                          <div 
                            key={sIdx} 
                            className="flex flex-col gap-2 cursor-pointer group"
                            onClick={() => setSelectedSkill({ skill, category: group.kategori })}
                          >
                            <div className="flex justify-between items-center px-0.5">
                              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-accent transition-colors">
                                {skill.bidang}
                              </span>
                              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                                {skill.persentase}
                              </span>
                            </div>
                            <div className="relative w-full h-3 bg-white dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs group-hover:border-accent/40 transition-colors">
                              {/* Progress Fill */}
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.persentase}%` }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.85, ease: "easeOut", delay: sIdx * 0.05 }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-blue-500 rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {(viewModes[group.kategori] || 'line') === 'hexagonal' && (
                    <RadarChartComponent 
                      keahlian={group.keahlian} 
                      onSkillClick={(skill) => setSelectedSkill({ skill, category: group.kategori })}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Slide Indicator Dots */}
          {skills && skills.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-1 pb-1">
              {skills.map((group) => {
                const isActive = activeCategories.includes(group.kategori);
                return (
                  <button
                    key={group.kategori}
                    type="button"
                    onClick={() => scrollToCategory(group.kategori)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'w-6 bg-[#02227E] dark:bg-blue-400' 
                        : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                    }`}
                    title={`Lihat keahlian ${group.kategori}`}
                  />
                );
              })}
            </div>
          )}

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
