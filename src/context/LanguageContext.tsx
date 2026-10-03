import React, { createContext, useContext, useState, useEffect } from 'react';
import { CVData } from '../types';
import { cvData } from '../data/cvData';
import { cvDataEn } from '../data/cvDataEn';

export type Language = 'id' | 'en';

export const translations = {
  id: {
    languageName: 'Bahasa Indonesia',
    switchLangLabel: 'EN',
    downloadPdf: 'Unduh CV PDF',
    downloading: 'Mengunduh...',
    atsScore: 'Skor ATS: 98%',
    viewAtsText: 'Teks Mentah ATS',
    viewAtsModalTitle: 'Konten Mentah CV ATS (Format Teks Murni)',
    viewAtsModalSub: 'Format teks polos seratus persen kompatibel dengan sistem ATS (Workday, Taleo, Greenhouse, SuccessFactors)',
    copyText: 'Salin Seluruh Teks ATS',
    copied: 'Teks Berhasil Disalin!',
    previewCv: 'Tampilan PDF / Print ATS',
    backToLanding: 'Kembali ke Portofolio',
    printCv: 'Cetak CV',
    customizePdf: 'Kustomisasi Layout PDF',
    headerSummary: 'Ringkasan',
    headerMetrics: 'Sorotan Kinerja & Metrik Kunci',
    headerExperience: 'Pengalaman',
    headerEducation: 'Pendidikan',
    headerSkills: 'Keahlian',
    headerCertifications: 'Sertifikasi',
    headerConsulting: 'Konsultan Proyek Independen',
    adminConsulting: 'Konsultan Proyek',
    headerDigitalSolutions: 'Portofolio Digital',
    headerOrganizations: 'Pengalaman Organisasi & Kepemimpinan',
    headerAchievements: 'Prestasi, Penghargaan & Pencapaian',
    softSkillsHeader: 'Soft Skills & Kepemimpinan',
    hardSkillsHeader: 'Hard Skills & Kompetensi Teknis',
    toolsHeader: 'Tools & Ekosistem Digital',
    digitalSolutionsNote: 'Seluruh prototipe sistem berbasis web ini dirancang sebagai kerangka kerja awal (live testing prototype) yang siap dikustomisasi sesuai alur kerja dan skala operasional perusahaan:',
    impactLabel: 'Dampak Utama:',
    demoLink: 'Live Demo',
    navHome: 'Beranda',
    navMetrics: 'Metrik',
    navExperience: 'Pengalaman',
    navSolutions: 'Solusi Digital',
    navSkills: 'Keahlian',
    navAchievements: 'Prestasi',
    navAtsCv: 'CV ATS (PDF/Print)',
    heroTag: 'Resume & Executive Portfolio',
    heroRole: 'Operations Manager & HR Specialist',
    heroSummaryBtn: 'Buka CV ATS (Pure Text)',
    filterAll: 'Semua',
    filterOps: 'Operasional & Mgt',
    filterB2B: 'B2B & Account Mgt',
    filterMarketing: 'Marketing & Ritel',
    caseStudyBtn: 'Lihat Studi Kasus',
    pageTitle: 'Halaman',
    pageOf: 'dari',
    levelLabel: 'Tingkat',
  },
  en: {
    languageName: 'English',
    switchLangLabel: 'ID',
    downloadPdf: 'Download CV PDF',
    downloading: 'Downloading...',
    atsScore: 'ATS Score: 98%',
    viewAtsText: 'ATS Raw Text',
    viewAtsModalTitle: 'CV ATS Raw Content (Plain Text Format)',
    viewAtsModalSub: '100% plain text format compatible with ATS systems (Workday, Taleo, Greenhouse, SuccessFactors)',
    copyText: 'Copy All ATS Text',
    copied: 'Text Copied Successfully!',
    previewCv: 'PDF Preview / Print ATS',
    backToLanding: 'Back to Portfolio',
    printCv: 'Print CV',
    customizePdf: 'Customize PDF Layout',
    headerSummary: 'Professional Summary',
    headerMetrics: 'Key Metrics & Performance Highlights',
    headerExperience: 'Work Experience',
    headerEducation: 'Education',
    headerSkills: 'Core Competencies & Skills',
    headerCertifications: 'Certifications',
    headerConsulting: 'Independent Project Consulting',
    adminConsulting: 'Project Consulting',
    headerDigitalSolutions: 'Digital Portfolio',
    headerOrganizations: 'Organizational Leadership',
    headerAchievements: 'Honors, Awards & Achievements',
    softSkillsHeader: 'Soft Skills & Leadership',
    hardSkillsHeader: 'Hard Skills & Technical Competencies',
    toolsHeader: 'Tools & Software Ecosystem',
    digitalSolutionsNote: 'All web-based system prototypes are designed as live testing prototypes ready for customization according to corporate workflows and operational scale:',
    impactLabel: 'Key Impact:',
    demoLink: 'Live Demo',
    navHome: 'Home',
    navMetrics: 'Metrics',
    navExperience: 'Experience',
    navSolutions: 'Digital Solutions',
    navSkills: 'Skills',
    navAchievements: 'Achievements',
    navAtsCv: 'ATS CV (PDF/Print)',
    heroTag: 'Executive Resume & Portfolio',
    heroRole: 'Operations Manager & HR Specialist',
    heroSummaryBtn: 'Open ATS CV (Pure Text)',
    filterAll: 'All',
    filterOps: 'Operations & Mgt',
    filterB2B: 'B2B & Account Mgt',
    filterMarketing: 'Marketing & Retail',
    caseStudyBtn: 'View Case Study',
    pageTitle: 'Page',
    pageOf: 'of',
    levelLabel: 'Level',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeCvData: CVData;
  t: typeof translations['id'];
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = (params.get('bahasa') || params.get('lang') || params.get('language') || params.get('l') || '').toLowerCase().trim();
      if (urlLang === 'en' || urlLang === 'english' || urlLang === 'inggris') return 'en';
      if (urlLang === 'id' || urlLang === 'indonesia' || urlLang === 'ina') return 'id';
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem('app_language') : null;
    return (saved === 'en' || saved === 'id') ? saved : 'id';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_language', language);
    }
  }, [language]);

  // Listen to popstate or URL search changes for language parameter
  useEffect(() => {
    const handleUrlLangChange = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const urlLang = (params.get('bahasa') || params.get('lang') || params.get('language') || params.get('l') || '').toLowerCase().trim();
      if (urlLang === 'en' || urlLang === 'english' || urlLang === 'inggris') {
        setLanguage('en');
      } else if (urlLang === 'id' || urlLang === 'indonesia' || urlLang === 'ina') {
        setLanguage('id');
      }
    };

    window.addEventListener('popstate', handleUrlLangChange);
    return () => window.removeEventListener('popstate', handleUrlLangChange);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const activeCvData = language === 'en' ? cvDataEn : cvData;
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, activeCvData, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
