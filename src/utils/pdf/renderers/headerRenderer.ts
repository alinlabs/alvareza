import { PDFRenderContext } from './context';
import { PRESET_HEADLINES } from '../../../data/preset/HeadlinesSummaries';

export function renderHeader(ctx: PDFRenderContext): void {
  const { doc, cv, scale, pageWidth, margin, primaryNavy, darkSlate, mutedSlate, lang, options, canonicalPreset, adapt } = ctx;
  const centerX = pageWidth / 2;

  // Full Name (BOLD SOLID NAVY)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18.0 * scale);
  doc.setTextColor(...primaryNavy);
  doc.text(cv.personalInfo.fullName.toUpperCase(), centerX, ctx.getY(), { align: 'center' });
  ctx.addY(4.5 * scale);

  // Professional Headline (BOLD DARK SLATE)
  const rawActiveHeadline =
    options?.headline ||
    (canonicalPreset && PRESET_HEADLINES[canonicalPreset]?.[lang]) ||
    (options?.preset && PRESET_HEADLINES[options.preset]?.[lang]) ||
    cv.personalInfo.headline;

  const activeHeadline = adapt(rawActiveHeadline);
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
  const currentY = ctx.getY();

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

  ctx.addY((3.6 * scale) + (1.5 * scale));
}
