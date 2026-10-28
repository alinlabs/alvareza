import { PDFRenderContext } from './context';
import { PRESET_SUMMARIES } from '../../../data/preset/HeadlinesSummaries';
import { getTailoredMetrics } from '../../../data/tailored/metrics';

export function renderSummary(ctx: PDFRenderContext): void {
  const { doc, cv, scale, margin, contentWidth, bodySlate, lang, options, canonicalPreset, textAlign, adapt } = ctx;
  const sec = options?.sections;
  const itm = options?.items;
  const isSummaryActive = itm ? itm.summary === true : sec?.summary !== false;

  if (!isSummaryActive) return;

  ctx.addSectionHeader(lang === 'en' ? 'Professional Summary' : 'Ringkasan', true);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5 * scale);
  doc.setTextColor(...bodySlate);

  const rawActiveSummary =
    options?.summaryText ||
    (canonicalPreset && PRESET_SUMMARIES[canonicalPreset]?.[lang]) ||
    (options?.preset && PRESET_SUMMARIES[options.preset]?.[lang]) ||
    cv.personalInfo.summary;

  const activeSummary = adapt(rawActiveSummary);
  const summaryLines = doc.splitTextToSize(activeSummary, contentWidth);

  const currentY = ctx.getY();
  if (textAlign === 'justify') {
    doc.text(summaryLines, margin, currentY, { align: 'justify', maxWidth: contentWidth });
  } else {
    doc.text(summaryLines, margin, currentY);
  }

  ctx.addY((summaryLines.length - 1) * (3.8 * scale) + (3.6 * scale));
}

export function renderMetrics(ctx: PDFRenderContext): void {
  const { lang, options, adapt } = ctx;
  const sec = options?.sections;
  const itm = options?.items;

  const tailoredMetricsList = getTailoredMetrics(options?.preset, lang, itm?.certifications);
  const allMetricItems = tailoredMetricsList.map((m, idx) => ({
    idx,
    prefix: adapt(`${m.value} ${m.label}`),
    desc: adapt(m.sublabel),
  }));

  let activeMetrics = itm?.metrics
    ? allMetricItems.filter((m) => itm.metrics?.[m.idx])
    : sec?.metrics !== false ? allMetricItems : [];

  if (activeMetrics.length === 0) return;

  ctx.addSectionHeader(
    lang === 'en' ? 'Key Performance Metrics & Operational Impact' : 'Sorotan Kinerja & Metrik Kunci'
  );

  activeMetrics.forEach((m) => {
    ctx.addBoldPrefixHangingBullet(m.prefix, m.desc, {
      bulletChar: '•',
      bulletOffset: 0,
      textOffset: 4.8 * ctx.scale,
      fontSize: 8.3 * ctx.scale,
      lineHeight: 3.6 * ctx.scale,
      gapAfter: 1.0 * ctx.scale,
    });
  });

  ctx.addY(1.0 * ctx.scale);
}
