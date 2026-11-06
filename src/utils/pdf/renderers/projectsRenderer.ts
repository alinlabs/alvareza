import { PDFRenderContext } from './context';
import { getTailoredConsulting, getTailoredDigitalSolutions } from '../../../data/tailored/projects';

export function renderConsultingProjects(ctx: PDFRenderContext): void {
  const { doc, lang, options, scale, margin, contentWidth, primaryNavy, darkSlate, mutedSlate, adapt } = ctx;
  const sec = options?.sections;
  const itm = options?.items;

  const sourceConsulting = getTailoredConsulting(options?.preset, lang);
  let activeConsultingProjects = itm?.consultingProjects
    ? sourceConsulting.projects.filter((proj) => itm.consultingProjects?.[proj.id])
    : sec?.consulting !== false ? sourceConsulting.projects : [];

  if (activeConsultingProjects.length === 0) return;

  ctx.addSectionHeader(
    lang === 'en'
      ? 'Strategic Management & Business Consulting Portfolio'
      : 'Portofolio Konsultansi & Proyek Independen'
  );

  activeConsultingProjects.forEach((proj) => {
    ctx.checkPageBreak(18.0 * scale);

    const projOrg = adapt(proj.organization);
    const projRole = adapt(proj.role);
    const periodSector = proj.sector ? `${proj.periodType} | ${proj.sector}` : proj.periodType;

    // Measure right text width dynamically
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.0 * scale);
    const rightWidth = periodSector ? doc.getTextWidth(periodSector) : 0;
    const availableWidth = rightWidth > 0 ? contentWidth - rightWidth - 4.0 * scale : contentWidth;

    // Row 1: Client / Organization Name (Bold Solid Navy) + Period & Sector (Right Muted)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2 * scale);
    doc.setTextColor(...primaryNavy);

    const titleWidth = doc.getTextWidth(projOrg);
    const currentY = ctx.getY();

    if (titleWidth > availableWidth) {
      const splitName = doc.splitTextToSize(projOrg, availableWidth);
      doc.text(splitName[0], margin, currentY);
      if (periodSector) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...mutedSlate);
        doc.text(periodSector, margin + contentWidth, currentY, { align: 'right' });
      }
      ctx.addY(3.8 * scale);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.2 * scale);
      doc.setTextColor(...primaryNavy);
      for (let t = 1; t < splitName.length; t++) {
        doc.text(splitName[t], margin, ctx.getY());
        ctx.addY(3.8 * scale);
      }
    } else {
      doc.text(projOrg, margin, currentY);
      if (periodSector) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...mutedSlate);
        doc.text(periodSector, margin + contentWidth, currentY, { align: 'right' });
      }
      ctx.addY(3.8 * scale);
    }

    // Row 2: Role / Position Name (Semi-bold / Bold Dark Slate)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.6 * scale);
    doc.setTextColor(...darkSlate);
    doc.text(projRole, margin, ctx.getY());
    ctx.addY(4.0 * scale);

    // Bullets (Hanging Indent) from highlights
    const highlights = proj.highlights || [];
    highlights.forEach((b: string) => {
      ctx.addHangingBullet(adapt(b), {
        bulletChar: '•',
        bulletOffset: 0.8 * scale,
        textOffset: 4.8 * scale,
        lineHeight: 3.5 * scale,
        gapAfter: 0.8 * scale,
      });
    });

    ctx.addY(1.4 * scale);
  });
}

export function renderDigitalSolutions(ctx: PDFRenderContext): void {
  const { doc, lang, options, scale, margin, contentWidth, primaryNavy, mutedSlate, adapt } = ctx;
  const sec = options?.sections;
  const itm = options?.items;

  const sourceDigitalSolutions = getTailoredDigitalSolutions(options?.preset, lang);
  let activeDigitalSolutions = itm?.digitalSolutions
    ? sourceDigitalSolutions.filter((proj) => itm.digitalSolutions?.[proj.id])
    : sec?.digitalSolutions !== false ? sourceDigitalSolutions : [];

  if (activeDigitalSolutions.length === 0) return;

  ctx.addSectionHeader(
    lang === 'en'
      ? 'Digital Solutions & Enterprise Automation Architecture'
      : 'Portofolio Sistem & Solusi Digital'
  );

  activeDigitalSolutions.forEach((proj) => {
    ctx.checkPageBreak(18.0 * scale);

    const projName = adapt(proj.title);
    const projSubtitle = proj.subtitle ? adapt(proj.subtitle) : '';
    const fullTitle = projSubtitle ? `${projName} – ${projSubtitle}` : projName;
    const demoUrl = proj.demoUrl ? proj.demoUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '') : '';

    // Measure demoUrl width dynamically on the right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8 * scale);
    const rightWidth = demoUrl ? doc.getTextWidth(demoUrl) : 0;
    const availableWidth = rightWidth > 0 ? contentWidth - rightWidth - 5.0 * scale : contentWidth;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.0 * scale);
    doc.setTextColor(...primaryNavy);

    const titleWidth = doc.getTextWidth(fullTitle);
    const currentY = ctx.getY();

    if (titleWidth > availableWidth) {
      const splitName = doc.splitTextToSize(fullTitle, availableWidth);
      doc.text(splitName[0], margin, currentY);
      if (demoUrl) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8 * scale);
        doc.setTextColor(...mutedSlate);
        doc.text(demoUrl, margin + contentWidth, currentY, { align: 'right' });
      }
      ctx.addY(3.6 * scale);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.0 * scale);
      doc.setTextColor(...primaryNavy);
      for (let t = 1; t < splitName.length; t++) {
        doc.text(splitName[t], margin, ctx.getY());
        ctx.addY(3.6 * scale);
      }
    } else {
      doc.text(fullTitle, margin, currentY);
      if (demoUrl) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8 * scale);
        doc.setTextColor(...mutedSlate);
        doc.text(demoUrl, margin + contentWidth, currentY, { align: 'right' });
      }
      ctx.addY(3.6 * scale);
    }

    if (proj.description) {
      ctx.addHangingBullet(adapt(proj.description), {
        bulletChar: '•',
        bulletOffset: 0.8 * scale,
        textOffset: 4.8 * scale,
        lineHeight: 3.5 * scale,
        gapAfter: 0.8 * scale,
      });
    }

    if (proj.impact) {
      const impactPrefix = lang === 'en' ? 'Impact' : 'Dampak';
      ctx.addBoldPrefixHangingBullet(impactPrefix, adapt(proj.impact), {
        bulletChar: '•',
        bulletOffset: 0.8 * scale,
        textOffset: 4.8 * scale,
        lineHeight: 3.5 * scale,
        gapAfter: 0.8 * scale,
      });
    }

    ctx.addY(1.4 * scale);
  });
}
