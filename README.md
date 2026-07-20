# Portfolio Assets & Database Seeds

Welcome to the public assets repository for the **Digital Portfolio & CV ATS Management System**. This directory contains all public resources, media assets, pre-configured email templates, and the complete database initialization scripts.

## 📂 Directory Structure

```text
public/
├── database/                    # SQL Database Schemas and Seeds
│   ├── schema.sql               # Base database schema definitions
│   ├── all-seed.sql             # Unified seed script containing all default datasets
│   ├── seed-profil.sql          # Individual seeds for user profile
│   ├── seed-pendidikan.sql      # Individual seeds for education history
│   ├── seed-pengalaman-profesi.sql  # Professional experience dataset
│   ├── seed-pengalaman-organisasi.sql # Organizational roles dataset
│   ├── seed-pengalaman-kerjasama.sql  # Collaborations & partnerships dataset
│   ├── seed-keahlian.sql        # Skills & proficiencies dataset
│   ├── seed-pencapaian.sql      # Achievements dataset
│   ├── seed-portofolio.sql      # Projects & Portfolio items
│   ├── seed-pelatihan.sql       # Certificates & course trainings
│   ├── seed-cover-letter-templates.sql # Multi-language Cover Letter Templates
│   ├── seed-email-sender.sql    # SMTP Sender configurations
│   ├── seed-email-template.sql  # Base email outreach templates
│   └── worker.js                # Database client-side worker
├── email/                       # Static HTML Email Templates
│   ├── formal.html              # Formal outreach email structure
│   ├── surat-lamaran.html       # Automated Job Application cover letters
│   └── otp-verification.html    # Secure OTP verification emails
├── gambar/                      # Public Image Assets
│   ├── profil.png               # Main user portrait
│   ├── hero-desktop.webp        # Desktop hero illustration
│   ├── hero-mobile.webp         # Mobile hero illustration
│   └── [logos]/                 # Corporate logos (wikara, lingua, bjb, etc.)
└── pdf/                         # Document Deliverables
    ├── cv.pdf                   # Downloadable Professional Resume
    └── paklaring.pdf            # Experience verification letters
```

## 🗄️ SQLite Database Initialization

The system utilizes a client-side database layer initialized via `schema.sql` and populated with unified records from `all-seed.sql`.

### Core Tables:
1. **`profil`**: Stores identity details, contact information, social links, and summary.
2. **`pendidikan`**: Holds educational background, institutions, and scores.
3. **`pengalaman_profesi`**: Professional corporate experience tracks.
4. **`pengalaman_organisasi`**: Extracurricular activities and leadership histories.
5. **`pengalaman_kerjasama`**: Client & partner relationship collaborations.
6. **`keahlian`**: Specialized skills categorized with scoring ratings.
7. **`kejuaraan` / `pencapaian`**: Key rewards, honors, and competition wins.
8. **`portofolio`**: Interactive project showcases.
9. **`cover_letter_templates`**: Pre-written, high-conversion cover letters (Bahasa Indonesia & English) for job applications.
10. **`email_sender`**: Custom SMTP credential records for automated outreach.
11. **`email_template`**: Recruiter email draft layouts.

## 📧 Automated Email System

All system emails utilize standard responsive HTML files situated in `/public/email`. Recruiter emails can be sent directly from the Admin Panel using pre-configured cover letters retrieved dynamically from the `cover_letter_templates` table.
