import { PDFRenderContext } from './context';
import { getTailoredExperiences } from '../../../data/tailored/experiences';

export function renderExperiences(ctx: PDFRenderContext): void {
  const { doc, lang, options, scale, margin, contentWidth, primaryNavy, darkSlate, mutedSlate, adapt } = ctx;
  const sec = options?.sections;
  const itm = options?.items;

  const sourceExperiences = getTailoredExperiences(options?.preset, lang);
  let activeExperiences = itm?.experiences
    ? sourceExperiences.filter((exp) => itm.experiences?.[exp.id])
    : sec?.experience !== false ? sourceExperiences : [];

  if (activeExperiences.length === 0) return;

  ctx.addSectionHeader(lang === 'en' ? 'Work Experience' : 'Pengalaman Kerja');

  activeExperiences.forEach((exp) => {
    ctx.checkPageBreak(25.0 * scale);

    let positionRole = adapt(exp.role);
    // Hard constraint: CV Jaya Baru (exp-3) level maksimal adalah SVP/Supervisor, dilarang menjadi Manager
    if (exp.id === 'exp-3' || exp.company?.toLowerCase().includes('jaya baru') || exp.company?.toLowerCase().includes('jayabaru')) {
      if (/\b(manager|manajer)\b/i.test(positionRole)) {
        if (!/\b(manager|manajer)\b/i.test(exp.role)) {
          positionRole = exp.role;
        } else {
          positionRole = positionRole.replace(/\b(manager|manajer)\b/gi, 'Supervisor');
        }
      }
    }
    const companyName = exp.company;
    const periodLocation = `${exp.period} | ${exp.location}`;

    // Row 1: Company Name (Bold Solid Navy) + Period & Location (Right Muted)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.0 * scale);
    const rightWidth = periodLocation ? doc.getTextWidth(periodLocation) : 0;
    const availableWidth = rightWidth > 0 ? contentWidth - rightWidth - 4.0 * scale : contentWidth;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2 * scale);
    doc.setTextColor(...primaryNavy);

    const titleWidth = doc.getTextWidth(companyName);
    const currentY = ctx.getY();
    if (titleWidth > availableWidth) {
      const splitTitle = doc.splitTextToSize(companyName, availableWidth);
      doc.text(splitTitle[0], margin, currentY);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.0 * scale);
      doc.setTextColor(...mutedSlate);
      doc.text(periodLocation, margin + contentWidth, currentY, { align: 'right' });
      ctx.addY(3.8 * scale);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.2 * scale);
      doc.setTextColor(...primaryNavy);
      for (let t = 1; t < splitTitle.length; t++) {
        doc.text(splitTitle[t], margin, ctx.getY());
        ctx.addY(3.8 * scale);
      }
    } else {
      doc.text(companyName, margin, currentY);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.0 * scale);
      doc.setTextColor(...mutedSlate);
      doc.text(periodLocation, margin + contentWidth, currentY, { align: 'right' });
      ctx.addY(3.8 * scale);
    }

    // Row 2: Position Role (Semi-bold / Bold Dark Slate)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.6 * scale);
    doc.setTextColor(...darkSlate);
    doc.text(positionRole, margin, ctx.getY());
    ctx.addY(4.0 * scale);

    // Bullets (Hanging Indent) from highlights
    const activeHighlights = exp.highlights || [];
    activeHighlights.forEach((bulletText: string) => {
      ctx.addHangingBullet(adapt(bulletText), {
        bulletChar: '•',
        bulletOffset: 0.8 * scale,
        textOffset: 4.8 * scale,
        lineHeight: 3.5 * scale,
        gapAfter: 1.0 * scale,
      });
    });

    if (exp.tools && exp.tools.length > 0) {
      const toolsPrefix = lang === 'en' ? 'Tools & Platform' : 'Tools & Platform';
      ctx.addBoldPrefixHangingBullet(toolsPrefix, exp.tools.join(', '), {
        bulletChar: '•',
        bulletOffset: 0.8 * scale,
        textOffset: 4.8 * scale,
        lineHeight: 3.5 * scale,
        gapAfter: 1.0 * scale,
      });
    }

    ctx.addY(1.8 * scale); // Space between job entries
  });
}
