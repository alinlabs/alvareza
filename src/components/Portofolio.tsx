import { ApiService } from '../services/api';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Globe, HardDrive, Folder, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Project } from '../types';
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { MobileSlider } from './MobileSlider';

export default function Portofolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useBodyScrollLock(!!selectedProject);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    ApiService.get<any>('portofolio').then(res => res.data)
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load portofolio data", err));
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const renderCard = (project: Project, index: number) => {
    const rawImageUrl = project.gambar || (project as any).image;
    const imageUrl = rawImageUrl && rawImageUrl.trim() !== '' ? rawImageUrl : null;
    
    return (
      <motion.article
        key={project.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onClick={() => setSelectedProject(project)}
        className="group relative flex flex-col rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full w-full overflow-hidden aspect-video bg-slate-800"
      >
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={project.judul}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Gradient Overlay dari bawah ke atas sedikit saja */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                {project.judul}
              </h3>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-6">
            <h3 className="text-sm md:text-base font-bold text-white text-center leading-snug line-clamp-3">
              {project.judul}
            </h3>
          </div>
        )}
      </motion.article>
    );
  };

  const renderContainer = (data: Project[]) => {
    if (isMobile) {
      return <MobileSlider data={data} renderCard={renderCard} chunkSize={2} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(!expanded ? data.slice(0, 6) : data).map((item, index) => renderCard(item, index))}
        </div>
        {data.length > 6 && (
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-500 transition-colors"
            >
              {expanded ? (
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

  const validProjects = (projects || []).filter(p => p.id && p.id.trim() !== "" && p.judul && p.judul.trim() !== "");

  if ((validProjects || []).length === 0) return null;

  return (
    <section id="portofolio" className="py-4 md:py-5 bg-white relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
        <div className="mb-6 md:mb-8 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[20px] md:text-[25px] lg:text-[30px] font-extrabold text-slate-950 tracking-tight flex items-center justify-start gap-2">
              <Folder className="text-accent w-6 h-6 shrink-0" />
              <span>Portofolio</span>
            </h2>
          </motion.div>
        </div>

        {(validProjects || []).length > 0 && (
          <div>
            {renderContainer(validProjects)}
          </div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (() => {
          const rawImageUrl = selectedProject.gambar || (selectedProject as any).image;
          const imageUrl = rawImageUrl && rawImageUrl.trim() !== '' ? rawImageUrl : null;
          
          // Group technologies by category
          const groupedTechs = (() => {
            const groups: { [key: string]: string[] } = {};
            const list = selectedProject.teknologi || [];
            
            list.forEach(tech => {
              if (tech.includes(':')) {
                const parts = tech.split(':');
                const category = parts[0].trim();
                const name = parts.slice(1).join(':').trim();
                if (category && name) {
                  if (!groups[category]) {
                    groups[category] = [];
                  }
                  groups[category].push(name);
                  return;
                }
              }
              
              const defaultCat = 'Alat / Teknologi';
              if (!groups[defaultCat]) {
                groups[defaultCat] = [];
              }
              groups[defaultCat].push(tech.trim());
            });
            
            return Object.keys(groups).map(category => ({
              category,
              items: groups[category]
            }));
          })();

          return (
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
                onClick={() => setSelectedProject(null)}
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="relative w-full max-w-2xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col mt-auto md:mt-0 max-h-[92vh] overflow-hidden"
              >
                {/* 16:9 Landscape Image Header */}
                <div className="relative w-full aspect-video bg-slate-800 overflow-hidden shrink-0">
                  {imageUrl ? (
                    <>
                      <img 
                        src={imageUrl} 
                        alt={selectedProject.judul}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {/* Premium Ambient Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-6 md:p-8">
                        <h4 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight pr-8">
                          {selectedProject.judul}
                        </h4>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-end p-6 md:p-8">
                      <h4 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight pr-8">
                        {selectedProject.judul}
                      </h4>
                    </div>
                  )}

                  {/* Soft Floating Close Button */}
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 p-2 bg-slate-900/50 hover:bg-slate-900/70 text-white rounded-full transition-colors backdrop-blur-xs shadow-md z-10 cursor-pointer"
                    title="Tutup"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Scrollable Content */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                  {selectedProject.kategori && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full">
                      <Folder className="w-3.5 h-3.5" />
                      <span>{selectedProject.kategori}</span>
                    </div>
                  )}

                  {/* Deskripsi */}
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                      {selectedProject.deskripsi}
                    </p>
                  </div>

                  {/* Fitur Utama */}
                  {selectedProject.fitur && selectedProject.fitur.length > 0 && (
                    <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-2.5">
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fitur Utama</h5>
                      <ul className="grid grid-cols-1 gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">
                        {selectedProject.fitur.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0 mt-1.5"></span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Grouped Tools/Tech */}
                  {groupedTechs.length > 0 && (
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alat & Bahan Pendukung</h5>
                      <div className="grid grid-cols-1 gap-3.5">
                        {groupedTechs.map((group, gIdx) => (
                          <div key={gIdx} className="flex flex-col gap-1.5 border-l-2 border-slate-100 pl-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {group.category}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {group.items.map((item, itemIdx) => (
                                <span key={itemIdx} className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Buttons - Kunjungi Proyek only, NO GitHub */}
                  {(selectedProject.link || selectedProject.demoUrl || selectedProject.demo_url || selectedProject.tautan) && (
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <a 
                        href={(selectedProject.link || selectedProject.demoUrl || selectedProject.demo_url || selectedProject.tautan)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-accent/10"
                      >
                        <ExternalLink size={16} />
                        Kunjungi Proyek
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
