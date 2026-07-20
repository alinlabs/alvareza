const fs = require('fs');
const lines = fs.readFileSync('server.ts', 'utf-8').split('\n');

const newLines = [
  ...lines.slice(0, 7),
  'import { getEmailHTML, getOtpEmailHTML } from "./src/utils/emailTemplate.js";', // note .js extension isn't needed here if TS supports it, wait, we are using esbuild for server.ts so .js doesn't matter, it bundles it. Let's use bare.
  ...lines.slice(345)
];

fs.writeFileSync('server.ts', newLines.join('\n'));
