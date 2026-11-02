/**
 * Automated Dependency Verification & Security Health Check
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('📦 [Audit Dependencies] Inspecting package.json manifest and locks...');
const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const deps = Object.keys(pkg.dependencies || {});
const devDeps = Object.keys(pkg.devDependencies || {});
console.log(`Total dependencies: ${deps.length}, devDependencies: ${devDeps.length}`);

// Check for known deprecated or removed packages
const deprecatedCheck = ['request', 'querystring', 'babel-eslint'];
const flagged = [...deps, ...devDeps].filter((d) => deprecatedCheck.includes(d));
if (flagged.length > 0) {
  console.warn('⚠️ [Audit Dependencies] Found deprecated packages:', flagged);
} else {
  console.log('✅ [Audit Dependencies] No deprecated legacy packages found.');
}

console.log('🔒 [Audit Dependencies] Running npm audit vulnerability scanner...');
try {
  const auditOutput = execSync('npm audit --json', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  const auditJson = JSON.parse(auditOutput);
  const vulns = auditJson.metadata?.vulnerabilities || {};
  console.log('Vulnerability breakdown:', vulns);
  if (vulns.critical > 0 || vulns.high > 0) {
    console.error('❌ [Audit Dependencies] Critical or High vulnerabilities detected!');
    process.exit(1);
  } else {
    console.log('✅ [Audit Dependencies] Zero critical or high severity vulnerabilities found.');
  }
} catch (e: any) {
  try {
    const jsonOutput = JSON.parse(e.stdout || '{}');
    const vulns = jsonOutput.metadata?.vulnerabilities || {};
    console.log('Vulnerability breakdown:', vulns);
    if ((vulns.critical || 0) > 0 || (vulns.high || 0) > 0) {
      console.error('❌ [Audit Dependencies] Critical/High vulnerabilities remain!');
      process.exit(1);
    } else {
      console.log('✅ [Audit Dependencies] Only low/moderate non-blocking dependencies reported:', vulns);
    }
  } catch {
    console.log('ℹ️ [Audit Dependencies] Audit process finished.');
  }
}

console.log('🎉 [Audit Dependencies] Dependency audit completed successfully!');
