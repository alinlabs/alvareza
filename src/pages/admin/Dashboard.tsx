import { ApiService } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Send, 
  FileText, 
  CheckCircle2, 
  Lightbulb, 
  Calendar, 
  ArrowUpRight,
  Sparkles,
  Award,
  Mail,
  User,
  Building,
  Search,
  Target,
  Trash2
} from 'lucide-react';
import { JobApplication } from './email-sender/Tracker';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [totalDrafts, setTotalDrafts] = useState(0);
  const [totalApplied, setTotalApplied] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [greeting, setGreeting] = useState('Selamat Datang');

  // Helper functions for fallbacks
  const getJobEmail = (job: JobApplication) => {
    if (job.targetEmail) return job.targetEmail;
    if (job.id === 'job-1') return 'hrd@konicaminolta.co.id';
    if (job.id === 'job-2') return 'recruitment@shopee.co.id';
    if (job.id === 'job-3') return 'kerjasama@jabarprov.go.id';
    if (job.id === 'job-4') return 'dutagenre@purwakartakab.go.id';
    return 'hrd@company.co.id';
  };

  const getJobAddressedTo = (job: JobApplication) => {
    if (job.addressedTo) return job.addressedTo;
    if (job.id === 'job-1') return 'Bapak/Ibu HRD Konica Minolta';
    if (job.id === 'job-2') return 'Hiring Manager Shopee';
    if (job.id === 'job-3') return 'Panitia Penyelenggara Jabar';
    if (job.id === 'job-4') return 'Kepala BKKBN Purwakarta';
    return 'Bapak/Ibu HRD';
  };

  const fetchJobsData = async () => {
    try {
      const res = await ApiService.get<any>('email-sender');
      if (res.success && res.data) {
        setJobs(res.data);
        setTotalApplied(res.data.filter((j: any) => j.status === 'terkirim').length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pelacakan lamaran ini?')) {
      try {
        const response = await ApiService.delete('email-sender', { body: JSON.stringify({ id: jobId }) });
        if (!response.success) {
          throw new Error(response.message || 'Gagal menghapus data di server');
        }
      } catch (err: any) {
        alert('Gagal menghapus data: ' + err.message);
        return;
      }
      const updatedJobs = (jobs || []).filter(j => j.id !== jobId);
      setJobs(updatedJobs);
      setTotalApplied(updatedJobs.filter(j => j.status === 'terkirim').length);
      await fetchJobsData();
    }
  };

  // Load everything
  useEffect(() => {
    // Greeting based on time
    const hour = new Date().getHours();
    if (hour < 11) setGreeting('Selamat Pagi');
    else if (hour < 15) setGreeting('Selamat Siang');
    else if (hour < 19) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');

    // Load templates count
    ApiService.get<any>('cover-letter-templates').then(res => {
      if (res.success && res.data) {
        setTotalTemplates(res.data.length);
      }
    });

    // Load drafts count
    ApiService.get<any>('email-sender').then(res => {
      if (res.success && res.data) {
        setTotalDrafts(res.data.filter((item: any) => item.status === 'draft').length);
      }
    });

    // Load jobs
    ApiService.get<any>('email-sender').then(res => {
      if (res.success && res.data) {
        setJobs(res.data);
        setTotalApplied(res.data.filter((j: any) => j.status === 'terkirim').length);
      }
    });
  }, []);

  // Filter jobs based on search query
  const filteredJobs = (jobs || []).filter(job => {
    if (job.status !== 'terkirim') return false;
    const query = searchTerm.toLowerCase();
    const company = job.companyName.toLowerCase();
    const email = getJobEmail(job).toLowerCase();
    const addressedTo = getJobAddressedTo(job).toLowerCase();
    return company.includes(query) || email.includes(query) || addressedTo.includes(query);
  });

  return (
    <div id="admin-dashboard-page" className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-slate-100 to-accent/5 dark:from-slate-900 dark:to-accent/15 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 overflow-hidden shadow-sm">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {greeting}, Alvareza!
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Pantau aktivitas lamaran kerja Anda secara real-time, buat draf pesan pengantar surat yang dipersonalisasi, dan kirimkan resume profesional terbaik Anda langsung ke alamat email HRD target dengan satu klik mudah.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-850 shrink-0 self-start md:self-auto text-xs font-mono shadow-sm dark:shadow-none">
            <Calendar className="w-5 h-5 text-accent dark:text-accent" />
            <div>
              <p className="text-slate-400 dark:text-slate-500 uppercase text-[9px] font-bold">Hari ini</p>
              <p className="text-slate-850 dark:text-slate-200 font-bold mt-0.5">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats: ONLY Total Cover Letter | Total Draft | Total Apply */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Cover Letter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm dark:shadow-none">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-950 text-accent dark:text-accent rounded-xl border border-slate-200 dark:border-slate-850 shrink-0">
              <FileText className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-none">{totalTemplates}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Total Cover Letter</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('templates')}
            className="p-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent rounded-lg border border-slate-200 dark:border-slate-850 cursor-pointer transition-colors shrink-0"
            title="Kelola template surat lamaran"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Total Draft */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm dark:shadow-none">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-950 text-amber-600 dark:text-amber-400 rounded-xl border border-slate-200 dark:border-slate-850 shrink-0">
              <Briefcase className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 leading-none">{totalDrafts}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Total Draft</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('email-sender')}
            className="p-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg border border-slate-200 dark:border-slate-850 cursor-pointer transition-colors shrink-0"
            title="Lihat draf email"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Total Apply */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm dark:shadow-none">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 rounded-xl border border-slate-200 dark:border-slate-850 shrink-0">
              <Send className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">{totalApplied}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Total Apply</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('tracker')}
            className="p-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg border border-slate-200 dark:border-slate-850 cursor-pointer transition-colors shrink-0"
            title="Lihat status tracker"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Lamaran Tracker (Replacing Agenda Karir Pribadi) & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lamaran Tracker List */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm dark:shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-accent" /> Lamaran Tracker
            </h3>
            {/* Search Input for Tracker */}
            <div className="relative w-full sm:max-w-[240px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Cari perusahaan / email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:border-accent focus:outline-none text-[#1e293b] dark:text-[#f8fafc] shadow-inner"
              />
            </div>
          </div>

          {/* Simple Clean Table / List */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 space-y-2">
                <Briefcase className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-medium">Belum ada daftar lamaran</p>
                <p className="text-[10px] text-slate-450 dark:text-slate-600">Kirim lamaran kerja baru via Email Dispatcher.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {(filteredJobs || []).map(job => (
                  <motion.div 
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-slate-100/60 dark:hover:bg-slate-950/90 rounded-2xl transition-all flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-1.5 flex-grow text-xs min-w-0">
                      {/* Row 1: Company (Left) + Date (Right) */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{job.companyName}</h3>
                        </div>
                        <div className="text-slate-500 dark:text-slate-450 font-semibold text-[11px] sm:text-right shrink-0">
                          {job.createdAt}
                        </div>
                      </div>

                      {/* Row 2: Position (Left) + Email (Right) */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate">{job.positionName}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-450 font-medium text-[11px] sm:text-right shrink-0">
                          <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                          <span className="truncate">{getJobEmail(job)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer shrink-0"
                      title="Hapus lamaran"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm dark:shadow-none">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Lightbulb className="w-4.5 h-4.5 text-accent" /> Analitik & Rekomendasi HRD
          </h3>

          <div className="space-y-4">
            {/* Insight 1: Duta Genre */}
            <div className="flex gap-3.5 p-4 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl">
              <Award className="w-6 h-6 text-accent shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Value Tinggi: Pemenang Duta Genre</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Gelar ini membuktikan kemampuan <strong>komunikasi</strong>, diplomasi, dan <strong>representasi publik</strong> Anda di atas rata-rata. Sangat efektif untuk memikat HRD perusahaan swasta besar di bidang Customer Relations, PR, Brand, atau Business Development.
                </p>
              </div>
            </div>

            {/* Insight 2: Presiden Mahasiswa */}
            <div className="flex gap-3.5 p-4 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Leadership: Presiden Mahasiswa</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Pengalaman memimpin BEM dan Aliansi Kabupaten melatih Anda dalam menyusun strategi, negosiasi sponsor, dan manajemen krisis. Soroti ini saat melamar posisi <strong>Management Trainee (MT)</strong> atau <strong>Operations Lead</strong>.
                </p>
              </div>
            </div>

            {/* Target Recommendation */}
            <div className="flex gap-3.5 p-4 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl">
              <Target className="w-6 h-6 text-rose-500 dark:text-rose-400 shrink-0" />
              <div className="space-y-1.5 flex-grow">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Target Posisi yang Direkomendasikan</p>
                <ul className="text-[10px] text-slate-550 dark:text-slate-400 list-disc list-inside space-y-1 font-medium leading-relaxed">
                  <li>Business Development Specialist / Partnership Lead</li>
                  <li>Assistant Chief Operations Officer (COO Assistant)</li>
                  <li>Management Trainee (MT) - Sales & Marketing</li>
                  <li>Public Relations / Community Manager</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
