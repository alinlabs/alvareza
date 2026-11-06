/**
 * Master Full-Scale Audit & Verification Runner
 */
import { execSync } from 'child_process';

console.log('=====================================================');
console.log('🚀 STARTING FULL-SCALE SYSTEM QUALITY AUDIT');
console.log('=====================================================\n');

function runStep(name: string, command: string) {
  console.log(`\n▶️  [STEP] ${name}`);
  console.log(`Running: ${command}\n`);
  const start = Date.now();
  try {
    execSync(command, { stdio: 'inherit' });
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`\n✅ [PASSED] ${name} completed in ${elapsed}s`);
    return true;
  } catch (error) {
    console.error(`\n❌ [FAILED] ${name} encountered an error!`);
    throw error;
  }
}

try {
  runStep('Phase 1 & 5: Static Analysis & Codebase Quality Audit', 'npx tsx scripts/audit-codebase.ts');
  runStep('Phase 4: Dependency & Security Audit', 'npx tsx scripts/audit-dependencies.ts');
  runStep('Phase 7: Automated Test Suite Execution (Vitest)', 'npx vitest run');
  runStep('Phase 6 & 8: Production Build & Asset Verification', 'npx tsx scripts/verify-build.ts');

  console.log('\n=====================================================');
  console.log('🎯 ALL AUDIT PHASES & AUTOMATED QA CHECKS PASSED!');
  console.log('=====================================================');
} catch {
  console.error('\n🚨 Full audit sequence terminated with errors.');
  process.exit(1);
}
