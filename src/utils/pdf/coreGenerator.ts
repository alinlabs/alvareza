import { PRESET_HEADLINES, PRESET_SUMMARIES } from '../../data/presetHeadlinesSummaries';
import { PDFSectionsConfig, PDFItemSelectionConfig, PDFStyleOptions } from './types';
import { jsPDF } from 'jspdf';
import { cvData } from '../../data/cvData';
import { cvDataEn } from '../../data/cvDataEn';
import { getTailoredExperiences } from '../../data/tailoredExperiences';
import { getTailoredConsulting, getTailoredDigitalSolutions } from '../../data/tailoredProjects';
import { getTailoredOrganizations } from '../../data/tailoredOrganizations';
import { getTailoredMetrics } from '../../data/tailoredMetrics';
import { PRESET_CODES } from '../../data/rolePresetsConfig';

export const formatColonSpacing = (text: string): string => {
  if (!text) return text;
  return text.replace(/(?<!https?)\s*:/gi, ' :');
};

export const buildATSPDFDocument = (
  languageOrOptions?: 'id' | 'en' | (PDFStyleOptions & { language?: 'id' | 'en' }),
  optionsArg?: PDFStyleOptions
): { doc: jsPDF; filename: string; totalPages: number } => {
  let lang: 'id' | 'en' = 'id';
  let options: PDFStyleOptions | undefined = optionsArg;

  if (typeof languageOrOptions === 'string') {
    lang = languageOrOptions;
  } else if (typeof languageOrOptions === 'object' && languageOrOptions !== null) {
    if (!('nativeEvent' in languageOrOptions)) {
      options = languageOrOptions as PDFStyleOptions;
      if (options.language === 'en' || options.language === 'id') {
        lang = options.language;
      }
    }
  }

  const cv = lang === 'en' ? cvDataEn : cvData;

  const margin = options?.marginMm ?? 15;
  const scale = options?.fontSizeScale ?? 1.0;
  const textAlign = options?.textAlign ?? 'left';

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
  let pageCount = 1;

  // Helper for clean page break with top margin preservation
  const checkPageBreak = (neededHeight: number): boolean => {
    // allow content to reach up to 2mm before the margin (which is 3mm before the footer line)
    if (currentY + neededHeight > pageHeight - margin - 2) {
      doc.addPage();
      pageCount++;
      currentY = margin + 4; // Top margin on subsequent pages
      return true;
    }
    return false;
  };

  /**
   * Helper to print professional hanging indent bullet points.
   * Ensures the bullet sits cleanly on the left, and subsequent lines of text
   * align strictly with the first word of the text (NOT under the bullet).
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

  const headerStyle = options?.headerStyle ?? 'solid-banner';

  // --- SECTION HEADER HELPER (PRECISE VERTICAL RHYTHM: COMPACT & BALANCED) ---
  const addSectionHeader = (title: string, isFirstSection = false, minFirstItemHeight = 22.0 * scale) => {
    // Balanced gap before new sections (depends on header style)
    let gapBefore = isFirstSection ? 2.0 * scale : 2.5 * scale;
    if (!isFirstSection && headerStyle !== 'solid-banner' && headerStyle !== 'badge') {
      gapBefore = 6.0 * scale; // Extra breathing room for line modes since they don't have a banner box
    }
    const bannerHeight = 5.2 * scale;
    // Check page break for section header PLUS first item height to prevent orphan headers
    checkPageBreak(bannerHeight + minFirstItemHeight + gapBefore);
    currentY += gapBefore;

    if (headerStyle === 'solid-banner') {
      // Solid Dark Filled Box (100% Vector Rectangle)
      doc.setFillColor(...headerBannerColor);
      doc.rect(margin, currentY, contentWidth, bannerHeight, 'F');

      // Crisp White High-Contrast ATS Text inside banner
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0 * scale);
      doc.setTextColor(255, 255, 255);
      doc.text(title.toUpperCase(), margin + 2.4, currentY + bannerHeight - 1.6 * scale);

      // Comfortable vertical space from bottom of banner to top of first line text
      currentY += bannerHeight + 4.6 * scale;
    } else if (headerStyle === 'badge') {
      // Badge (Block around text only)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0 * scale);
      
      const titleUpper = title.toUpperCase();
      const textWidth = doc.getTextWidth(titleUpper);
      const badgeWidth = textWidth + 4.8 * scale; // padding left/right
      const badgeHeight = 5.2 * scale;
      
      doc.setFillColor(...headerBannerColor);
      doc.rect(margin, currentY, badgeWidth, badgeHeight, 'F');

      doc.setTextColor(255, 255, 255);
      doc.text(titleUpper, margin + 2.4 * scale, currentY + badgeHeight - 1.6 * scale);

      currentY += badgeHeight + 4.6 * scale;
    } else if (headerStyle === 'plain') {
      // Just bold text, no lines, no backgrounds
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.0 * scale);
      doc.setTextColor(...headerBannerColor);
      doc.text(title.toUpperCase(), margin, currentY);
      currentY += 3.6 * scale; // standard bottom gap
    } else if (headerStyle === 'navy-double') {
      // Section Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.0 * scale);
      doc.setTextColor(...headerBannerColor);
      doc.text(title.toUpperCase(), margin, currentY);
      currentY += 1.8 * scale;

      doc.setDrawColor(...headerBannerColor);
      doc.setLineWidth(0.4);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      doc.line(margin, currentY + 0.8, pageWidth - margin, currentY + 0.8);
      currentY += 3.6 * scale;
    } else if (headerStyle === 'minimal-thin') {
      // Section Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.0 * scale);
      doc.setTextColor(...headerBannerColor);
      doc.text(title.toUpperCase(), margin, currentY);
      currentY += 1.8 * scale;

      doc.setDrawColor(...ruleGray);
      doc.setLineWidth(0.35);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 3.6 * scale;
    } else {
      // Line Design Style (navy-solid)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.0 * scale);
      doc.setTextColor(...headerBannerColor);
      doc.text(title.toUpperCase(), margin, currentY);
      currentY += 1.8 * scale;

      doc.setDrawColor(...headerBannerColor);
      doc.setLineWidth(0.55 * scale); // Normal clean line thickness
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 3.6 * scale;
    }
  };

  // ==========================================
  // 1. TOP HEADER (EXECUTIVE TYPOGRAPHY & ATS COMPLIANT)
  // ==========================================
  const centerX = pageWidth / 2;

  // Full Name (BOLD SOLID NAVY)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18.0 * scale);
  doc.setTextColor(...primaryNavy);
  doc.text(cv.personalInfo.fullName.toUpperCase(), centerX, currentY, { align: 'center' });
  currentY += 4.5 * scale;

  // Professional Headline (BOLD DARK SLATE)
  const activeHeadline =
    options?.headline ||
    (options?.preset && PRESET_HEADLINES[options.preset]?.[lang]) ||
    cv.personalInfo.headline;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.8 * scale);
  doc.setTextColor(...darkSlate);

  const maxHeadlineWidth = pageWidth - 2 * margin;
  const headlineLines = doc.splitTextToSize(activeHeadline, maxHeadlineWidth);
  headlineLines.forEach((line: string) => {
    doc.text(line, centerX, currentY, { align: 'center' });
    currentY += 4.5 * scale;
  });
  currentY += 1.0 * scale;

  // Contact Info Row (Clickable Links & Centered)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2 * scale);
  
  const contactItems = [
    { text: cv.personalInfo.phone, url: `https://wa.me/${cv.personalInfo.phone.replace(/\D/g, '')}` },
    { text: cv.personalInfo.email, url: `mailto:${cv.personalInfo.email}` },
    { text: cv.personalInfo.linkedin, url: `https://${cv.personalInfo.linkedin.replace(/^https?:\/\//, '')}` },
    { text: cv.personalInfo.website, url: `https://${cv.personalInfo.website.replace(/^https?:\/\//, '')}` }
  ].filter(item => item.text);

  const separator = "   |   ";
  
  // Calculate total width of the line to center it
  let totalWidth = 0;
  contactItems.forEach((item, index) => {
    totalWidth += doc.getTextWidth(item.text);
    if (index < contactItems.length - 1) {
      totalWidth += doc.getTextWidth(separator);
    }
  });

  let startX = centerX - (totalWidth / 2);

  // Render each piece
  contactItems.forEach((item, index) => {
    const textWidth = doc.getTextWidth(item.text);
    doc.setTextColor(...mutedSlate); // keep the same sleek color
    
    if (item.url) {
      doc.textWithLink(item.text, startX, currentY, { url: item.url });
    } else {
      doc.text(item.text, startX, currentY);
    }
    startX += textWidth;

    if (index < contactItems.length - 1) {
      doc.text(separator, startX, currentY);
      startX += doc.getTextWidth(separator);
    }
  });

  currentY += (3.6 * scale) + (1.5 * scale);

  const sec = options?.sections;
  const itm = options?.items;

  // ==========================================
  // 2. RINGKASAN PROFESIONAL (PROFESSIONAL SUMMARY)
  // ==========================================
  const isSummaryActive = itm ? itm.summary === true : sec?.summary !== false;
  if (isSummaryActive) {
    addSectionHeader(lang === 'en' ? 'Professional Summary' : 'Ringkasan', true);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5 * scale);
    doc.setTextColor(...bodySlate);
    const activeSummary =
      options?.summaryText ||
      (options?.preset && PRESET_SUMMARIES[options.preset]?.[lang]) ||
      cv.personalInfo.summary;
    const summaryLines = doc.splitTextToSize(activeSummary, contentWidth);
    if (textAlign === 'justify') {
      doc.text(summaryLines, margin, currentY, { align: 'justify', maxWidth: contentWidth });
    } else {
      doc.text(summaryLines, margin, currentY);
    }
    currentY += (summaryLines.length - 1) * (3.8 * scale) + (3.6 * scale);
  }

  // ==========================================
  // 3. SOROTAN KINERJA & METRIK KUNCI (KEY METRICS)
  // ==========================================
  const tailoredMetricsList = getTailoredMetrics(options?.preset, lang, itm?.certifications);
  const allMetricItems = tailoredMetricsList.map((m, idx) => ({
    idx,
    prefix: `${m.value} ${m.label}`,
    body: m.sublabel,
  }));

  let activeMetrics = itm?.metrics
    ? allMetricItems.filter((m) => itm.metrics?.[m.idx])
    : sec?.metrics !== false ? allMetricItems : [];

  if (options?.sectionOrders?.metrics) {
    const order = options.sectionOrders.metrics;
    activeMetrics = [...activeMetrics].sort((a, b) => {
      const idxA = order.indexOf(a.idx);
      const idxB = order.indexOf(b.idx);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    });
  }

  if (activeMetrics.length > 0) {
    addSectionHeader(lang === 'en' ? 'Key Metrics & Performance Highlights' : 'Sorotan Kinerja & Metrik Kunci');
    activeMetrics.forEach((m) => {
      addBoldPrefixHangingBullet(m.prefix, m.body, {
        bulletChar: '•',
        gapAfter: 1.1 * scale,
        lineHeight: 3.6 * scale,
        fontSize: 8.3 * scale,
        prefixColor: primaryNavy,
        bodyColor: bodySlate,
      });
    });
  }

  // ==========================================
  // 4. PENGALAMAN KERJA (WORK EXPERIENCE)
  // ==========================================
  const sourceExperiences = getTailoredExperiences(options?.preset, lang);
  let activeExperiences = itm?.experiences
    ? sourceExperiences.filter((exp) => itm.experiences?.[exp.id])
    : sec?.experience !== false ? sourceExperiences : [];

  if (options?.sectionOrders?.experiences) {
    const order = options.sectionOrders.experiences;
    activeExperiences = [...activeExperiences].sort((a, b) => {
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    });
  }

  if (activeExperiences.length > 0) {
    addSectionHeader(lang === 'en' ? 'Work Experience' : 'Pengalaman');

    activeExperiences.forEach((exp, expIdx) => {
      checkPageBreak(12 * scale);

      if (expIdx > 0) {
        currentY += 6.5 * scale;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.4 * scale);
      doc.setTextColor(...primaryNavy);
      doc.text(exp.company.toUpperCase(), margin, currentY);

      const locationText = exp.location ? `${exp.location} (${exp.type})` : exp.type;
      doc.text(locationText, pageWidth - margin, currentY, { align: 'right' });
      currentY += 3.8 * scale;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.8 * scale);
      doc.setTextColor(...darkSlate);
      doc.text(exp.role, margin, currentY);

      doc.text(exp.period, pageWidth - margin, currentY, { align: 'right' });
      currentY += 3.8 * scale;

      if (exp.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.3 * scale);
        doc.setTextColor(...bodySlate);
        const descLines = doc.splitTextToSize(exp.description, contentWidth);
        if (textAlign === 'justify') {
          doc.text(descLines, margin, currentY, { align: 'justify', maxWidth: contentWidth });
        } else {
          doc.text(descLines, margin, currentY);
        }
        currentY += descLines.length * (3.6 * scale) + (1.2 * scale);
      }

      exp.highlights.forEach((hl) => {
        addHangingBullet(hl, {
          fontStyle: 'normal',
          textColor: bodySlate,
          bulletColor: primaryNavy,
          textOffset: 5.2,
          bulletOffset: 1.2,
          lineHeight: 3.6 * scale,
          gapAfter: 1.0 * scale,
        });
      });

      if (exp.tools && exp.tools.length > 0) {
        addBoldPrefixHangingBullet('Tools & Platform', exp.tools.join(', '), {
          bulletChar: '',
          textOffset: 5.2,
          bulletOffset: 1.2,
          lineHeight: 3.4 * scale,
          gapAfter: 1.2 * scale,
          fontSize: 7.8 * scale,
          prefixColor: darkSlate,
          bodyColor: mutedSlate,
        });
      }
    });
  }

  // ==========================================
  // 5. PENDIDIKAN (EDUCATION)
  // ==========================================
  const allEduItems = cv.education.map((edu, idx) => ({ ...edu, idx }));
  let activeEducation = itm?.education
    ? allEduItems.filter((edu) => itm.education?.[edu.idx])
    : sec?.education !== false ? allEduItems : [];

  if (options?.sectionOrders?.education) {
    const order = options.sectionOrders.education;
    activeEducation = [...activeEducation].sort((a, b) => {
      const idxA = order.indexOf(a.idx);
      const idxB = order.indexOf(b.idx);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    });
  }

  if (activeEducation.length > 0) {
    addSectionHeader(lang === 'en' ? 'Education' : 'Pendidikan');
    activeEducation.forEach((edu, eduIdx) => {
      checkPageBreak(16 * scale);

      if (eduIdx > 0) {
        currentY += 2.8 * scale;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.2 * scale);
      doc.setTextColor(...primaryNavy);
      doc.text(edu.institution.toUpperCase(), margin, currentY);

      doc.text(edu.period, pageWidth - margin, currentY, { align: 'right' });
      currentY += 3.8 * scale;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.6 * scale);
      doc.setTextColor(...darkSlate);
      doc.text(edu.degree, margin, currentY);
      currentY += 3.6 * scale;

      if (edu.detail) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...bodySlate);
        const detailLines = doc.splitTextToSize(edu.detail, contentWidth);
        if (textAlign === 'justify') {
          doc.text(detailLines, margin, currentY, { align: 'justify', maxWidth: contentWidth });
        } else {
          doc.text(detailLines, margin, currentY);
        }
        currentY += detailLines.length * (3.4 * scale) + (1.2 * scale);
      }
    });
  }

  // ==========================================
  // 6. KEAHLIAN & KOMPETENSI (SKILLS & COMPETENCIES)
  // ==========================================
  const skillConfig = itm?.skills;

  const showHardSkills = skillConfig
    ? (skillConfig.hardGroup !== false) &&
      (typeof skillConfig.hard === 'boolean'
        ? skillConfig.hard
        : Object.values(skillConfig.hard || {}).some(Boolean))
    : sec?.skills !== false;

  const showSoftSkills = skillConfig
    ? (skillConfig.softGroup !== false) &&
      (typeof skillConfig.soft === 'boolean'
        ? skillConfig.soft
        : Object.values(skillConfig.soft || {}).some(Boolean))
    : sec?.skills !== false;

  const showToolsSkills = skillConfig
    ? (skillConfig.toolsGroup !== false) &&
      (typeof skillConfig.tools === 'boolean'
        ? skillConfig.tools
        : Object.values(skillConfig.tools || {}).some(Boolean))
    : sec?.skills !== false;

  const hasAnySkills = showHardSkills || showSoftSkills || showToolsSkills;

  if (hasAnySkills) {
    addSectionHeader(lang === 'en' ? 'Core Competencies & Skills' : 'Keahlian');

    // Hard skills sorted
    let hardSkillItems = cv.skills.hard.map((group, idx) => ({ ...group, idx }));
    if (options?.sectionOrders?.skills_hard) {
      const order = options.sectionOrders.skills_hard;
      hardSkillItems = [...hardSkillItems].sort((a, b) => {
        const idxA = order.indexOf(a.idx);
      const idxB = order.indexOf(b.idx);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
      });
    }

    // Soft skills sorted
    let softSkillItems = cv.skills.soft.map((item, idx) => ({ item, idx }));
    if (options?.sectionOrders?.skills_soft) {
      const order = options.sectionOrders.skills_soft;
      softSkillItems = [...softSkillItems].sort((a, b) => {
        const idxA = order.indexOf(a.idx);
      const idxB = order.indexOf(b.idx);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
      });
    }

    // Tool categories sorted
    let toolCatItems = (cv.skills.toolCategories || []).map((cat, idx) => ({ ...cat, idx }));
    if (options?.sectionOrders?.skills_tools) {
      const order = options.sectionOrders.skills_tools;
      toolCatItems = [...toolCatItems].sort((a, b) => {
        const idxA = order.indexOf(a.idx);
      const idxB = order.indexOf(b.idx);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
      });
    }

    const renderHardSkills = () => {
      if (!showHardSkills) return;
      checkPageBreak(12 * scale);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5 * scale);
      doc.setTextColor(...primaryNavy);
      doc.text('Hard Skills:', margin, currentY);
      currentY += 3.4 * scale;

      hardSkillItems.forEach((group) => {
        const isSelected =
          typeof skillConfig?.hard === 'object'
            ? !!skillConfig.hard[group.idx]
            : true;

        if (isSelected) {
          addBoldPrefixHangingBullet(group.category, group.items.join(', '), {
            gapAfter: 0.9 * scale,
            lineHeight: 3.5 * scale,
            fontSize: 8.3 * scale,
            prefixColor: primaryNavy,
            bodyColor: bodySlate,
            bulletColor: primaryNavy,
          });
        }
      });
      currentY += 1.4 * scale;
    };

    const renderSoftSkills = () => {
      if (!showSoftSkills) return;
      checkPageBreak(10 * scale);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5 * scale);
      doc.setTextColor(...primaryNavy);
      doc.text(lang === 'en' ? 'Soft Skills & Leadership:' : 'Soft Skills & Kepemimpinan:', margin, currentY);
      currentY += 3.4 * scale;

      softSkillItems.forEach(({ item, idx }) => {
        const isSelected =
          typeof skillConfig?.soft === 'object'
            ? !!skillConfig.soft[idx]
            : true;

        if (isSelected) {
          const colonIdx = item.indexOf(':');
          const prefix = colonIdx !== -1 ? item.substring(0, colonIdx) : item;
          const body = colonIdx !== -1 ? item.substring(colonIdx + 1) : '';
          addBoldPrefixHangingBullet(prefix, body, {
            bulletChar: '•',
            gapAfter: 0.9 * scale,
            lineHeight: 3.5 * scale,
            fontSize: 8.3 * scale,
            prefixColor: primaryNavy,
            bodyColor: bodySlate,
          });
        }
      });
      currentY += 1.4 * scale;
    };

    const renderToolsSkills = () => {
      if (!showToolsSkills) return;
      checkPageBreak(10 * scale);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5 * scale);
      doc.setTextColor(...primaryNavy);
      doc.text(lang === 'en' ? 'Tools & Software Ecosystem:' : 'Tools & Ekosistem Digital:', margin, currentY);
      currentY += 3.4 * scale;

      toolCatItems.forEach((cat) => {
        const isSelected =
          typeof skillConfig?.tools === 'object'
            ? !!skillConfig.tools[cat.idx]
            : true;

        if (isSelected) {
          addBoldPrefixHangingBullet(cat.category, cat.tools, {
            bulletChar: '•',
            gapAfter: 0.9 * scale,
            lineHeight: 3.5 * scale,
            fontSize: 8.3 * scale,
            prefixColor: primaryNavy,
            bodyColor: bodySlate,
          });
        }
      });
      currentY += 1.4 * scale;
    };

    const skillsGroupOrder = options?.sectionOrders?.skills || ['hard', 'soft', 'tools'];
    skillsGroupOrder.forEach((grp) => {
      if (grp === 'hard') renderHardSkills();
      else if (grp === 'soft') renderSoftSkills();
      else if (grp === 'tools') renderToolsSkills();
    });
  }

  // ==========================================
  // 7. SERTIFIKASI PROFESIONAL (PROFESSIONAL CERTIFICATIONS)
  // ==========================================
  let activeCertifications = itm?.certifications
    ? (cv.certifications || []).filter((cert) => itm.certifications?.[cert.id])
    : sec?.certifications !== false ? (cv.certifications || []) : [];

  if (options?.sectionOrders?.certifications) {
    const order = options.sectionOrders.certifications;
    activeCertifications = [...activeCertifications].sort((a, b) => {
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    });
  }

  if (activeCertifications.length > 0) {
    addSectionHeader(lang === 'en' ? 'Certifications' : 'Sertifikasi');
    activeCertifications.forEach((cert, certIdx) => {
      checkPageBreak(16 * scale);

      if (certIdx > 0) {
        currentY += 2.0 * scale;
      }

      const rightTop = cert.grade || cert.period || '';
      const rightBottom = cert.credentialSub || (cert.grade && cert.period ? cert.period : '');

      // Baris 1: Title (Kiri) & Grade / Right Top (Kanan)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.0 * scale);
      const topWidth = rightTop ? doc.getTextWidth(rightTop) : 0;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.6 * scale);
      doc.setTextColor(...primaryNavy);
      const maxTitleWidth = rightTop ? contentWidth - topWidth - 4 : contentWidth;
      const titleLines = doc.splitTextToSize(cert.title, maxTitleWidth);
      doc.text(titleLines[0], margin, currentY);

      if (rightTop) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...darkSlate);
        doc.text(rightTop, pageWidth - margin, currentY, { align: 'right' });
      }
      currentY += (titleLines.length > 1 ? titleLines.length * 3.4 : 3.6) * scale;

      // Baris 2: Issuer (Kiri) & Right Bottom (Kanan)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.0 * scale);
      const bottomWidth = rightBottom ? doc.getTextWidth(rightBottom) : 0;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2 * scale);
      doc.setTextColor(...darkSlate);
      const maxIssuerWidth = rightBottom ? contentWidth - bottomWidth - 4 : contentWidth;
      const issuerLines = doc.splitTextToSize(cert.issuer, maxIssuerWidth);
      doc.text(issuerLines[0], margin, currentY);

      if (rightBottom) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...darkSlate);
        doc.text(rightBottom, pageWidth - margin, currentY, { align: 'right' });
      }
      currentY += (issuerLines.length > 1 ? issuerLines.length * 3.2 : 3.4) * scale;

      // Baris 3: Deskripsi kompetensi
      if (cert.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...bodySlate);
        const descLines = doc.splitTextToSize(cert.description, contentWidth);
        if (textAlign === 'justify') {
          doc.text(descLines, margin, currentY, { align: 'justify', maxWidth: contentWidth });
        } else {
          doc.text(descLines, margin, currentY);
        }
        currentY += descLines.length * (3.4 * scale) + (1.4 * scale);
      }
    });
  }

  // ==========================================
  // 8. PORTOFOLIO KONSULTANSI & PROYEK INDEPENDEN
  // ==========================================
  const sourceConsulting = getTailoredConsulting(options?.preset, lang);
  let activeConsultingProjects = itm?.consultingProjects
    ? (sourceConsulting.projects || []).filter((proj) => itm.consultingProjects?.[proj.id])
    : sec?.consulting !== false ? (sourceConsulting.projects || []) : [];

  if (options?.sectionOrders?.consultingProjects) {
    const order = options.sectionOrders.consultingProjects;
    activeConsultingProjects = [...activeConsultingProjects].sort((a, b) => {
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    });
  }

  if (activeConsultingProjects.length > 0) {
    addSectionHeader(lang === 'en' ? 'Independent Project Consulting' : 'Konsultan Proyek Independen');

    checkPageBreak(15 * scale);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.3 * scale);
    doc.setTextColor(...bodySlate);
    const consultSummaryLines = doc.splitTextToSize(sourceConsulting.summary, contentWidth);
    if (textAlign === 'justify') {
      doc.text(consultSummaryLines, margin, currentY, { align: 'justify', maxWidth: contentWidth });
    } else {
      doc.text(consultSummaryLines, margin, currentY);
    }
    currentY += consultSummaryLines.length * (3.6 * scale) + (2.0 * scale);

    activeConsultingProjects.forEach((proj, pIdx) => {
      checkPageBreak(22 * scale);

      if (pIdx > 0) {
        currentY += 2.2 * scale;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.6 * scale);
      doc.setTextColor(...primaryNavy);
      doc.text(proj.organization.toUpperCase(), margin, currentY);

      doc.text(proj.sector, pageWidth - margin, currentY, { align: 'right' });
      currentY += 3.6 * scale;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.3 * scale);
      doc.setTextColor(...darkSlate);
      doc.text(proj.role, margin, currentY);

      doc.text(proj.periodType, pageWidth - margin, currentY, { align: 'right' });
      currentY += 3.6 * scale;

      proj.highlights.forEach((hl) => {
        addHangingBullet(hl, {
          fontStyle: 'normal',
          textColor: bodySlate,
          bulletColor: primaryNavy,
          textOffset: 5.2,
          bulletOffset: 1.2,
          lineHeight: 3.5 * scale,
          gapAfter: 1.0 * scale,
        });
      });
    });
    currentY += 1.4 * scale;
  }

  // ==========================================
  // 9. PORTOFOLIO SISTEM & SOLUSI DIGITAL
  // ==========================================
  const sourceDigitalSolutions = getTailoredDigitalSolutions(options?.preset, lang);
  let activeDigitalSolutions = itm?.digitalSolutions
    ? (sourceDigitalSolutions || []).filter((sol) => itm.digitalSolutions?.[sol.id])
    : sec?.digitalSolutions !== false ? (sourceDigitalSolutions || []) : [];

  if (options?.sectionOrders?.digitalSolutions) {
    const order = options.sectionOrders.digitalSolutions;
    activeDigitalSolutions = [...activeDigitalSolutions].sort((a, b) => {
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    });
  }

  if (activeDigitalSolutions.length > 0) {
    addSectionHeader(lang === 'en' ? 'Digital Portfolio' : 'Portofolio Digital');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.0 * scale);
    doc.setTextColor(...darkSlate);
    const solIntro = lang === 'en'
      ? 'All web-based system prototypes are designed as live testing prototypes ready for customization according to corporate workflows and operational scale:'
      : 'Seluruh prototipe sistem berbasis web ini dirancang sebagai kerangka kerja awal (live testing prototype) yang siap dikustomisasi sesuai alur kerja dan skala operasional perusahaan:';
    const solIntroLines = doc.splitTextToSize(solIntro, contentWidth);
    if (textAlign === 'justify') {
      doc.text(solIntroLines, margin, currentY, { align: 'justify', maxWidth: contentWidth });
    } else {
      doc.text(solIntroLines, margin, currentY);
    }
    currentY += solIntroLines.length * (3.4 * scale) + (1.6 * scale);
    
    activeDigitalSolutions.forEach((sol) => {
      checkPageBreak(15 * scale);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5 * scale);
      doc.setTextColor(...primaryNavy);
      const fullTitle = sol.subtitle ? `${sol.title} - ${sol.subtitle}` : sol.title;
      doc.text(fullTitle, margin, currentY);
      currentY += 3.8 * scale; // Space below title

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.0 * scale);
      doc.setTextColor(...bodySlate);
      const impactText = sol.impact ? (lang === 'en' ? ` Impact: ${sol.impact}` : ` Dampak: ${sol.impact}`) : '';
      const fullDesc = `${sol.description}${impactText}`;
      const splitDesc = doc.splitTextToSize(fullDesc, contentWidth);
      if (textAlign === 'justify') {
        doc.text(splitDesc, margin, currentY, { align: 'justify', maxWidth: contentWidth });
      } else {
        doc.text(splitDesc, margin, currentY);
      }
      currentY += splitDesc.length * (3.5 * scale);

      if (sol.demoUrl) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8 * scale);
        doc.setTextColor(...darkSlate);
        const linkPrefix = 'Link & Demo: ';
        doc.text(linkPrefix, margin, currentY);
        
        const labelW = doc.getTextWidth(linkPrefix);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...mutedSlate);
        doc.textWithLink(sol.demoUrl, margin + labelW, currentY, { url: sol.demoUrl });
        currentY += 4.5 * scale; // Spacing after link to next section
      } else {
        currentY += 4.5 * scale;
      }
      currentY += 0.8 * scale; // Additional spacing between items
    });
  }

  // ==========================================
  // 10. PENGALAMAN ORGANISASI & KEPEMIMPINAN
  // ==========================================
  const sourceOrganizations = getTailoredOrganizations(options?.preset, lang);
  const allOrgItems = (sourceOrganizations || []).map((org, idx) => ({ ...org, idx }));
  let activeOrganizations = itm?.organizations
    ? allOrgItems.filter((org) => itm.organizations?.[org.idx])
    : sec?.organizations !== false ? allOrgItems : [];

  if (options?.sectionOrders?.organizations) {
    const order = options.sectionOrders.organizations;
    activeOrganizations = [...activeOrganizations].sort((a, b) => {
      const idxA = order.indexOf(a.idx);
      const idxB = order.indexOf(b.idx);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    });
  }

  if (activeOrganizations.length > 0) {
    addSectionHeader(lang === 'en' ? 'Organizational Leadership' : 'Pengalaman Organisasi & Kepemimpinan');

    activeOrganizations.forEach((org, orgIdx) => {
      checkPageBreak(16 * scale);

      if (orgIdx > 0) {
        currentY += 2.2 * scale;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.6 * scale);
      doc.setTextColor(...primaryNavy);
      doc.text(org.role, margin, currentY);

      doc.text(org.period, pageWidth - margin, currentY, { align: 'right' });
      currentY += 3.6 * scale;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2 * scale);
      doc.setTextColor(...darkSlate);
      doc.text(org.organization, margin, currentY);
      currentY += 3.4 * scale;

      if (org.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...bodySlate);
        const orgDescLines = doc.splitTextToSize(org.description, contentWidth);
        if (textAlign === 'justify') {
          doc.text(orgDescLines, margin, currentY, { align: 'justify', maxWidth: contentWidth });
        } else {
          doc.text(orgDescLines, margin, currentY);
        }
        currentY += orgDescLines.length * (3.4 * scale) + (1.2 * scale);
      }
    });
  }

  // ==========================================
  // 11. PRESTASI & PENGHARGAAN
  // ==========================================
  let activeAchievements = itm?.achievements
    ? (cv.achievements || []).filter((ach) => itm.achievements?.[ach.id])
    : sec?.achievements !== false ? (cv.achievements || []) : [];

  if (options?.sectionOrders?.achievements) {
    const order = options.sectionOrders.achievements;
    activeAchievements = [...activeAchievements].sort((a, b) => {
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    });
  }

  // Enforce maximum 5 achievements displayed unless preset is 'all'
  if (options?.preset !== 'all') {
    activeAchievements = activeAchievements.slice(0, 5);
  }

  if (activeAchievements.length > 0) {
    const achHeader = lang === 'en'
      ? `Honors, Awards & Achievements (${activeAchievements.length} Items)`
      : `Prestasi, Penghargaan & Pencapaian (${activeAchievements.length} Kegiatan)`;
    addSectionHeader(achHeader, false, 26.0 * scale);

    activeAchievements.forEach((ach, achIdx) => {
      checkPageBreak(16 * scale);

      if (achIdx > 0) {
        currentY += 2.2 * scale;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.6 * scale);
      doc.setTextColor(...primaryNavy);

      const levelText = lang === 'en' ? `${ach.level} Level` : `Tingkat ${ach.level}`;
      doc.setFontSize(8.0 * scale);
      const levelWidth = doc.getTextWidth(levelText);

      doc.setFontSize(8.6 * scale);
      const maxTitleWidth = contentWidth - levelWidth - 4;
      const titleLines = doc.splitTextToSize(ach.title, maxTitleWidth);
      doc.text(titleLines[0], margin, currentY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.0 * scale);
      doc.setTextColor(...darkSlate);
      doc.text(levelText, pageWidth - margin, currentY, { align: 'right' });

      if (titleLines.length > 1) {
        currentY += 3.4 * scale;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.6 * scale);
        doc.setTextColor(...primaryNavy);
        doc.text(titleLines.slice(1), margin, currentY);
      }
      currentY += 3.6 * scale;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2 * scale);
      doc.setTextColor(...darkSlate);
      doc.text(ach.organization, margin, currentY);

      doc.text(ach.year, pageWidth - margin, currentY, { align: 'right' });
      currentY += 3.4 * scale;

      if (ach.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...bodySlate);
        const achDescLines = doc.splitTextToSize(ach.description, contentWidth);
        if (textAlign === 'justify') {
          doc.text(achDescLines, margin, currentY, { align: 'justify', maxWidth: contentWidth });
        } else {
          doc.text(achDescLines, margin, currentY);
        }
        currentY += achDescLines.length * (3.4 * scale) + (1.2 * scale);
      }
    });
  }

  // ==========================================
  // FOOTER & PAGINATION ON ALL PAGES
  // ==========================================
  const totalPages = doc.getNumberOfPages();

  // Standard filename format: cv_alvareza_<preset_code>.pdf
  const presetKey = options?.preset || 'all';
  const presetCode = (PRESET_CODES[presetKey] || presetKey).toLowerCase();
  const filename = `cv_alvareza_${presetCode}.pdf`;
  return { doc, filename, totalPages };
};
