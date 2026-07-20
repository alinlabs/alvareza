import { ApiService } from '../../../services/api';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Plus, Save, Trash2, Copy, FileText, Check, AlertCircle } from 'lucide-react';

export interface CoverLetterTemplate {
  id: string;
  name: string;
  body: string;
  bahasa?: string;
  rekomendasi?: string[] | string;
}

export const DEFAULT_TEMPLATES: CoverLetterTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Umum',
    bahasa: 'Indonesia',
    rekomendasi: ['HRD', 'PR', 'Manajemen'],
    body: `Saya merupakan lulusan **Sarjana Manajemen dari STIE Wikara** dengan portofolio pengalaman kerja yang solid di bidang **operasional ritel dan manajemen proyek**. Portofolio profesional saya mencakup peran strategis dalam mengelola efisiensi alur kerja di **Lingua / Tirta Abadi Utama** serta penyelesaian proyek distribusi sumber daya pada program **BPSPAMS**. Didukung dengan kepemimpinan kuat selaku mantan **Presiden Mahasiswa** serta gelar **Duta GenRe Kabupaten Purwakarta**, saya terbiasa mengoordinasikan tim lintas divisi dan membangun kemitraan strategis.

Saya memiliki daya adaptasi tinggi, etos kerja disiplin, dan kemampuan public speaking yang mumpuni. Saya sangat antusias untuk mengaplikasikan rekam jejak manajerial ini untuk mendukung operasional dan pencapaian target **[Perusahaan]** sebagai **[Posisi]**.`
  },
  {
    id: 'tpl-2',
    name: 'General',
    bahasa: 'Inggris',
    rekomendasi: ['HRD', 'PR', 'Management'],
    body: `I am a **Bachelor of Management from STIE Wikara** with a robust work portfolio in **retail operations and project management**. My professional background includes managing operational workflows at **Lingua / Tirta Abadi Utama** and resource coordination within the **BPSPAMS project**. Combined with my leadership experience as the **President of the Student Executive Board (Presma)** and my achievement as **Duta GenRe Kabupaten Purwakarta**, I excel in cross-functional coordination and strategic partnerships.

I possess strong adaptability, exceptional communication skills, and a result-oriented mindset. I am highly motivated to leverage my practical experience and leadership track record to contribute to **[Perusahaan]** as a **[Posisi]**.`
  },
  {
    id: 'tpl-3',
    name: 'Fokus Kepemimpinan, Akademis & Prestasi',
    bahasa: 'Indonesia',
    rekomendasi: ['Kepemimpinan', 'Akademis', 'Prestasi'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang memegang **Sertifikat Kompetensi Kepemimpinan & Public Speaking**, perjalanan karir saya dibentuk oleh jiwa kepemimpinan yang matang dan prestasi nyata. Saya dipercaya memimpin organisasi kemahasiswaan tertinggi sebagai **Presiden Mahasiswa STIE Wikara** dan mengoordinasikan aksi daerah bersama **Aliansi BEM Purwakarta**. Prestasi saya sebagai **Duta GenRe Kabupaten Purwakarta** merefleksikan keahlian komunikasi persuasif dan diplomasi yang kuat, yang juga saya terapkan saat mengoptimalkan tim operasional di **Lingua / Tirta Abadi Utama** dan **BPSPAMS**.

Saya memiliki kemampuan pemecahan masalah yang analitis dan mentalitas yang berorientasi pada prestasi. Saya siap membawa dedikasi terbaik ini untuk mendukung pertumbuhan **[Perusahaan]** pada posisi **[Posisi]**.`
  },
  {
    id: 'tpl-4',
    name: 'Focus on Academic Excellence, Leadership & Awards',
    bahasa: 'Inggris',
    rekomendasi: ['Academic', 'Leadership', 'Awards'],
    body: `As a **Bachelor of Management from STIE Wikara** holding **Leadership & Public Speaking Certificates**, my professional journey is anchored in high-impact leadership and recognized excellence. I served as the **President of the Student Executive Board (Presma)** and regional coordinator for the **Purwakarta Student Alliance**. My achievement as **Duta GenRe Kabupaten Purwakarta** highlights my ability to influence and build alliances, which I have successfully translated into operational achievements at **Lingua / Tirta Abadi Utama** and **BPSPAMS**.

With a strong foundation in strategic management, outstanding communication, and a history of awards, I am fully prepared to excel as a **[Posisi]** at **[Perusahaan]**.`
  },
  {
    id: 'tpl-5',
    name: 'Fokus Pengalaman Kerja & Operasional Ritel',
    bahasa: 'Indonesia',
    rekomendasi: ['Pengalaman Kerja', 'Ritel', 'Operasional'],
    body: `Portofolio profesional saya berfokus pada **manajemen operasional ritel dan efisiensi kerja**. Saya memiliki pengalaman langsung mengelola rantai pasok dan pelayanan pelanggan di **Lingua / Tirta Abadi Utama**, serta memimpin administrasi dan pelaporan keuangan pada proyek lingkungan **BPSPAMS**. Melalui pengalaman ini, didukung kompetensi manajerial dari studi **Sarjana Manajemen STIE Wikara**, saya terbukti mampu mereduksi hambatan operasional dan meningkatkan kepuasan mitra kerja secara signifikan.

Dengan dukungan sertifikasi kompetensi di bidang **Bisnis dan Digital**, saya siap menerapkan strategi operasional yang lincah dan berorientasi data untuk mengoptimalkan kinerja divisi **[Posisi]** di **[Perusahaan]**.`
  },
  {
    id: 'tpl-6',
    name: 'Focus on Work Experience & Retail Operations',
    bahasa: 'Inggris',
    rekomendasi: ['Work Experience', 'Retail', 'Operations'],
    body: `My professional portfolio is centered on **retail operations management and workflow optimization**. I have hands-on experience managing supply chain logistics and customer relations at **Lingua / Tirta Abadi Utama**, alongside administering project logistics for the **BPSPAMS program**. Guided by my business education in **Bachelor of Management from STIE Wikara**, I have a proven track record of reducing operational bottlenecks and driving partner satisfaction.

Holding a **Digital Business Competency Certificate**, I am fully equipped to bring agile, data-driven operational solutions to support the **[Posisi]** role at **[Perusahaan]**.`
  },
  {
    id: 'tpl-7',
    name: 'Management Trainee / Graduate Leader Program',
    bahasa: 'Indonesia',
    rekomendasi: ['MT', 'Graduate Leader'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** dengan jiwa kepemimpinan tinggi selaku mantan **Presiden Mahasiswa**, saya sangat berambisi untuk bergabung dalam program **Management Trainee** di **[Perusahaan]**. Latar belakang akademis saya diperkuat oleh pengalaman lapangan mengelola operasional ritel di **Lingua / Tirta Abadi Utama** serta administrasi proyek **BPSPAMS**, yang membuktikan bahwa saya tidak hanya menguasai teori, tetapi juga andal dalam eksekusi taktis.

Dengan kepemilikan **Sertifikat Kompetensi Bisnis, Digital, dan Kepemimpinan**, saya memiliki kegesitan belajar (learning agility) yang tinggi untuk ditempatkan lintas divisi. Saya siap mendedikasikan potensi terbaik saya untuk tumbuh dan berkontribusi jangka panjang bagi **[Perusahaan]** sebagai **[Posisi]**.`
  },
  {
    id: 'tpl-8',
    name: 'Management Trainee / Future Leaders Program',
    bahasa: 'Inggris',
    rekomendasi: ['MT', 'Future Leaders'],
    body: `As a **Bachelor of Management from STIE Wikara** with stellar leadership credentials as the former **President of the Student Executive Board (Presma)**, I am highly driven to join the **Management Trainee program** at **[Perusahaan]**. My academic excellence is balanced by solid hands-on experience in retail operations at **Lingua / Tirta Abadi Utama** and administrative governance at **BPSPAMS**, proving my capability to transition smoothly from strategy to execution.

Armed with **Leadership & Digital Business certificates**, I possess high learning agility and cross-functional adaptability. I am eager to contribute fresh strategic perspectives and a strong work ethic to **[Perusahaan]** as a **[Posisi]**.`
  },
  {
    id: 'tpl-9',
    name: 'Hubungan Masyarakat, Publik & Kemitraan',
    bahasa: 'Indonesia',
    rekomendasi: ['Humas', 'Public Relations', 'PR'],
    body: `Dengan kombinasi keahlian sebagai **Duta GenRe Kabupaten Purwakarta** dan pemegang **Sertifikat Kompetensi Public Speaking**, saya melamar untuk posisi **[Posisi]** di **[Perusahaan]**. Keahlian komunikasi strategis saya terasah nyata melalui peran eksternal di **Aliansi BEM Purwakarta** serta koordinasi kemitraan publik pada proyek **BPSPAMS**. Saya mahir dalam mengelola pesan komunikasi publik, menjalin relasi media, serta membangun citra positif organisasi.

Didukung oleh landasan keilmuan **Sarjana Manajemen dari STIE Wikara**, saya memiliki pendekatan yang sistematis dan berorientasi bisnis dalam merancang strategi kehumasan. Saya yakin dapat memperkuat reputasi dan hubungan kemitraan strategis **[Perusahaan]**.`
  },
  {
    id: 'tpl-10',
    name: 'Public Relations, Communication & Partnerships',
    bahasa: 'Inggris',
    rekomendasi: ['PR', 'Communication', 'Partnerships'],
    body: `Leveraging my background as the **Duta GenRe (Ambassador) of Purwakarta Regency** and my **Public Speaking Competency Certificate**, I am writing to apply for the **[Posisi]** role at **[Perusahaan]**. My communication skills were honed through managing external stakeholder relations for the **Purwakarta Student Alliance** and coordinating public partnerships for **BPSPAMS**. I excel in public speaking, message crafting, and building long-term organizational trust.

With a structured business mindset from my **Bachelor of Management from STIE Wikara**, I bring a strategic approach to public relations. I am highly confident in my ability to enhance stakeholder engagement and public trust for **[Perusahaan]**.`
  },
  {
    id: 'tpl-11',
    name: 'Administrasi Operasional & Manajemen Kantor',
    bahasa: 'Indonesia',
    rekomendasi: ['Administrasi', 'Office Management'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** dengan penguasaan mendalam dalam tata kelola administrasi, saya bermaksud mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Pengalaman saya memimpin administrasi kegiatan mahasiswa selaku **Presiden Mahasiswa** serta mengelola pelaporan dan logistik keuangan pada program **BPSPAMS** menjamin ketelitian tinggi, keteraturan berkas, dan efisiensi koordinasi harian.

Didukung oleh **Sertifikat Kompetensi Akademik**, saya sangat terbiasa menggunakan instrumen digital untuk manajemen data operasional. Saya berkomitmen penuh untuk menjaga kelancaran operasional harian kantor di **[Perusahaan]** dengan etos kerja yang disiplin dan andal.`
  },
  {
    id: 'tpl-12',
    name: 'Office Administration & Operational Support',
    bahasa: 'Inggris',
    rekomendasi: ['Office Administration', 'Operational Support'],
    body: `With a solid academic background in **Bachelor of Management from STIE Wikara** and extensive organizational governance experience, I am applying for the **[Posisi]** role at **[Perusahaan]**. My expertise in document control, budget tracking, and scheduling was developed during my tenure as **President of the Student Executive Board** and through handling operational logs for **BPSPAMS** and **Lingua / Tirta Abadi Utama**.

Equipped with an **Academic Competency Certificate**, I am highly proficient in digital administration tools and administrative database management. I am committed to supporting the daily office efficiency and operational workflow of **[Perusahaan]**.`
  },
  {
    id: 'tpl-13',
    name: 'Fokus Digital Marketing & Pemasaran',
    bahasa: 'Indonesia',
    rekomendasi: ['Digital Marketing', 'Pemasaran'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang memiliki minat besar dan pengalaman lapangan di bidang pemasaran, saya mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Berbekal pengalaman dalam pemasaran lapangan dan pemahaman kuat terhadap perilaku konsumen, saya mahir dalam merancang strategi akuisisi audiens, membangun kesadaran merek (brand awareness), serta mengoptimalkan kampanye yang berorientasi pada data dan hasil nyata.

Dengan sertifikasi kompetensi di bidang **Bisnis dan Digital**, pemahaman manajerial yang solid, serta kreativitas yang terasah melalui kepemimpinan kemahasiswaan, saya siap membantu meningkatkan metrik konversi dan visibilitas digital **[Perusahaan]**.`
  },
  {
    id: 'tpl-14',
    name: 'Focus on Digital Marketing & Growth',
    bahasa: 'Inggris',
    rekomendasi: ['Digital Marketing', 'Growth'],
    body: `As a **Bachelor of Management from STIE Wikara** with a profound passion and hands-on experience in marketing operations, I am writing to express my interest in the **[Posisi]** role at **[Perusahaan]**. Equipped with a robust background in field marketing and consumer behavior analysis, I am highly capable of designing audience acquisition strategies, driving brand awareness, and optimizing data-driven campaigns for tangible growth.

Holding a **Digital Business Competency Certificate** alongside a solid managerial foundation and creativity honed through leadership roles, I am eager to contribute to boosting digital visibility and conversion metrics for **[Perusahaan]**.`
  }
];

export default function Templates() {
  const [templates, setTemplates] = useState<CoverLetterTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [bahasa, setBahasa] = useState('Indonesia');
  const [rekomendasiInput, setRekomendasiInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Synchronize scroll from textarea to backdrop
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (backdropRef.current) {
      backdropRef.current.scrollTop = e.currentTarget.scrollTop;
      backdropRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  // Sync scroll on body value changes
  useEffect(() => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [body]);

  // Handle Ctrl+B / Cmd+B formatting and backspace behavior
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;

    if (e.key === 'Backspace' && start === end) {
      const beforeCursor = val.substring(0, start);
      if (beforeCursor.endsWith('**')) {
        const textBeforeStars = beforeCursor.slice(0, -2);
        const lastStartIndex = textBeforeStars.lastIndexOf('**');
        if (lastStartIndex !== -1 && !textBeforeStars.slice(lastStartIndex + 2).includes('**')) {
          // Cursor is immediately after a completed bold block: **text**|
          e.preventDefault();
          const beforeBlock = val.substring(0, lastStartIndex);
          const blockText = textBeforeStars.slice(lastStartIndex + 2);
          const afterCursor = val.substring(start);
          
          setBody(beforeBlock + blockText + afterCursor);
          
          const newCursorPos = lastStartIndex + blockText.length;
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
          return;
        } else {
          // Fallback: just delete the two asterisks
          e.preventDefault();
          const before = val.substring(0, start - 2);
          const after = val.substring(start);
          setBody(before + after);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start - 2, start - 2);
          }, 0);
          return;
        }
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      const selectedText = val.substring(start, end);
      if (!selectedText) {
        // If nothing is selected, we insert **** and place cursor in the middle
        const before = val.substring(0, start);
        const after = val.substring(end);
        const newValue = before + '****' + after;
        setBody(newValue);

        // Restore cursor position inside the asterisks
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
        return;
      }

      let newValue = '';
      let newStart = start;
      let newEnd = end;

      // Toggle bold if already wrapped in double asterisks internally OR externally
      const isWrappedInternally = selectedText.startsWith('**') && selectedText.endsWith('**') && selectedText.length >= 4;
      const isWrappedExternally = start >= 2 && end <= val.length - 2 && val.substring(start - 2, start) === '**' && val.substring(end, end + 2) === '**';

      if (isWrappedInternally) {
        const unwrapped = selectedText.slice(2, -2);
        const before = val.substring(0, start);
        const after = val.substring(end);
        newValue = before + unwrapped + after;
        newStart = start;
        newEnd = start + unwrapped.length;
      } else if (isWrappedExternally) {
        const before = val.substring(0, start - 2);
        const after = val.substring(end + 2);
        newValue = before + selectedText + after;
        newStart = start - 2;
        newEnd = start - 2 + selectedText.length;
      } else {
        const wrapped = `**${selectedText}**`;
        const before = val.substring(0, start);
        const after = val.substring(end);
        newValue = before + wrapped + after;
        newStart = start;
        newEnd = start + wrapped.length;
      }

      setBody(newValue);

      // Restore selection range of the formatted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newStart, newEnd);
      }, 0);
    }
  };

  // Render text highlighting markdown bold blocks (**word**)
  const renderHighlightedText = (text: string) => {
    if (!text) {
      return <span className="text-slate-400 dark:text-slate-600 font-normal">Tulis badan email surat lamaran...</span>;
    }

    // Split using double asterisks format with no space right inside
    const parts = text.split(/(\*\*[^\*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-[#02227e] dark:text-[#60a5fa] bg-slate-200/40 dark:bg-slate-800/50 px-0.5 rounded border border-slate-300/30 dark:border-slate-700/30">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    ApiService.get<CoverLetterTemplate[]>('cover-letter-templates').then(res => {
      if (res.success && res.data && res.data.length > 0) {
        const dbTemplates = res.data;
        // Merge DEFAULT_TEMPLATES with dbTemplates, prioritizing dbTemplates
        const merged = DEFAULT_TEMPLATES.map(tpl => {
          const dbTpl = dbTemplates.find(d => d.id === tpl.id);
          return dbTpl ? dbTpl : tpl;
        });
        
        // Find custom templates from database that are not part of DEFAULT_TEMPLATES
        const mergedIds = new Set(merged.map(m => m.id));
        const extraDbTemplates = dbTemplates.filter(d => !mergedIds.has(d.id));
        const synchronized = [...merged, ...extraDbTemplates];

        setTemplates(synchronized);
        selectTemplate(synchronized[0]);
      } else {
        setTemplates(DEFAULT_TEMPLATES);
        if (DEFAULT_TEMPLATES.length > 0) {
          selectTemplate(DEFAULT_TEMPLATES[0]);
        }
      }
    });
  }, []);

  const selectTemplate = (tpl: CoverLetterTemplate) => {
    setSelectedId(tpl.id);
    setName(tpl.name);
    setBody(tpl.body);
    setBahasa(tpl.bahasa || 'Indonesia');

    if (Array.isArray(tpl.rekomendasi)) {
      setRekomendasiInput(tpl.rekomendasi.join(', '));
    } else if (typeof tpl.rekomendasi === 'string') {
      try {
        const parsed = JSON.parse(tpl.rekomendasi);
        if (Array.isArray(parsed)) {
          setRekomendasiInput(parsed.join(', '));
        } else {
          setRekomendasiInput(tpl.rekomendasi);
        }
      } catch {
        setRekomendasiInput(tpl.rekomendasi || '');
      }
    } else {
      setRekomendasiInput('');
    }
  };

  const handleSave = () => {
    if (!name || !body) return;

    const recsArray = rekomendasiInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    let updated: CoverLetterTemplate[];
    
    if (selectedId) {
      const updatedTpl: CoverLetterTemplate = { 
        id: selectedId, 
        name, 
        body,
        bahasa,
        rekomendasi: recsArray
      };
      updated = (templates || []).map(t => t.id === selectedId ? updatedTpl : t);
      ApiService.put('cover-letter-templates', updatedTpl);
    } else {
      const newTpl: CoverLetterTemplate = {
        id: 'tpl-' + Date.now().toString(),
        name,
        body,
        bahasa,
        rekomendasi: recsArray
      };
      updated = [newTpl, ...templates];
      setSelectedId(newTpl.id);
      ApiService.post('cover-letter-templates', newTpl);
    }
    
    setTemplates(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddNew = () => {
    setSelectedId('');
    setName('Template Baru');
    setBahasa('Indonesia');
    setRekomendasiInput('HRD, PR');
    setBody(`Tuliskan paragraf pengantar dan kualifikasi Anda di sini. 
Header, salam pembuka, dan penutup akan otomatis ditambahkan oleh sistem berdasarkan pengaturan.`);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus template ini?')) {
      try {
        const response = await ApiService.delete('cover-letter-templates', { body: JSON.stringify({ id }) });
        if (!response.success) throw new Error(response.message);
      } catch (err: any) {
        alert('Gagal menghapus template: ' + err.message);
        return;
      }
      const filtered = (templates || []).filter(t => t.id !== id);
      setTemplates(filtered);
      if (selectedId === id) {
        if (filtered.length > 0) {
          selectTemplate(filtered[0]);
        } else {
          handleAddNew();
        }
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mereset ke template bawaan? Semua template yang Anda buat akan terhapus.')) {
      // In a real app we might delete all and post defaults, but for simplicity we just update state
      // This is a bit complex for DB so we'll just set it. 
      // User can save them individually if they edit.
      setTemplates(DEFAULT_TEMPLATES);
      selectTemplate(DEFAULT_TEMPLATES[0]);
    }
  };

  return (
    <div id="admin-templates-page" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Templates List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left">
              Daftar Template ({(templates || []).length})
            </p>
            <button
              onClick={handleAddNew}
              className="text-[10px] font-bold text-accent hover:text-accent/80 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Buat Baru</span>
            </button>
          </div>
          <div className="space-y-2 lg:max-h-[680px] max-h-[500px] overflow-y-auto pr-1">
            {(templates || []).map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => selectTemplate(tpl)}
                className={`p-4 rounded-xl border transition-all text-left cursor-pointer group flex items-start justify-between gap-3 ${
                  selectedId === tpl.id
                    ? 'bg-slate-50 dark:bg-slate-900 border-accent/40 text-slate-900 dark:text-slate-100 shadow-md'
                    : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-500 dark:text-slate-400 shadow-sm dark:shadow-none'
                }`}
              >
                <div className="space-y-1.5 overflow-hidden">
                  <h3 className={`text-xs font-semibold truncate ${selectedId === tpl.id ? 'text-accent' : 'text-slate-750 dark:text-slate-300'}`}>
                    {tpl.name}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tpl.bahasa && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400">
                        {tpl.bahasa}
                      </span>
                    )}
                    {Array.isArray(tpl.rekomendasi) ? (
                      tpl.rekomendasi.map((tag, i) => (
                        <span key={i} className="text-[9px] font-medium px-1.5 py-0.5 bg-accent/5 rounded-md text-accent">
                          {tag}
                        </span>
                      ))
                    ) : typeof tpl.rekomendasi === 'string' && tpl.rekomendasi ? (
                      <span className="text-[9px] font-medium px-1.5 py-0.5 bg-accent/5 rounded-md text-accent">
                        {tpl.rekomendasi}
                      </span>
                    ) : null}
                  </div>
                </div>
                {/* Delete button (prevent deleting all) */}
                {(templates || []).length > 1 && (
                  <button
                    onClick={(e) => handleDelete(tpl.id, e)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-150 dark:hover:bg-slate-800 shrink-0 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                    title="Hapus template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm dark:shadow-none">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2 text-left">
              <FileText className="w-4 h-4 text-accent" />
              {selectedId ? 'Ubah Template' : 'Buat Template Baru'}
            </h2>

            <div className="space-y-4 text-left">
              {/* Template Name */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Nama Template
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Digital Marketer"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] focus:border-accent focus:outline-none shadow-inner"
                />
              </div>

              {/* Bahasa & Rekomendasi Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bahasa */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Bahasa
                  </label>
                  <select
                    value={bahasa}
                    onChange={(e) => setBahasa(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] focus:border-accent focus:outline-none shadow-inner"
                  >
                    <option value="Indonesia">Indonesia</option>
                    <option value="Inggris">Inggris</option>
                  </select>
                </div>

                {/* Rekomendasi */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Rekomendasi Perusahaan / Divisi (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={rekomendasiInput}
                    onChange={(e) => setRekomendasiInput(e.target.value)}
                    placeholder="Misal: HRD, PR, Pemasaran"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] focus:border-accent focus:outline-none shadow-inner"
                  />
                </div>
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Isi Surat Pengantar (Cover Letter)
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(body, 'body')}
                    className="text-[10px] text-accent hover:text-accent/80 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'body' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Salin Semua
                      </>
                    )}
                  </button>
                </div>
                <div className="relative w-full h-[380px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-inner focus-within:border-accent transition-colors">
                  <div
                    ref={backdropRef}
                    className="custom-backdrop-class absolute inset-0 w-full h-full whitespace-pre-wrap break-words overflow-y-auto pointer-events-none select-none"
                  >
                    {renderHighlightedText(body)}
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value);
                      if (backdropRef.current) {
                        backdropRef.current.scrollTop = e.target.scrollTop;
                      }
                    }}
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    spellCheck="false"
                    className="custom-textarea-class absolute inset-0 w-full h-full bg-transparent border-0 focus:ring-0 focus:outline-none whitespace-pre-wrap break-words resize-none overflow-y-auto"
                    placeholder="Tulis badan email surat lamaran..."
                  />
                </div>
              </div>
            </div>

            {/* Save Buttons & Alert */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[10px] text-slate-450 dark:text-slate-500 text-left">
                <AlertCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>Format variabel yang di-replace otomatis: <code className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded font-mono">[Posisi]</code> dan <code className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded font-mono">[Perusahaan]</code></span>
              </div>

              <div className="flex items-center gap-3">
                {isSaved && (
                  <motion.span 
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-semibold text-accent flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Berhasil Disimpan
                  </motion.span>
                )}
                <button
                  onClick={handleSave}
                  disabled={!name || !body}
                  className="px-5 py-3 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:pointer-events-none text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(2,34,126,0.1)] hover:shadow-[0_4px_18px_rgba(2,34,126,0.25)] active:scale-98 animate-none"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Template</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
