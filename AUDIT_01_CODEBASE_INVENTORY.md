# AUDIT 01: Comprehensive Codebase Inventory & Architectural Mapping

## 1. Executive Codebase Summary
- **Application Name**: MyCivy — Alvareza Hilka Pratama ATS CV Builder & Executive Portfolio
- **Architecture**: Hybrid Vite React 19 Frontend + Express Node.js Backend with Vercel Serverless Function compatibility.
- **Language**: TypeScript 5.8+ (Strict ESNext, Bundler Resolution)
- **Primary Entry Points**:
  - Web Client: `/src/main.tsx` -> `/src/App.tsx` (Single Page Application with shortlink codec routing)
  - Full-Stack Server: `/server.ts` (Express with Vite middleware in dev, static + API router in production on port 3000)
  - Vercel Serverless: `/api/*.ts` (Export handlers for Vercel deployment)
- **Build Tooling**: Vite 6.4.5, Tailwind CSS 4.1.14 (@tailwindcss/vite), ESBuild 0.25 (Node server bundler), Vitest 5.0.5.

---

## 2. Directory & Module Mapping

| Directory / Path | Layer | Responsibility | Key Files |
| :--- | :--- | :--- | :--- |
| `/server.ts` | Server Entry | Initializes Express, mounts global CORS, configures body parsers (20MB), registers modular routes, serves static assets with PDF inline headers, mounts Vite dev middleware. | `server.ts` |
| `/server/routes/` | Backend API | Modular Express Routers for Health, SEO/Sitemap/Robots/oEmbed, OCR & Gemini AI extraction, and Google Apps Script (GAS) proxying. | `index.ts`, `health.ts`, `seo.ts`, `ocr.ts`, `gas.ts` |
| `/api/` | Serverless API | Vercel Serverless functions for cloud hosting parity. | `health.ts`, `scan-job-text.ts`, `send-email-gas.ts`, `test-gas-account.ts` |
| `/src/pages/executive/` | Presentation | Public Executive Landing Page showcasing Maha Karya 50+ apps, key metrics, hero showcase, running ticker, and share modals. | `ExecutiveLandingPage.tsx`, `ExecutiveHero.tsx`, `ExecutiveMetricsGrid.tsx`, `ExecutiveMahaKarya.tsx` |
| `/src/pages/admin/` | Tools & Admin | ATS CV Builder workspace, live accordion editor for 10 sections, preset selector (86 roles), direct link generator, OCR scanner modal, GAS multi-account dispatcher. | `ToolsWorkspacePage.tsx`, `HeaderNavbar.tsx`, `SectionList.tsx`, `modal-setting.tsx`, `modal-history.tsx` |
| `/src/pages/admin/lamar-kerja/` | Workflow Engine | Quick job application scanner, OCR drag & drop, AI parsing, draft manager, attachment selection, sequential bulk dispatcher with anti-spam pacing. | `JobApplyModalSheet.tsx`, `useJobApplyFlow.ts`, `SmartInputSection.tsx`, `JobDraftsModal.tsx` |
| `/src/pages/full-view/` | Document Sheet | ATS-Friendly printable document sheets, vector PDF viewer, Portfolio slide viewer, Certification gallery, Academic and Identity document displays. | `pdf.tsx`, `portfolio.tsx`, `certification.tsx`, `academic.tsx`, `identity.tsx`, `constants.ts` |
| `/src/data/preset/` | Domain Catalog | 86 distinct role presets, item selection registry, section orders, headlines, and bilingual summaries. | `RoleConfig.ts`, `HeadlinesSummaries.ts`, `RegistryData.ts`, `ItemSelections.ts`, `SectionOrders.ts` |
| `/src/data/position-detektor/`| Intelligence Engine | Keyword adapter, bilingual position matcher, domain rule clusters (HR, Ops, Sales, Tech, PMO, Consulting, Finance, Admin). | `matcher.ts`, `synonymEngine.ts`, `types.ts`, `cvKeywordAdapter.ts` |
| `/src/utils/pdf/` | Document Engine | Vector jsPDF generators for ATS resumes, formal cover letters, and document preview rendering via pdfjs-dist. | `coreGenerator.ts`, `coverLetterGenerator.ts`, `helpers.ts`, `types.ts` |
| `/src/utils/portfolio-pdf/` | Portfolio Engine | Generates multi-slide executive portfolio PDF with adaptive quality compression. | `pdfBuilders.ts`, `slideCatalog.ts`, `slideSelector.ts`, `imageLoader.ts` |
| `/src/services/` | State & Network | Storage and dispatch service for GAS accounts, rotation engine, and job drafts persistence. | `gasSenderService.ts`, `jobDraftService.ts` |
| `/src/utils/` | Utilities | Codecs, OCR sanitizers, image preprocessors, short link obfuscators. | `shortLinkCodec.ts`, `ocrValidatorAndMapper.ts`, `gasAttachmentGenerator.ts`, `identityPdfGenerator.ts` |
| `/tests/` | Automated QA | Complete Vitest test suite covering unit tests, integration tests, regression tests, and end-to-end workflow tests. | `tests/unit/*.ts`, `tests/integration/*.ts`, `tests/regression/*.ts`, `tests/e2e/*.ts` |
| `/scripts/` | Tooling & Audit | Automated audit runners, dependency scanners, build verification, and preset validation. | `audit-codebase.ts`, `audit-dependencies.ts`, `verify-build.ts`, `run-full-audit.ts` |

---

## 3. Technology Stack & Runtime Verification
- **Frontend Framework**: React 19.0.1 + React-DOM 19.0.1
- **Styling**: Tailwind CSS v4.1.14 with `@tailwindcss/vite`
- **Animation**: `lottie-web` 5.13.0 and `motion` 12.23.24
- **PDF Engine**: `jspdf` 4.2.1, `pdf-lib` 1.17.1, `pdfjs-dist` 6.2.108
- **AI SDK**: `@google/genai` 2.4.0 (Model: `gemini-3.8-flash`)
- **OCR Engine**: Client-side `tesseract.js` 7.0.0 with server-side text intelligence fallback
- **Server Runtime**: Express 4.21.2 on Node.js >=20.0.0, bundled with ESBuild
- **Test Runner**: Vitest 5.0.5

---

## 4. Architectural Dependency Graph
```
Browser / Client Request
          │
          ▼
   ShortLinkCodec (Decodes /sr?pg=adm, /prev?f=p, etc.)
          │
   ┌──────┴────────────────────────────────────────────────┐
   │                                                       │
Public Mode: /                                      Admin Mode: /sr?pg=adm
ExecutiveLandingPage                                ToolsWorkspacePage
  ├── ExecutiveHero                                   ├── HeaderNavbar
  ├── ExecutiveMetricsGrid                            ├── SectionList (10 ATS Sections)
  ├── ExecutiveMahaKarya (50+ apps)                   ├── Quickbar & Preset Selector
  └── ExecutiveShareModal                             ├── LamarKerja Drawer
                                                      │     ├── OCR Image / Flyer Scanner
PDF / Document Viewer Mode: /prev?f=...               │     ├── Gemini AI Entity Extractor
  ├── FullPagePdfView (ATS Resume)                   │     ├── Job Draft Service (Indexed/LocalStorage)
  ├── FullPagePortfolioView (Adaptive Slides)        │     └── GAS Multi-Account Dispatcher (6 Accounts)
  ├── FullPageCertificationView                       └── DirectLink Generator
  ├── FullPageAcademicView (SKL / Transkrip)
  └── FullPageIdentityView (KTP / KK / NPWP / Pas Foto)
          │
          ▼
Core Generators & Services:
  ├── buildATSPDFDocument (Vector jsPDF)
  ├── generateCoverLetterPdfAttachment
  ├── buildAdaptivePortfolioPdf
  ├── buildIdentityDocsPdf
  ├── GasSenderService (Load-balanced multi-account rotation)
  └── JobDraftService (Tempo delayed bulk dispatcher)
```
