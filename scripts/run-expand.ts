import fs from 'fs';
import path from 'path';
import { cleanList, LEVELS_IN, LEVELS_EN, writeDomainFile } from './expand-position-library';
import { hrDomain, operationsDomain, adminDomain } from './data-hr-ops-admin';
import { salesDomain, marketingDomain, financeDomain } from './data-sales-mkt-fin';
import { pmoDomain, logisticsDomain, techDomain, consultingDomain, featuredDomain } from './data-pmo-log-tech-con-feat';
import { DomainMetadata, DomainRoleDefinition } from './domain-definitions';

const ALL_DOMAINS: DomainMetadata[] = [
  hrDomain,
  operationsDomain,
  adminDomain,
  salesDomain,
  marketingDomain,
  financeDomain,
  pmoDomain,
  logisticsDomain,
  techDomain,
  consultingDomain,
  featuredDomain,
];

// Expand a base phrase with prefix levels and connector variations
function expandPhraseCombinations(bases: string[], prefixes: string[]): string[] {
  const result: string[] = [];

  for (const base of bases) {
    const cleanBase = base.trim();
    result.push(cleanBase);

    // If phrase contains & or and or dan or /, create alternate connector variants
    if (/[\/&]| and | dan /i.test(cleanBase)) {
      result.push(cleanBase.replace(/\s*&\s*/g, ' and '));
      result.push(cleanBase.replace(/\s*&\s*/g, ' dan '));
      result.push(cleanBase.replace(/\s*&\s*/g, ' / '));
      result.push(cleanBase.replace(/\s*&\s*/g, '-'));
      result.push(cleanBase.replace(/\s*&\s*/g, ' '));
      result.push(cleanBase.replace(/\s*\/\s*/g, ' and '));
      result.push(cleanBase.replace(/\s*\/\s*/g, ' dan '));
      result.push(cleanBase.replace(/\s*\/\s*/g, ' & '));
    }

    // Combine with all seniority prefixes
    for (const prefix of prefixes) {
      if (!prefix) continue;
      // Do not duplicate if base already starts with this prefix
      if (cleanBase.startsWith(prefix + ' ')) continue;

      result.push(`${prefix} ${cleanBase}`);

      // Also create "Base + Prefix" if natural in Indonesian (e.g. "hrd staf", "operasional koordinator")
      result.push(`${cleanBase} ${prefix}`);
    }
  }

  return cleanList(result);
}

// Expand synonyms dictionary with bidirectional associations and common prefixes/qualifiers
function expandSynonymDictionary(dict: Record<string, string[]>): Record<string, string[]> {
  const expanded: Record<string, string[]> = {};

  for (const [key, list] of Object.entries(dict)) {
    const cleanKey = key.toLowerCase().trim();
    const cleanItems = cleanList(list);

    const merged = new Set<string>(cleanItems);

    // Expand variations with & vs and vs dan vs /
    for (const item of cleanItems) {
      if (item.includes('&')) {
        merged.add(item.replace(/\s*&\s*/g, ' and '));
        merged.add(item.replace(/\s*&\s*/g, ' dan '));
        merged.add(item.replace(/\s*&\s*/g, '/'));
        merged.add(item.replace(/\s*&\s*/g, ' '));
      }
      if (item.includes('/')) {
        merged.add(item.replace(/\s*\/\s*/g, ' and '));
        merged.add(item.replace(/\s*\/\s*/g, ' & '));
        merged.add(item.replace(/\s*\/\s*/g, ' '));
      }
    }

    expanded[cleanKey] = Array.from(merged);
  }

  return expanded;
}

function processAll() {
  const rootDir = process.cwd();
  const inDir = path.join(rootDir, 'src', 'data', 'position-detektor', 'in');
  const enDir = path.join(rootDir, 'src', 'data', 'position-detektor', 'en');

  let totalExactIn = 0;
  let totalExactEn = 0;
  let totalSynonymsIn = 0;
  let totalSynonymsEn = 0;

  for (const domainMeta of ALL_DOMAINS) {
    const domainName = domainMeta.domain;

    // 1. Process Indonesian (IN)
    const rulesIn = domainMeta.roles.map((r) => {
      const expandedExact = expandPhraseCombinations(r.basesIn, LEVELS_IN);
      totalExactIn += expandedExact.length;

      return {
        key: r.key,
        code: r.code,
        exactPhrases: expandedExact,
        strongKeywords: cleanList(r.strongIn),
        secondaryKeywords: r.secondaryIn ? cleanList(r.secondaryIn) : undefined,
        negativeKeywords: r.negativeIn ? cleanList(r.negativeIn) : undefined,
        mustIncludeAny: r.mustIncludeIn ? cleanList(r.mustIncludeIn) : undefined,
      };
    });

    const synsIn = expandSynonymDictionary(domainMeta.synonymsIn);
    for (const list of Object.values(synsIn)) {
      totalSynonymsIn += list.length;
    }

    const fileIn = path.join(inDir, `${domainName}.ts`);
    const varRulesIn = `${domainName}RulesIn`;
    const varSynsIn = `${domainName}SynonymsIn`;
    writeDomainFile(fileIn, varRulesIn, varSynsIn, rulesIn, synsIn, `Aturan Pencocokan Posisi Kerja Bahasa Indonesia - ${domainMeta.nameIn}`);

    // 2. Process English (EN)
    const rulesEn = domainMeta.roles.map((r) => {
      const expandedExact = expandPhraseCombinations(r.basesEn, LEVELS_EN);
      totalExactEn += expandedExact.length;

      return {
        key: r.key,
        code: r.code,
        exactPhrases: expandedExact,
        strongKeywords: cleanList(r.strongEn),
        secondaryKeywords: r.secondaryEn ? cleanList(r.secondaryEn) : undefined,
        negativeKeywords: r.negativeEn ? cleanList(r.negativeEn) : undefined,
        mustIncludeAny: r.mustIncludeEn ? cleanList(r.mustIncludeEn) : undefined,
      };
    });

    const synsEn = expandSynonymDictionary(domainMeta.synonymsEn);
    for (const list of Object.values(synsEn)) {
      totalSynonymsEn += list.length;
    }

    const fileEn = path.join(enDir, `${domainName}.ts`);
    const varRulesEn = `${domainName}RulesEn`;
    const varSynsEn = `${domainName}SynonymsEn`;
    writeDomainFile(fileEn, varRulesEn, varSynsEn, rulesEn, synsEn, `English Position Matching Rules - ${domainMeta.nameEn}`);

    console.log(`[OK] Domain ${domainName.toUpperCase()}: generated both IN and EN modules.`);
  }

  console.log(`\n======================================================`);
  console.log(`EXPANSION SUMMARY:`);
  console.log(`Total Exact Phrases (ID): ${totalExactIn.toLocaleString()}`);
  console.log(`Total Exact Phrases (EN): ${totalExactEn.toLocaleString()}`);
  console.log(`Total Synonyms Terms (ID): ${totalSynonymsIn.toLocaleString()}`);
  console.log(`Total Synonyms Terms (EN): ${totalSynonymsEn.toLocaleString()}`);
  console.log(`Total Grand Terminology Bank: ${(totalExactIn + totalExactEn + totalSynonymsIn + totalSynonymsEn).toLocaleString()} terms!`);
  console.log(`======================================================\n`);
}

processAll();
