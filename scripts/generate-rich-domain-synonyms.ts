import fs from 'fs';
import path from 'path';
import { explodeClusters } from './build-rich-synonyms';
import { hrDomain, operationsDomain, adminDomain } from './data-hr-ops-admin';
import { salesDomain, marketingDomain, financeDomain } from './data-sales-mkt-fin';
import { pmoDomain, logisticsDomain, techDomain, consultingDomain, featuredDomain } from './data-pmo-log-tech-con-feat';
import { hrClustersIn, hrClustersEn } from './clusters-hr';
import { operationsClustersIn, operationsClustersEn, adminClustersIn, adminClustersEn } from './clusters-ops-admin';
import { salesClustersIn, salesClustersEn, marketingClustersIn, marketingClustersEn, financeClustersIn, financeClustersEn } from './clusters-sales-mkt-fin';
import { pmoClustersIn, pmoClustersEn, logisticsClustersIn, logisticsClustersEn, techClustersIn, techClustersEn, consultingClustersIn, consultingClustersEn, featuredClustersIn, featuredClustersEn } from './clusters-pmo-log-tech-con-feat';

function cleanList(arr: string[]): string[] {
  const seen = new Set<string>();
  const res: string[] = [];
  for (const item of arr) {
    if (!item) continue;
    const clean = item.toLowerCase().trim().replace(/\s+/g, ' ');
    if (clean && !seen.has(clean)) {
      seen.add(clean);
      res.push(clean);
    }
  }
  return res;
}

// Generate sensible, natural job title phrases (not 10,000 artificial permutations, but realistic titles)
const NATURAL_LEVELS_IN = [
  '', 'staf', 'staff', 'officer', 'spesialis', 'specialist', 'koordinator', 'supervisor',
  'spv', 'lead', 'head of', 'kepala', 'manajer', 'manager', 'asisten', 'senior', 'junior',
  'associate', 'intern', 'praktisi', 'ahli'
];

const NATURAL_LEVELS_EN = [
  '', 'staff', 'officer', 'specialist', 'coordinator', 'supervisor', 'lead', 'head of',
  'manager', 'assistant', 'senior', 'junior', 'associate', 'intern', 'director', 'lead specialist'
];

function buildNaturalJobTitles(bases: string[], levels: string[]): string[] {
  const set = new Set<string>();
  for (const b of bases) {
    const cleanB = b.trim().toLowerCase();
    set.add(cleanB);
    for (const l of levels) {
      if (!l) continue;
      if (!cleanB.startsWith(l + ' ')) {
        set.add(`${l} ${cleanB}`);
      }
    }
  }
  return cleanList(Array.from(set));
}

interface DomainPlan {
  domain: string;
  meta: any;
  clustersIn: string[][];
  clustersEn: string[][];
}

const DOMAIN_PLANS: DomainPlan[] = [
  { domain: 'hr', meta: hrDomain, clustersIn: hrClustersIn, clustersEn: hrClustersEn },
  { domain: 'operations', meta: operationsDomain, clustersIn: operationsClustersIn, clustersEn: operationsClustersEn },
  { domain: 'admin', meta: adminDomain, clustersIn: adminClustersIn, clustersEn: adminClustersEn },
  { domain: 'sales', meta: salesDomain, clustersIn: salesClustersIn, clustersEn: salesClustersEn },
  { domain: 'marketing', meta: marketingDomain, clustersIn: marketingClustersIn, clustersEn: marketingClustersEn },
  { domain: 'finance', meta: financeDomain, clustersIn: financeClustersIn, clustersEn: financeClustersEn },
  { domain: 'pmo', meta: pmoDomain, clustersIn: pmoClustersIn, clustersEn: pmoClustersEn },
  { domain: 'logistics', meta: logisticsDomain, clustersIn: logisticsClustersIn, clustersEn: logisticsClustersEn },
  { domain: 'tech', meta: techDomain, clustersIn: techClustersIn, clustersEn: techClustersEn },
  { domain: 'consulting', meta: consultingDomain, clustersIn: consultingClustersIn, clustersEn: consultingClustersEn },
  { domain: 'featured', meta: featuredDomain, clustersIn: featuredClustersIn, clustersEn: featuredClustersEn },
];

function run() {
  const rootDir = process.cwd();
  const inDir = path.join(rootDir, 'src', 'data', 'position-detektor', 'in');
  const enDir = path.join(rootDir, 'src', 'data', 'position-detektor', 'en');

  let totalSynonymKeysIn = 0;
  let totalSynonymKeysEn = 0;
  let totalSynonymLinksIn = 0;
  let totalSynonymLinksEn = 0;

  for (const plan of DOMAIN_PLANS) {
    const { domain, meta, clustersIn, clustersEn } = plan;

    // --- 1. Indonesian Module ---
    const rulesIn = meta.roles.map((r: any) => ({
      key: r.key,
      code: r.code,
      exactPhrases: buildNaturalJobTitles(r.basesIn, NATURAL_LEVELS_IN),
      strongKeywords: cleanList(r.strongIn),
      secondaryKeywords: r.secondaryIn ? cleanList(r.secondaryIn) : undefined,
      negativeKeywords: r.negativeIn ? cleanList(r.negativeIn) : undefined,
      mustIncludeAny: r.mustIncludeIn ? cleanList(r.mustIncludeIn) : undefined,
    }));

    // Explode synonym clusters into exhaustive bidirectional mappings
    const synsIn = explodeClusters(clustersIn);
    const keysIn = Object.keys(synsIn);
    totalSynonymKeysIn += keysIn.length;
    for (const k of keysIn) {
      totalSynonymLinksIn += synsIn[k].length;
    }

    const fileIn = path.join(inDir, `${domain}.ts`);
    const contentIn = `import { PresetMatchingRule } from '../types';

/**
 * Aturan Pencocokan Posisi Kerja Bahasa Indonesia - ${meta.nameIn}
 * Dilengkapi Kamus Istilah & Sinonim Industri Komprehensif (Bidirectional Synonym Clusters)
 */
export const ${domain}RulesIn: PresetMatchingRule[] = ${JSON.stringify(rulesIn, null, 2)};

export const ${domain}SynonymsIn: Record<string, string[]> = ${JSON.stringify(synsIn, null, 2)};
`;
    fs.writeFileSync(fileIn, contentIn, 'utf-8');

    // --- 2. English Module ---
    const rulesEn = meta.roles.map((r: any) => ({
      key: r.key,
      code: r.code,
      exactPhrases: buildNaturalJobTitles(r.basesEn, NATURAL_LEVELS_EN),
      strongKeywords: cleanList(r.strongEn),
      secondaryKeywords: r.secondaryEn ? cleanList(r.secondaryEn) : undefined,
      negativeKeywords: r.negativeEn ? cleanList(r.negativeEn) : undefined,
      mustIncludeAny: r.mustIncludeEn ? cleanList(r.mustIncludeEn) : undefined,
    }));

    const synsEn = explodeClusters(clustersEn);
    const keysEn = Object.keys(synsEn);
    totalSynonymKeysEn += keysEn.length;
    for (const k of keysEn) {
      totalSynonymLinksEn += synsEn[k].length;
    }

    const fileEn = path.join(enDir, `${domain}.ts`);
    const contentEn = `import { PresetMatchingRule } from '../types';

/**
 * English Position Matching Rules - ${meta.nameEn}
 * Equipped with Comprehensive Industry Synonym Clusters & Cross-References
 */
export const ${domain}RulesEn: PresetMatchingRule[] = ${JSON.stringify(rulesEn, null, 2)};

export const ${domain}SynonymsEn: Record<string, string[]> = ${JSON.stringify(synsEn, null, 2)};
`;
    fs.writeFileSync(fileEn, contentEn, 'utf-8');

    console.log(`[OK] Domain ${domain.toUpperCase()}: IN (${keysIn.length} synonym keys, ${rulesIn.length} rules), EN (${keysEn.length} synonym keys, ${rulesEn.length} rules)`);
  }

  console.log(`\n======================================================`);
  console.log(`RICH SYNONYMS GENERATION SUMMARY:`);
  console.log(`Indonesian Synonym Keys: ${totalSynonymKeysIn.toLocaleString()}`);
  console.log(`Indonesian Synonym Total Mappings: ${totalSynonymLinksIn.toLocaleString()}`);
  console.log(`English Synonym Keys: ${totalSynonymKeysEn.toLocaleString()}`);
  console.log(`English Synonym Total Mappings: ${totalSynonymLinksEn.toLocaleString()}`);
  console.log(`Total Bidirectional Synonym Pairs: ${(totalSynonymLinksIn + totalSynonymLinksEn).toLocaleString()}`);
  console.log(`======================================================\n`);
}

run();
