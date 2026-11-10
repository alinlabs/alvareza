import { jsPDF } from 'jspdf';
import { GasAttachment } from '../../types/gasSender';
import {
  getTailoredExperienceDetails,
  getTailoredCertificationSummary,
  APPLICANT_DATA,
} from '../jobApplicationDraft';
import {
  matchPresetFromJobTitle,
  getPresetKeyFromCodeOrKey,
  getRolePresetByKey,
} from '../../data/preset/RoleConfig';
import { PRESET_HEADLINES } from '../../data/preset/HeadlinesSummaries';

export interface CoverLetterOptions {
  companyName?: string;
  jobTitle?: string;
  jobDesk?: string;
  kualifikasi?: string;
  coverLetterDate?: string; // ISO date 'YYYY-MM-DD' or formatted text
  coverLetterCity?: string; // City name, e.g. 'Purwakarta'
  language?: 'in' | 'en' | 'id';
  presetKey?: string;
  headerColor?: string;
  textAlign?: 'left' | 'justify';
  applicantEmail?: string;
}

/**
 * Helper to format cover letter date string into localized readable format.
 */
export function formatCoverLetterDate(
  dateStr?: string,
  lang: 'in' | 'en' | 'id' = 'in'
): string {
  const normalizedLang = lang === 'en' ? 'en' : 'in';

  let raw = (dateStr || '').trim();
  if (!raw) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    raw = `${year}-${month}-${day}`;
  }

  // Check if matches YYYY-MM-DD
  const match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);

    const idMonths = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    const enMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    if (normalizedLang === 'en') {
      return `${enMonths[month] || ''} ${day}, ${year}`;
    }
    return `${day} ${idMonths[month] || ''} ${year}`;
  }

  return raw;
}

/**
 * Helper to format cover letter date string into 3-letter month format (e.g., '12 Okt 2026').
 */
export function formatCoverLetterShortDate(
  dateStr?: string,
  lang: 'in' | 'en' | 'id' = 'in'
): string {
  const normalizedLang = lang === 'en' ? 'en' : 'in';

  let raw = (dateStr || '').trim();
  if (!raw) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    raw = `${year}-${month}-${day}`;
  }

  // Check if matches YYYY-MM-DD
  const match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);

    const idMonths = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];
    const enMonths = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const shortMonth =
      normalizedLang === 'en'
        ? enMonths[month] || ''
        : idMonths[month] || '';

    return `${day} ${shortMonth} ${year}`;
  }

  return raw;
}

const hexToRgb = (hex: string): [number, number, number] => {
  let clean = (hex || '#0062E3').replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) return [0, 98, 227];
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [0, 98, 227];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

/**
 * Builds professional Cover Letter (Surat Lamaran) PDF document using jsPDF.
 * Dynamically tailored to the selected role preset, target position, company name, and location.
 * Standardized at minimum 11pt font size, fitting elegantly on a single A4 page.
 */
export function buildCoverLetterPDFDocument(options: CoverLetterOptions = {}): {
  doc: jsPDF;
  filename: string;
  totalPages: number;
} {
  const isEn = options.language === 'en';
  const lang: 'in' | 'en' = isEn ? 'en' : 'in';
  // Default text alignment is now 'justify', allowing fallback to 'left' if explicitly requested
  const textAlign: 'justify' | 'left' = options.textAlign === 'left' ? 'left' : 'justify';
  const headerColorHex = options.headerColor || '#0062E3';
  const [headerR, headerG, headerB] = hexToRgb(headerColorHex);

  const city = (options.coverLetterCity !== undefined ? options.coverLetterCity : '').trim();
  const formattedDate = formatCoverLetterDate(options.coverLetterDate, lang);

  const rawCompany = (options.companyName || '').trim();
  const hasCompany =
    !!rawCompany &&
    !/^(perusahaan|company|hiring company|organisasi|organization)$/i.test(rawCompany);
  const companyName = hasCompany ? rawCompany : '';

  const rawJobTitle = (options.jobTitle || '').trim();
  const hasJobTitle =
    !!rawJobTitle &&
    !/^(posisi terkait|target position|posisi yang dilamar|posisi|jabatan|role)$/i.test(rawJobTitle);
  const cleanJobTitle = hasJobTitle ? rawJobTitle : '';

  // Dynamically resolve preset role:
  // Strictly prioritize the explicit role preset selected by the user in the role section.
  // Only fall back to auto-matching if presetKey was not provided or empty.
  let resolvedPresetKey = (options.presetKey || '').trim();
  if (!resolvedPresetKey) {
    const matched = cleanJobTitle ? matchPresetFromJobTitle(cleanJobTitle) : null;
    resolvedPresetKey = matched && matched.key ? matched.key : 'optimal';
  }

  const canonicalPresetKey =
    getPresetKeyFromCodeOrKey(resolvedPresetKey) || resolvedPresetKey;

  // Tailor candidate accomplishments, bullets, and certifications to the role
  const experienceDetails = getTailoredExperienceDetails(
    canonicalPresetKey,
    lang,
    cleanJobTitle
  );
  const certificationDesc = getTailoredCertificationSummary(
    canonicalPresetKey,
    lang,
    cleanJobTitle
  );

  // Dynamic Headline adapted strictly to the active role preset
  const presetObj = getRolePresetByKey(canonicalPresetKey);
  const headlineObj = (PRESET_HEADLINES[canonicalPresetKey] ||
    PRESET_HEADLINES[resolvedPresetKey] ||
    PRESET_HEADLINES.optimal) as any;

  let applicantHeadline = '';
  if (headlineObj) {
    applicantHeadline =
      lang === 'en'
        ? headlineObj.en
        : headlineObj.in || headlineObj.id || headlineObj.en;
  } else if (presetObj) {
    applicantHeadline =
      lang === 'en'
        ? presetObj.titleEn || presetObj.tag
        : presetObj.titleIn || presetObj.titleId || presetObj.tag;
  } else {
    applicantHeadline = APPLICANT_DATA.headline;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // Standard line height calculation: 11pt with 1.15 line spacing
  const FONT_SIZE_PT = 11;
  const LINE_SPACING_FACTOR = 1.15;
  doc.setLineHeightFactor(LINE_SPACING_FACTOR);
  const LINE_HEIGHT_MM = (FONT_SIZE_PT * 25.4 / 72) * LINE_SPACING_FACTOR; // ~4.463 mm

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 18;
  const contentWidth = pageWidth - marginX * 2; // 174mm

  // 1. Top Decorative Brand Banner
  doc.setFillColor(headerR, headerG, headerB);
  doc.rect(0, 0, pageWidth, 4, 'F');

  // 2. Applicant Header Section
  const headerStartY = 16.0;

  // # AREA KIRI (Rata Kiri)
  // Line 1: ALVAREZA HILKA (bold 18pt)
  // Line 2: PRATAMA (bold 18pt)
  // Line 3: [Spesialisasi sesuai spesialisasi cv] (normal 11pt, abu-abu slate-500, TIDAK biru dan TIDAK bold)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('ALVAREZA HILKA', marginX, headerStartY);
  doc.text('PRATAMA', marginX, headerStartY + 6.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // slate-500 abu-abu (tidak biru dan tidak bold)
  const maxHeadlineWidth = 115; // reserve width for right contact area
  const headlineLines = doc.splitTextToSize(applicantHeadline, maxHeadlineWidth);
  const leftLine3Y = headerStartY + 12.0;
  headlineLines.forEach((line: string, idx: number) => {
    doc.text(line, marginX, leftLine3Y + idx * 4.5);
  });
  const leftEndY = leftLine3Y + (headlineLines.length - 1) * 4.5;

  // # AREA KANAN (Rata Kanan)
  // Line 1: [Kontak] (normal 11pt)
  // Line 2: [web] (normal 11pt) -> www.alvareza.my.id
  // Line 3: [email] (normal 11pt)
  // Line 4: [Kota] (normal 11pt jika ada atau jika kota seekbar aktif)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // slate-500 abu-abu (sama persis dengan warna spesialisasi)

  const rightX = marginX + contentWidth; // 192 mm
  const cleanPhone = APPLICANT_DATA.phone;
  let cleanWeb = APPLICANT_DATA.portfolioUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  if (!cleanWeb.startsWith('www.')) {
    cleanWeb = `www.${cleanWeb}`;
  }
  const cleanEmail = options.applicantEmail?.trim() || APPLICANT_DATA.email;
  const cityLine = city
    ? city.toLowerCase().includes('indonesia')
      ? city
      : `${city}, Indonesia`
    : '';

  let rightCurY = headerStartY;
  doc.text(cleanPhone, rightX, rightCurY, { align: 'right' });
  rightCurY += 4.5;
  doc.text(cleanWeb, rightX, rightCurY, { align: 'right' });
  rightCurY += 4.5;
  doc.text(cleanEmail, rightX, rightCurY, { align: 'right' });
  if (cityLine) {
    rightCurY += 4.5;
    doc.text(cityLine, rightX, rightCurY, { align: 'right' });
  }
  const rightEndY = rightCurY;

  // Divider Line below the header (standardized neutral grey, allowing only top header banner to change color)
  const maxHeaderY = Math.max(leftEndY, rightEndY);
  let curY = maxHeaderY + 4.5;
  doc.setDrawColor(203, 213, 225); // slate-300 clean neutral grey divider
  doc.setLineWidth(0.45);
  doc.line(marginX, curY, marginX + contentWidth, curY);

  // 3. Metadata (Date & Subject / Hal - Standardized 11pt)
  curY += 6.5;

  if (isEn) {
    // English Letter Metadata
    // Line 1: Date (Aligned Right)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    const dateLineText = city ? `${city}, ${formattedDate}` : formattedDate;
    doc.text(dateLineText, marginX + contentWidth, curY, { align: 'right' });

    // Move to Line 2: Recipient (Separate line below date)
    curY += LINE_HEIGHT_MM;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('To:', marginX, curY);
    curY += LINE_HEIGHT_MM;
    doc.setFont('helvetica', 'normal');
    doc.text('Recruitment Team / Hiring Manager', marginX, curY);
    if (hasCompany) {
      curY += LINE_HEIGHT_MM;
      doc.text(companyName, marginX, curY);
    }

    curY += LINE_HEIGHT_MM * 2;
    doc.setFont('helvetica', 'bold');
    let subjectText = 'Subject: Job Application';
    if (hasJobTitle && hasCompany) {
      subjectText = `Subject: Job Application for ${cleanJobTitle} - ${companyName}`;
    } else if (hasJobTitle) {
      subjectText = `Subject: Job Application for ${cleanJobTitle}`;
    } else if (hasCompany) {
      subjectText = `Subject: Job Application - ${companyName}`;
    }
    const subjectLines = doc.splitTextToSize(subjectText, contentWidth);
    doc.text(subjectLines, marginX, curY);
    curY += (subjectLines.length - 1) * LINE_HEIGHT_MM;

    curY += LINE_HEIGHT_MM * 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Dear Hiring Team,', marginX, curY);
  } else {
    // Indonesian Formal Letter Metadata
    // Line 1: Kota & Tanggal (Rata Kanan)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    const dateLineText = city ? `${city}, ${formattedDate}` : formattedDate;
    doc.text(dateLineText, marginX + contentWidth, curY, {
      align: 'right',
    });

    // Move to Line 2: Hal & Lampiran (Rata Kiri pada baris terpisah di bawah tanggal, tidak sejajar 1 baris)
    curY += LINE_HEIGHT_MM;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);

    doc.text('Hal', marginX, curY);
    doc.text(':', marginX + 18, curY);
    doc.setFont('helvetica', 'bold');
    let halSubjectText = 'Lamaran Pekerjaan';
    if (hasJobTitle) {
      halSubjectText = `Lamaran Pekerjaan – ${cleanJobTitle}`;
    } else if (hasCompany) {
      halSubjectText = `Lamaran Pekerjaan – ${companyName}`;
    }
    const halLines = doc.splitTextToSize(halSubjectText, contentWidth - 22);
    doc.text(halLines, marginX + 22, curY);
    curY += (halLines.length - 1) * LINE_HEIGHT_MM;

    curY += LINE_HEIGHT_MM;
    doc.setFont('helvetica', 'normal');
    doc.text('Lampiran', marginX, curY);
    doc.text(':', marginX + 18, curY);
    doc.text('Berkas Kelengkapan Lamaran', marginX + 22, curY);

    // 1 enter baris kosong sebelum Kepada Yth.
    curY += LINE_HEIGHT_MM * 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Kepada Yth.', marginX, curY);
    curY += LINE_HEIGHT_MM;
    doc.setFont('helvetica', 'normal');
    doc.text('HRD / Tim Rekrutmen', marginX, curY);
    curY += LINE_HEIGHT_MM;
    if (hasCompany) {
      doc.text(companyName, marginX, curY);
    } else {
      doc.text('Bapak/Ibu Pimpinan Perusahaan', marginX, curY);
    }
    curY += LINE_HEIGHT_MM;
    doc.text('di Tempat', marginX, curY);

    // 1 enter baris kosong sebelum salam pembuka Dengan hormat,
    curY += LINE_HEIGHT_MM * 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Dengan hormat,', marginX, curY);
  }

  // Helper function to render body paragraphs without 1.27 cm indent (clean flush block style)
  const renderParagraph = (
    text: string,
    startY: number
  ): number => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59); // slate-800

    const lines: string[] = doc.splitTextToSize(text.trim(), contentWidth);
    if (lines.length === 0) return startY;

    let pY = startY;
    if (textAlign === 'justify' && lines.length > 1) {
      doc.text(lines, marginX, pY, {
        align: 'justify',
        maxWidth: contentWidth,
      });
      pY += (lines.length - 1) * LINE_HEIGHT_MM;
    } else {
      for (let j = 0; j < lines.length; j++) {
        doc.text(lines[j], marginX, pY + j * LINE_HEIGHT_MM);
      }
      pY += (lines.length - 1) * LINE_HEIGHT_MM;
    }

    return pY;
  };

  // 4. Body Paragraph 1: Pembuka / Intro
  // Enter 1 baris kosong pemisah setelah salam pembuka (Dengan hormat,)
  curY += LINE_HEIGHT_MM * 2;

  let introParagraph = '';
  if (isEn) {
    if (hasJobTitle && hasCompany) {
      introParagraph = `I am writing to formally submit my application for the ${cleanJobTitle} position at ${companyName}. With a solid professional background in operational management, governance standards, and digital workflow systems, I am enthusiastic about the opportunity to contribute effectively to your organization.`;
    } else if (hasCompany) {
      introParagraph = `I am writing to formally express my keen interest and submit my job application to explore suitable career opportunities at ${companyName} that align with my qualifications and professional background. With a solid foundation in operational management, governance standards, and digital workflow systems, I am enthusiastic about contributing effectively to your team.`;
    } else if (hasJobTitle) {
      introParagraph = `I am writing to formally submit my application for the ${cleanJobTitle} position. With a solid professional background in operational management, governance standards, and digital workflow systems, I am enthusiastic about the opportunity to contribute effectively to your organization.`;
    } else {
      introParagraph = `I am writing to formally submit my job application to explore suitable career opportunities that align with my qualifications and professional background. With a solid foundation in operational management, governance standards, and digital workflow systems, I am enthusiastic about contributing effectively to your organization.`;
    }
  } else {
    if (hasJobTitle && hasCompany) {
      introParagraph = `Sehubungan dengan informasi lowongan pekerjaan untuk posisi ${cleanJobTitle} di ${companyName}, melalui surat ini saya bermaksud mengajukan diri untuk bergabung dan mendedikasikan kompetensi profesional saya. Saya memiliki motivasi tinggi serta komitmen untuk memberikan kontribusi nyata bagi pertumbuhan dan keberhasilan tim ${companyName}.`;
    } else if (hasCompany) {
      introParagraph = `Melalui surat ini, saya bermaksud mengajukan permohonan lamaran pekerjaan untuk bergabung dan berkarier di ${companyName} pada posisi yang selaras dengan kualifikasi serta kompetensi profesional saya. Saya memiliki motivasi tinggi serta komitmen untuk memberikan kontribusi nyata bagi pertumbuhan dan keberhasilan tim ${companyName}.`;
    } else if (hasJobTitle) {
      introParagraph = `Sehubungan dengan informasi lowongan pekerjaan untuk posisi ${cleanJobTitle}, melalui surat ini saya bermaksud mengajukan diri untuk bergabung dan mendedikasikan kompetensi profesional saya. Saya memiliki motivasi tinggi serta komitmen untuk memberikan kontribusi nyata bagi pencapaian target dan keberhasilan tim kerja perusahaan yang Bapak/Ibu pimpin.`;
    } else {
      introParagraph = `Melalui surat ini, saya bermaksud mengajukan permohonan lamaran pekerjaan untuk bergabung dan mendedikasikan kompetensi profesional saya pada posisi yang relevan dengan latar belakang saya di perusahaan yang Bapak/Ibu pimpin. Saya memiliki motivasi tinggi serta komitmen untuk memberikan kontribusi nyata bagi pertumbuhan dan keberhasilan organisasi.`;
    }
  }

  curY = renderParagraph(introParagraph, curY);

  // 5. Body Paragraph 2: Core Experience Highlights
  // Enter 1 baris kosong sebagai pemisah antar paragraf
  curY += LINE_HEIGHT_MM * 2;

  const expIntro = isEn
    ? `I bring a proven foundation with ${experienceDetails.intro}, highlighting key capabilities such as:`
    : `Saya memiliki latar belakang profesional ${experienceDetails.intro}, dengan portofolio rekam jejak utama antara lain:`;

  curY = renderParagraph(expIntro, curY);

  // Bullets: menjorok sedikit ke dalam secara normal dan rapi (tanpa identasi 1,27 cm berlebihan)
  const bulletSymbolIndent = 3.5; // Simbol • menjorok sedikit dari marginX
  const bulletTextIndent = 7.0;   // Teks menjorok rapi di sebelah simbol •
  const bulletAvailableWidth = contentWidth - bulletTextIndent; // 174 - 7.0 = 167.0 mm

  for (const bullet of experienceDetails.bullets) {
    curY += LINE_HEIGHT_MM;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('•', marginX + bulletSymbolIndent, curY);

    doc.setFont('helvetica', 'normal');
    const bulletLines: string[] = doc.splitTextToSize(bullet, bulletAvailableWidth);
    if (textAlign === 'justify' && bulletLines.length > 1) {
      doc.text(bulletLines, marginX + bulletTextIndent, curY, {
        align: 'justify',
        maxWidth: bulletAvailableWidth,
      });
    } else {
      for (let j = 0; j < bulletLines.length; j++) {
        doc.text(bulletLines[j], marginX + bulletTextIndent, curY + j * LINE_HEIGHT_MM);
      }
    }
    curY += (bulletLines.length - 1) * LINE_HEIGHT_MM;
  }

  // 6. Body Paragraph 3: Certifications & Value Proposition
  // Enter 1 baris kosong sebagai pemisah antar paragraf
  curY += LINE_HEIGHT_MM * 2;

  let certParagraph = '';
  if (isEn) {
    const orgTarget = hasCompany ? `at ${companyName}` : 'within your organization';
    certParagraph = `To complement my practical experience, I hold verified professional credentials in ${certificationDesc}. Combining disciplined ground execution, structured analytical problem-solving, and continuous learning, I am prepared to drive measurable operational efficiencies and uphold high standards of governance ${orgTarget}.`;
  } else {
    const orgTarget = hasCompany ? `di ${companyName}` : 'bagi kemajuan perusahaan';
    certParagraph = `Keahlian praktis saya diperkuat oleh sertifikasi kompetensi resmi dalam ${certificationDesc}. Berbekal perpaduan eksekusi lapangan yang disiplin, pemikiran analitis berbasis data, serta komitmen pembelajaran berkelanjutan, saya siap memberikan solusi bernilai tambah dan menjaga standar tata kelola terbaik ${orgTarget}.`;
  }

  curY = renderParagraph(certParagraph, curY);

  // 7. Body Paragraph 4: Supporting Attachments & Closing
  // Enter 1 baris kosong sebagai pemisah antar paragraf
  curY += LINE_HEIGHT_MM * 2;

  const closingParagraph = isEn
    ? `As supporting consideration, I have enclosed my ATS-compliant CV, official academic credentials, adaptive project portfolio, and relevant certification documents. Thank you for your time and consideration. I would welcome the opportunity to discuss my qualifications further in an interview.`
    : `Sebagai bahan pertimbangan Bapak/Ibu, bersama surat ini turut saya lampirkan Curriculum Vitae (CV) ATS-Friendly terkini, dokumen akademik resmi, portofolio proyek terintegrasi, serta salinan sertifikat kompetensi. Besar harapan saya untuk memperoleh kesempatan wawancara agar dapat menjelaskan kualifikasi dan rencana kontribusi saya secara lebih mendalam. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya sampaikan terima kasih.`;

  curY = renderParagraph(closingParagraph, curY);

  // 8. Sign-off & Applicant Name
  // Enter 1 baris kosong sebelum salam penutup
  curY += LINE_HEIGHT_MM * 2;
  const signOff = isEn ? 'Sincerely,' : 'Hormat saya,';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(signOff, marginX, curY);

  curY += 14.0; // Space for signature
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text(APPLICANT_DATA.fullName, marginX, curY);

  curY += LINE_HEIGHT_MM;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(APPLICANT_DATA.phone, marginX, curY);

  return {
    doc,
    filename: 'surat-lamaran.pdf',
    totalPages: 1,
  };
}

/**
 * Generate Cover Letter PDF attachment formatted for Google Apps Script.
 */
export function generateCoverLetterPdfAttachment(
  options: CoverLetterOptions = {}
): GasAttachment {
  const { doc, filename } = buildCoverLetterPDFDocument(options);

  const dataUri = doc.output('datauristring');
  const base64Data = dataUri.split(',')[1] || '';
  const sizeBytes = Math.round((base64Data.length * 3) / 4);

  return {
    filename,
    mimeType: 'application/pdf',
    base64: base64Data,
    sizeBytes,
  };
}
