import { jsPDF } from 'jspdf';
import { ApiService } from '../services/api';
import { 
  ProfileData, 
  Experience, 
  Education, 
  SkillGroup, 
  Achievement, 
  Training, 
  OrganizationExperience, 
  Collaboration 
} from '../types';

export async function generateAtsCvDoc(signal?: AbortSignal): Promise<{ doc: jsPDF; filename: string }> {
  // 1. Fetch all data in parallel
  const [
    profilRes,
    profesiRes,
    kerjasamaRes,
    organisasiRes,
    pendidikanRes,
    pelatihanRes,
    keahlianRes,
    pencapaianRes,
    kejuaraanRes
  ] = await Promise.all([
    ApiService.get<ProfileData>('profil', { signal }),
    ApiService.get<Experience[]>('pengalaman-profesi', { signal }),
    ApiService.get<Collaboration[]>('pengalaman-kerjasama', { signal }),
    ApiService.get<OrganizationExperience[]>('pengalaman-organisasi', { signal }),
    ApiService.get<Education[]>('pendidikan', { signal }),
    ApiService.get<Training[]>('pelatihan', { signal }),
    ApiService.get<any>('keahlian', { signal }), // can be SkillGroup[] or Skill[] flat
    ApiService.get<Achievement[]>('pencapaian', { signal }),
    ApiService.get<Achievement[]>('kejuaraan', { signal })
  ]);

  const profil = profilRes.data;
  const experiences = profesiRes.data || [];
  const collaborations = kerjasamaRes.data || [];
  const organizations = organisasiRes.data || [];
  const educations = pendidikanRes.data || [];
  const trainings = pelatihanRes.data || [];
  const rawSkills = keahlianRes.data || [];
  const achievements = pencapaianRes.data || [];
  const kejuaraan = kejuaraanRes.data || [];

  if (!profil) {
    throw new Error('Data profil tidak ditemukan. Gagal membuat CV.');
  }

  // Normalize skills into grouped structure if flat
  let skillGroups: SkillGroup[] = [];
  if (Array.isArray(rawSkills) && rawSkills.length > 0) {
    if (rawSkills[0].hasOwnProperty('keahlian')) {
      skillGroups = rawSkills as SkillGroup[];
    } else {
      // It's a flat array of Skills, let's group by category (kategori)
      const tempGroup: Record<string, any[]> = {};
      rawSkills.forEach((s: any) => {
        const cat = s.kategori || 'Keahlian Utama';
        if (!tempGroup[cat]) tempGroup[cat] = [];
        tempGroup[cat].push(s);
      });
      skillGroups = Object.keys(tempGroup).map(cat => ({
        kategori: cat,
        keahlian: tempGroup[cat]
      }));
    }
  }

  // 2. Initialize jsPDF
  await new Promise(resolve => setTimeout(resolve, 20));
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = 297;
  const pageWidth = 210;
  const leftMargin = 12.5; // 1.25 cm standard margin
  const rightMargin = 12.5;
  const topMargin = 12.5;
  const bottomMargin = 12.5;
  const contentWidth = pageWidth - leftMargin - rightMargin; // 185mm
  const maxContentY = pageHeight - bottomMargin;
  let y = topMargin;

  // Helper: Text rendering with word wrap & auto page break
  const addWrappedText = (
    text: string, 
    fontSize: number, 
    fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic', 
    textColor: [number, number, number], 
    lineSpacing = 4.5,
    customX = leftMargin
  ): void => {
    doc.setFont('Helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    const lines = doc.splitTextToSize(text, contentWidth - (customX - leftMargin));
    for (let i = 0; i < lines.length; i++) {
      if (y + lineSpacing > maxContentY) {
        doc.addPage();
        y = topMargin;
      }
      doc.text(lines[i], customX, y);
      y += lineSpacing;
    }
  };

  // Helper: Add double section spacing
  const spacing = (amount: number): void => {
    y += amount;
    if (y > maxContentY) {
      doc.addPage();
      y = topMargin;
    }
  };

  // Helper: Page space validation (Orphan protection)
  const ensureSpace = (spaceNeeded: number): void => {
    if (y + spaceNeeded > maxContentY) {
      doc.addPage();
      y = topMargin;
    }
  };

  // Helper: Add Section Header
  const addSectionHeader = (title: string): void => {
    ensureSpace(20);
    spacing(4);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // slate-900 (Dark Slate)
    doc.text(title.toUpperCase(), leftMargin, y);
    
    y += 1.8;
    // Section underline
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.3);
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    
    y += 4.5;
  };

  // ==========================================
  // HEADER SECTION (Name & Contact Info)
  // ==========================================
  ensureSpace(40);
  // Name
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(profil.nama, leftMargin, y);
  y += 5.5;

  // Subtitle / Job Title
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(profil.jabatan, leftMargin, y);
  y += 5.5;

  // Contact Info row
  const contacts: string[] = [];
  if (profil.email) contacts.push(profil.email);
  if (profil.telepon) contacts.push(profil.telepon);
  if (profil.lokasi) contacts.push(profil.lokasi);
  if (profil.linkedin) {
    const cleanLinkedIn = profil.linkedin.replace(/https?:\/\/(www\.)?/, '');
    contacts.push(cleanLinkedIn);
  }

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // slate-600
  const contactsText = contacts.join('   |   ');
  doc.text(contactsText, leftMargin, y);
  y += 5;

  // Header separator line
  doc.setDrawColor(15, 23, 42); // dark slate
  doc.setLineWidth(0.6);
  doc.line(leftMargin, y, pageWidth - rightMargin, y);
  y += 6;

  // ==========================================
  // SUMMARY SECTION
  // ==========================================
  if (profil.tentang || profil.bio) {
    addSectionHeader('Tentang Saya');
    const summaryText = profil.tentang || profil.bio || '';
    addWrappedText(summaryText, 9.5, 'normal', [51, 65, 85], 4.8);
  }

  // ==========================================
  // WORK EXPERIENCE SECTION
  // ==========================================
  if (experiences && experiences.length > 0) {
    addSectionHeader('Pengalaman Kerja');
    
    // Sort experience by date/status (assumed sorted or latest first)
    const sortedExp = [...experiences];

    sortedExp.forEach((exp) => {
      ensureSpace(24);
      
      // 1. Company Name (Left) & Location/Scale (Right)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(exp.perusahaan, leftMargin, y);
      
      const locText = exp.skala || exp.industri || '';
      if (locText) {
        doc.text(locText, pageWidth - rightMargin, y, { align: 'right' });
      }
      y += 4.5;

      // 2. Role Title (Left) & Dates (Right)
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text(exp.peran, leftMargin, y);

      const periodText = `${exp.mulai || ''} - ${exp.selesai || 'Sekarang'}`;
      doc.text(periodText, pageWidth - rightMargin, y, { align: 'right' });
      y += 5;

      // 3. Short description of experience
      if (exp.deskripsi) {
        addWrappedText(exp.deskripsi, 9.5, 'normal', [51, 65, 85], 4.5);
      }

      // 4. Tasks and Responsibilities (as standard bullet points)
      if (exp.tugasTanggungJawab && exp.tugasTanggungJawab.length > 0) {
        exp.tugasTanggungJawab.forEach((tugas) => {
          if (!tugas) return;
          ensureSpace(10);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);
          
          // Draw a neat solid bullet circle
          doc.text('\u2022', leftMargin + 2, y);
          
          // Text wrap on tasks with indent
          const indentX = leftMargin + 6;
          const wrappedLines = doc.splitTextToSize(tugas, contentWidth - 6);
          wrappedLines.forEach((line: string) => {
            if (y + 4.5 > maxContentY) {
              doc.addPage();
              y = topMargin;
            }
            doc.text(line, indentX, y);
            y += 4.5;
          });
        });
      }

      // 5. Specializations/Technologies
      if (exp.spesialisasi && exp.spesialisasi.length > 0) {
        ensureSpace(8);
        const specLabel = `Spesialisasi: ${exp.spesialisasi.join(', ')}`;
        addWrappedText(specLabel, 9, 'italic', [71, 85, 105], 4.2);
      }

      y += 2.5; // spacing between experience blocks
    });
  }

  // ==========================================
  // COLLABORATION EXPERIENCE SECTION
  // ==========================================
  if (collaborations && collaborations.length > 0) {
    addSectionHeader('Pengalaman Kolaborasi & Kerjasama');
    
    collaborations.forEach((collab) => {
      ensureSpace(22);
      
      // Partner (Left) & Industry (Right)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(collab.partner, leftMargin, y);
      
      if (collab.bidang) {
        doc.text(collab.bidang, pageWidth - rightMargin, y, { align: 'right' });
      }
      y += 4.5;

      // Role (Left) & Period (Right)
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`${collab.peran} (${collab.proyek})`, leftMargin, y);

      const periodText = `${collab.mulai || ''} - ${collab.selesai || ''}`;
      doc.text(periodText, pageWidth - rightMargin, y, { align: 'right' });
      y += 5;

      // Description
      if (collab.deskripsi) {
        addWrappedText(collab.deskripsi, 9.5, 'normal', [51, 65, 85], 4.5);
      }

      // Goals & Outcomes
      if (collab.tujuan && collab.tujuan.length > 0) {
        collab.tujuan.forEach((item) => {
          if (!item) return;
          ensureSpace(10);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);
          doc.text('\u2022', leftMargin + 2, y);
          
          const indentX = leftMargin + 6;
          const wrappedLines = doc.splitTextToSize(item, contentWidth - 6);
          wrappedLines.forEach((line: string) => {
            if (y + 4.5 > maxContentY) {
              doc.addPage();
              y = topMargin;
            }
            doc.text(line, indentX, y);
            y += 4.5;
          });
        });
      }

      y += 2;
    });
  }

  // ==========================================
  // EDUCATION SECTION
  // ==========================================
  if (educations && educations.length > 0) {
    addSectionHeader('Pendidikan');

    educations.forEach((edu) => {
      ensureSpace(18);

      // Institution Name (Left) & Gelar (Right)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(edu.institusi, leftMargin, y);
      doc.text(edu.gelar, pageWidth - rightMargin, y, { align: 'right' });
      y += 4.5;

      // Period
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`${edu.tahunMasuk} - ${edu.tahunLulus}`, leftMargin, y);
      y += 5;

      // Description
      if (edu.deskripsi && edu.deskripsi.length > 0) {
        edu.deskripsi.forEach((desc) => {
          if (!desc) return;
          ensureSpace(10);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);
          doc.text('\u2022', leftMargin + 2, y);
          
          const indentX = leftMargin + 6;
          const wrappedLines = doc.splitTextToSize(desc, contentWidth - 6);
          wrappedLines.forEach((line: string) => {
            if (y + 4.5 > maxContentY) {
              doc.addPage();
              y = topMargin;
            }
            doc.text(line, indentX, y);
            y += 4.5;
          });
        });
      }

      y += 2;
    });
  }

  // ==========================================
  // TRAINING & CERTIFICATIONS SECTION
  // ==========================================
  if (trainings && trainings.length > 0) {
    addSectionHeader('Pelatihan & Sertifikasi');

    trainings.forEach((trn) => {
      ensureSpace(15);
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(trn.judul, leftMargin, y);
      
      const trnYear = trn.tahun ? ` (${trn.tahun})` : '';
      doc.text(`${trn.penyelenggara}${trnYear}`, pageWidth - rightMargin, y, { align: 'right' });
      y += 4.5;

      if (trn.deskripsi) {
        addWrappedText(trn.deskripsi, 9, 'normal', [51, 65, 85], 4.2);
      }

      if (trn.hasil && trn.hasil.length > 0) {
        const outcomesText = `Hasil/Materi: ${trn.hasil.join(', ')}`;
        addWrappedText(outcomesText, 8.5, 'italic', [71, 85, 105], 4);
      }

      y += 2;
    });
  }

  // ==========================================
  // SKILLS SECTION
  // ==========================================
  if (skillGroups && skillGroups.length > 0) {
    addSectionHeader('Keahlian & Kompetensi');

    skillGroups.forEach((group) => {
      ensureSpace(12);

      const categoryName = group.kategori;
      const skillsList = group.keahlian.map(s => {
        const masteryStr = s.penguasaan && s.penguasaan.length > 0 
          ? ` (${s.penguasaan.join(', ')})` 
          : '';
        return `${s.bidang}${masteryStr}`;
      }).join(', ');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${categoryName}:`, leftMargin, y);

      // Measure width of category name to place list right next to it, or wrap it
      const categoryWidth = doc.getTextWidth(`${categoryName}: `);
      const startX = leftMargin + categoryWidth;
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      
      const wrappedSkills = doc.splitTextToSize(skillsList, contentWidth - categoryWidth);
      for (let i = 0; i < wrappedSkills.length; i++) {
        if (y + 4.5 > maxContentY) {
          doc.addPage();
          y = topMargin;
        }
        // First line goes next to category name, subsequent lines indent to leftMargin
        const currentX = i === 0 ? startX : leftMargin;
        doc.text(wrappedSkills[i], currentX, y);
        y += 4.5;
      }
      
      y += 1.5;
    });
  }

  // ==========================================
  // ORGANIZATIONAL EXPERIENCE SECTION
  // ==========================================
  if (organizations && organizations.length > 0) {
    addSectionHeader('Pengalaman Organisasi');

    organizations.forEach((org) => {
      ensureSpace(20);

      // Organization Name
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(org.organisasi, leftMargin, y);
      y += 4.5;

      // Peran & Period
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text(org.peran, leftMargin, y);

      const periodText = `${org.mulai || ''} - ${org.selesai || 'Sekarang'}`;
      doc.text(periodText, pageWidth - rightMargin, y, { align: 'right' });
      y += 5;

      // Description
      if (org.deskripsi) {
        addWrappedText(org.deskripsi, 9.5, 'normal', [51, 65, 85], 4.5);
      }

      // Key Achievements
      if (org.pencapaian && org.pencapaian.length > 0) {
        org.pencapaian.forEach((p) => {
          if (!p || !p.pekerjaan) return;
          ensureSpace(10);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);
          doc.text('\u2022', leftMargin + 2, y);
          
          const indentX = leftMargin + 6;
          const wrappedLines = doc.splitTextToSize(`${p.pekerjaan} (${p.persentase}%)`, contentWidth - 6);
          wrappedLines.forEach((line: string) => {
            if (y + 4.5 > maxContentY) {
              doc.addPage();
              y = topMargin;
            }
            doc.text(line, indentX, y);
            y += 4.5;
          });
        });
      }

      y += 2;
    });
  }

  // ==========================================
  // ACHIEVEMENTS SECTION
  // ==========================================
  const allAchievements = [...achievements, ...kejuaraan];
  if (allAchievements && allAchievements.length > 0) {
    addSectionHeader('Prestasi & Penghargaan');

    allAchievements.forEach((ach) => {
      ensureSpace(12);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(ach.judul, leftMargin, y);
      
      const achYear = ach.tahun ? ` (${ach.tahun})` : '';
      doc.text(`${ach.penerbit}${achYear}`, pageWidth - rightMargin, y, { align: 'right' });
      y += 4.5;

      if (ach.deskripsi) {
        addWrappedText(ach.deskripsi, 9, 'normal', [51, 65, 85], 4.2);
      }

      y += 2;
    });
  }

  // Add page numbers at the bottom of each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  // 3. Return doc and filename instead of directly saving inside the builder
  await new Promise(resolve => setTimeout(resolve, 10));
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return { doc, filename: `CV_ATS_${profil.nama.replace(/\s+/g, '_')}.pdf` };
}

export async function generateAtsCv(): Promise<void> {
  const { doc, filename } = await generateAtsCvDoc();
  doc.save(filename);
}
