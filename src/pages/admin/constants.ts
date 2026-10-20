import { FileText, TrendingUp, Briefcase, GraduationCap, Code2, Award, FolderGit2, Cpu, Building2, Trophy } from 'lucide-react';

export const TOOLS_CONFIG = {
  title: 'Workspace Internal & Tools Admin',
  subtitle: 'Suite manajemen kurasi CV ATS, OCR Scanner lowongan kerja, dan automasi apply email',
  version: '2.5.0',
  features: [
    {
      id: 'ats-builder',
      titleIn: 'ATS CV Builder & Preset Selector',
      titleEn: 'ATS CV Builder & Preset Selector',
      descriptionIn: 'Sesuaikan varian kurasi CV untuk peran Operasional, PMO, Tech, atau Generalis.',
      descriptionEn: 'Customize tailored CV variants for Operations, PMO, Tech, or Generalist roles.',
    },
    {
      id: 'job-apply-scanner',
      titleIn: 'Tulis Cepat Lamaran Kerja',
      titleEn: 'Quick Job Application Writer',
      descriptionIn: 'Isi data lamaran cepat: [Nama Perusahaan], [Posisi], [email tujuan], [cc/subject].',
      descriptionEn: 'Quickly fill application info: [Company], [Position], [Recipient Email], [CC/Subject].',
    },
    {
      id: 'gas-settings',
      titleIn: 'Dispatcher Multi-Akun GAS',
      titleEn: 'GAS Multi-Account Dispatcher',
      descriptionIn: 'Konfigurasi 6 endpoint Google Apps Script untuk pengiriman lamaran kerja terdistribusi.',
      descriptionEn: 'Configure 6 Google Apps Script endpoints for distributed job application delivery.',
    },
  ],
};

export const QUICKBAR_SECTIONS = [
  { key: 'summary', icon: FileText, labelIn: 'Ringkasan', labelEn: 'Summary' },
  { key: 'metrics', icon: TrendingUp, labelIn: 'Sorotan Metrik', labelEn: 'Metrics' },
  { key: 'experiences', icon: Briefcase, labelIn: 'Pengalaman Kerja', labelEn: 'Experience' },
  { key: 'education', icon: GraduationCap, labelIn: 'Pendidikan', labelEn: 'Education' },
  { key: 'skills', icon: Code2, labelIn: 'Skills', labelEn: 'Skills' },
  { key: 'certifications', icon: Award, labelIn: 'Sertifikasi', labelEn: 'Certifications' },
  { key: 'consultingProjects', icon: FolderGit2, labelIn: 'Konsultan Proyek', labelEn: 'Project Consulting' },
  { key: 'digitalSolutions', icon: Cpu, labelIn: 'Portofolio Digital', labelEn: 'Digital Portfolio' },
  { key: 'organizations', icon: Building2, labelIn: 'Organisasi', labelEn: 'Organization' },
  { key: 'achievements', icon: Trophy, labelIn: 'Penghargaan', labelEn: 'Achievements' },
];

export const DESIGN_OPTIONS = [
  {
    key: 'block',
    titleIn: 'Blok (Header Blok Biru)',
    titleEn: 'Block (Solid Blue Banner)',
    descIn: 'Judul seksi dengan latar blok Biru profesional & teks putih kontras tinggi. Tampilan klasik & tegas.',
    descEn: 'Section headers with solid professional Blue filled block & high-contrast white text. Classic & authoritative.',
  },
  {
    key: 'line',
    titleIn: 'Garis (Underline Minimalis)',
    titleEn: 'Line (Minimalist Underline)',
    descIn: 'Judul seksi dengan aksen garis bawah bersih. Format standar ATS paling disukai recruiter.',
    descEn: 'Section headers with crisp underline accent. Clean ATS layout preferred by recruiters.',
  },
  {
    key: 'badge',
    titleIn: 'Badge (Kapsul Header)',
    titleEn: 'Badge (Header Pill)',
    descIn: 'Judul seksi dalam bingkai kapsul badge modern. Terlihat segar & kontemporer.',
    descEn: 'Section headers wrapped in modern badge pills. Fresh & contemporary style.',
  },
  {
    key: 'plain',
    titleIn: 'Polos (Minimalis Murni)',
    titleEn: 'Plain (Pure Minimalist)',
    descIn: 'Tanpa latar atau garis dekoratif. Fokus murni pada konten teks & kemudahan pemindaian.',
    descEn: 'No decorative backgrounds or lines. Pure focus on text content & scannability.',
  },
];

export const HEADER_COLOR_PRESETS = [
  { hex: '#0F172A', label: 'Navy Blue' },
  { hex: '#1E293B', label: 'Dark Slate' },
  { hex: '#111827', label: 'Midnight Black' },
  { hex: '#0062E3', label: 'Royal Blue' },
  { hex: '#0284C7', label: 'Ocean Blue' },
  { hex: '#0F766E', label: 'Deep Teal' },
  { hex: '#047857', label: 'Forest Green' },
  { hex: '#7C3AED', label: 'Royal Purple' },
  { hex: '#B91C1C', label: 'Crimson Red' },
  { hex: '#C2410C', label: 'Rust Orange' },
  { hex: '#475569', label: 'Steel Gray' },
  { hex: '#000000', label: 'Pitch Black' },
];
