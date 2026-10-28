import { PDFRenderContext } from './context';

export function renderSectionHeader(
  ctx: PDFRenderContext,
  title: string,
  isFirstSection = false,
  minFirstItemHeight = 22.0 * ctx.scale
): void {
  const { doc, scale, margin, contentWidth, pageWidth, headerStyle, headerBannerColor, ruleGray } = ctx;

  let gapBefore = isFirstSection ? 2.0 * scale : 2.5 * scale;
  if (!isFirstSection && headerStyle !== 'solid-banner' && headerStyle !== 'badge') {
    gapBefore = 6.0 * scale; // Extra breathing room for line modes since they don't have a banner box
  }

  const bannerHeight = 5.2 * scale;
  // Check page break for section header PLUS first item height to prevent orphan headers
  ctx.checkPageBreak(bannerHeight + minFirstItemHeight + gapBefore);

  ctx.addY(gapBefore);
  const currentY = ctx.getY();

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
    ctx.setY(currentY + bannerHeight + 4.6 * scale);
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
    ctx.setY(currentY + badgeHeight + 4.6 * scale);
  } else if (headerStyle === 'plain') {
    // Just bold text, no lines, no backgrounds
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.0 * scale);
    doc.setTextColor(...headerBannerColor);
    doc.text(title.toUpperCase(), margin, currentY);
    ctx.setY(currentY + 3.6 * scale); // standard bottom gap
  } else if (headerStyle === 'navy-double') {
    // Section Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.0 * scale);
    doc.setTextColor(...headerBannerColor);
    doc.text(title.toUpperCase(), margin, currentY);
    const lineY = currentY + 1.8 * scale;
    doc.setDrawColor(...headerBannerColor);
    doc.setLineWidth(0.4);
    doc.line(margin, lineY, pageWidth - margin, lineY);
    doc.line(margin, lineY + 0.8, pageWidth - margin, lineY + 0.8);
    ctx.setY(currentY + 1.8 * scale + 3.6 * scale);
  } else if (headerStyle === 'minimal-thin') {
    // Section Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.0 * scale);
    doc.setTextColor(...headerBannerColor);
    doc.text(title.toUpperCase(), margin, currentY);
    const lineY = currentY + 1.8 * scale;
    doc.setDrawColor(...ruleGray);
    doc.setLineWidth(0.35);
    doc.line(margin, lineY, pageWidth - margin, lineY);
    ctx.setY(currentY + 1.8 * scale + 3.6 * scale);
  } else {
    // Line Design Style (navy-solid)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.0 * scale);
    doc.setTextColor(...headerBannerColor);
    doc.text(title.toUpperCase(), margin, currentY);
    const lineY = currentY + 1.8 * scale;
    doc.setDrawColor(...headerBannerColor);
    doc.setLineWidth(0.55 * scale); // Normal clean line thickness
    doc.line(margin, lineY, pageWidth - margin, lineY);
    ctx.setY(currentY + 1.8 * scale + 3.6 * scale);
  }
}
