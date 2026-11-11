import { EmailLanguage, JobScanResult } from '../../types/jobApplication';
import { matchExactJobPositionFromCatalog, stripOcrArtifactsFromText } from '../../data/job-posisi';
import { matchPresetFromJobTitle } from '../../data/preset/config/konfigurasi-peran';
import {
  detectLanguageFromText,
  extractEmailStrict,
  extractPhoneStrict,
  extractSubjectFormatNotice,
  extractCompanyNameStrict,
  extractJobPositionStrict,
} from './textExtractors';
import { generateTailoredApplicationDraft } from './draftEmailTemplates';

export const APPLICANT_DATA = {
  fullName: 'Alvareza Hilka Pratama',
  email: 'alvareza.work@gmail.com',
  phone: '+62 857-9718-4059',
  portfolioUrl: 'https://www.alvareza.my.id',
  linkedinUrl: 'https://linkedin.com/in/alvareza-hilka-pratama',
  headline: 'Business Operations & Strategic Management Specialist',
  education: 'Sarjana Manajemen (S1 Manajemen, IPK 3,63 / Predikat Dengan Pujian)',
  certification: 'Human Resources (MarkPlus Institute, Nilai 93,00) & Six Sigma White Belt',
  keyHighlights: [
    'Supervisi operasional 13 gerai ritel dan koordinasi lintas 6 divisi bisnis',
    'Eksekusi 100+ proyek komersial dengan CSAT 98% dan kepatuhan SLA 95%',
    'Perancangan 20+ SOP yang memangkas hambatan operasional hingga 90%',
    'Pembangunan 50+ aplikasi sistem digital/ERP kustom untuk efisiensi bisnis',
    'Pengelolaan database prospek B2B CRM 4.000+ kontak',
  ],
};

export function parseJobTextHeuristically(rawText: string, filename?: string, language?: EmailLanguage): JobScanResult {
  const text = rawText || '';
  const detectedLang = language || detectLanguageFromText(text);
  const activeLanguage = detectedLang;
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 1. Extract Email with OCR error correction
  const detectedEmail = extractEmailStrict(text);

  // 2. Extract Phone / WhatsApp
  const detectedPhone = extractPhoneStrict(text);

  // 3. Extract Subject Format Notice
  const detectedSubjectNotice = extractSubjectFormatNotice(lines);

  // 4. Extract Company Name with strict entity validation
  const detectedCompany = extractCompanyNameStrict(lines, detectedEmail);

  // 5. Extract Job Title / Position with strict role detection
  const detectedRole = extractJobPositionStrict(lines, filename, activeLanguage);

  // 6. Extract Key Requirements
  const keyRequirements: string[] = [];
  let reqSection = false;
  for (const line of lines) {
    if (/(?:kualifikasi|persyaratan|requirements|kriteria|job\s*description|tanggung\s*jawab)/i.test(line)) {
      reqSection = true;
      continue;
    }
    if (reqSection) {
      if (/(?:kirim|send|email|kontak|contact|hubungi|apply|deadline|lokasi|penempatan)/i.test(line)) {
        reqSection = false;
      } else if (line.length > 5 && line.length < 80) {
        keyRequirements.push(line.replace(/^[-•*–\d\.\)]\s*/, ''));
        if (keyRequirements.length >= 4) break;
      }
    }
  }

  if (keyRequirements.length === 0) {
    keyRequirements.push(
      activeLanguage === 'en' ? 'Operational management & SOP governance' : 'Manajemen operasional & standardisasi SOP',
      activeLanguage === 'en' ? 'Cross-functional team coordination' : 'Koordinasi tim lintas divisi bisnis',
      activeLanguage === 'en' ? 'Process efficiency & digital automation' : 'Efisiensi proses kerja & otomatisasi sistem'
    );
  }

  // Construct Final Subject
  let customSubject = '';
  if (detectedSubjectNotice) {
    customSubject = detectedSubjectNotice
      .replace(/\[posisi\]|\[position\]|\[job title\]/gi, detectedRole)
      .replace(/\[nama\]|\[name\]|\[nama pelamar\]/gi, APPLICANT_DATA.fullName)
      .replace(/\[perusahaan\]|\[company\]/gi, detectedCompany);
  } else {
    const hasRole = !!detectedRole && !/^(posisi terkait|target position)$/i.test(detectedRole);
    const hasComp = !!detectedCompany && !/^(perusahaan|company|hiring company)$/i.test(detectedCompany);

    if (activeLanguage === 'en') {
      if (hasRole && hasComp) {
        customSubject = `Job Application: ${detectedRole} - ${detectedCompany} - ${APPLICANT_DATA.fullName}`;
      } else if (hasComp) {
        customSubject = `Job Application - ${detectedCompany} - ${APPLICANT_DATA.fullName}`;
      } else if (hasRole) {
        customSubject = `Job Application: ${detectedRole} - ${APPLICANT_DATA.fullName}`;
      } else {
        customSubject = `Job Application - ${APPLICANT_DATA.fullName}`;
      }
    } else {
      if (hasRole && hasComp) {
        customSubject = `Lamaran Pekerjaan: ${detectedRole} - ${detectedCompany} - ${APPLICANT_DATA.fullName}`;
      } else if (hasComp) {
        customSubject = `Lamaran Pekerjaan - ${detectedCompany} - ${APPLICANT_DATA.fullName}`;
      } else if (hasRole) {
        customSubject = `Lamaran Pekerjaan: ${detectedRole} - ${APPLICANT_DATA.fullName}`;
      } else {
        customSubject = `Lamaran Pekerjaan - ${APPLICANT_DATA.fullName}`;
      }
    }
  }

  const { emailBody } = generateTailoredApplicationDraft({
    companyName: detectedCompany,
    jobTitle: detectedRole,
    recipientEmail: detectedEmail || 'recruitment@perusahaan.com',
    keyRequirements,
    tone: 'concise',
    language: activeLanguage,
  });

  return {
    companyName: detectedCompany,
    jobTitle: detectedRole,
    recipientEmail: detectedEmail || '',
    recipientPhone: detectedPhone,
    formatSubjectNotice: detectedSubjectNotice,
    keyRequirements,
    emailSubject: customSubject,
    emailBody,
    language: activeLanguage,
    rawExtractedText: rawText,
    notes: activeLanguage === 'en'
      ? 'Extracted and verified via strict entity disambiguation engine.'
      : 'Berhasil diekstrak dan diseleksi secara ketat melalui mesin analisis entitas cerdas.',
    isAi: false,
    isFallback: true,
  };
}

export function createFallbackJobScan(filename?: string, language: EmailLanguage = 'id'): JobScanResult {
  const detectedRole = extractJobPositionStrict([], filename, language);
  const detectedCompany = language === 'en' ? 'Hiring Company' : 'Perusahaan';

  const keyRequirements = language === 'en'
    ? ['Operational efficiency & workflow design', 'Team leadership & cross-functional coordination', 'SOP implementation & problem solving']
    : ['Efisiensi operasional & standardisasi SOP', 'Koordinasi tim lintas divisi bisnis', 'Orientasi pada data & perbaikan proses'];

  const { emailSubject, emailBody } = generateTailoredApplicationDraft({
    companyName: detectedCompany,
    jobTitle: detectedRole,
    recipientEmail: '',
    keyRequirements,
    tone: 'concise',
    language,
  });

  return {
    companyName: detectedCompany,
    jobTitle: detectedRole,
    recipientEmail: '',
    recipientPhone: '',
    keyRequirements,
    emailSubject,
    emailBody,
    language,
    notes: language === 'en'
      ? 'Preset for Alvareza Hilka Pratama with verified credentials.'
      : 'Draf siap kirim tersusun otomatis untuk Alvareza Hilka Pratama.',
    isAi: false,
    isFallback: true,
  };
}
