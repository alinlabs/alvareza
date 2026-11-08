import { EmailLanguage } from '../../types/jobApplication';
import { matchExactJobPositionFromCatalog, stripOcrArtifactsFromText } from '../../data/jobPositionsCatalog';

export function detectLanguageFromText(text: string): EmailLanguage {
  const lower = (text || '').toLowerCase();
  const enKeywords = [
    'qualification',
    'requirement',
    'responsibilities',
    'application',
    'send your cv',
    'hiring',
    'job description',
    'apply',
    'position',
    'experience',
  ];
  let enCount = 0;
  for (const kw of enKeywords) {
    if (lower.includes(kw)) enCount++;
  }
  return enCount >= 2 ? 'en' : 'id';
}

export function extractEmailStrict(text: string): string {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = (text || '').match(emailRegex);
  if (matches && matches.length > 0) {
    return matches[0].trim();
  }
  return '';
}

export function extractPhoneStrict(text: string): string {
  const phoneRegex = /(?:\+?62|0)8[1-9][0-9]{7,10}/g;
  const matches = (text || '').match(phoneRegex);
  if (matches && matches.length > 0) {
    return matches[0].trim();
  }
  return '';
}

export function extractSubjectFormatNotice(lines: string[]): string {
  for (const line of lines) {
    if (/(?:subjek|subject|format\s*email|format\s*subjek)\s*[:=]\s*(.+)/i.test(line)) {
      const match = line.match(/(?:subjek|subject|format\s*email|format\s*subjek)\s*[:=]\s*(.+)/i);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }
  return '';
}

export function extractCompanyNameStrict(lines: string[], email?: string): string {
  if (email) {
    const domain = email.split('@')[1];
    if (domain && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'].includes(domain.toLowerCase())) {
      const parts = domain.split('.');
      if (parts[0] && parts[0].length > 2) {
        const comp = parts[0].toUpperCase();
        return `PT ${comp}`;
      }
    }
  }

  for (const line of lines) {
    if (/^(?:PT|CV|UD|TBK)\b/i.test(line)) {
      return line.trim();
    }
  }
  return 'Perusahaan';
}

export function extractJobPositionStrict(lines: string[], filename?: string, language?: EmailLanguage): string {
  for (const line of lines) {
    const catalogMatch = matchExactJobPositionFromCatalog(line);
    if (catalogMatch) return catalogMatch;
  }
  return language === 'en' ? 'Target Position' : 'Posisi Dilamar';
}
