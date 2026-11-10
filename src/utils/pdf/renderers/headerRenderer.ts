import { PDFRenderContext } from './context';
import { PRESET_HEADLINES } from '../../../data/preset/HeadlinesSummaries';
import { PAS_FOTO_3X4_DATA_URL } from '../assets/photoAsset';

export function renderHeader(ctx: PDFRenderContext): void {
  const { doc, cv, scale, pageWidth, margin, contentWidth, primaryNavy, darkSlate, mutedSlate, ruleGray, lang, options, canonicalPreset, adapt, headerStyle, designPreset } = ctx;

  const rawActiveHeadline =
    options?.headline ||
    (canonicalPreset && PRESET_HEADLINES[canonicalPreset]?.[lang]) ||
    (options?.preset && PRESET_HEADLINES[options.preset]?.[lang]) ||
    cv.personalInfo.headline;
  const activeHeadline = adapt(rawActiveHeadline);

  const contactItems = [
    { text: cv.personalInfo.phone, url: `https://wa.me/${cv.personalInfo.phone.replace(/\D/g, '')}` },
    { text: cv.personalInfo.email, url: `mailto:${cv.personalInfo.email}` },
    { text: cv.personalInfo.linkedin, url: `https://${cv.personalInfo.linkedin.replace(/^https?:\/\//, '')}` },
    { text: cv.personalInfo.website, url: `https://${cv.personalInfo.website.replace(/^https?:\/\//, '')}` }
  ].filter(item => item.text);

  const separator = "   |   ";

  // MODAL / MODERN PRESET: Name, Headline & Contacts on the Left, 3x4 Photo on the Right
  if (headerStyle === 'modern' || designPreset === 'modern') {
    const currentY = ctx.getY();
    const photoWidth = 21.0; // 3x4 aspect ratio in mm (21mm x 28mm)
    const photoHeight = 28.0;

    // Embed 3x4 profile photo on right side of page (Rata Kanan)
    const photoX = margin + contentWidth - photoWidth;
    const photoY = currentY;

    const photoDataUrl = options?.photoDataUrl || PAS_FOTO_3X4_DATA_URL;
    try {
      doc.addImage(photoDataUrl, 'WEBP', photoX, photoY, photoWidth, photoHeight, undefined, 'FAST');
      // Subtle framing border around photo
      doc.setDrawColor(...ruleGray);
      doc.setLineWidth(0.25);
      doc.rect(photoX, photoY, photoWidth, photoHeight, 'S');
    } catch (e) {
      console.warn('Could not render photo in modern header:', e);
    }

    // Left-side textual info (Candidate Name, Professional Headline, Contacts - Rata Kiri Terkunci)
    const infoX = margin;
    const infoWidth = contentWidth - (photoWidth + 5.0);

    // Split headline to calculate exact text block height for vertical centering
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2 * scale);
    const headlineLines = doc.splitTextToSize(activeHeadline, infoWidth);
    const headlineCount = headlineLines.length;

    // Calculate total vertical visual height of text block (Name -> Headline -> Contacts)
    // Name (14pt): ~3.6*scale cap height above baseline
    // Gap Name->Headline: 4.5*scale
    // Headline: (headlineCount - 1) * 3.8*scale
    // Gap Headline->Line1: 3.8*scale + 1.5*scale = 5.3*scale
    // Gap Line1->Line2: 3.6*scale
    // Line2 (7.8pt): ~0.6*scale descender below baseline
    const textBlockSpanY = (4.5 + (headlineCount - 1) * 3.8 + 5.3 + 3.6) * scale;
    const visualTextHeight = textBlockSpanY + 4.2 * scale;

    // Vertically center visual text height against photoHeight (28.0mm)
    const topVisualPadding = Math.max(1.0, (photoHeight - visualTextHeight) / 2);
    let textY = photoY + topVisualPadding + 3.6 * scale;

    // Full Name (14pt BOLD SOLID NAVY - Rata Kiri)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14.0 * scale);
    doc.setTextColor(...primaryNavy);
    doc.text(cv.personalInfo.fullName.toUpperCase(), infoX, textY);
    textY += 4.5 * scale;

    // Professional Headline (BOLD DARK SLATE - Rata Kiri)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2 * scale);
    doc.setTextColor(...darkSlate);

    headlineLines.forEach((line: string) => {
      doc.text(line, infoX, textY);
      textY += 3.8 * scale;
    });
    textY += 1.5 * scale;

    // Contact Items: Tabular format without dashes (Rata Kiri)
    // Line 1: [Nomor]   [Email]   [Web]
    // Line 2: [LinkedIn]
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8 * scale);
    doc.setTextColor(...mutedSlate);

    const colGap = 5.5; // Spasi berjarak antar kolom tabel
    const line1Y = textY;
    let colX = infoX;

    if (cv.personalInfo.phone) {
      const phoneUrl = `https://wa.me/${cv.personalInfo.phone.replace(/\D/g, '')}`;
      doc.textWithLink(cv.personalInfo.phone, colX, line1Y, { url: phoneUrl });
      colX += doc.getTextWidth(cv.personalInfo.phone) + colGap;
    }

    if (cv.personalInfo.email) {
      const emailUrl = `mailto:${cv.personalInfo.email}`;
      doc.textWithLink(cv.personalInfo.email, colX, line1Y, { url: emailUrl });
      colX += doc.getTextWidth(cv.personalInfo.email) + colGap;
    }

    if (cv.personalInfo.website) {
      const webUrl = `https://${cv.personalInfo.website.replace(/^https?:\/\//, '')}`;
      doc.textWithLink(cv.personalInfo.website, colX, line1Y, { url: webUrl });
    }

    // Line 2: [LinkedIn]
    const line2Y = line1Y + 3.6 * scale;
    if (cv.personalInfo.linkedin) {
      const linkedinUrl = `https://${cv.personalInfo.linkedin.replace(/^https?:\/\//, '')}`;
      doc.textWithLink(cv.personalInfo.linkedin, infoX, line2Y, { url: linkedinUrl });
    }

    const maxHeaderY = Math.max(photoY + photoHeight + 3.0 * scale, line2Y + 4.0 * scale);
    ctx.setY(maxHeaderY);
    return;
  }

  // STANDARD ATS CENTERED HEADER (Block, Line, Badge, Plain)
  const centerX = pageWidth / 2;

  // Full Name (BOLD SOLID NAVY)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18.0 * scale);
  doc.setTextColor(...primaryNavy);
  doc.text(cv.personalInfo.fullName.toUpperCase(), centerX, ctx.getY(), { align: 'center' });
  ctx.addY(4.5 * scale);

  // Professional Headline (BOLD DARK SLATE)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.8 * scale);
  doc.setTextColor(...darkSlate);

  const maxHeadlineWidth = pageWidth - 2 * margin;
  const headlineLines = doc.splitTextToSize(activeHeadline, maxHeadlineWidth);
  headlineLines.forEach((line: string) => {
    doc.text(line, centerX, ctx.getY(), { align: 'center' });
    ctx.addY(4.5 * scale);
  });
  ctx.addY(1.0 * scale);

  // Contact Info Row (Clickable Links & Centered)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2 * scale);

  // Calculate total width of the line to center it
  let totalWidth = 0;
  contactItems.forEach((item, index) => {
    totalWidth += doc.getTextWidth(item.text);
    if (index < contactItems.length - 1) {
      totalWidth += doc.getTextWidth(separator);
    }
  });

  let startX = centerX - (totalWidth / 2);
  const currentY = ctx.getY();

  // Render each piece
  contactItems.forEach((item, index) => {
    const textWidth = doc.getTextWidth(item.text);
    doc.setTextColor(...mutedSlate);

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

  ctx.addY((3.6 * scale) + (1.5 * scale));
}
