/**
 * Static Analysis & Codebase Quality Verification Script
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { ALL_ROLE_PRESETS } from '../src/data/preset/RoleConfig';
import { PRESET_HEADLINES, PRESET_SUMMARIES } from '../src/data/preset/HeadlinesSummaries';

console.log('🔍 [Audit Codebase] Running TypeScript Static Type Checking...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ [Audit Codebase] TypeScript type checking: PASS (0 errors)');
} catch (e) {
  console.error('❌ [Audit Codebase] TypeScript type checking failed!');
  process.exit(1);
}

console.log('🔍 [Audit Codebase] Verifying Preset Data Completeness across all 86 roles...');
const missingHeadlines = ALL_ROLE_PRESETS.filter((p) => !PRESET_HEADLINES[p.key]);
const missingSummaries = ALL_ROLE_PRESETS.filter((p) => !PRESET_SUMMARIES[p.key]);

if (missingHeadlines.length > 0 || missingSummaries.length > 0) {
  console.error('❌ [Audit Codebase] Incomplete preset definitions found!');
  if (missingHeadlines.length > 0) console.error('Missing headlines:', missingHeadlines.map((p) => p.key));
  if (missingSummaries.length > 0) console.error('Missing summaries:', missingSummaries.map((p) => p.key));
  process.exit(1);
}
console.log(`✅ [Audit Codebase] All ${ALL_ROLE_PRESETS.length} role presets have 100% complete headlines & summaries.`);

console.log('🔍 [Audit Codebase] Checking for misplaced imports in source files...');
const files = execSync('find src server api -type f -name "*.ts" -o -name "*.tsx"')
  .toString()
  .split('\n')
  .filter(Boolean);

let misplacedCount = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let inImportBlock = false;
  let seenCode = false;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('*/')) {
      continue;
    }
    if (trimmed.startsWith('import ') || trimmed.startsWith('import{')) {
      if (seenCode) {
        console.warn(`⚠️ [Warning] Misplaced import in ${file}:${i + 1} -> ${trimmed}`);
        misplacedCount++;
      }
      if (!trimmed.includes(';') && !trimmed.includes('from ')) {
        inImportBlock = true;
      }
    } else if (inImportBlock) {
      if (trimmed.includes(';') || trimmed.includes('from ')) {
        inImportBlock = false;
      }
    } else if (!trimmed.startsWith('export *') && !trimmed.startsWith('type ') && !trimmed.startsWith('interface ')) {
      seenCode = true;
    }
  }
}

if (misplacedCount === 0) {
  console.log('✅ [Audit Codebase] All imports are clean and located at top level.');
} else {
  console.log(`ℹ️ [Audit Codebase] ${misplacedCount} imports noticed for refactoring.`);
}

console.log('🎉 [Audit Codebase] Codebase static verification complete!');
