import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Send, 
  Briefcase, 
  FileText, 
  Home, 
  Menu, 
  X, 
  User, 
  Settings,
  ChevronRight,
  GraduationCap,
  Award,
  Users,
  FolderGit2,
  Cpu,
  LogOut,
  FileDown
} from 'lucide-react';
import { generateAtsCv } from '../../utils/atsCvGenerator';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  headerActions?: ReactNode;
}

export default function AdminLayout({ children, activeTab, setActiveTab, onLogout, headerActions }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDownloadAts = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      showToast("Sedang memproses & menyusun CV ATS...");
      await generateAtsCv();
      showToast("CV ATS Berhasil Diunduh!");
    } catch (err: any) {
      console.error("Gagal mendownload CV ATS:", err);
      showToast("Gagal mengunduh CV ATS: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  // Sync state with HTML class name if modified elsewhere
  useEffect(() => {
    // Force light mode
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Ikhtisar & Statistik' },
    { id: 'email-sender', label: 'Utilitas Karir', icon: Send, desc: 'Email, Tracker & Cover Letter' },
    { id: 'rekruter', label: 'Data Rekruter', icon: Users, desc: 'Follow-up & Hubungi' },
    { id: 'berkas', label: 'Berkas', icon: FolderGit2, desc: 'Manajemen Dokumen' },
  ];

  const dataMenuItems = [
    { id: 'data-profil', label: 'Profil', icon: User, desc: 'Informasi Pribadi' },
    { id: 'data-keahlian', label: 'Keahlian', icon: Cpu, desc: 'Skill Utama' },
    { id: 'data-kejuaraan', label: 'Kejuaraan', icon: Award, desc: 'Daftar Juara' },
    { id: 'data-pelatihan', label: 'Pelatihan', icon: Briefcase, desc: 'Sertifikasi' },
    { id: 'data-pencapaian', label: 'Pencapaian', icon: Award, desc: 'Award & Prestasi' },
    { id: 'data-pendidikan', label: 'Pendidikan', icon: GraduationCap, desc: 'Riwayat Sekolah' },
    { id: 'data-pengalaman-kerjasama', label: 'Kerjasama', icon: Users, desc: 'Kemitraan' },
    { id: 'data-pengalaman-organisasi', label: 'Organisasi', icon: Users, desc: 'Aktivitas Sosial' },
    { id: 'data-pengalaman-profesi', label: 'Profesi', icon: Briefcase, desc: 'Riwayat Kerja' },
    { id: 'data-portofolio', label: 'Portofolio', icon: FolderGit2, desc: 'Proyek Selesai' },
  ];

  const categorizedDataMenu = [
    {
      title: 'Personalisasi',
      items: [
        { id: 'data-profil', label: 'Profil', icon: User, desc: 'Informasi Pribadi' },
        { id: 'data-keahlian', label: 'Keahlian', icon: Cpu, desc: 'Skill Utama' },
      ]
    },
    {
      title: 'Kompetensi',
      items: [
        { id: 'data-pendidikan', label: 'Pendidikan', icon: GraduationCap, desc: 'Riwayat Sekolah' },
        { id: 'data-pelatihan', label: 'Pelatihan', icon: Briefcase, desc: 'Sertifikasi' },
      ]
    },
    {
      title: 'Pengalaman',
      items: [
        { id: 'data-pengalaman-profesi', label: 'Profesi', icon: Briefcase, desc: 'Riwayat Kerja' },
        { id: 'data-pengalaman-kerjasama', label: 'Kerjasama', icon: Users, desc: 'Kemitraan' },
        { id: 'data-pengalaman-organisasi', label: 'Organisasi', icon: Users, desc: 'Aktivitas Sosial' },
      ]
    },
    {
      title: 'Prestasi',
      items: [
        { id: 'data-kejuaraan', label: 'Kejuaraan', icon: Award, desc: 'Daftar Juara' },
        { id: 'data-pencapaian', label: 'Pencapaian', icon: Award, desc: 'Award & Prestasi' },
      ]
    },
    {
      title: 'Portofolio',
      items: [
        { id: 'data-portofolio', label: 'Portofolio', icon: FolderGit2, desc: 'Proyek Selesai' },
      ]
    }
  ];

  const handleReturnToPortfolio = () => {
    window.location.pathname = '/';
  };

  return (
    <div id="admin-layout" className="h-screen h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans selection:bg-accent/20 selection:text-accent dark:selection:text-accent">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
            <img 
              src="/gambar/profil.png" 
              alt="Alvareza H.P" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold tracking-wider text-sm uppercase text-slate-900 dark:text-slate-100">
            ADMIN WORKSPACE
          </span>
        </div>
        <div className="flex items-center gap-1">
          {activeTab === 'dashboard' && (
            <div id="mobile-top-bar-actions" className="flex items-center mr-1">
              <button
                onClick={handleDownloadAts}
                disabled={isDownloading}
                className={`p-2 transition-colors relative ${
                  isDownloading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                } text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200`}
                title="Download CV ATS Friendly (PDF)"
              >
                <FileDown size={20} className={isDownloading ? 'animate-bounce' : ''} />
              </button>
            </div>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 h-screen sticky top-0 z-20">
        {/* Brand Header */}
        <div className="p-6 h-[88px] border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-inner">
            <img 
              src="/gambar/profil.png" 
              alt="Alvareza H.P" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-wider uppercase text-slate-900 dark:text-slate-100">
              Alvareza H.P
            </h2>
            <p className="text-[10px] text-accent dark:text-accent font-mono font-medium">ADMIN CONSOLE</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            Utilitas Karir
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all group cursor-pointer ${
                  isActive 
                    ? 'bg-accent/10 text-accent dark:text-accent border border-accent/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-850 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-accent/10 dark:bg-accent/20 text-accent' : 'bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 font-normal">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                  isActive ? 'text-accent translate-x-0.5' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                }`} />
              </button>
            );
          })}

          {categorizedDataMenu.map((group) => (
            <div key={group.title} className="space-y-1 pt-4">
              <p className="px-3 text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-widest mb-2">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                        isActive 
                          ? 'bg-accent/10 text-accent dark:text-accent border border-accent/20' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-850 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg transition-colors ${
                          isActive ? 'bg-accent/10 dark:bg-accent/20 text-accent' : 'bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-450 font-normal">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isActive ? 'text-accent translate-x-0.5' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Operations */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
          <button
            onClick={handleReturnToPortfolio}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-850 border border-transparent transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>Ke Landing Portfolio</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-10 shadow-xl"
            >
              {/* Brand Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
                    <img 
                      src="/gambar/profil.png" 
                      alt="Alvareza H.P" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Alvareza H.P</h2>
                    <p className="text-[9px] text-accent font-mono">ADMIN CONSOLE</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Navigation */}
              <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
                <p className="px-3 text-[9px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-widest mb-3">
                  Utilitas Karir
                </p>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-accent/10 text-accent border border-accent/20' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-slate-400 dark:text-slate-500'}`} />
                        <div>
                          <p className="text-xs font-semibold">{item.label}</p>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">{item.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {categorizedDataMenu.map((group) => (
                  <div key={group.title} className="space-y-1 pt-3">
                    <p className="px-3 text-[9px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-widest mb-2">
                      {group.title}
                    </p>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                              isActive 
                                ? 'bg-accent/10 text-accent border border-accent/20' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-850'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-slate-400 dark:text-slate-500'}`} />
                              <div>
                                <p className="text-xs font-semibold">{item.label}</p>
                                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">{item.desc}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Mobile Drawer Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1 bg-slate-50/50 dark:bg-slate-950/20">
                <button
                  onClick={handleReturnToPortfolio}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all cursor-pointer"
                >
                  <Home className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Ke Landing Portfolio</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        {/* Desktop Top Bar */}
        <div className="hidden md:flex h-[88px] border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0 sticky top-0 z-10 px-10 items-center justify-between">
          <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100">
            {menuItems.find(m => m.id === activeTab)?.icon ? React.createElement(menuItems.find(m => m.id === activeTab)!.icon, { className: "w-5 h-5 text-accent" }) : dataMenuItems.find(m => m.id === activeTab)?.icon ? React.createElement(dataMenuItems.find(m => m.id === activeTab)!.icon, { className: "w-5 h-5 text-accent" }) : <FileText className="w-5 h-5 text-accent" />}
            <h1 className="text-lg font-bold">
              {menuItems.find(m => m.id === activeTab)?.label || dataMenuItems.find(m => m.id === activeTab)?.label || 'Editor'}
            </h1>
          </div>
          <div id="desktop-top-bar-actions" className="flex items-center gap-3">
            {headerActions}
            {activeTab === 'dashboard' && (
              <button
                onClick={handleDownloadAts}
                disabled={isDownloading}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 shadow-sm border cursor-pointer ${
                  isDownloading 
                    ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-accent border-accent text-white hover:bg-accent/90'
                }`}
                title="Download seluruh data dalam format CV ATS Friendly (PDF)"
              >
                <FileDown size={16} className={isDownloading ? 'animate-bounce' : ''} />
                {isDownloading ? 'Mengunduh CV ATS...' : 'Download CV ATS'}
              </button>
            )}
          </div>
        </div>
        
        {/* Scrollable Page Content */}
        <div className={`flex-1 min-h-0 p-4 md:p-10 scroll-smooth ${activeTab === 'berkas' ? 'overflow-y-auto lg:overflow-hidden' : 'overflow-y-auto'}`}>
          <div className={`w-full ${activeTab === 'berkas' ? 'h-full flex flex-col' : ''}`}>
            {children}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[110] px-6 py-3 bg-slate-900 text-white rounded-xl shadow-xl flex items-center gap-2.5 border border-slate-800 text-sm font-semibold"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
