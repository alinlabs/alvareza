const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// Remove top-level import
code = code.replace(/import\s+\{\s*createServer\s*as\s*createViteServer\s*\}\s*from\s+["']vite["'];?\n?/g, "");

// Replace usage with dynamic import
code = code.replace(
  /const\s+vite\s*=\s*await\s+createViteServer\(\{\s*server:\s*\{\s*middlewareMode:\s*true\s*\},\s*appType:\s*["']spa["'],\s*\}\);/g,
  `const { createServer: createViteServer } = await import("vite");\n    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });`
);

fs.writeFileSync('server.ts', code);
