import { FileText, TrendingUp, Briefcase, GraduationCap, Code2, Award, FolderGit2, Cpu, Building2, Trophy } from 'lucide-react';

export const QUICKBAR_SECTIONS = [
  { key: 'summary', icon: FileText, labelId: 'Ringkasan', labelEn: 'Summary' },
  { key: 'metrics', icon: TrendingUp, labelId: 'Sorotan Metrik', labelEn: 'Metrics' },
  { key: 'experiences', icon: Briefcase, labelId: 'Pengalaman Kerja', labelEn: 'Experience' },
  { key: 'education', icon: GraduationCap, labelId: 'Pendidikan', labelEn: 'Education' },
  { key: 'skills', icon: Code2, labelId: 'Skills', labelEn: 'Skills' },
  { key: 'certifications', icon: Award, labelId: 'Sertifikasi', labelEn: 'Certifications' },
  { key: 'consultingProjects', icon: FolderGit2, labelId: 'Konsultan Proyek', labelEn: 'Project Consulting' },
  { key: 'digitalSolutions', icon: Cpu, labelId: 'Portofolio Digital', labelEn: 'Digital Portfolio' },
  { key: 'organizations', icon: Building2, labelId: 'Organisasi', labelEn: 'Organization' },
  { key: 'achievements', icon: Trophy, labelId: 'Penghargaan', labelEn: 'Achievements' },
];

export const DESIGN_OPTIONS = [
  {
    key: 'block',
    titleId: 'Blok (Header Blok Biru)',
    titleEn: 'Block (Solid Blue Banner)',
    descId: 'Judul seksi dengan latar blok Biru profesional & teks putih kontras tinggi. Tampilan klasik & tegas.',
    descEn: 'Section headers with solid professional Blue filled block & high-contrast white text. Classic & authoritative.',
  },
  {
    key: 'line',
    titleId: 'Garis (Underline Minimalis)',
    titleEn: 'Line (Minimalist Underline)',
    descId: 'Judul seksi dengan aksen garis bawah bersih. Format standar ATS paling disukai recruiter.',
    descEn: 'Section headers with crisp underline accent. Clean ATS layout preferred by recruiters.',
  },
  {
    key: 'badge',
    titleId: 'Badge (Kapsul Header)',
    titleEn: 'Badge (Header Pill)',
    descId: 'Judul seksi dalam bingkai kapsul badge modern. Terlihat segar & kontemporer.',
    descEn: 'Section headers wrapped in modern badge pills. Fresh & contemporary style.',
  },
  {
    key: 'plain',
    titleId: 'Polos (Minimalis Murni)',
    titleEn: 'Plain (Pure Minimalist)',
    descId: 'Tanpa latar atau garis dekoratif. Fokus murni pada konten teks & kemudahan pemindaian.',
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
