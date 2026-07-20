import { ApiService } from '../services/api';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Award, X, Globe, HardDrive, Folder, Trophy, Mic, Users, MonitorPlay, UserCheck, Scale, Flag, Clapperboard, Briefcase, UserPlus, Map, ChevronDown, ChevronUp } from 'lucide-react';
import { Project, Achievement } from '../types';
import { certificateImages } from './Achievements';
import { MobileSlider } from './MobileSlider';

export const getAchievementIcon = (category?: string, className = "text-slate-400 dark:text-slate-500") => {
  switch (category) {
    case 'Kepanitiaan': return <Users size={20} className={className} />;
    case 'Presentasi': return <MonitorPlay size={20} className={className} />;
    case 'Partisipasi': return <UserCheck size={20} className={className} />;
    case 'Public Speaking': return <Mic size={20} className={className} />;
    case 'Penghargaan': return <Trophy size={20} className={className} />;
    case 'Pemateri': return <Mic size={20} className={className} />;
    case 'Juri': return <Scale size={20} className={className} />;
    case 'Moderator': return <UserPlus size={20} className={className} />;
    case 'Delegasi': return <Map size={20} className={className} />;
    case 'Paskibra': return <Flag size={20} className={className} />;
    case 'Organisasi': return <Briefcase size={20} className={className} />;
    case 'Sutradara': return <Clapperboard size={20} className={className} />;
    default: return <Award size={20} className={className} />;
  }
};

import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

export default function Pencapaian() {
  const [pencapaian, setPencapaian] = useState<Achievement[]>([]);
  const [kejuaraan, setKejuaraan] = useState<Achievement[]>([]);
  
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const [activeCertTab, setActiveCertTab] = useState<'detail' | 'sertifikat'>('detail');
  const [activeTab, setActiveTab] = useState<'pencapaian' | 'kejuaraan'>('pencapaian');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  useBodyScrollLock(!!selectedAchievement);

  const toggleExpand = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    ApiService.get<any>('pencapaian').then(res => res.data)
      .then(data => setPencapaian(data))
      .catch(err => console.error("Failed to load pencapaian data", err));

    ApiService.get<any>('kejuaraan').then(res => res.data)
      .then(data => setKejuaraan(data))
      .catch(err => console.error("Failed to load kejuaraan data", err));
  }, []);

  // Prevent background scrolling when a modal is open
  useEffect(() => {
    if (selectedAchievement) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedAchievement]);

  const renderCard = (achieve: Achievement, index: number) => (
    <motion.div
      key={achieve.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full flex items-center gap-3 cursor-pointer"
      onClick={() => { setSelectedAchievement(achieve); setActiveCertTab('detail'); }}
    >
      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0">
        {getAchievementIcon(achieve.kategori)}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            {achieve.tingkat}
          </span>
        </div>
        <h4 className="text-sm font-bold text-slate-950 dark:text-slate-50 leading-tight mb-0.5 line-clamp-2">{achieve.judul}</h4>
        <p className="text-slate-600 dark:text-slate-400 font-medium text-[11px] truncate hidden md:block">{achieve.penerbit}</p>
      </div>
    </motion.div>
  );

  const renderContainer = (data: Achievement[], section: string) => {
    if (isMobile) {
      return <MobileSlider data={data} renderCard={renderCard} chunkSize={3} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(!expandedSections[section] ? data.slice(0, 6) : data).map((item, index) => renderCard(item, index))}
        </div>
        {data.length > 6 && (
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => toggleExpand(section)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:text-slate-400 transition-colors"
            >
              {expandedSections[section] ? (
                <>Sembunyikan <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Tampilkan semua <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <section id="pencapaian" className="py-4 md:py-5 bg-white dark:bg-slate-950 relative">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-6 md:mb-8 text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-left md:w-auto"
          >
            <h2 className="text-[20px] md:text-[25px] lg:text-[30px] font-extrabold text-slate-950 dark:text-slate-50 tracking-tight flex items-center justify-start gap-2">
              <Folder className="text-accent w-6 h-6 shrink-0" />
              <span>Pencapaian</span>
            </h2>
          </motion.div>

          <div 
            className="flex flex-nowrap gap-1.5 justify-start md:justify-end bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm w-full md:w-auto overflow-x-auto md:overflow-visible [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => setActiveTab('pencapaian')}
              className={`flex-1 md:flex-none whitespace-nowrap flex justify-center items-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === 'pencapaian' 
                  ? 'bg-accent text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 dark:text-slate-100 hover:bg-slate-50 dark:bg-slate-900'
              }`}
            >
              Pencapaian
            </button>
            <button
              onClick={() => setActiveTab('kejuaraan')}
              className={`flex-1 md:flex-none whitespace-nowrap flex justify-center items-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === 'kejuaraan' 
                  ? 'bg-accent text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 dark:text-slate-100 hover:bg-slate-50 dark:bg-slate-900'
              }`}
            >
              Kejuaraan
            </button>
          </div>
        </div>

        {pencapaian && (pencapaian || []).length > 0 && activeTab === 'pencapaian' && (
          <div className="mb-6 md:mb-8">
            {renderContainer(pencapaian, 'pencapaian')}
          </div>
        )}

        {kejuaraan && (kejuaraan || []).length > 0 && activeTab === 'kejuaraan' && (
          <div className="mb-6 md:mb-8">
            {renderContainer(kejuaraan, 'kejuaraan')}
          </div>
        )}

      </div>

      {/* Achievement Bottom Sheet */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedAchievement(null)}
            />
            
            {/* Bottom Sheet container */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="relative bg-white dark:bg-slate-950 w-full max-w-2xl rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl border-t border-slate-100 dark:border-slate-800 z-10 max-h-[92vh] flex flex-col"
            >
              {/* Drag bar indicator */}
              <div className="w-full flex justify-center pt-3 pb-2 bg-slate-50 dark:bg-slate-900 shrink-0 cursor-pointer" onClick={() => setSelectedAchievement(null)}>
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full hover:bg-slate-400 dark:bg-slate-600 transition-colors"></div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-3 right-4 z-20 w-8 h-8 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200 transition-all cursor-pointer"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>

              {/* Header */}
              {(() => {
                const hasCertificate = !!selectedAchievement.sertifikat && selectedAchievement.sertifikat.trim() !== "" && selectedAchievement.sertifikat.trim() !== "-";
                return (
                  <div className={`px-6 pt-4 ${hasCertificate ? 'pb-0' : 'pb-4'} border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 z-10 shrink-0`}>
                    <div className="pr-10">
                      <span className="text-xs font-light text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                        {selectedAchievement.kategori}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-accent leading-tight">
                        {selectedAchievement.judul}
                      </h3>
                    </div>
                    {hasCertificate ? (
                      <div className="flex mt-4">
                        <button
                          onClick={() => setActiveCertTab('detail')}
                          className={`flex-1 py-3 text-[13px] font-bold border-b-2 transition-colors ${
                            activeCertTab === 'detail' 
                              ? 'border-accent text-accent' 
                              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200'
                          }`}
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => setActiveCertTab('sertifikat')}
                          className={`flex-1 py-3 text-[13px] font-bold border-b-2 transition-colors ${
                            activeCertTab === 'sertifikat' 
                              ? 'border-accent text-accent' 
                              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200'
                          }`}
                        >
                          Sertifikat
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })()}
              {/* Scrollable Content */}
              <div className="overflow-y-auto pb-8 flex-1">
                {(() => {
                  const hasCertificate = !!selectedAchievement.sertifikat && selectedAchievement.sertifikat.trim() !== "" && selectedAchievement.sertifikat.trim() !== "-";
                  return (!hasCertificate || activeCertTab === 'detail') ? (
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shrink-0">
                        {getAchievementIcon(selectedAchievement.kategori, "text-white")}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">Penerbit</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{selectedAchievement.penerbit}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                          <line x1="16" x2="16" y1="2" y2="6"></line>
                          <line x1="8" x2="8" y1="2" y2="6"></line>
                          <line x1="3" x2="21" y1="10" y2="10"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">Tahun</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedAchievement.tahun}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">Tingkat</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedAchievement.tingkat}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">Sertifikasi</p>
                        <p className={`text-sm font-bold ${hasCertificate ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}>
                          {hasCertificate ? 'Tersertifikasi' : '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Deskripsi Aktivitas & Pencapaian
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {selectedAchievement.deskripsi}
                    </p>
                  </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                      <img
                        src={selectedAchievement.sertifikat}
                        alt={selectedAchievement.judul}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-contain max-h-[60vh] mx-auto select-none pointer-events-none"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    </div>
                  </div>
                );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}

