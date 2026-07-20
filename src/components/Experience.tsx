import { ApiService } from '../services/api';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, X, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Experience as ExperienceType, OrganizationExperience, Collaboration } from '../types';
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { MobileSlider } from './MobileSlider';

const filterTahun = (t: string | undefined | null) => {
  if (!t) return '';
  const text = t.trim();
  const lower = text.toLowerCase();
  if (lower === 'sekarang' || lower === 'kini' || lower === 'present' || lower === 'tidak disebutkan') return '';
  return text;
};

export default function Experience() {
  const [selectedExp, setSelectedExp] = useState<ExperienceType | null>(null);
  const [selectedOrgExp, setSelectedOrgExp] = useState<OrganizationExperience | null>(null);
  const [selectedCollab, setSelectedCollab] = useState<Collaboration | null>(null);
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [kerjasamaExperiences, setKerjasamaExperiences] = useState<Collaboration[]>([]);
  const [organizationExperiences, setOrganizationExperiences] = useState<OrganizationExperience[]>([]);
  
  const [activeTab, setActiveTab] = useState<'profesi' | 'kerjasama' | 'organisasi'>('profesi');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeExpModalTab, setActiveExpModalTab] = useState<'ringkasan' | 'tugas' | 'spesialisasi'>('ringkasan');
  const [activeCollabModalTab, setActiveCollabModalTab] = useState<'ringkasan' | 'detail'>('ringkasan');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPaklaringImage, setSelectedPaklaringImage] = useState<string | null>(null);
  useBodyScrollLock(!!selectedExp || !!selectedOrgExp || !!selectedCollab || !!selectedPaklaringImage);

  const renderGridPeriode = (periode: any) => {
    if (!periode) return null;
    let masuk = '';
    let keluar = '';
    if (typeof periode === 'object') {
      masuk = filterTahun(periode.masuk);
      keluar = filterTahun(periode.keluar);
    } else if (typeof periode === 'string') {
      if (periode.includes('-')) {
        const parts = periode.split('-');
        masuk = filterTahun(parts[0]);
        keluar = filterTahun(parts[1]);
      } else {
        masuk = filterTahun(periode);
      }
    }
    
    if (!masuk && !keluar) return null;

    if (masuk && keluar && masuk !== keluar) {
      return (
        <div className="flex flex-col text-right text-[10px] font-medium text-slate-400 dark:text-slate-500">
          <span>{masuk}</span>
          <span>{keluar}</span>
        </div>
      );
    } else {
      return (
        <div className="text-right text-[10px] font-medium text-slate-400 dark:text-slate-500">
          {masuk || keluar}
        </div>
      );
    }
  };

  const renderModalPeriode = (periode: any, isOrg = false) => {
    if (!periode) return null;
    let masuk = '';
    let keluar = '';
    if (typeof periode === 'object') {
      masuk = filterTahun(periode.masuk);
      keluar = filterTahun(periode.keluar);
    } else if (typeof periode === 'string') {
      if (periode.includes('-')) {
        const parts = periode.split('-');
        masuk = filterTahun(parts[0]);
        keluar = filterTahun(parts[1]);
      } else {
        masuk = filterTahun(periode);
      }
    }
    
    if (!masuk && !keluar) return null;

    const baseClass = isOrg 
      ? "text-right text-sm font-light text-slate-500 dark:text-slate-400 mt-1"
      : "text-right text-xs md:text-sm font-light text-slate-500 dark:text-slate-400 h-full flex flex-col justify-center";
    const flexClass = isOrg 
      ? "flex flex-col text-right text-sm font-light text-slate-500 dark:text-slate-400 mt-1" 
      : "flex flex-col justify-center text-right text-xs md:text-sm font-light text-slate-500 dark:text-slate-400 h-full";

    if (masuk && keluar && masuk !== keluar) {
      return (
        <div className={flexClass}>
          <span>{masuk}</span>
          <span>{keluar}</span>
        </div>
      );
    } else {
      return (
        <div className={baseClass}>
          <span>{masuk || keluar}</span>
        </div>
      );
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpand = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const tabs = [
    { id: 'profesi', label: 'Profesi' },
    { id: 'kerjasama', label: 'Kerjasama' },
    { id: 'organisasi', label: 'Organisasi' }
  ];

  useEffect(() => {
    ApiService.get<any>('pengalaman-profesi').then(res => res.data)
      .then(data => setExperiences(data))
      .catch(err => console.error("Failed to load profesi data", err));

    ApiService.get<any>('pengalaman-kerjasama').then(res => res.data)
      .then(data => setKerjasamaExperiences(data))
      .catch(err => console.error("Failed to load kerjasama data", err));

    ApiService.get<any>('pengalaman-organisasi').then(res => res.data)
      .then(data => setOrganizationExperiences(data))
      .catch(err => console.error("Failed to load organisasi data", err));
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedExp || selectedOrgExp || selectedCollab) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedExp, selectedOrgExp, selectedCollab]);

  const renderExpCard = (exp: ExperienceType, index: number) => (
    <motion.div 
      key={exp.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="cursor-pointer h-full"
      onClick={() => setSelectedExp(exp)}
    >
      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full flex items-center gap-3">
        {exp.logoUrl ? (
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
            <img src={exp.logoUrl} alt={exp.perusahaan} className="w-full h-full object-contain p-1.5 grayscale" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              {exp.tingkatan}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-950 dark:text-slate-50 leading-tight mb-0.5 truncate">{exp.peran}</h4>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-[11px] truncate">{exp.perusahaan}</p>
        </div>
        <div className="shrink-0 flex items-start ml-2">
          {renderGridPeriode({masuk: exp.mulai, keluar: exp.selesai})}
        </div>
      </div>
    </motion.div>
  );

  const renderOrgCard = (exp: OrganizationExperience, index: number) => (
    <motion.div 
      key={exp.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="cursor-pointer h-full"
      onClick={() => setSelectedOrgExp(exp)}
    >
      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full flex items-center gap-3">
        {exp.logoUrl ? (
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
            <img src={exp.logoUrl} alt={exp.organisasi} className="w-full h-full object-contain p-1.5 grayscale" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="text-sm font-bold text-slate-950 dark:text-slate-50 leading-tight mb-0.5 truncate">{exp.peran}</h4>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-[11px] truncate">{exp.organisasi}</p>
        </div>
        <div className="shrink-0 flex items-start ml-2">
          {renderGridPeriode({masuk: exp.mulai, keluar: exp.selesai})}
        </div>
      </div>
    </motion.div>
  );

  const renderExpContainer = (data: ExperienceType[], section: string) => {
    if (isMobile) {
      return <MobileSlider data={data} renderCard={renderExpCard} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(!expandedSections[section] ? data.slice(0, 6) : data).map((exp, index) => renderExpCard(exp, index))}
        </div>
        {data.length > 6 && (
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => toggleExpand(section)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:text-slate-400 transition-colors"
            >
              {expandedSections[section] ? (
                <>Sembunyikan sebagian <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Tampilkan semua <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </>
    );
  };

  const renderOrgContainer = (data: OrganizationExperience[], section: string) => {
    if (isMobile) {
      return <MobileSlider data={data} renderCard={renderOrgCard} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(!expandedSections[section] ? data.slice(0, 6) : data).map((exp, index) => renderOrgCard(exp, index))}
        </div>
        {data.length > 6 && (
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => toggleExpand(section)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:text-slate-400 transition-colors"
            >
              {expandedSections[section] ? (
                <>Sembunyikan sebagian <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Tampilkan semua <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </>
    );
  };

  const renderCollabCard = (collab: Collaboration, index: number) => (
    <motion.div 
      key={collab.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="cursor-pointer h-full"
      onClick={() => {
        setSelectedCollab(collab);
        setActiveCollabModalTab('ringkasan');
      }}
    >
      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full flex items-center gap-3">
        {collab.logoUrl ? (
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
            <img src={collab.logoUrl} alt={collab.partner} className="w-full h-full object-contain p-1.5 grayscale" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              {collab.peran}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-950 dark:text-slate-50 leading-tight mb-0.5 truncate">{collab.proyek}</h4>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-[11px] truncate">{collab.partner}</p>
        </div>
        <div className="shrink-0 flex items-start ml-2">
          {renderGridPeriode({masuk: collab.mulai, keluar: collab.selesai})}
        </div>
      </div>
    </motion.div>
  );

  const renderCollabContainer = (data: Collaboration[], section: string) => {
    if (isMobile) {
      return <MobileSlider data={data} renderCard={renderCollabCard} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(!expandedSections[section] ? data.slice(0, 6) : data).map((collab, index) => renderCollabCard(collab, index))}
        </div>
        {data.length > 6 && (
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => toggleExpand(section)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:text-slate-400 transition-colors"
            >
              {expandedSections[section] ? (
                <>Sembunyikan sebagian <ChevronUp className="w-4 h-4" /></>
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
    <section id="experience" className="py-4 md:py-5 bg-slate-50 dark:bg-slate-900 relative">
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
              <Briefcase className="text-accent w-6 h-6 shrink-0" />
              <span>Pengalaman</span>
            </h2>
          </motion.div>

          <div 
            className="flex flex-nowrap gap-1.5 justify-start md:justify-end bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm w-full md:w-auto overflow-x-auto md:overflow-visible [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 md:flex-none whitespace-nowrap flex justify-center items-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-accent text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 dark:text-slate-100 hover:bg-white dark:bg-slate-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12 md:space-y-16">
          {/* Work Experience */}
          {experiences && experiences.length > 0 && activeTab === 'profesi' && (
            <div>
              <div className="hidden">
                <h3 className="text-lg md:text-xl font-bold text-slate-950 dark:text-slate-50">Pengalaman Kerja Profesi</h3>
              </div>
              {renderExpContainer(experiences, 'profesi')}
            </div>
          )}

          {/* Project Based / Kerjasama */}
          {(kerjasamaExperiences?.length > 0) && activeTab === 'kerjasama' && (
            <div>
              <div className="hidden">
                <h3 className="text-lg md:text-xl font-bold text-slate-950 dark:text-slate-50">Kerjasama</h3>
              </div>
              {renderCollabContainer(kerjasamaExperiences, 'kerjasama')}
            </div>
          )}
          
          {/* Organization Experience */}
          {organizationExperiences && organizationExperiences.length > 0 && activeTab === 'organisasi' && (
            <div>
              <div className="hidden">
                <h3 className="text-lg md:text-xl font-bold text-slate-950 dark:text-slate-50">Pengalaman Organisasi</h3>
              </div>
              {renderOrgContainer(organizationExperiences, 'organisasi')}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedExp && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExp(null)}
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
                <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white dark:bg-slate-950" onClick={() => setSelectedExp(null)}>
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                </div>
                <div className="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm px-4 md:px-6 pt-2 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between rounded-t-3xl md:rounded-t-2xl z-10">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 pr-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                      {selectedExp.logoUrl ? (
                        <img src={selectedExp.logoUrl} alt={`${selectedExp.perusahaan} logo`} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Briefcase className="w-6 h-6 md:w-7 md:h-7 text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-slate-950 dark:text-slate-50 leading-tight">{selectedExp.peran}</h3>
                      <p className="text-accent text-sm md:text-base font-medium mt-0.5">
                        {selectedExp.perusahaan}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {renderModalPeriode({masuk: selectedExp.mulai, keluar: selectedExp.selesai}, false)}
                    <button 
                      onClick={() => setSelectedExp(null)}
                      className="p-1.5 md:p-2 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:text-slate-50 rounded-full transition-colors"
                    >
                      <X size={18} className="md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-[72px] sm:top-[76px] md:top-[88px] z-10 px-2 shrink-0 shadow-sm">
                  <button
                    onClick={() => setActiveExpModalTab('ringkasan')}
                    className={`flex-1 py-3 text-[11px] font-bold border-b-2 transition-colors ${activeExpModalTab === 'ringkasan' ? 'border-accent text-accent' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200'}`}
                  >
                    Ringkasan
                  </button>
                  <button
                    onClick={() => setActiveExpModalTab('tugas')}
                    className={`flex-1 py-3 text-[11px] font-bold border-b-2 transition-colors ${activeExpModalTab === 'tugas' ? 'border-accent text-accent' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200'}`}
                  >
                    Tugas
                  </button>
                  <button
                    onClick={() => setActiveExpModalTab('spesialisasi')}
                    className={`flex-1 py-3 text-[11px] font-bold border-b-2 transition-colors ${activeExpModalTab === 'spesialisasi' ? 'border-accent text-accent' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200'}`}
                  >
                    Spesialisasi
                  </button>
                </div>
                
                <div className="px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
                  {activeExpModalTab === 'spesialisasi' && selectedExp.spesialisasi && selectedExp.spesialisasi.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-[15px] md:text-lg font-bold text-slate-950 dark:text-slate-50 mb-3">Spesialisasi</h4>
                      <ul className="space-y-3">
                        {selectedExp.spesialisasi.map((spec, i) => (
                          <li key={i} className="text-slate-600 dark:text-slate-400 text-[13px] md:text-sm leading-relaxed flex items-start gap-3">
                            <span className="text-accent mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-accent"></span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activeExpModalTab === 'tugas' && (
                    <>
                      {selectedExp.deskripsi && (
                        <div className="mb-6">
                          <h4 className="text-[15px] md:text-lg font-bold text-slate-950 dark:text-slate-50 mb-3">Deskripsi Pekerjaan</h4>
                          <p className="text-slate-600 dark:text-slate-400 text-[13px] md:text-sm leading-relaxed">
                            {selectedExp.deskripsi}
                          </p>
                        </div>
                      )}
                      {selectedExp.tugasTanggungJawab && selectedExp.tugasTanggungJawab.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-[15px] md:text-lg font-bold text-slate-950 dark:text-slate-50 mb-3">Tugas & Tanggung Jawab</h4>
                          <ul className="space-y-3">
                            {selectedExp.tugasTanggungJawab.map((tugas, i) => (
                              <li key={i} className="text-slate-600 dark:text-slate-400 text-[13px] md:text-sm leading-relaxed flex items-start gap-3">
                                <span className="text-accent mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-accent"></span>
                                <span>{tugas}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                  {activeExpModalTab === 'ringkasan' && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[15px] md:text-lg font-bold text-slate-950 dark:text-slate-50">Ringkasan</h4>
                        {selectedExp.paklaring && (
                          <button 
                            onClick={() => setSelectedPaklaringImage(selectedExp.paklaring!)}
                            className="text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 hover:text-accent font-medium transition-colors cursor-pointer"
                          >
                            Lihat Paklaring
                          </button>
                        )}
                      </div>
                      
                      <div className="mb-6 space-y-4">
                        <div>
                          <p className="text-xs font-light text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Nama Perusahaan</p>
                          <p className="text-[12px] md:text-sm font-medium text-slate-700 dark:text-slate-300">{selectedExp.perusahaan}</p>
                        </div>
                        {selectedExp.industri && (
                          <div>
                            <p className="text-xs font-light text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Industri Bidang</p>
                            <p className="text-[12px] md:text-sm font-medium text-slate-700 dark:text-slate-300">{selectedExp.industri}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-light text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Posisi</p>
                          <p className="text-[12px] md:text-sm font-medium text-slate-700 dark:text-slate-300">{selectedExp.peran}</p>
                        </div>
                        {selectedExp.tingkatan && (
                          <div>
                            <p className="text-xs font-light text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Level</p>
                            <p className="text-[12px] md:text-sm font-medium text-slate-700 dark:text-slate-300">{selectedExp.tingkatan}</p>
                          </div>
                        )}
                      </div>

                      {selectedExp.ringkasan && selectedExp.ringkasan.length > 0 && (
                        <>
                          <h4 className="text-[15px] md:text-lg font-bold text-slate-950 dark:text-slate-50 mb-4">Aktivitas Utama</h4>
                          <div className="space-y-4">
                            {selectedExp.ringkasan.map((item, i) => (
                              <div key={i}>
                                <div className="flex justify-between text-[12px] md:text-sm mb-1">
                                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.pekerjaan}</span>
                                  <span className="text-slate-500 dark:text-slate-400">{item.persentase}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 md:h-2 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-accent h-full rounded-full"
                                    style={{ width: `${item.persentase}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrgExp && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrgExp(null)}
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
                <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white dark:bg-slate-950" onClick={() => setSelectedOrgExp(null)}>
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                </div>
                <div className="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm px-4 md:px-6 pt-2 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between rounded-t-3xl md:rounded-t-2xl z-10">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 pr-4">
                    {selectedOrgExp.logoUrl ? (
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={selectedOrgExp.logoUrl} alt={selectedOrgExp.organisasi} className="w-full h-full object-contain p-1.5" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6 md:w-7 md:h-7 text-slate-400 dark:text-slate-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-slate-950 dark:text-slate-50 leading-tight">{selectedOrgExp.peran}</h3>
                      <p className="text-sm md:text-base text-accent font-medium mt-0.5">{selectedOrgExp.organisasi}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 shrink-0">
                    {renderModalPeriode({masuk: selectedOrgExp.mulai, keluar: selectedOrgExp.selesai}, true)}
                    <button 
                      onClick={() => setSelectedOrgExp(null)}
                      className="p-2 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:text-slate-50 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="px-6 py-6 overflow-y-auto">
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-slate-950 dark:text-slate-50 mb-3">Deskripsi</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {selectedOrgExp.deskripsi}
                    </p>
                  </div>

                  {selectedOrgExp.pencapaian && selectedOrgExp.pencapaian?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-slate-950 dark:text-slate-50 mb-4">Pencapaian Kinerja</h4>
                      <div className="space-y-4">
                        {selectedOrgExp.pencapaian?.map((item, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-slate-700 dark:text-slate-300">{item.pekerjaan}</span>
                              <span className="text-slate-500 dark:text-slate-400">{item.persentase}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-accent h-full rounded-full" 
                                style={{ width: `${item.persentase}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCollab && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCollab(null)}
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
                <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white dark:bg-slate-950" onClick={() => setSelectedCollab(null)}>
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                </div>
                
                {/* Header */}
                <div className="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm px-5 md:px-6 pt-3 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between rounded-t-3xl md:rounded-t-2xl z-10">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 pr-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                      {selectedCollab.logoUrl ? (
                        <img src={selectedCollab.logoUrl} alt={`${selectedCollab.partner} logo`} className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="w-full h-full bg-accent/5 flex items-center justify-center text-accent">
                          <Users className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base md:text-xl font-bold text-slate-950 dark:text-slate-50 leading-tight">{selectedCollab.proyek}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm font-medium mt-0.5">
                        {selectedCollab.partner}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {renderModalPeriode({masuk: selectedCollab.mulai, keluar: selectedCollab.selesai}, false)}
                    <button 
                      onClick={() => setSelectedCollab(null)}
                      className="p-1.5 md:p-2 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:text-slate-50 rounded-full transition-colors"
                    >
                      <X size={18} className="md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-[72px] sm:top-[76px] md:top-[88px] z-10 px-4 shrink-0 shadow-sm">
                  <button
                    onClick={() => setActiveCollabModalTab('ringkasan')}
                    className={`flex-1 py-3 text-[13px] font-bold border-b-2 transition-all duration-200 ${activeCollabModalTab === 'ringkasan' ? 'border-accent text-accent' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200'}`}
                  >
                    Ringkasan
                  </button>
                  <button
                    onClick={() => setActiveCollabModalTab('detail')}
                    className={`flex-1 py-3 text-[13px] font-bold border-b-2 transition-all duration-200 ${activeCollabModalTab === 'detail' ? 'border-accent text-accent' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200'}`}
                  >
                    Detail
                  </button>
                </div>
                
                {/* Content */}
                <div className="px-5 md:px-6 py-5 md:py-6 space-y-6 overflow-y-auto">
                  {activeCollabModalTab === 'ringkasan' && (
                    <>
                      <div className="flex items-center justify-between">
                        <h4 className="text-[14px] md:text-base font-bold text-slate-950 dark:text-slate-50">Ringkasan</h4>
                        {selectedCollab.paklaring && (
                          <button 
                            onClick={() => setSelectedPaklaringImage(selectedCollab.paklaring!)}
                            className="text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 hover:text-accent font-medium transition-colors cursor-pointer"
                          >
                            Lihat Paklaring
                          </button>
                        )}
                      </div>

                  {/* Tujuan Kerjasama */}
                  {selectedCollab.tujuan && selectedCollab.tujuan.length > 0 && (
                    <div>
                      <h4 className="text-[14px] md:text-base font-bold text-slate-950 dark:text-slate-50 mb-2.5">
                        Fokus Kerjasama
                      </h4>
                      <ul className="space-y-2.5">
                        {selectedCollab.tujuan.map((item, i) => (
                          <li key={i} className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed flex items-start gap-2.5">
                            <span className="text-accent mt-1 shrink-0 bg-accent/5 p-1 rounded-full">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            <span className="pt-0.5">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dampak */}
                  {selectedCollab.dampak && selectedCollab.dampak.length > 0 && (
                    <div>
                      <h4 className="text-[14px] md:text-base font-bold text-slate-950 dark:text-slate-50 mb-4">
                        Dampak
                      </h4>
                      <div className="space-y-4">
                        {selectedCollab.dampak.map((item, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-[12px] md:text-sm mb-1.5">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{item.indikator}</span>
                              <span className="font-bold text-accent">{item.persentase}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 md:h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-accent h-full rounded-full"
                                style={{ width: `${item.persentase}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                    </>
                  )}

                  {activeCollabModalTab === 'detail' && (
                    <>
                      {/* Rincian Informasi */}
                      <div>
                        <h4 className="text-[14px] md:text-base font-bold text-slate-950 dark:text-slate-50 mb-3">
                          Rincian Informasi
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800/60 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center py-1.5 border-b border-slate-100 dark:border-slate-800/40 gap-1">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mitra Kerjasama</span>
                            <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200">{selectedCollab.partner}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center py-1.5 border-b border-slate-100 dark:border-slate-800/40 gap-1">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Peran</span>
                            <span className="text-xs md:text-sm font-semibold text-accent">{selectedCollab.peran}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center py-1.5 border-b border-slate-100 dark:border-slate-800/40 gap-1">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Proyek</span>
                            <span className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200 text-left sm:text-right max-w-xs">{selectedCollab.proyek}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center py-1.5 border-b border-slate-100 dark:border-slate-800/40 gap-1">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bidang / Sektor</span>
                            <span className="text-xs md:text-sm font-medium text-slate-800 dark:text-slate-200">{selectedCollab.bidang}</span>
                          </div>
                          {(filterTahun(selectedCollab.mulai) || filterTahun(selectedCollab.selesai)) && (
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-1.5 gap-1">
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Periode</span>
                              <div className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 flex flex-col text-left sm:text-right">
                                {filterTahun(selectedCollab.mulai) && filterTahun(selectedCollab.selesai) && filterTahun(selectedCollab.mulai) !== filterTahun(selectedCollab.selesai) ? (
                                  <>
                                    <span>{filterTahun(selectedCollab.mulai)}</span>
                                    <span>{filterTahun(selectedCollab.selesai)}</span>
                                  </>
                                ) : (
                                  <span>{filterTahun(selectedCollab.mulai) || filterTahun(selectedCollab.selesai)}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Deskripsi Kerjasama */}
                      <div>
                        <h4 className="text-[14px] md:text-base font-bold text-slate-950 dark:text-slate-50 mb-2">
                          Tentang Kerjasama
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                          {selectedCollab.deskripsi}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      
      {/* Paklaring Image Modal */}
      <AnimatePresence>
        {selectedPaklaringImage && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPaklaringImage(null)}
              className="fixed inset-0 bg-slate-950/90 z-[120] backdrop-blur-md cursor-zoom-out"
            />
            <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 md:p-8 pointer-events-none">
              <button 
                onClick={() => setSelectedPaklaringImage(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 bg-white/10 hover:bg-white/20  text-white rounded-full transition-all duration-200 pointer-events-auto backdrop-blur-md shadow-lg z-50 border border-white/10"
                aria-label="Tutup"
              >
                <X size={24} />
              </button>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedPaklaringImage(null)}
                className="relative pointer-events-auto max-w-full max-h-[90vh] md:max-h-[95vh] flex items-center justify-center cursor-zoom-out"
              >
                <img 
                  src={selectedPaklaringImage} 
                  alt="Sertifikat Paklaring" 
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
