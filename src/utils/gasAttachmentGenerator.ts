import { buildATSPDFDocument } from './pdf/coreGenerator';
import { GasAttachment } from '../types/gasSender';
import { APPLICANT_DATA } from './jobApplicationDraft';
import {
  buildAdaptivePortfolioPdf,
  buildCertificatesCompilationPdf,
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

export interface GenerateCvAttachmentOptions {
  preset?: string;
  language?: 'id' | 'en';
  customFilename?: string;
  jobTitle?: string;
  companyName?: string;
  headerColor?: string;
  designPreset?: 'block' | 'line' | 'badge' | 'plain';
  textAlign?: 'left' | 'justify';
}

export interface GeneratePortfolioAttachmentOptions {
  preset?: string;
  selectedSlideIds?: string[];
  activeDigitalSolutions?: string[];
  activeCertifications?: string[];
  includeKeyImpact?: boolean;
  jobTitle?: string;
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
  ALL_PORTFOLIO_SLIDES,
  ALL_CERTIFICATES_LIST,
  CERTIFICATE_FILES,
  isHrPosition,
  isRecruitmentScreeningFocus,
  sortPortfolioSlideIds,
};
export type { PortfolioSlideConfig, CertItemConfig };

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
  const lang = options.language || 'id';
  const presetKey = options.preset || 'optimal';

  const headerStyleMap: Record<string, 'solid-banner' | 'minimal-thin' | 'badge' | 'plain'> = {
    block: 'solid-banner',
    line: 'minimal-thin',
    badge: 'badge',
    plain: 'plain',
  };
  const headerStyle = options.designPreset ? headerStyleMap[options.designPreset] || 'solid-banner' : 'solid-banner';

  // Build document using jsPDF
  const { doc, filename } = buildATSPDFDocument(lang, {
    preset: presetKey,
    fontSizeScale: 1.0,
    textAlign: options.textAlign || 'left',
    headerColor: options.headerColor,
    headerStyle,
  });

  // Export base64 string from jsPDF
  const dataUri = doc.output('datauristring');
  const base64Data = dataUri.split(',')[1] || '';

  // Determine standardized attachment filename (cv_alvareza.pdf for all presets)
  const attachmentFilename = options.customFilename || 'cv_alvareza.pdf';

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
