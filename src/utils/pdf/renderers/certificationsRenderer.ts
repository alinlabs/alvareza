import { PDFRenderContext } from './context';

export function renderCertifications(ctx: PDFRenderContext): void {
  const { doc, cv, lang, options, scale, margin, contentWidth, primaryNavy, darkSlate, mutedSlate, adapt } = ctx;
  const sec = options?.sections;
  const itm = options?.items;

  let activeCertifications = itm?.certifications
    ? cv.certifications.filter((cert) => itm.certifications?.[cert.id])
    : sec?.certifications !== false ? cv.certifications : [];

  if (activeCertifications.length === 0) return;

  ctx.addSectionHeader(lang === 'en' ? 'Professional Certifications' : 'Sertifikasi Profesional');

  activeCertifications.forEach((cert) => {
    ctx.checkPageBreak(14.0 * scale);

    const certName = adapt(cert.title);
    const rightTop = cert.grade || cert.period;
    const rightBottom = cert.credentialSub || (cert.grade && cert.period ? cert.period : '');
    const issuerPeriod = rightBottom ? `${cert.issuer} | ${rightBottom}` : `${cert.issuer} | ${cert.period}`;

    // Row 1: Certificate Name (Bold Solid Navy) + Year/Issuer (Right Muted)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.0 * scale);
    const rightWidth = rightTop ? doc.getTextWidth(rightTop) : 0;
    const availableWidth = rightWidth > 0 ? contentWidth - rightWidth - 4.0 * scale : contentWidth;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.0 * scale);
    doc.setTextColor(...primaryNavy);

    const certWidth = doc.getTextWidth(certName);
    const currentY = ctx.getY();
    if (certWidth > availableWidth) {
      const splitName = doc.splitTextToSize(certName, availableWidth);
      doc.text(splitName[0], margin, currentY);
      if (rightTop) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...mutedSlate);
        doc.text(rightTop, margin + contentWidth, currentY, { align: 'right' });
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
      doc.text(certName, margin, currentY);
      if (rightTop) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.0 * scale);
        doc.setTextColor(...mutedSlate);
        doc.text(rightTop, margin + contentWidth, currentY, { align: 'right' });
      }
      ctx.addY(3.6 * scale);
    }

    // Row 2: Issuer and details (Regular Body)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2 * scale);
    doc.setTextColor(...darkSlate);
    doc.text(adapt(issuerPeriod), margin + 0.8 * scale, ctx.getY());
    ctx.addY(3.6 * scale);

    if (cert.description) {
      ctx.addHangingBullet(adapt(cert.description), {
        bulletChar: '•',
        bulletOffset: 0.8 * scale,
        textOffset: 4.8 * scale,
        lineHeight: 3.5 * scale,
        gapAfter: 0.8 * scale,
      });
    }

    ctx.addY(1.0 * scale);
  });
}
