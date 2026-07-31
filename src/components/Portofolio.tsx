import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  FolderGit2, 
  X, 
  ExternalLink, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Eye, 
  Sparkles,
  Code2,
  Tag,
  Globe,
  ChevronDown
} from 'lucide-react';
import { ApiService } from '../services/api';
import { Project } from '../types';
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { PortfolioImage } from './PortfolioImage';

const fallbackProjects: Project[] = [];

const normalizePortfolioItem = (item: any): Project => {
  let teknologiList: string[] = [];
  if (Array.isArray(item.teknologi)) {
    teknologiList = item.teknologi.map(t => String(t).trim()).filter(Boolean);
  } else if (typeof item.teknologi === 'string') {
    try {
      const parsed = JSON.parse(item.teknologi);
      if (Array.isArray(parsed)) {
        teknologiList = parsed.map(t => String(t).trim()).filter(Boolean);
      } else {
        teknologiList = item.teknologi.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    } catch {
      teknologiList = item.teknologi.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }

  let fiturList: string[] = [];
  if (Array.isArray(item.fitur)) {
    fiturList = item.fitur.map(f => String(f).trim()).filter(Boolean);
  } else if (typeof item.fitur === 'string') {
    try {
      const parsed = JSON.parse(item.fitur);
      if (Array.isArray(parsed)) {
        fiturList = parsed.map(f => String(f).trim()).filter(Boolean);
      } else {
        fiturList = item.fitur.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    } catch {
      fiturList = item.fitur.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }

  let gambar = item.gambar || item.image || item.foto || item.thumbnail || '';
  const link = item.link || item.demoUrl || item.demo_url || item.tautan || item.url || item.github || '';
  const kategori = item.kategori || item.category || 'Aplikasi';

  // "jika kategori adalah web maka buatkan agar gambar yang di tampilkan adalah dari metatag website itu atau thumbnail website itu secara otomatis di render nya"
  if (!gambar && link && kategori.toLowerCase().includes('web')) {
    gambar = `https://image.thum.io/get/width/1280/crop/800/${link}`;
  }

  return {
    id: String(item.id || Math.random()),
    judul: item.judul || item.title || item.nama || 'Portofolio Proyek',
    kategori,
    deskripsi: item.deskripsi || item.description || '',
    gambar,
    tanggal: item.tanggal || item.date || item.tahun || '',
    teknologi: teknologiList,
    fitur: fiturList,
    link,
  };
};

export default function Portofolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [resolvedImages, setResolvedImages] = useState<Record<string, string>>({});

  useEffect(() => {
    setShowAll(false);
  }, [selectedCategory]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useBodyScrollLock(!!selectedProject || !!selectedImageModal);

  useEffect(() => {
    if (projects.length === 0) return;

    const webProjects = projects.filter(p => 
      p.link && 
      p.kategori?.toLowerCase().includes('web')
    );

    webProjects.forEach(async (project) => {
      const link = project.link;
      const cacheKey = `resolved_img_${link}`;
      
      // Check localStorage first
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setResolvedImages(prev => ({ ...prev, [project.id]: cached }));
        return;
      }

      // If not cached, fetch from microlink
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(link)}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const resJson = await response.json();
          if (resJson.status === 'success' && resJson.data?.image?.url) {
            const ogImage = resJson.data.image.url;
            localStorage.setItem(cacheKey, ogImage);
            setResolvedImages(prev => ({ ...prev, [project.id]: ogImage }));
            return;
          }
        }
      } catch (err) {
        console.warn(`Error fetching metatag for ${link}:`, err);
      }

      // Fallback to thum.io thumbnail if fetch fails or no og:image found
      const fallbackUrl = `https://image.thum.io/get/width/1280/crop/800/${link}`;
      localStorage.setItem(cacheKey, fallbackUrl);
      setResolvedImages(prev => ({ ...prev, [project.id]: fallbackUrl }));
    });
  }, [projects]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    ApiService.get<any>('portofolio')
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const normalized = res.data.map(normalizePortfolioItem);
          setProjects(normalized);
        } else {
          setProjects(fallbackProjects);
        }
      })
      .catch((err) => {
        console.error('Gagal memuat data portofolio dari database:', err);
        if (isMounted) setProjects(fallbackProjects);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.kategori) set.add(p.kategori);
    });
    return ['Semua', ...Array.from(set)];
  }, [projects]);

  // Filter projects by active category tab
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'Semua') return projects;
    return projects.filter((p) => p.kategori === selectedCategory);
  }, [projects, selectedCategory]);

  const displayedProjects = useMemo(() => {
    if (isMobile || showAll) return filteredProjects;
    return filteredProjects.slice(0, 4);
  }, [filteredProjects, isMobile, showAll]);

  return (
    <section id="portofolio" className="py-3 md:py-16 bg-white dark:bg-slate-950 relative border-t-0 md:border-t border-slate-100 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-4 md:mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-auto"
          >
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-950 dark:text-slate-50 text-center md:text-left">
              Portofolio Proyek
            </h2>
          </motion.div>

          {/* Category Filter Tabs */}
          {categories.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar"
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = cat === 'Semua' ? projects.length : projects.filter(p => p.kategori === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-[#02227E] text-white shadow-sm scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 animate-pulse space-y-4">
                <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-8">
            <Folder className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Belum ada portofolio</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Data portofolio untuk kategori {selectedCategory} belum tersedia di database.
            </p>
          </div>
        ) : (
          <>
            {/* Portfolio Grid / Mobile Slider */}
            <div className="flex md:grid overflow-x-auto md:overflow-x-visible md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 pb-5 md:pb-0 snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar">
            {displayedProjects.map((item, index) => {
              const techList = Array.isArray(item.teknologi) ? item.teknologi : [];
              const imageUrl = resolvedImages[item.id] || item.gambar || undefined;
 
              return (
                <div
                  key={item.id || index}
                  onClick={() => setSelectedProject(item)}
                  className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col cursor-pointer w-[80vw] sm:w-[45vw] md:w-full shrink-0 md:shrink snap-start snap-always"
                >
                  {/* Image Container */}
                  {imageUrl && (
                    <div className="relative aspect-video bg-gradient-to-br from-slate-50 to-slate-150 dark:from-slate-900 dark:to-slate-950 overflow-hidden border-b border-slate-100 dark:border-slate-800/80">
                      <PortfolioImage
                        src={imageUrl}
                        alt={item.judul}
                        kategori={item.kategori}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        showHoverOverlay={true}
                      />
                    </div>
                  )}
 
                  {/* Content Section */}
                  <div className="p-5 lg:p-4 text-left space-y-2 lg:space-y-1.5 flex-grow flex flex-col justify-between">
                    <div className="space-y-1.5 lg:space-y-1">
                      {item.kategori && (
                        <p className="text-[11px] lg:text-[10px] font-light uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          {item.kategori}
                        </p>
                      )}
 
                      <h3 
                        className="text-base md:text-lg lg:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-accent transition-colors leading-snug"
                      >
                        {item.judul}
                      </h3>
 
                       {!imageUrl && item.deskripsi && (
                         <p className="text-xs md:text-sm lg:text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                           {item.deskripsi}
                         </p>
                       )}
                     </div>
 
                     {/* Tech Stack Tags */}
                     {!imageUrl && techList.length > 0 && (
                       <div className="flex flex-wrap gap-1.5 pt-1.5">
                         {techList.slice(0, 4).map((tech, i) => (
                           <span
                             key={i}
                             className="px-2 py-0.5 text-[10px] lg:text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200/60 dark:border-slate-700/60"
                           >
                             {tech}
                           </span>
                         ))}
                         {techList.length > 4 && (
                           <span className="px-1.5 py-0.5 text-[10px] lg:text-[9px] font-bold text-slate-400">
                             +{techList.length - 4}
                           </span>
                         )}
                       </div>
                     )}
                   </div>
                 </div>
               );
             })}
           </div>
           {/* Subtle Mobile Horizontal Swipe Cue */}
           {!loading && filteredProjects.length > 1 && (
             <div className="flex md:hidden justify-center items-center gap-1 mt-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 select-none">
               <span>Geser untuk melihat proyek lainnya</span>
               <span>→</span>
             </div>
           )}
            {/* Show All Projects Button (Desktop Only) */}
            {!isMobile && filteredProjects.length > 4 && !showAll && (
              <div className="flex justify-center mt-10">
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="flex items-center gap-1.5 text-sm md:text-base font-medium text-slate-500 hover:text-[#02227E] dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  Tampilkan semua
                  <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </button>
              </div>
            )}
        </>
        )}
      </div>

      {/* Detail Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 transition-all duration-300">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setSelectedProject(null)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative w-full bg-white dark:bg-slate-900 shadow-2xl z-10 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl m-auto ${
                isMobile 
                  ? 'max-h-[85vh] h-[85vh]' 
                  : 'max-w-4xl h-[600px] max-h-[85vh]'
              }`}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-40 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white/85 dark:bg-slate-800/85 rounded-full backdrop-blur-xs shadow-md transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {isMobile ? (
                /* Mobile Layout: everything scrollable in a single container except the sticky footer */
                <div className="flex-grow flex flex-col overflow-hidden h-full relative">
                  {/* Scrollable area containing both image and details */}
                  <div className="flex-grow overflow-y-auto">
                    {/* Edge-to-edge Image */}
                    {(resolvedImages[selectedProject.id] || selectedProject.gambar) && (
                      <div 
                        className="relative w-full aspect-video bg-slate-100 dark:bg-slate-950 overflow-hidden cursor-pointer group"
                        onClick={() => setSelectedImageModal(resolvedImages[selectedProject.id] || selectedProject.gambar)}
                      >
                        <PortfolioImage
                          src={resolvedImages[selectedProject.id] || selectedProject.gambar}
                          alt={selectedProject.judul}
                          kategori={selectedProject.kategori}
                          className="w-full h-full object-cover object-center bg-slate-100 dark:bg-slate-950"
                        />
                        <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center">
                          <span className="px-3 py-1.5 bg-slate-950/80 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                            <Eye className="w-4 h-4" /> Perbesar Gambar
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Details Contents */}
                    <div className="p-6 space-y-6 text-left">
                      {/* Header Info */}
                      <div className="space-y-1">
                        {selectedProject.kategori && (
                          <p className="text-xs font-light uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            {selectedProject.kategori}
                          </p>
                        )}

                        <h2 className="text-xl font-extrabold text-slate-950 dark:text-slate-50 leading-tight">
                          {selectedProject.judul}
                        </h2>
                      </div>

                      {/* Description */}
                      {selectedProject.deskripsi && (
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-accent" /> Deskripsi Proyek
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {selectedProject.deskripsi}
                          </p>
                        </div>
                      )}

                      {/* Key Features */}
                      {Array.isArray(selectedProject.fitur) && selectedProject.fitur.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Fitur &amp; Keunggulan Utama
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedProject.fitur.map((feat, idx) => (
                              <div 
                                key={idx} 
                                className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tech Stack */}
                      {Array.isArray(selectedProject.teknologi) && selectedProject.teknologi.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <Code2 className="w-4 h-4 text-blue-500" /> Teknologi &amp; Tooling
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.teknologi.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sticky Footer */}
                  {selectedProject.link && (
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0 flex items-center justify-center z-20 sticky bottom-0">
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-6 py-3 bg-[#02227E] hover:bg-[#02227E]/90 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center"
                      >
                        Buka Portofolio
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                /* Desktop Layout: Split 3:4 left image, scrollable right column, sticky footer */
                <div className="flex-grow flex flex-row overflow-hidden h-full">
                  {/* Left Column: Image (100% height) */}
                  {(resolvedImages[selectedProject.id] || selectedProject.gambar) && (
                    <div 
                      className="w-[360px] h-full relative cursor-pointer group bg-slate-100 dark:bg-slate-950 overflow-hidden shrink-0 border-r border-slate-100 dark:border-slate-800"
                      onClick={() => {
                        const targetImg = resolvedImages[selectedProject.id] || selectedProject.gambar;
                        const isWeb = targetImg.includes('thum.io') || selectedProject.kategori.toLowerCase().includes('web');
                        let modalSrc = targetImg;
                        if (isWeb) {
                          if (targetImg.includes('thum.io')) {
                            const match = targetImg.match(/thum\.io\/get\/(?:.*\/)?(https?:\/\/.*)/);
                            if (match && match[1]) {
                              modalSrc = `https://image.thum.io/get/viewportWidth/400/width/400/crop/800/${match[1]}`;
                            } else {
                              modalSrc = targetImg.replace('width/1280/crop/800', 'viewportWidth/400/width/400/crop/800');
                            }
                          } else if (targetImg.startsWith('http')) {
                            modalSrc = `https://image.thum.io/get/viewportWidth/400/width/400/crop/800/${targetImg}`;
                          }
                        }
                        setSelectedImageModal(modalSrc);
                      }}
                    >
                      <PortfolioImage
                        src={resolvedImages[selectedProject.id] || selectedProject.gambar}
                        alt={selectedProject.judul}
                        kategori={selectedProject.kategori}
                        className="w-full h-full object-cover object-center bg-slate-100 dark:bg-slate-950"
                        forceMobile={true}
                      />
                      <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-slate-950/80 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                          <Eye className="w-4 h-4" /> Perbesar Gambar
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Right Column: Details & Sticky Pinned Footer */}
                  <div className="flex-grow flex flex-col overflow-hidden h-full relative">
                    {/* Scrollable details contents */}
                    <div className="flex-grow overflow-y-auto p-8 space-y-6 text-left">
                      {/* Header Info */}
                      <div className="space-y-1">
                        {selectedProject.kategori && (
                          <p className="text-xs font-light uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            {selectedProject.kategori}
                          </p>
                        )}

                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-950 dark:text-slate-50 leading-tight">
                          {selectedProject.judul}
                        </h2>
                      </div>

                      {/* Description */}
                      {selectedProject.deskripsi && (
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-accent" /> Deskripsi Proyek
                          </h4>
                          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {selectedProject.deskripsi}
                          </p>
                        </div>
                      )}

                      {/* Key Features */}
                      {Array.isArray(selectedProject.fitur) && selectedProject.fitur.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Fitur &amp; Keunggulan Utama
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {selectedProject.fitur.map((feat, idx) => (
                              <div 
                                key={idx} 
                                className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tech Stack */}
                      {Array.isArray(selectedProject.teknologi) && selectedProject.teknologi.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <Code2 className="w-4 h-4 text-blue-500" /> Teknologi &amp; Tooling
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.teknologi.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sticky Pinned Footer with Action Link */}
                    {selectedProject.link && (
                      <div className="p-4 md:px-8 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0 flex items-center justify-end z-20 sticky bottom-0">
                        <a
                          href={selectedProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-6 py-3 bg-[#02227E] hover:bg-[#02227E]/90 text-white font-bold text-xs md:text-sm rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer active:scale-95 text-center"
                        >
                          Buka Portofolio
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal for Fullscreen Image */}
      <AnimatePresence>
        {selectedImageModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
              onClick={() => setSelectedImageModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh] z-10 flex items-center justify-center"
            >
              <button
                type="button"
                onClick={() => setSelectedImageModal(null)}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2 cursor-pointer"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={selectedImageModal}
                alt="Fullscreen Preview"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
