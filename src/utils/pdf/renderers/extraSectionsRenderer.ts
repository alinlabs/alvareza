import { PDFRenderContext } from './context';
import { getTailoredOrganizations } from '../../../data/tailored/organizations';

export function renderOrganizations(ctx: PDFRenderContext): void {
  const { doc, lang, options, scale, margin, contentWidth, primaryNavy, darkSlate, mutedSlate, adapt } = ctx;
  const sec = options?.sections;
  const itm = options?.items;

  const sourceOrganizations = getTailoredOrganizations(options?.preset, lang);
  let activeOrganizations = itm?.organizations
    ? sourceOrganizations.map((org, idx) => ({ ...org, idx })).filter((org) => itm.organizations?.[org.idx])
    : sec?.organizations !== false ? sourceOrganizations.map((org, idx) => ({ ...org, idx })) : [];

  if (activeOrganizations.length === 0) return;

  ctx.addSectionHeader(
    lang === 'en'
      ? 'Leadership & Organizational Experience'
      : 'Pengalaman Organisasi & Kepemimpinan'
  );

  activeOrganizations.forEach((org) => {
    ctx.checkPageBreak(16.0 * scale);

    const orgName = org.organization;
    const period = org.period;
    const role = adapt(org.role);

    // Row 1: Organization Name (Bold Solid Navy) + Period (Right Muted)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.0 * scale);
    doc.setTextColor(...primaryNavy);
    doc.text(orgName, margin, ctx.getY());

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.0 * scale);
    doc.setTextColor(...mutedSlate);
    doc.text(period, margin + contentWidth, ctx.getY(), { align: 'right' });
    ctx.addY(3.6 * scale);

    // Row 2: Role (Semi-bold / Bold Dark Slate)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.4 * scale);
    doc.setTextColor(...darkSlate);
    doc.text(role, margin, ctx.getY());
    ctx.addY(3.8 * scale);

    // Description bullet
    if (org.description) {
      ctx.addHangingBullet(adapt(org.description), {
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

export function renderAchievements(ctx: PDFRenderContext): void {
  const { doc, cv, lang, options, scale, margin, contentWidth, primaryNavy, mutedSlate, adapt } = ctx;
  const sec = options?.sections;
  const itm = options?.items;

  let activeAchievements = itm?.achievements
    ? (cv.achievements || []).filter((ach) => itm.achievements?.[ach.id])
    : sec?.achievements !== false ? (cv.achievements || []) : [];

  if (activeAchievements.length === 0) return;

  ctx.addSectionHeader(
    lang === 'en'
      ? 'Honors, Awards & Key Milestones'
      : 'Prestasi & Penghargaan'
  );

  activeAchievements.forEach((ach) => {
    ctx.checkPageBreak(14.0 * scale);

    const achTitle = adapt(ach.title);
    const orgPeriod = `${ach.organization} | ${ach.year}`;

    // Row 1: Title (Bold Solid Navy) + Issuer/Year (Right Muted)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.0 * scale);
    const rightWidth = orgPeriod ? doc.getTextWidth(orgPeriod) : 0;
    const availableWidth = rightWidth > 0 ? contentWidth - rightWidth - 4.0 * scale : contentWidth;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.0 * scale);
    doc.setTextColor(...primaryNavy);

    const titleWidth = doc.getTextWidth(achTitle);
    const currentY = ctx.getY();
    if (titleWidth > availableWidth) {
      const splitName = doc.splitTextToSize(achTitle, availableWidth);
      doc.text(splitName[0], margin, currentY);
      if (orgPeriod) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...mutedSlate);
        doc.text(orgPeriod, margin + contentWidth, currentY, { align: 'right' });
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
      doc.text(achTitle, margin, currentY);
      if (orgPeriod) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...mutedSlate);
        doc.text(orgPeriod, margin + contentWidth, currentY, { align: 'right' });
      }
      ctx.addY(3.6 * scale);
    }

    if (ach.description) {
      ctx.addHangingBullet(adapt(ach.description), {
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
