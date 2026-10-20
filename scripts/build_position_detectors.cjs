const fs = require('fs');
const path = require('path');

const FILES_MAP = [
  { file: 'featured.ts', exportName: 'featuredRules', data: require('./data/featured.cjs') },
  { file: 'admin_secretariat.ts', exportName: 'adminSecretariatRules', data: require('./data/admin_secretariat.cjs') },
  { file: 'operations_retail.ts', exportName: 'operationsRetailRules', data: require('./data/operations_retail.cjs') },
  { file: 'project_pmo.ts', exportName: 'projectPmoRules', data: require('./data/project_pmo.cjs') },
  { file: 'business_sales.ts', exportName: 'businessSalesRules', data: require('./data/business_sales.cjs') },
  { file: 'supply_chain_logistics.ts', exportName: 'supplyChainLogisticsRules', data: require('./data/supply_chain_logistics.cjs') },
  { file: 'hr_talent.ts', exportName: 'hrTalentRules', data: require('./data/hr_talent.cjs') },
  { file: 'marketing_cx.ts', exportName: 'marketingCxRules', data: require('./data/marketing_cx.cjs') },
  { file: 'finance_accounting.ts', exportName: 'financeAccountingRules', data: require('./data/finance_accounting.cjs') },
  { file: 'digital_tech.ts', exportName: 'digitalTechRules', data: require('./data/digital_tech.cjs') },
  { file: 'strategic_consulting.ts', exportName: 'strategicConsultingRules', data: require('./data/strategic_consulting.cjs') }
];

let grandTotalPhrases = 0;
let grandTotalStrong = 0;
let grandTotalSecondary = 0;
let totalPresetsCount = 0;

console.log('==> [EXECUTE_PROMPT.md PROTOCOL] Starting Batch Expansion for position-detektor/*.ts...');

for (const item of FILES_MAP) {
  let content = `import { PresetMatchingRule } from './types';\n\n`;
  content += `export const ${item.exportName}: PresetMatchingRule[] = [\n`;

  let filePhrases = 0;

  for (const rule of item.data) {
    totalPresetsCount++;
    filePhrases += rule.exactPhrases.length;
    grandTotalPhrases += rule.exactPhrases.length;
    grandTotalStrong += rule.strongKeywords.length;
    grandTotalSecondary += (rule.secondaryKeywords || []).length;

    content += `  {\n`;
    content += `    key: '${rule.key}',\n`;
    content += `    code: '${rule.code}',\n`;
    content += `    exactPhrases: [\n`;
    
    // Chunk phrases cleanly
    const phrLines = [];
    const chunkSize = 5;
    for (let i = 0; i < rule.exactPhrases.length; i += chunkSize) {
      const slice = rule.exactPhrases.slice(i, i + chunkSize);
      phrLines.push('      ' + slice.map(s => `'${s}'`).join(', '));
    }
    content += phrLines.join(',\n') + '\n';
    content += `    ],\n`;

    content += `    strongKeywords: [\n`;
    const strongLines = [];
    for (let i = 0; i < rule.strongKeywords.length; i += chunkSize) {
      const slice = rule.strongKeywords.slice(i, i + chunkSize);
      strongLines.push('      ' + slice.map(s => `'${s}'`).join(', '));
    }
    content += strongLines.join(',\n') + '\n';
    content += `    ]`;

    if (rule.secondaryKeywords && rule.secondaryKeywords.length > 0) {
      content += `,\n    secondaryKeywords: [\n`;
      const secLines = [];
      for (let i = 0; i < rule.secondaryKeywords.length; i += chunkSize) {
        const slice = rule.secondaryKeywords.slice(i, i + chunkSize);
        secLines.push('      ' + slice.map(s => `'${s}'`).join(', '));
      }
      content += secLines.join(',\n') + '\n';
      content += `    ]`;
    }

    if (rule.negativeKeywords && rule.negativeKeywords.length > 0) {
      content += `,\n    negativeKeywords: [\n`;
      const negLines = [];
      for (let i = 0; i < rule.negativeKeywords.length; i += chunkSize) {
        const slice = rule.negativeKeywords.slice(i, i + chunkSize);
        negLines.push('      ' + slice.map(s => `'${s}'`).join(', '));
      }
      content += negLines.join(',\n') + '\n';
      content += `    ]`;
    }

    if (rule.mustIncludeAny && rule.mustIncludeAny.length > 0) {
      content += `,\n    mustIncludeAny: [\n`;
      const mustLines = [];
      for (let i = 0; i < rule.mustIncludeAny.length; i += chunkSize) {
        const slice = rule.mustIncludeAny.slice(i, i + chunkSize);
        mustLines.push('      ' + slice.map(s => `'${s}'`).join(', '));
      }
      content += mustLines.join(',\n') + '\n';
      content += `    ]`;
    }

    content += `\n  },\n`;
  }

  content += `];\n`;

  const targetPath = path.join(process.cwd(), 'src/data/position-detektor', item.file);
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log(`[SUCCESS] Generated ${item.file}: ${item.data.length} presets, ${filePhrases} exactPhrases`);
}

console.log('----------------------------------------------------');
console.log(`==> Total Presets Processed: ${totalPresetsCount}`);
console.log(`==> Total Exact Phrases: ${grandTotalPhrases} (Massively multiplied)`);
console.log(`==> Total Strong Keywords: ${grandTotalStrong}`);
console.log(`==> Total Secondary Keywords: ${grandTotalSecondary}`);
console.log('==> All 11 files written successfully!');
