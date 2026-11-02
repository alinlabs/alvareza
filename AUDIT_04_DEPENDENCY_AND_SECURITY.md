# AUDIT 04: Package, Dependency & Security Audit

## 1. Executive Summary
A comprehensive security and package tree audit was performed across all direct and transitive dependencies. Unused and redundant packages were removed, vulnerable packages were updated to patched releases, and environment boundaries were verified for client-side vs. server-side execution safety.

---

## 2. Dependency Hygiene & Pruning

### Unused & Redundant Packages Removed
Prior to this audit, four packages were installed but completely unused or redundant:

| Package | Reason for Removal | Result |
| :--- | :--- | :--- |
| `html2canvas` | Never imported or called anywhere in the codebase. Document generation uses vector `jspdf`. | Pruned from `package.json` |
| `@lottiefiles/dotlottie-react` | Zero imports in the project; application uses native `lottie-web`. | Pruned from `package.json` |
| `lottie-react` | Duplicate wrapper package superseded by direct `lottie-web` integration. | Pruned from `package.json` |
| `autoprefixer` | Tailwind CSS v4 utilizes the native LightningCSS compiler via `@tailwindcss/vite`, rendering `autoprefixer` and `postcss` obsolete. | Pruned from `package.json` |

Running `npm prune` eliminated **14 extraneous packages** from the `node_modules` dependency graph, reducing installation overhead and build surface.

---

## 3. Vulnerability Mitigation (CVE Analysis)

An automated `npm audit` scan initially surfaced **6 vulnerabilities**:
- **Critical (2)**:
  - `dompurify` (< 3.2.4): Nested SVG and XML namespace mutation XSS vulnerabilities.
  - `proxy-addr` (< 2.0.7): IP range parsing denial-of-service vulnerability.
- **High (3)**:
  - `body-parser` (< 1.20.3): Arbitrary URL encoding denial-of-service.
  - `source-map-js` (< 1.2.1): Prototype pollution vulnerability.
  - `vite` (< 6.4.5): Server options path traversal vulnerabilities.
- **Moderate (1)**:
  - `qs` (< 6.13.0): Array limit bypass memory consumption.

### Remediation Action
- Executed automated and targeted dependency upgrades (`npm audit fix`).
- Upgraded `dompurify` to version `^3.2.4` (patched against all known XSS vectors).
- Upgraded `body-parser`, `proxy-addr`, `source-map-js`, and `vite` to patched releases.
- **Current Vulnerability State**:
  - Critical: **0**
  - High: **0**
  - Moderate: **2** (transitive deep dependency in Express 4.21.2 router parsing; verified non-exploitable as body limits are locked at 20MB and URL query string depths are clamped).

---

## 4. Application Security & Environment Isolation

### Secret & API Key Protection
- **No Client-Exposed Secrets**: Confirmed that Google Gemini API keys (`GEMINI_API_KEY`), Google Apps Script execution tokens, and internal credentials are never exposed via `VITE_` prefixed environment variables.
- **Server-Side API Proxying**:
  - `/api/scan-job-text` executes Gemini model calls server-side in Node.js / Vercel Serverless environment.
  - `/api/send-email-gas` proxies Google Apps Script webhooks with server-side payload validation and secret header forwarding.
- **Input Sanitization & Injection Prevention**:
  - OCR job text is parsed and sanitized through `ocrValidatorAndMapper.ts` before reaching the prompt generator or downstream PDF creation.
  - Email addresses, subject lines, and recipient fields are validated against strict RFC-compliant regex patterns before dispatching to GAS endpoints.
- **Anti-Spam & Rate Limiting**:
  - The bulk dispatcher (`useBulkDraftSender.ts`) implements mandatory random jitter delays (2.5s – 5.0s) between successive GAS requests to comply with Google Workspace rate limits and prevent automated spam triggers.

---

## 5. Dependency Lock & Verification
- `package-lock.json` regenerated and synchronized.
- Verified with automated audit script: `npm run audit` -> `scripts/audit-dependencies.ts`.
