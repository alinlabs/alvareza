import { ApiService } from '../services/api';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Calendar, Landmark, MapPin, X, ArrowUpRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { Achievement } from '../types';
import { getAchievementIcon } from './Pencapaian';

export const certificateImages: Record<string, string> = {};

export const getWidthClass = (id: string) => {
  const num = parseInt(id.replace("ach-", "")) || 1;
  const sizes = [
    "w-[200px] sm:w-[300px]", 
    "w-[240px] sm:w-[350px]", 
    "w-[260px] sm:w-[380px]", 
    "w-[220px] sm:w-[320px]"
  ];
  return sizes[num % sizes.length];
};

import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCert, setSelectedCert] = useState<Achievement | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [activeTab, setActiveTab] = useState<'detail' | 'sertifikat'>('detail');

  useEffect(() => {
    if (selectedCert) {
      setActiveTab(selectedCert.sertifikat ? 'sertifikat' : 'detail');
    }
  }, [selectedCert]);

  useEffect(() => {
    Promise.all([
      ApiService.get<any>('pencapaian').then(res => res.data),
      ApiService.get<any>('kejuaraan').then(res => res.data)
    ])
      .then(([pencapaianData, kejuaraanData]) => {
        pencapaianData = Array.isArray(pencapaianData) ? pencapaianData : [];
        kejuaraanData = Array.isArray(kejuaraanData) ? kejuaraanData : [];
        const combined = [...pencapaianData, ...kejuaraanData];
        // Filter out achievements that do not have a valid certificate image (sertifikat)
        const withCert = (combined || []).filter((item: Achievement) => item.sertifikat && item.sertifikat.trim() !== "");
        setAchievements(withCert);
      })
      .catch(err => console.error("Failed to load achievements data", err));
  }, []);

  // Duplicate achievements to build the marquee loop
  const marqueeItems = [...achievements, ...achievements];

  return (
    <section className="py-4 md:py-5 bg-white dark:bg-slate-950 overflow-hidden border-b border-slate-100 dark:border-slate-800">
      {/* Marquee Track Wrapper */}
      <div className="relative w-full overflow-hidden py-2 select-none">
        {/* Subtle left gradient overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        
        {/* Horizontal Infinite Marquee */}
        {achievements.length > 0 && (
          <div className="flex w-max">
            <div
              className={`flex gap-5 sm:gap-6 pr-5 sm:pr-6 marquee-content ${selectedCert || showGallery ? 'paused' : ''}`}
            >
              {marqueeItems.map((cert, index) => {
                const imgUrl = cert.sertifikat;
                return (
                  <div
                    key={`${cert.id}-${index}`}
                    onClick={() => setSelectedCert(cert)}
                    className="h-[80px] sm:h-[110px] md:h-[140px] w-auto flex-shrink-0 rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(2,34,126,0.03)] hover:shadow-[0_12px_25px_rgba(2,34,126,0.08)] border border-slate-100 dark:border-slate-800/80 hover:border-blue-200/60 dark:hover:border-blue-800/60 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer group bg-slate-50 dark:bg-slate-900 relative"
                  >
                    <img
                      src={imgUrl}
                      alt={cert.judul}
                      referrerPolicy="no-referrer"
                      className="h-full w-auto object-cover grayscale transition-transform duration-500 group-hover:scale-105 select-none"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    {/* Subtle dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                      <span className="text-white font-bold text-xs sm:text-sm tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">Lihat Detail</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Subtle right gradient overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Bottom Sheet for Certificate Detail */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedCert(null)}
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
              <div className="w-full flex justify-center pt-3 pb-2 bg-slate-50 dark:bg-slate-900 shrink-0 cursor-pointer" onClick={() => setSelectedCert(null)}>
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full hover:bg-slate-400 dark:bg-slate-600 transition-colors"></div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-3 right-4 z-20 w-8 h-8 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200 transition-all cursor-pointer"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>

              {/* Header */}
              {(() => {
                const hasCertificate = !!selectedCert.sertifikat && selectedCert.sertifikat.trim() !== "" && selectedCert.sertifikat.trim() !== "-";
                
                return (
                  <div className={`px-6 pt-4 ${hasCertificate ? 'pb-0' : 'pb-4'} border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 z-10 shrink-0`}>
                    <div className="pr-10">
                      <span className="text-xs font-light text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                        {selectedCert.kategori}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-accent leading-tight">
                        {selectedCert.judul}
                      </h3>
                    </div>

                    {hasCertificate ? (
                      <div className="flex mt-4">
                        <button
                          onClick={() => setActiveTab('detail')}
                          className={`flex-1 py-3 text-[13px] font-bold border-b-2 transition-colors ${
                            activeTab === 'detail' 
                              ? 'border-accent text-accent' 
                              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200'
                          }`}
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => setActiveTab('sertifikat')}
                          className={`flex-1 py-3 text-[13px] font-bold border-b-2 transition-colors ${
                            activeTab === 'sertifikat' 
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
                  const hasCertificate = !!selectedCert.sertifikat && selectedCert.sertifikat.trim() !== "" && selectedCert.sertifikat.trim() !== "-";
                  
                  return (!hasCertificate || activeTab === 'detail') ? (
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shrink-0">
                        {getAchievementIcon(selectedCert.kategori, "text-white")}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">Penerbit</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{selectedCert.penerbit}</p>
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
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedCert.tahun}</p>
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
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedCert.tingkat}</p>
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
                      {selectedCert.deskripsi}
                    </p>
                  </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                      <img
                        src={selectedCert.sertifikat}
                        alt={selectedCert.judul}
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

      {/* Full Screen Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm cursor-pointer"
              onClick={() => setShowGallery(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-950 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-20">
                <div className="flex items-center gap-2">
                  <Award className="text-accent w-6 h-6" />
                  <h3 className="text-lg md:text-xl font-bold text-slate-950 dark:text-slate-50">Semua Pencapaian</h3>
                </div>
                <button
                  onClick={() => setShowGallery(false)}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200 transition-all cursor-pointer"
                  aria-label="Tutup"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                  {achievements.map((cert) => {
                    const imgUrl = cert.sertifikat;
                    return (
                      <div 
                        key={cert.id}
                        onClick={() => {
                          setShowGallery(false);
                          setTimeout(() => setSelectedCert(cert), 300);
                        }}
                        className="group relative h-[70px] sm:h-[100px] md:h-[130px] w-auto rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex-shrink-0"
                      >
                        <img
                          src={imgUrl}
                          alt={cert.judul}
                          referrerPolicy="no-referrer"
                          className="h-full w-auto object-cover grayscale group-hover:scale-105 transition-transform duration-500 select-none"
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
                          <span className="text-white text-xs font-bold mb-1 truncate">{cert.kategori}</span>
                          <span className="text-white text-sm font-semibold truncate leading-tight">{cert.judul}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-content {
          animation: custom-marquee 35s linear infinite;
        }
        .marquee-content.paused {
          animation-play-state: paused !important;
        }
      `}} />
    </section>
  );
}
