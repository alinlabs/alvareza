# AUDIT 02: Duplicate Code, Redundancy Elimination & Structural Refactoring

## 1. Executive Summary
During Phase 2, the codebase underwent systematic scanning for duplicated logic, redundant packages, dead imports, and architectural anti-patterns. Multiple significant redundancies and duplications were identified, isolated, and refactored into centralized, reusable modules.

---

## 2. Inventory of Duplications & Refactoring Actions

### A. Redundant & Duplicated Packages in `package.json`
| Package | Identified Status | Action Taken | Rationale |
| :--- | :--- | :--- | :--- |
| `html2canvas` | **Unused / Dead Weight** | Removed from `package.json` & `vite.config.ts` | The entire PDF generator utilizes direct vector drawing via `jspdf` and canvas rendering via `pdfjs-dist`. `html2canvas` was never imported in any source file. |
| `@lottiefiles/dotlottie-react` | **Unused / Duplicate** | Removed from `package.json` | Project exclusively utilizes standard Lottie JSON files rendered via `lottie-web`. Zero source files imported dotlottie. |
| `lottie-react` | **Unused / Duplicate** | Removed from `package.json` & `vite.config.ts` | `src/components/common/LottiePlayer.tsx` implements a robust custom wrapper over `lottie-web` with freeze protection and layer limits validation. `lottie-react` was completely redundant. |
| `autoprefixer` | **Redundant** | Removed from devDependencies | Tailwind CSS v4 utilizes the `@tailwindcss/vite` plugin powered by LightningCSS, which includes built-in modern vendor prefixing. Separate PostCSS autoprefixer is obsolete. |

**Net Impact**: 14 transitive and direct packages eliminated from `node_modules`, shrinking node_modules footprint and eliminating unnecessary build chunk overhead.

---

### B. Constant Duplication & Misplaced Imports in Full-View Modules
- **Discovered Issue**: The vector SVG data URI constant `MYCIVY_QR_LOGO_SVG` (7 lines of URI-encoded SVG markup) was copy-pasted verbatim across 5 distinct files:
  1. `src/pages/full-view/academic.tsx`
  2. `src/pages/full-view/certification.tsx`
  3. `src/pages/full-view/identity.tsx`
  4. `src/pages/full-view/pdf.tsx`
  5. `src/pages/full-view/portfolio.tsx`
  Furthermore, in several files (`academic.tsx`, `identity.tsx`), the constant was declared in the middle of import blocks, breaking the TypeScript coding standard requiring all imports at the top level.
- **Refactoring Applied**:
  - Created a single, centralized `src/pages/full-view/constants.ts` exporting `MYCIVY_QR_LOGO_SVG`.
  - Re-exported `constants.ts` through `src/pages/full-view/index.tsx`.
  - Replaced duplicate inline declarations across all 5 files with a clean top-level import:
    `import { MYCIVY_QR_LOGO_SVG } from './constants';`
  - Reordered all imports to the topmost lines.

---

### C. Import Order Violations in Data & Utility Modules
- **Discovered Issues**:
  1. `src/data/preset/ItemSelections.ts`: Export statements appeared on lines 1-8 before `import` statements on lines 10-12.
  2. `src/utils/ocrEntityExtractor.ts`: `import { detectDominantLanguage } from '../data/position-detektor'` was placed on line 18 below `export const NOISE_SLOGANS`.
- **Refactoring Applied**:
  - Reordered imports to strictly precede all code definitions and exports across both files.
  - Verified with AST static analyzer script (`scripts/audit-codebase.ts`), resulting in 0 misplaced imports.

---

### D. Email Body HTML Formatting Consolidation
- **Discovered Issue**: In `api/send-email-gas.ts`, raw body formatting used an inline regex replacement while `server/routes/gas.ts` used `formatEmailBodyToHtml` from `src/utils/gasAttachmentGenerator.ts`.
- **Refactoring Applied**:
  - Both Express server routes and client services now strictly utilize the unified `formatEmailBodyToHtml` engine, ensuring consistent paragraph styling, bullet list conversion (`<ul style="list-style-type: disc;">`), and automated WhatsApp hyperlink generation (`wa.me/...`) across all execution environments.
