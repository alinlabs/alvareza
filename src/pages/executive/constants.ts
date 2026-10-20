import { MetricHighlight } from './types';

export const EXECUTIVE_PROFILE = {
  fullName: 'Alvareza Hilka Pratama',
  photoUrl: '/gambar/desktop-profile-photo.webp',
  desktopPhotoUrl: '/gambar/desktop-profile-photo.webp',
  mobilePhotoUrl: '/gambar/mobile-profile-photo.webp',
  whatsappNumber: '6285797184059',
  email: 'alvareza.work@gmail.com',
  linkedinUrl: 'https://linkedin.com/in/alvareza-hilka-pratama',
  instagramUrl: 'https://instagram.com/varezza_',
  instagramHandle: '@varezza_',
};

export const getWhatsappUrl = (language: 'in' | 'en' | 'id'): string => {
  const message = encodeURIComponent(
    language === 'en'
      ? 'Hello Alvareza, I visited your profile and would like to discuss potential business and collaboration opportunities.'
      : 'Halo Alvareza, saya melihat profil Anda dan tertarik untuk mendiskusikan peluang kerjasama bisnis dan profesional.'
  );
  return `https://wa.me/${EXECUTIVE_PROFILE.whatsappNumber}?text=${message}`;
};

export const EXECUTIVE_METRICS: MetricHighlight[] = [
  // Baris 1: Database | CSAT | SLA | Hambatan
  {
    id: 'crm',
    value: '4.000+',
    labelIn: 'Database Prospek B2B',
    labelEn: 'B2B Leads & CRM',
    sublabelIn: '5.200+ Kontak PIC',
    sublabelEn: 'Market Intelligence',
    colorClass: 'text-[#0A3395]',
    borderHoverClass: 'hover:border-blue-300',
  },
  {
    id: 'csat',
    value: '98%',
    labelIn: 'Kepuasan Mitra CSAT',
    labelEn: 'Client CSAT Score',
    sublabelIn: 'Mutu Layanan & Eksekusi',
    sublabelEn: 'Service Quality & SLA',
    colorClass: 'text-[#0A3395]',
    borderHoverClass: 'hover:border-blue-300',
  },
  {
    id: 'sla',
    value: '95%',
    labelIn: 'SLA Target Proyek',
    labelEn: 'Project Delivery SLA',
    sublabelIn: '100+ Proyek Komersial',
    sublabelEn: '100+ Projects Handled',
    colorClass: 'text-[#0A3395]',
    borderHoverClass: 'hover:border-blue-300',
  },
  {
    id: 'sop',
    value: '90%',
    labelIn: 'Efisiensi Hambatan SOP',
    labelEn: 'Bottleneck Reduction',
    sublabelIn: 'Standardisasi 20+ SOP',
    sublabelEn: '20+ SOPs Standardized',
    colorClass: 'text-[#0A3395]',
    borderHoverClass: 'hover:border-blue-300',
  },
  // Baris 2: 50+ Sistem | 13 Gerai Retail | 8 Lisensi | 6 Departemen
  {
    id: 'apps',
    value: '50+ Sistem',
    labelIn: 'Aplikasi & Otomasi Ai',
    labelEn: 'Apps & AI Automation',
    sublabelIn: 'Otomasi Solusi Digital',
    sublabelEn: 'Automation & Custom Apps',
    colorClass: 'text-[#0A3395]',
    borderHoverClass: 'hover:border-blue-300',
  },
  {
    id: 'retail',
    value: '13 Gerai Retail',
    labelIn: 'Supervisi Event & Promosi',
    labelEn: 'Event & Promotion Supervision',
    sublabelIn: 'Tata Kelola POS & Stok',
    sublabelEn: 'POS & Inventory Control',
    colorClass: 'text-[#0A3395]',
    borderHoverClass: 'hover:border-blue-300',
  },
  {
    id: 'cert',
    value: '8 Lisensi',
    labelIn: 'Sertifikasi Terakreditasi',
    labelEn: 'Accredited Certifications',
    sublabelIn: 'MarkPlus, Saylor, CSSC',
    sublabelEn: 'HR, Ops & Six Sigma',
    colorClass: 'text-[#0A3395]',
    borderHoverClass: 'hover:border-blue-300',
  },
  {
    id: 'crossfunc',
    value: '6 Departemen',
    labelIn: 'Koordinasi Lintas Fungsi',
    labelEn: 'Cross-Functional Coordination',
    sublabelIn: 'Penyelarasan 6 Unit Kerja',
    sublabelEn: 'Ops, HRGA, Finance & Systems',
    colorClass: 'text-[#0A3395]',
    borderHoverClass: 'hover:border-blue-300',
  },
];
