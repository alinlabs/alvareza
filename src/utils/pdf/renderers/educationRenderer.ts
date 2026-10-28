import { PDFRenderContext } from './context';

export function renderEducation(ctx: PDFRenderContext): void {
  const { doc, cv, lang, options, scale, margin, contentWidth, primaryNavy, darkSlate, bodySlate, mutedSlate, adapt } = ctx;
  const sec = options?.sections;
  const itm = options?.items;

  const allEduItems = cv.education.map((edu, idx) => ({ ...edu, idx }));
  let activeEducation = itm?.education
    ? allEduItems.filter((edu) => itm.education?.[edu.idx])
    : sec?.education !== false ? allEduItems : [];

  if (activeEducation.length === 0) return;

  ctx.addSectionHeader(lang === 'en' ? 'Education' : 'Pendidikan');

  activeEducation.forEach((edu) => {
    ctx.checkPageBreak(18.0 * scale);

    const institutionName = edu.institution;
    const period = edu.period;
    const degree = adapt(edu.degree);

    // Row 1: Institution (Bold Solid Navy) + Period (Right Muted)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2 * scale);
    doc.setTextColor(...primaryNavy);
    doc.text(institutionName, margin, ctx.getY());

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.0 * scale);
    doc.setTextColor(...mutedSlate);
    doc.text(period, margin + contentWidth, ctx.getY(), { align: 'right' });
    ctx.addY(3.8 * scale);

    // Row 2: Degree (Bold Dark Slate) + GPA / Predicate (Right aligned, vertically aligned with period)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.6 * scale);
    doc.setTextColor(...darkSlate);
    doc.text(degree, margin, ctx.getY());

    if (edu.gpa) {
      const gpaPredicate = `${lang === 'en' ? 'GPA' : 'IPK'} : ${edu.gpa}${edu.predicate ? ` • ${edu.predicate}` : ''}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.0 * scale);
      doc.setTextColor(...bodySlate);
      doc.text(adapt(gpaPredicate), margin + contentWidth, ctx.getY(), { align: 'right' });
    }
    ctx.addY(3.8 * scale);

    // Row 3: Curriculum / Study Description Bullet (Hanya penjelasan fokus pembelajaran di bawah)
    if (edu.detail) {
      ctx.addHangingBullet(adapt(edu.detail), {
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
