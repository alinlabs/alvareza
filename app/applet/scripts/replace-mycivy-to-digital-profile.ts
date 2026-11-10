import fs from 'fs';
import path from 'path';

function walkDir(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = walkDir(process.cwd());

let filesModified = 0;

for (const filePath of allFiles) {
  if (filePath.endsWith('.webp') || filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.ico') || filePath.endsWith('.lock') || filePath.includes('/scripts/replace-mycivy-to-digital-profile.ts')) {
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replacements
  content = content.replace(/My Civy/g, 'Digital Profile');
  content = content.replace(/MyCivy/g, 'Digital Profile');
  content = content.replace(/MYCIVY/g, 'DIGITALPROFILE');
  content = content.replace(/mycivy/g, 'digitalprofile');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
    console.log(`Updated: ${filePath}`);
  }
}

console.log(`\nDone! Modified ${filesModified} files.`);
