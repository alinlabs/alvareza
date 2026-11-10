import fs from 'fs';
import path from 'path';

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

const PREFIXES_IN = [
  '', 'staf', 'staff', 'officer', 'spesialis', 'specialist', 'koordinator', 'coordinator',
  'supervisor', 'spv', 'lead', 'team lead', 'head of', 'kepala', 'manajer', 'manager',
  'asisten', 'assistant', 'senior', 'sr', 'junior', 'jr', 'associate', 'intern', 'magang',
  'analis', 'analyst', 'ahli', 'praktisi', 'penanggung jawab', 'pic', 'executive', 'deputy',
  'lead specialist', 'senior specialist', 'senior officer', 'junior officer'
];

const PREFIXES_EN = [
  '', 'staff', 'officer', 'specialist', 'coordinator', 'supervisor', 'spv', 'lead',
  'team lead', 'head of', 'manager', 'assistant', 'senior', 'sr', 'junior', 'jr',
  'associate', 'intern', 'internship', 'analyst', 'director', 'vp', 'vice president',
  'principal', 'consultant', 'adviser', 'advisor', 'executive', 'lead specialist',
  'senior specialist', 'senior officer', 'junior officer'
];

function expandRoleTerms(bases: string[], prefixes: string[], extraWords: string[] = []): string[] {
  const results: string[] = [];

  for (const base of bases) {
    results.push(base);

    // Prefix + Base
    for (const p of prefixes) {
      if (p) {
        results.push(`${p} ${base}`);
      }
    }

    // Base + Extra
    for (const ex of extraWords) {
      results.push(`${base} ${ex}`);
      for (const p of prefixes) {
        if (p) {
          results.push(`${p} ${base} ${ex}`);
        }
      }
    }
  }

  return cleanList(results);
}

// Generate separator and slash variations for acronyms (e.g. 'hr & ga', 'hr/ga', 'hr-ga', 'hr ga')
function expandAcronyms(pairA: string[], pairB: string[]): string[] {
  const res: string[] = [];
  const seps = [' ', ' & ', ' and ', ' dan ', '/', '-'];
  for (const a of pairA) {
    for (const b of pairB) {
      for (const s of seps) {
        res.push(`${a}${s}${b}`);
      }
    }
  }
  return res;
}

console.log('Combinator utilities verified.');
