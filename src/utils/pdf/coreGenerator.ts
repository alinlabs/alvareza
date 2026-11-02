import { buildKeywordAdaptationRules, adaptCvText, KeywordAdaptationRule } from '../../data/position-detektor/cvKeywordAdapter';
import { PDFStyleOptions } from './types';
import { jsPDF } from 'jspdf';
import { cvData, cvDataEn } from '../../data/cv';
import { PRESET_CODES, resolvePresetFromQuery } from '../../data/preset/RoleConfig';
import {
  PDFRenderContext,
  renderSectionHeader,
  renderHeader,
  renderSummary,
  renderMetrics,
  renderExperiences,
  renderEducation,
  renderSkills,
  renderCertifications,
  renderConsultingProjects,
  renderDigitalSolutions,
  renderOrganizations,
  renderAchievements,
} from './renderers';

export const formatColonSpacing = (text: string): string => {
  if (!text) return text;
  return text.replace(/(?<!https?)\s*:/gi, ' :');
};

export const buildATSPDFDocument = (
  languageOrOptions?: 'in' | 'en' | 'id' | (PDFStyleOptions & { language?: 'in' | 'en' | 'id' }),
  optionsArg?: PDFStyleOptions
): { doc: jsPDF; filename: string; totalPages: number } => {
  let lang: 'in' | 'en' = 'in';
  let options: PDFStyleOptions | undefined = optionsArg;

  if (typeof languageOrOptions === 'string') {
    lang = (languageOrOptions === 'id' ? 'in' : languageOrOptions) as 'in' | 'en';
  } else if (typeof languageOrOptions === 'object' && languageOrOptions !== null) {
    if (!('nativeEvent' in languageOrOptions)) {
      options = languageOrOptions as PDFStyleOptions;
      if (options.language === 'en' || options.language === 'in' || options.language === 'id') {
        lang = options.language === 'en' ? 'en' : 'in';
      }
    }
  }

  const rawCv = lang === 'en' ? cvDataEn : cvData;
  const effectiveEmail = options?.applicantEmail?.trim() || rawCv.personalInfo.email;
  const cv = {
    ...rawCv,
    personalInfo: {
      ...rawCv.personalInfo,
      email: effectiveEmail,
    },
  };

  // Inisialisasi aturan adaptasi sinonim jika jobContext diberikan dari Modal Lamar Kerja
  const adaptationResult = options?.jobContext ? buildKeywordAdaptationRules(options.jobContext) : { rules: [] };
  const adaptRules: KeywordAdaptationRule[] = adaptationResult.rules;
  const adapt = (str: string): string => {
    if (!str || adaptRules.length === 0) return str;
    return adaptCvText(str, adaptRules);
  };

  const margin = options?.marginMm ?? 15;
  const scale = options?.fontSizeScale ?? 1.0;
  const textAlign = options?.textAlign ?? 'left';
  const headerStyle = options?.headerStyle ?? 'solid-banner';

  const hexToRgb = (hex: string): [number, number, number] => {
    let clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    if (clean.length !== 6) return [15, 23, 42];
    const num = parseInt(clean, 16);
    if (isNaN(num)) return [15, 23, 42];
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  // Palette: Deep Navy / Header Banner Color & Charcoal Text
  const primaryNavy: [number, number, number] = [15, 23, 42]; // #0F172A - Fixed Deep Navy for Candidate Name & Companies
  const darkNavyAccent: [number, number, number] = [15, 23, 42]; // #0F172A
  const headerBannerColor: [number, number, number] = options?.headerColor
    ? hexToRgb(options.headerColor)
    : [15, 23, 42]; // #0F172A - Custom color ONLY for Section Header Blocks/Lines
  const darkSlate: [number, number, number] = [30, 41, 59]; // #1E293B - High-Contrast Black/Slate for Bold text
  const bodySlate: [number, number, number] = [51, 65, 85]; // #334155 - Smooth Charcoal Body for Regular text
  const mutedSlate: [number, number, number] = [100, 116, 139]; // #64748B - Muted Subtitles & Dates
  const ruleGray: [number, number, number] = [203, 213, 225]; // #CBD5E1 - Light Dividers

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Helper for clean page break with top margin preservation
  const checkPageBreak = (neededHeight: number): boolean => {
    // allow content to reach up to 2mm before the margin (which is 3mm before the footer line)
    if (currentY + neededHeight > pageHeight - margin - 2) {
      doc.addPage();
      currentY = margin + 4; // Top margin on subsequent pages
      return true;
    }
    return false;
  };

  /**
   * Helper to print professional hanging indent bullet points.
   */
  const addHangingBullet = (
    text: string,
    opts?: {
      bulletChar?: string;
      bulletOffset?: number;
      textOffset?: number;
      lineHeight?: number;
      gapAfter?: number;
      fontStyle?: 'normal' | 'bold' | 'italic';
      textColor?: [number, number, number];
      bulletColor?: [number, number, number];
    }
  ) => {
    const bulletChar = opts?.bulletChar ?? '•';
    const bulletOffset = opts?.bulletOffset ?? 1.2;
    const textOffset = opts?.textOffset ?? 5.2;
    const lineHeight = opts?.lineHeight ?? 3.7 * scale;
    const gapAfter = opts?.gapAfter ?? 1.2 * scale;
    const fontStyle = opts?.fontStyle ?? 'normal';
    const textColor = opts?.textColor ?? bodySlate;
    const bulletColor = opts?.bulletColor ?? primaryNavy;

    const bulletX = margin + bulletOffset;
    const textX = margin + textOffset;
    const textWidth = contentWidth - textOffset;

    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(8.4 * scale);

    const splitText = doc.splitTextToSize(formatColonSpacing(text), textWidth);
    checkPageBreak(splitText.length * lineHeight + gapAfter);

    // Draw bullet symbol
    doc.setTextColor(...bulletColor);
    doc.setFont('helvetica', 'bold');
    doc.text(bulletChar, bulletX, currentY);

    // Draw multi-line text
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(...textColor);
    if (textAlign === 'justify') {
      doc.text(splitText, textX, currentY, { align: 'justify', maxWidth: textWidth });
    } else {
      doc.text(splitText, textX, currentY);
    }

    currentY += splitText.length * lineHeight + gapAfter;
  };

  /**
   * Helper to render a bullet point where the prefix before the colon is Bold
   * and the following text is Regular, with strict hanging indent wrapping.
   */
  const addBoldPrefixHangingBullet = (
    boldPrefix: string,
    bodyText: string,
    opts?: {
      bulletChar?: string;
      bulletOffset?: number;
      textOffset?: number;
      lineHeight?: number;
      gapAfter?: number;
      fontSize?: number;
      prefixColor?: [number, number, number];
      bodyColor?: [number, number, number];
      bulletColor?: [number, number, number];
    }
  ) => {
    const bulletChar = opts?.bulletChar ?? '•';
    const bulletOffset = opts?.bulletOffset ?? 1.2;
    const textOffset = opts?.textOffset ?? (bulletChar ? 5.2 : 0);
    const lineHeight = opts?.lineHeight ?? 3.5 * scale;
    const gapAfter = opts?.gapAfter ?? 1.0 * scale;
    const fontSize = opts?.fontSize ?? 8.3 * scale;
    const prefixColor = opts?.prefixColor ?? primaryNavy;
    const bodyColor = opts?.bodyColor ?? bodySlate;
    const bulletColor = opts?.bulletColor ?? primaryNavy;

    const bulletX = margin + bulletOffset;
    const textX = margin + textOffset;
    const textWidth = contentWidth - textOffset;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fontSize);

    const cleanPrefix = boldPrefix.trim().replace(/\s*:\s*$/, '');
    const formattedPrefix = formatColonSpacing(cleanPrefix) + ' :';
    const prefixWithSpace = formattedPrefix + ' ';
    const prefixWidth = doc.getTextWidth(prefixWithSpace);

    const processedBodyText = formatColonSpacing(bodyText);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);

    const words = processedBodyText.trim().split(/\s+/);
    const firstLineWords: string[] = [];
    let remainingWords: string[] = [];
    const firstLineAvailable = textWidth - prefixWidth;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testText = firstLineWords.length === 0 ? word : firstLineWords.join(' ') + ' ' + word;
      if (doc.getTextWidth(testText) <= firstLineAvailable) {
        firstLineWords.push(word);
      } else {
        remainingWords = words.slice(i);
        break;
      }
    }

    const firstLineNormalText = firstLineWords.join(' ');
    const remainingText = remainingWords.join(' ');
    const remainingLines = remainingText ? doc.splitTextToSize(remainingText, textWidth) : [];
    const totalLines = 1 + remainingLines.length;

    checkPageBreak(totalLines * lineHeight + gapAfter);

    // Draw bullet symbol if present
    if (bulletChar) {
      doc.setTextColor(...bulletColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(fontSize);
      doc.text(bulletChar, bulletX, currentY);
    }

    // Draw bold prefix on first line
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...prefixColor);
    doc.text(prefixWithSpace, textX, currentY);

    // Draw normal text on first line
    if (firstLineNormalText) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...bodyColor);
      if (textAlign === 'justify' && remainingLines.length > 0) {
        doc.text([firstLineNormalText, ''], textX + prefixWidth, currentY, { align: 'justify', maxWidth: firstLineAvailable });
      } else {
        doc.text(firstLineNormalText, textX + prefixWidth, currentY);
      }
    }

    // Draw subsequent lines with hanging indent
    if (remainingLines.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...bodyColor);
      if (textAlign === 'justify') {
        doc.text(remainingLines, textX, currentY + lineHeight, { align: 'justify', maxWidth: textWidth });
      } else {
        for (let j = 0; j < remainingLines.length; j++) {
          doc.text(remainingLines[j], textX, currentY + (j + 1) * lineHeight);
        }
      }
    }

    currentY += totalLines * lineHeight + gapAfter;
  };

  /**
   * Helper to render an array of string items across a 4-column grid with bullets.
   */
  const addFourColumnBullets = (
    items: string[],
    opts?: {
      lineHeight?: number;
      gapAfter?: number;
      fontSize?: number;
      textColor?: [number, number, number];
      bulletColor?: [number, number, number];
    }
  ) => {
    const lineHeight = opts?.lineHeight ?? 3.3 * scale;
    const gapAfter = opts?.gapAfter ?? 1.2 * scale;
    const fontSize = opts?.fontSize ?? 7.8 * scale;
    const textColor = opts?.textColor ?? bodySlate;
    const bulletColor = opts?.bulletColor ?? primaryNavy;

    const numCols = 4;
    const colWidth = contentWidth / numCols;
    const bulletSymbol = '•';
    const totalRows = Math.ceil(items.length / numCols);

    for (let r = 0; r < totalRows; r++) {
      let maxLinesInRow = 1;
      const rowItems: { col: number; text: string; lines: string[]; x: number }[] = [];

      for (let c = 0; c < numCols; c++) {
        const idx = r * numCols + c;
        if (idx < items.length) {
          const text = items[idx];
          const cellX = margin + c * colWidth;
          const maxTextWidth = colWidth - 3.8 * scale;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(fontSize);
          const lines = doc.splitTextToSize(text, maxTextWidth);
          maxLinesInRow = Math.max(maxLinesInRow, lines.length);

          rowItems.push({
            col: c,
            text,
            lines,
            x: cellX,
          });
        }
      }

      const rowHeight = maxLinesInRow * lineHeight;
      checkPageBreak(rowHeight + 0.5 * scale);

      rowItems.forEach((cell) => {
        // Bullet
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(fontSize);
        doc.setTextColor(...bulletColor);
        doc.text(bulletSymbol, cell.x, currentY);

        // Lines
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fontSize);
        doc.setTextColor(...textColor);
        cell.lines.forEach((lineText, lineIdx) => {
          doc.text(lineText, cell.x + 2.8 * scale, currentY + lineIdx * lineHeight);
        });
      });

      currentY += rowHeight + 0.6 * scale;
    }

    currentY += gapAfter;
  };

  const canonicalPreset = (options?.preset && resolvePresetFromQuery(options.preset)) || options?.preset;

  const ctx: PDFRenderContext = {
    doc,
    lang,
    options,
    cv,
    margin,
    scale,
    pageWidth,
    pageHeight,
    contentWidth,
    primaryNavy,
    darkNavyAccent,
    headerBannerColor,
    darkSlate,
    bodySlate,
    mutedSlate,
    ruleGray,
    textAlign,
    headerStyle,
    canonicalPreset,
    adapt,
    getY: () => currentY,
    setY: (y: number) => { currentY = y; },
    addY: (dy: number) => { currentY += dy; },
    checkPageBreak,
    addHangingBullet,
    addBoldPrefixHangingBullet,
    addFourColumnBullets,
    addSectionHeader: (title: string, isFirstSection = false, minFirstItemHeight = 22.0 * scale) => {
      renderSectionHeader(ctx, title, isFirstSection, minFirstItemHeight);
    },
  };

  // 1. TOP HEADER (EXECUTIVE TYPOGRAPHY & ATS COMPLIANT)
  renderHeader(ctx);

  // 2. RINGKASAN PROFESIONAL (PROFESSIONAL SUMMARY)
  renderSummary(ctx);

  // 3. SOROTAN KINERJA & METRIK KUNCI (KEY METRICS)
  renderMetrics(ctx);

  // 4. PENGALAMAN KERJA (WORK EXPERIENCE)
  renderExperiences(ctx);

  // 5. PENDIDIKAN (EDUCATION)
  renderEducation(ctx);

  // 6. KEAHLIAN & KOMPETENSI (SKILLS & COMPETENCIES)
  renderSkills(ctx);

  // 7. SERTIFIKASI PROFESIONAL (PROFESSIONAL CERTIFICATIONS)
  renderCertifications(ctx);

  // 8. PORTOFOLIO KONSULTANSI & PROYEK INDEPENDEN
  renderConsultingProjects(ctx);

  // 9. PORTOFOLIO SISTEM & SOLUSI DIGITAL
  renderDigitalSolutions(ctx);

  // 10. PENGALAMAN ORGANISASI & KEPEMIMPINAN
  renderOrganizations(ctx);

  // 11. PRESTASI & PENGHARGAAN
  renderAchievements(ctx);

  // FOOTER & PAGINATION ON ALL PAGES
  const totalPages = doc.getNumberOfPages();

  // Standard filename format: cv-[code 3 huruf]-alvareza-[code bahasa].pdf (e.g. cv-hrs-alvareza-in.pdf)
  const presetKey = options?.preset || 'optimal';
  const cleanPreset = presetKey.toLowerCase().trim();
  const rawCode = PRESET_CODES[cleanPreset] || PRESET_CODES[resolvePresetFromQuery(cleanPreset) || ''] || cleanPreset;
  const presetCode = rawCode.toLowerCase().slice(0, 3) || 'opt';
  const langCode = lang === 'en' ? 'en' : 'in';
  const filename = `cv-${presetCode}-alvareza-${langCode}.pdf`;

  return { doc, filename, totalPages };
};
