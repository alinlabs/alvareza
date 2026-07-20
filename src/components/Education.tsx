import { ApiService } from '../services/api';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, X, Award, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Education as EducationType, Training } from '../types';

import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

export default function Education() {
  const [selectedEdu, setSelectedEdu] = useState<EducationType | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [selectedCertImage, setSelectedCertImage] = useState<string | null>(null);
  const [educations, setEducations] = useState<EducationType[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);

  const [activeTab, setActiveTab] = useState<'pendidikan' | 'pelatihan'>('pendidikan');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  useBodyScrollLock(!!selectedEdu || !!selectedTraining || !!selectedCertImage);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpand = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    ApiService.get<any>('pendidikan').then(res => res.data)
      .then(data => setEducations(data))
      .catch(err => console.error("Failed to load pendidikan data", err));

    ApiService.get<any>('pelatihan').then(res => res.data)
      .then(data => setTrainings(data))
      .catch(err => console.error("Failed to load pelatihan data", err));
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedEdu || selectedTraining || selectedCertImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedEdu, selectedTraining, selectedCertImage]);

  return (
    <section id="education" className="py-4 md:py-5 bg-white dark:bg-slate-950 relative">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8 text-left"
        >
          <h2 className="text-[20px] md:text-[25px] lg:text-[30px] font-extrabold text-slate-950 dark:text-slate-50 mb-2 md:mb-4 flex items-center justify-start gap-2">
            <GraduationCap className="text-accent w-6 h-6 shrink-0" />
            <span>Pendidikan</span>
          </h2>
        </motion.div>

        {isMobile && (
          <div className="flex justify-start md:justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('pendidikan')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex-1 ${
                activeTab === 'pendidikan' 
                  ? 'bg-accent text-white' 
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              Pendidikan
            </button>
            <button
              onClick={() => setActiveTab('pelatihan')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex-1 ${
                activeTab === 'pelatihan' 
                  ? 'bg-accent text-white' 
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              Pelatihan
            </button>
          </div>
        )}

        {educations && educations.length > 0 && (!isMobile || activeTab === 'pendidikan') && (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-8 mb-8">
          {(isMobile && !expandedSections.pendidikan ? educations.slice(0, 4) : educations).map((edu, index) => (
            <motion.div 
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cursor-pointer h-full"
              onClick={() => setSelectedEdu(edu)}
            >
              <div className="bg-slate-50 dark:bg-slate-900 p-4 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full flex flex-col justify-center text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                  {edu.logoUrl ? (
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={edu.logoUrl} alt={edu.institusi} className="w-full h-full object-contain p-1.5 md:p-2" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col items-center md:items-start w-full">
                    <h4 className="text-[13px] md:text-2xl font-bold text-slate-950 dark:text-slate-50 mb-0.5 md:mb-1 truncate w-full">{edu.gelar}</h4>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-[11px] md:text-sm truncate w-full">{edu.institusi}</p>
                  </div>
                  <div className="shrink-0 text-right text-sm text-slate-400 dark:text-slate-500 font-normal hidden md:flex flex-col justify-center">
                    <span>{edu.tahunMasuk}</span>
                    <span>{edu.tahunLulus}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {isMobile && educations.length > 4 && (
            <div className="mt-2 flex justify-center col-span-2">
              <button 
                onClick={() => toggleExpand('pendidikan')}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:text-slate-400 transition-colors"
              >
                {expandedSections.pendidikan ? (
                  <>Sembunyikan <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Tampilkan semua <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>
        )}

        {trainings && trainings.length > 0 && (!isMobile || activeTab === 'pelatihan') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {(!expandedSections.pelatihan ? trainings.slice(0, 3) : trainings).map((training, index) => (
            <motion.div
              key={training.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full cursor-pointer"
              onClick={() => setSelectedTraining(training)}
            >
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-full flex items-center gap-3 text-left hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-slate-950 dark:text-slate-50 leading-tight mb-0.5 truncate">{training.judul}</h4>
                  <p className="text-slate-600 dark:text-slate-400 font-medium text-[11px] truncate">{training.penyelenggara}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {trainings.length > 3 && (
            <div className="mt-2 flex justify-center col-span-1 md:col-span-3">
              <button 
                onClick={() => toggleExpand('pelatihan')}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:text-slate-400 transition-colors"
              >
                {expandedSections.pelatihan ? (
                  <>Sembunyikan sebagian <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Tampilkan semua <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>
        )}
      </div>

      <AnimatePresence>
        {selectedEdu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEdu(null)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 z-[100] backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 pointer-events-none">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="bg-white dark:bg-slate-950 rounded-t-3xl md:rounded-2xl shadow-xl w-full md:max-w-2xl max-h-[85vh] md:max-h-[80vh] overflow-y-auto flex flex-col pointer-events-auto"
              >
                <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white dark:bg-slate-950" onClick={() => setSelectedEdu(null)}>
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                </div>
                <div className="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm px-6 pt-2 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between rounded-t-3xl md:rounded-t-2xl z-10">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 pr-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                      {selectedEdu.logoUrl ? (
                        <img src={selectedEdu.logoUrl} alt={`${selectedEdu.institusi} logo`} className="w-full h-full object-contain p-2" />
                      ) : (
                        <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-slate-950 dark:text-slate-50 leading-tight">{selectedEdu.gelar}</h3>
                      <p className="text-sm md:text-base text-accent font-medium mt-0.5">{selectedEdu.institusi} • {selectedEdu.field}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 shrink-0">
                    {(selectedEdu.tahunMasuk || selectedEdu.tahunLulus) && (
                        <div className="hidden md:flex flex-col text-right text-sm font-light text-slate-500 dark:text-slate-400 mt-1">
                          <span>{selectedEdu.tahunMasuk}</span>
                          <span>{selectedEdu.tahunLulus}</span>
                        </div>
                    )}
                    <button 
                      onClick={() => setSelectedEdu(null)}
                      className="p-2 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:text-slate-50 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="px-6 py-6 overflow-y-auto">
                  <h4 className="text-[15px] md:text-lg font-bold text-slate-950 dark:text-slate-50 mb-4">Konsentrasi & Aktivitas</h4>
                  <ul className="space-y-4 mb-6">
                    {selectedEdu.deskripsi.map((desc, i) => (
                      <li key={i} className="text-[13px] md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex gap-3 items-start">
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-accent mt-0.5 shrink-0" />
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Sertifikasi Section */}
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-[15px] md:text-lg font-bold text-slate-950 dark:text-slate-50 mb-4">Sertifikasi & Piagam</h4>
                    {selectedEdu.sertifikat && selectedEdu.sertifikat.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {selectedEdu.sertifikat.map((src, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedCertImage(src)}
                            className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-zoom-in bg-slate-50 dark:bg-slate-900 group"
                          >
                            <img 
                              src={src} 
                              alt={`Sertifikasi ${idx + 1}`} 
                              className="w-full h-auto block group-hover:scale-105 transition-transform duration-300 select-none"
                              onContextMenu={(e) => e.preventDefault()}
                              onDragStart={(e) => e.preventDefault()}
                            />
                            <div className="absolute inset-0 bg-slate-950/0 hover:bg-slate-950/10 dark:hover:bg-slate-800/40 transition-colors duration-200" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500 text-xs md:text-sm italic">Belum ada sertifikasi</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTraining && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTraining(null)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 z-[100] backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 pointer-events-none">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="bg-white dark:bg-slate-950 rounded-t-3xl md:rounded-2xl shadow-xl w-full md:max-w-2xl max-h-[85vh] md:max-h-[80vh] overflow-y-auto flex flex-col pointer-events-auto"
              >
                <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white dark:bg-slate-950" onClick={() => setSelectedTraining(null)}>
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                </div>
                <div className="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm px-6 pt-2 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between rounded-t-3xl md:rounded-t-2xl z-10">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 pr-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 md:w-7 md:h-7 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-slate-950 dark:text-slate-50 leading-tight">{selectedTraining.judul}</h3>
                      <p className="text-sm md:text-base text-accent font-medium mt-0.5">{selectedTraining.penyelenggara}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 shrink-0">
                    {selectedTraining.tahun && (
                      selectedTraining.tahun.includes('-') ? (
                        <div className="hidden md:flex flex-col text-right text-sm font-light text-slate-500 dark:text-slate-400 mt-1">
                          <span>{selectedTraining.tahun.split('-')[0].trim()}</span>
                          <span>{selectedTraining.tahun.split('-')[1].trim()}</span>
                        </div>
                      ) : (
                        <div className="hidden md:block text-right text-sm font-light text-slate-500 dark:text-slate-400 mt-1">
                          {selectedTraining.tahun}
                        </div>
                      )
                    )}
                    <button 
                      onClick={() => setSelectedTraining(null)}
                      className="p-2 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:text-slate-50 rounded-full transition-colors shrink-0 ml-4"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="px-4 md:px-6 py-6 overflow-y-auto">
                  <p className="text-[13px] md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {selectedTraining.deskripsi}
                  </p>
                  <h4 className="text-[15px] md:text-lg font-bold text-slate-950 dark:text-slate-50 mb-4">Hasil</h4>
                  <ul className="space-y-4">
                    {selectedTraining.hasil?.map((point, i) => (
                      <li key={i} className="text-[13px] md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex gap-3 items-start">
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-accent mt-0.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Sertifikasi Section */}
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-[15px] md:text-lg font-bold text-slate-950 dark:text-slate-50 mb-4">Sertifikat</h4>
                    {selectedTraining.sertifikat && selectedTraining.sertifikat.trim() !== '' ? (
                      <div className="max-w-[280px]">
                        <div 
                          onClick={() => setSelectedCertImage(selectedTraining.sertifikat!)}
                          className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-zoom-in bg-slate-50 dark:bg-slate-900 group"
                        >
                          <img 
                            src={selectedTraining.sertifikat} 
                            alt={`Sertifikat Pelatihan`} 
                            className="w-full h-auto block group-hover:scale-105 transition-transform duration-300 select-none"
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                          />
                          <div className="absolute inset-0 bg-slate-950/0 hover:bg-slate-950/10 dark:hover:bg-slate-800/40 transition-colors duration-200" />
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500 text-xs md:text-sm italic">Belum ada sertifikat</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Certification Image Modal */}
      <AnimatePresence>
        {selectedCertImage && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCertImage(null)}
              className="fixed inset-0 bg-slate-950/90 z-[120] backdrop-blur-md cursor-zoom-out"
            />
            <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 md:p-8 pointer-events-none">
              <button 
                onClick={() => setSelectedCertImage(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 bg-white/10 hover:bg-white/20  text-white rounded-full transition-all duration-200 pointer-events-auto backdrop-blur-md shadow-lg z-50 border border-white/10"
                aria-label="Tutup"
              >
                <X size={24} />
              </button>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedCertImage(null)}
                className="relative pointer-events-auto max-w-full max-h-[90vh] md:max-h-[95vh] flex items-center justify-center cursor-zoom-out"
              >
                <img 
                  src={selectedCertImage} 
                  alt="Sertifikasi" 
                  className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain select-none shadow-2xl rounded-lg pointer-events-none"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
