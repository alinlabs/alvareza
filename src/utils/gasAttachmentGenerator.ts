import { buildATSPDFDocument } from './pdf/coreGenerator';
import { GasAttachment } from '../types/gasSender';
import { APPLICANT_DATA } from './jobApplicationDraft';
import {
  buildAdaptivePortfolioPdf,
  buildCertificatesCompilationPdf,
  calculateAdaptivePortfolioQuality,
  getAdaptivePortfolioSlides,
  getActiveCertificateList,
  ALL_PORTFOLIO_SLIDES,
  ALL_CERTIFICATES_LIST,
  CERTIFICATE_FILES,
  PortfolioSlideConfig,
  CertItemConfig,
  isHrPosition,
  isRecruitmentScreeningFocus,
  sortPortfolioSlideIds,
} from './portfolioPdfGenerator';
import {
  getItemSelectionForPreset,
  getPresetSectionOrders,
} from '../data/preset/ItemSelections';
import { getPresetKeyFromCodeOrKey } from '../data/preset/RoleConfig';
import { PRESET_HEADLINES, PRESET_SUMMARIES } from '../data/preset/HeadlinesSummaries';
import { PDFItemSelectionConfig } from './pdf/types';
import {
  buildCoverLetterPDFDocument,
  generateCoverLetterPdfAttachment,
  formatCoverLetterDate,
  formatCoverLetterShortDate,
  CoverLetterOptions,
} from './pdf/coverLetterGenerator';

export { formatCoverLetterShortDate };

export interface GenerateCvAttachmentOptions {
  preset?: string;
  language?: 'id' | 'en' | 'in';
  customFilename?: string;
  jobTitle?: string;
  companyName?: string;
  jobDesk?: string;
  kualifikasi?: string;
  rawText?: string;
  headerColor?: string;
  designPreset?: 'block' | 'line' | 'badge' | 'plain';
  textAlign?: 'left' | 'justify';
  applicantEmail?: string;
}

export interface GeneratePortfolioAttachmentOptions {
  preset?: string;
  selectedSlideIds?: string[];
  activeDigitalSolutions?: string[];
  activeCertifications?: string[];
  includeKeyImpact?: boolean;
  jobTitle?: string;
  isCompressed?: boolean;
  onProgress?: (current: number, total: number, slideTitle: string) => void;
}

export interface GenerateCertificatesAttachmentOptions {
  preset?: string;
  selectedCertIds?: string[];
  activeCertifications?: string[];
  jobTitle?: string;
  onProgress?: (current: number, total: number, certTitle: string) => void;
}

export {
  getAdaptivePortfolioSlides,
  getActiveCertificateList,
  buildAdaptivePortfolioPdf,
  buildCertificatesCompilationPdf,
  calculateAdaptivePortfolioQuality,
  ALL_PORTFOLIO_SLIDES,
  ALL_CERTIFICATES_LIST,
  CERTIFICATE_FILES,
  isHrPosition,
  isRecruitmentScreeningFocus,
  sortPortfolioSlideIds,
  buildCoverLetterPDFDocument,
  generateCoverLetterPdfAttachment,
  formatCoverLetterDate,
};
export type { PortfolioSlideConfig, CertItemConfig, CoverLetterOptions };

/**
 * Generate PDF Portofolio Adaptif sebagai Lampiran GAS (Promise)
 */
export async function generatePortfolioPdfAttachment(
  options: GeneratePortfolioAttachmentOptions = {}
): Promise<GasAttachment> {
  return buildAdaptivePortfolioPdf(options);
}

/**
 * Generate PDF Kompilasi Sertifikasi Fisik Resmi sebagai Lampiran GAS (Promise)
 */
export async function generateCertificatesPdfAttachment(
  options: GenerateCertificatesAttachmentOptions = {}
): Promise<GasAttachment> {
  return buildCertificatesCompilationPdf(options);
}

/**
 * Generate ATS PDF Resume as a base64 attachment object ready for Google Apps Script.
 */
export function generateCvPdfAttachment(options: GenerateCvAttachmentOptions = {}): GasAttachment {
  const rawLang = options.language || 'in';
  const lang: 'in' | 'en' = rawLang === 'en' ? 'en' : 'in';
  const rawPresetKey = options.preset || 'optimal';
  const canonicalPresetKey = getPresetKeyFromCodeOrKey(rawPresetKey) || rawPresetKey;

  const headerStyleMap: Record<string, 'solid-banner' | 'navy-solid' | 'badge' | 'plain'> = {
    block: 'solid-banner',
    line: 'navy-solid',
    badge: 'badge',
    plain: 'plain',
  };
  const headerStyle = options.designPreset ? (headerStyleMap[options.designPreset] || 'solid-banner') : 'solid-banner';

  const items = getItemSelectionForPreset(canonicalPresetKey);
  const sectionOrders = getPresetSectionOrders(canonicalPresetKey);

  const headlineRaw = (PRESET_HEADLINES[canonicalPresetKey] || PRESET_HEADLINES[rawPresetKey] || PRESET_HEADLINES.optimal) as any;
  const headline = lang === 'en' ? headlineRaw.en : (headlineRaw.in || headlineRaw.id);

  const summaryRaw = (PRESET_SUMMARIES[canonicalPresetKey] || PRESET_SUMMARIES[rawPresetKey] || PRESET_SUMMARIES.optimal) as any;
  const summaryText = lang === 'en' ? summaryRaw.en : (summaryRaw.in || summaryRaw.id);

  const pdfItemsConfig: PDFItemSelectionConfig = {
    summary: items.summary,
    metrics: items.metrics,
    experiences: items.experiences,
    education: items.education,
    skills: items.skills,
    certifications: items.certifications,
    consultingProjects: items.consultingProjects,
    digitalSolutions: items.digitalSolutions,
    organizations: items.organizations,
    achievements: items.achievements,
  };

  // Build document using jsPDF with 100% identical configuration to ModalCvPreview
  const { doc, filename } = buildATSPDFDocument({
    language: lang,
    marginMm: 15,
    fontSizeScale: 1.15,
    headerStyle,
    boldWeight: 'refined' as const,
    headline,
    summaryText,
    preset: canonicalPresetKey,
    items: pdfItemsConfig,
    sectionOrders,
    textAlign: options.textAlign === 'justify' ? 'justify' : 'left',
    headerColor: options.headerColor || '#0062E3',
    applicantEmail: options.applicantEmail,
    jobContext: (options.jobDesk || options.kualifikasi || options.jobTitle || options.rawText) ? {
      jobTitle: options.jobTitle,
      jobDesk: options.jobDesk,
      kualifikasi: options.kualifikasi,
      rawText: options.rawText,
    } : undefined,
  });

  // Export base64 string from jsPDF
  const dataUri = doc.output('datauristring');
  const base64Data = dataUri.split(',')[1] || '';

  // Determine standardized attachment filename
  const attachmentFilename = options.customFilename || filename;

  // Calculate approximate byte size from base64 length
  const sizeBytes = Math.round((base64Data.length * 3) / 4);

  return {
    filename: attachmentFilename,
    mimeType: 'application/pdf',
    base64: base64Data,
    sizeBytes,
  };
}

/**
 * Returns formatted HTML email body with preserved paragraph spacing,
 * bold greeting (Yth./Dear), indented bullet lists (• / -), and phone numbers converted to WhatsApp hyperlinks.
 */
export function formatEmailBodyToHtml(
  plainTextBody: string,
  _applicantName = 'Alvareza Hilka Pratama'
): string {
  const clean = (plainTextBody || '').trim();
  if (!clean) return '';

  const lines = clean.split(/\r?\n/);
  const htmlParts: string[] = [];

  let inBulletList = false;
  let currentBulletItems: string[] = [];

  const flushBulletList = () => {
    if (currentBulletItems.length > 0) {
      const listHtml = `<ul style="margin: 6px 0 12px 0; padding-left: 28px; list-style-type: disc;">\n${currentBulletItems
        .map(
          (item) =>
            `  <li style="margin-bottom: 5px; line-height: 1.6; color: #1e293b;">${item}</li>`
        )
        .join('\n')}\n</ul>`;
      htmlParts.push(listHtml);
      currentBulletItems = [];
    }
    inBulletList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check if line is empty / blank line
    if (!trimmed) {
      flushBulletList();
      continue;
    }

    // Check if line is a bullet item (starts with •, -, *, or numbered bullet)
    const bulletMatch = trimmed.match(/^([•\-\*]|\d+\.)\s+(.+)$/);
    if (bulletMatch) {
      inBulletList = true;
      let bulletContent = bulletMatch[2]
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Convert phone numbers to WhatsApp link in bullet item
      const phoneRegex = /(\+?62|0)[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{3,5}[\s\-]?[0-9]{3,5}/g;
      bulletContent = bulletContent.replace(phoneRegex, (match) => {
        let digits = match.replace(/\D/g, '');
        if (digits.startsWith('0')) {
          digits = '62' + digits.slice(1);
        } else if (!digits.startsWith('62')) {
          digits = '62' + digits;
        }
        return `<a href="https://wa.me/${digits}" style="color: #2563eb; text-decoration: underline; font-weight: 500;" target="_blank" rel="noopener noreferrer">${match}</a>`;
      });

      currentBulletItems.push(bulletContent);
      continue;
    }

    // Not a bullet line -> flush any pending bullet list
    flushBulletList();

    let cleanLine = trimmed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Convert Indonesian / International phone number to WhatsApp hyperlink
    const phoneRegex = /(\+?62|0)[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{3,5}[\s\-]?[0-9]{3,5}/g;
    cleanLine = cleanLine.replace(phoneRegex, (match) => {
      let digits = match.replace(/\D/g, '');
      if (digits.startsWith('0')) {
        digits = '62' + digits.slice(1);
      } else if (!digits.startsWith('62')) {
        digits = '62' + digits;
      }
      return `<a href="https://wa.me/${digits}" style="color: #2563eb; text-decoration: underline; font-weight: 500;" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });

    // Check if greeting (Yth. / Dear)
    if (/^\s*(Yth\.|Dear\b)/i.test(cleanLine)) {
      htmlParts.push(
        `<p style="margin: 0 0 14px 0; line-height: 1.6; font-weight: bold; color: #0f172a;">${cleanLine}</p>`
      );
    } else {
      htmlParts.push(
        `<p style="margin: 0 0 12px 0; line-height: 1.6; color: #1e293b;">${cleanLine}</p>`
      );
    }
  }

  // Flush remaining bullets if file ends with list
  flushBulletList();

  return `<div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b;">
${htmlParts.join('\n')}
</div>`;
}
