import fs from 'fs';
import path from 'path';

// Clean, normalize and deduplicate an array of terms
function cleanList(arr: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of arr) {
    if (!item) continue;
    const clean = item.toLowerCase().trim().replace(/\s+/g, ' ');
    if (clean.length > 0 && !seen.has(clean)) {
      seen.add(clean);
      result.push(clean);
    }
  }
  return result;
}

// Generate cross product of prefixes, bases, and suffixes
function combineTokens(prefixes: string[], bases: string[], suffixes: string[] = ['']): string[] {
  const res: string[] = [];
  for (const p of prefixes) {
    for (const b of bases) {
      for (const s of suffixes) {
        const parts = [p.trim(), b.trim(), s.trim()].filter(Boolean);
        if (parts.length > 0) {
          res.push(parts.join(' '));
        }
      }
    }
  }
  return res;
}

// Generate separator variants: 'a b', 'a & b', 'a and b', 'a dan b', 'a/b', 'a-b'
function genSeparators(termA: string, termB: string): string[] {
  return [
    `${termA} ${termB}`,
    `${termA} & ${termB}`,
    `${termA} and ${termB}`,
    `${termA} dan ${termB}`,
    `${termA}/${termB}`,
    `${termA}-${termB}`,
  ];
}

// Seniority & Level variants
const LEVELS_IN = [
  '', 'staf', 'staff', 'officer', 'spesialis', 'specialist', 'koordinator', 'coordinator',
  'supervisor', 'spv', 'lead', 'team lead', 'head of', 'kepala', 'manajer', 'manager',
  'asisten', 'assistant', 'senior', 'sr', 'junior', 'jr', 'associate', 'intern', 'magang',
  'analis', 'analyst', 'ahli', 'praktisi', 'penanggung jawab', 'pic', 'executive', 'deputy'
];

const LEVELS_EN = [
  '', 'staff', 'officer', 'specialist', 'coordinator', 'supervisor', 'spv', 'lead',
  'team lead', 'head of', 'manager', 'assistant', 'senior', 'sr', 'junior', 'jr',
  'associate', 'intern', 'internship', 'analyst', 'director', 'vp', 'vice president',
  'principal', 'consultant', 'adviser', 'advisor', 'executive'
];

// Helper to write formatted TS file
function writeDomainFile(
  filePath: string,
  rulesVarName: string,
  synonymsVarName: string,
  rules: any[],
  synonyms: Record<string, string[]>,
  commentTitle: string
) {
  // Clean each rule
  const cleanedRules = rules.map((r) => ({
    key: r.key,
    code: r.code,
    exactPhrases: cleanList(r.exactPhrases || []),
    strongKeywords: cleanList(r.strongKeywords || []),
    secondaryKeywords: r.secondaryKeywords ? cleanList(r.secondaryKeywords) : undefined,
    negativeKeywords: r.negativeKeywords ? cleanList(r.negativeKeywords) : undefined,
    mustIncludeAny: r.mustIncludeAny ? cleanList(r.mustIncludeAny) : undefined,
  }));

  // Clean synonyms
  const cleanedSynonyms: Record<string, string[]> = {};
  for (const [key, list] of Object.entries(synonyms)) {
    const cleanedKey = key.toLowerCase().trim();
    cleanedSynonyms[cleanedKey] = cleanList(list);
  }

  const content = `import { PresetMatchingRule } from '../types';

/**
 * ${commentTitle}
 * Perpustakaan Istilah Komprehensif (Lengkap dengan Akronim, Singkatan, dan Non-Singkatan)
 */
export const ${rulesVarName}: PresetMatchingRule[] = ${JSON.stringify(cleanedRules, null, 2)};

export const ${synonymsVarName}: Record<string, string[]> = ${JSON.stringify(cleanedSynonyms, null, 2)};
`;

  fs.writeFileSync(filePath, content, 'utf-8');
}

export {
  cleanList,
  combineTokens,
  genSeparators,
  LEVELS_IN,
  LEVELS_EN,
  writeDomainFile
};
