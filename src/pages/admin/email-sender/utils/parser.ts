import { CoverLetterTemplate } from '../Templates';
import { AttachedFile } from '../type';
import { ProfileData } from '../../../../types';

export interface GenerateEmailParams {
  selectedTplId: string;
  templates: CoverLetterTemplate[];
  companyName: string;
  positionName: string;
  recipientGender: string;
  recipientRole: string;
  customRecipientRole: string;
  recipientName: string;
  recipientPlaceOption: string;
  recipientPlaceName: string;
  recipientRoleCompanyFormat: string;
  includePerihal: boolean;
  includeLampiranAwal: boolean;
  includeDaftarLampiran: boolean;
  attachmentNamePreview: string;
  includeBio: boolean;
  bioNama: string;
  bioTtl: string;
  bioAlamat: string;
  bioTelp: string;
  bioPendidikan: string;
  bioJurusan: string;
  attachedFilesList: AttachedFile[];
  isSubjectAuto: boolean;
  customSubject: string;
  profileData: ProfileData | null;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export function getCityFromAlamat(alamat: string): string {
  if (!alamat || alamat === 'none') return 'Purwakarta';
  
  const commonCities = [
    'Purwakarta', 'Jakarta', 'Bandung', 'Bekasi', 'Depok', 'Bogor', 'Tangerang', 
    'Karawang', 'Subang', 'Cianjur', 'Sukabumi', 'Garut', 'Tasikmalaya', 'Ciamis',
    'Sumedang', 'Indramayu', 'Cirebon', 'Kuningan', 'Majalengka', 'Semarang', 
    'Surakarta', 'Solo', 'Yogyakarta', 'Surabaya', 'Malang', 'Medan', 'Makassar',
    'Palembang', 'Denpasar', 'Batam', 'Pekanbaru', 'Banjarmasin', 'Balikpapan'
  ];
  
  for (const city of commonCities) {
    if (new RegExp('\\b' + city + '\\b', 'i').test(alamat)) {
      return city;
    }
  }

  const parts = alamat.split(',');
  if (parts.length >= 2) {
    const secondPart = parts[1].trim();
    const cleanCity = secondPart.replace(/^(Kota|Kabupaten|Kab\.)\s+/i, '').trim();
    if (cleanCity) return cleanCity;
  }
  
  return 'Purwakarta';
}

export function buildEmailContent(params: GenerateEmailParams): GeneratedEmail {
  const {
    selectedTplId,
    templates,
    companyName,
    positionName,
    recipientGender,
    recipientRole,
    customRecipientRole,
    recipientName,
    recipientPlaceOption,
    recipientPlaceName,
    recipientRoleCompanyFormat,
    includePerihal,
    includeLampiranAwal,
    includeDaftarLampiran,
    attachmentNamePreview,
    includeBio,
    bioNama,
    bioTtl,
    bioAlamat,
    bioTelp,
    bioPendidikan,
    bioJurusan,
    attachedFilesList,
    isSubjectAuto,
    customSubject,
    profileData
  } = params;

  if (!selectedTplId || (templates || []).length === 0) {
    return { subject: '', body: '' };
  }
  
  const selectedTpl = templates.find(t => t.id === selectedTplId);
  if (!selectedTpl) {
    return { subject: '', body: '' };
  }

  let bdy = selectedTpl.body;

  // Replace variables
  const repPos = positionName || '[Posisi]';
  const repComp = companyName || '[Perusahaan]';

  const isEnglish = selectedTpl.name.toLowerCase().includes('english') || /en-/i.test(selectedTplId);
  const autoSub = isEnglish
    ? `Job Application: ${repPos} - Alvareza Hilka Pratama`
    : `Lamaran Pekerjaan: ${repPos} - Alvareza Hilka Pratama`;
  const sub = isSubjectAuto ? autoSub : customSubject;

  // Build the correct header block
  const role = recipientRole === 'Lainnya' ? (customRecipientRole || 'HRD') : (recipientRole || 'HRD');
  
  // Format place
  let tempat = isEnglish ? 'At place' : 'Di tempat';
  if (recipientPlaceOption === 'spesifik') {
    const trimmed = recipientPlaceName.trim();
    if (trimmed) {
      if (/^di\s+/i.test(trimmed)) {
        tempat = isEnglish ? 'In ' + trimmed.substring(3).trim() : 'Di ' + trimmed.substring(3).trim();
      } else if (isEnglish && /^in\s+/i.test(trimmed)) {
        tempat = trimmed;
      } else {
        tempat = isEnglish ? `In ${trimmed}` : `Di ${trimmed}`;
      }
    }
  }

  let headerBlock = '';
  const salutationEn = recipientGender === 'Bapak' ? 'Mr.' : recipientGender === 'Ibu' ? 'Ms.' : 'Mr./Ms.';
  const salutationId = recipientGender === 'Bapak' ? 'Bpk.' : recipientGender === 'Ibu' ? 'Ibu' : 'Bpk./Ibu';
  const salutation = isEnglish ? salutationEn : salutationId;
  const dearLabel = isEnglish ? 'To:' : 'Kepada Yth.';

  if (recipientGender !== 'Bapak/Ibu' && recipientName.trim()) {
    const boldName = `**${salutation} ${recipientName.trim()}**`;
    const boldRoleCompBlock = recipientRoleCompanyFormat === 'dua_baris' 
      ? `**${role}**\n**${repComp}**` 
      : `**${role} ${repComp}**`;

    headerBlock = `${dearLabel}
${boldName}
${boldRoleCompBlock}
${tempat}`;
  } else {
    const salutationNoNameEn = recipientGender === 'Bapak' ? 'Mr.' : recipientGender === 'Ibu' ? 'Ms.' : 'Mr./Ms.';
    const salutationNoNameId = recipientGender === 'Bapak' ? 'Bapak' : recipientGender === 'Ibu' ? 'Ibu' : 'Bapak/Ibu';
    const salutationNoName = isEnglish ? salutationNoNameEn : salutationNoNameId;
    if (recipientRoleCompanyFormat === 'dua_baris') {
      headerBlock = `${dearLabel}
**${salutationNoName} ${role}**
**${repComp}**
${tempat}`;
    } else {
      headerBlock = `${dearLabel}
**${salutationNoName} ${role} ${repComp}**
${tempat}`;
    }
  }

  // Prepend Perihal & Lampiran if requested
  if (includePerihal || includeLampiranAwal) {
    let prefix = '';
    if (includePerihal) {
      const perihalLabel = isEnglish ? 'Subject' : 'Perihal';
      const perihalVal = isEnglish ? `Job Application - ${repPos}` : `Lamaran Pekerjaan - ${repPos}`;
      prefix += `**${perihalLabel}**  : ${perihalVal}\n`;
    }
    if (includeLampiranAwal) {
      const lampiranLabel = isEnglish ? 'Attachment' : 'Lampiran';
      prefix += `**${lampiranLabel}** : ${attachmentNamePreview}\n`;
    }
    prefix += '\n'; // Space before Kepada Yth. / To:
    headerBlock = prefix + headerBlock;
  }

  // Replace the entire block of "Kepada Yth. ... Di tempat" or "di tempat" or "To: ... At place"
  const blockRegex = /Kepada Yth\.[\s\S]*?(?:Di tempat|di tempat)/gi;
  const blockRegexEn = /To:[\s\S]*?(?:At place|at place)/gi;
  const dearRegexHeader = /^Dear\s+Hiring[\s\S]*?,/i;
  
  if (blockRegex.test(bdy)) {
    bdy = bdy.replace(blockRegex, headerBlock);
  } else if (blockRegexEn.test(bdy)) {
    bdy = bdy.replace(blockRegexEn, headerBlock);
  } else if (dearRegexHeader.test(bdy)) {
    bdy = bdy.replace(dearRegexHeader, `Dear ${recipientGender === 'Bapak' ? 'Mr.' : recipientGender === 'Ibu' ? 'Ms.' : 'Mr./Ms.'} ${recipientName.trim() || role},`);
  } else {
    // Build the full letter around the core paragraphs
    const opening = isEnglish
      ? `${headerBlock}\n\nDear ${recipientGender === 'Bapak' ? 'Mr.' : recipientGender === 'Ibu' ? 'Ms.' : 'Mr./Ms.'} ${recipientName.trim() || role},\n\nI am writing to express my interest in the **${repPos}** role at **${repComp}**.`
      : `${headerBlock}\n\nDengan hormat,\n\nSehubungan dengan informasi lowongan pekerjaan yang saya peroleh mengenai posisi **${repPos}** di **${repComp}**, melalui surat ini saya bermaksud menyampaikan ketertarikan saya untuk bergabung dan berkontribusi bersama tim Bapak/Ibu.`;

    const closing = isEnglish
      ? `I look forward to the possibility of discussing how my qualifications and enthusiasm can benefit your team.\n\nThank you for your time and consideration.\n\nSincerely,\n\n**Alvareza Hilka Pratama**`
      : `Saya sangat berharap dapat mendiskusikan lebih lanjut kualifikasi saya melalui tahapan wawancara.\n\nTerima kasih atas waktu dan perhatian Bapak/Ibu.\n\nHormat saya,\n\n**Alvareza Hilka Pratama**`;

    bdy = `${opening}\n\n${bdy}\n\n${closing}`;
  }

  // Do remaining replacements
  bdy = bdy.replaceAll('[Posisi]', repPos).replaceAll('[Perusahaan]', repComp);

  // For English templates, if role is customized, replace "Hiring Manager"
  if (role !== 'HRD' && role !== 'Hiring Manager') {
    bdy = bdy.replace(/Hiring\s+Manager/gi, role);
  }

  // Insert Bio Singkat if enabled
  if (includeBio) {
    let tempatLahir = '-';
    let tanggalLahir = '-';
    if (bioTtl && bioTtl.includes(',')) {
      const parts = bioTtl.split(',');
      tempatLahir = parts[0].trim();
      tanggalLahir = parts.slice(1).join(',').trim();
    } else {
      tempatLahir = bioTtl || '-';
    }

    let alamatLine = '';
    if (bioAlamat !== 'none') {
      let label = '';
      const alamatList = (profileData as any)?.alamatTempatTinggal || profileData?.alamat_tempat_tinggal;
      if (alamatList) {
        const found = alamatList.find((a: any) => a.alamat === bioAlamat);
        if (found) label = found.label;
      }
      
      if (label.toLowerCase() === 'rumah') {
        alamatLine = isEnglish ? `\nHome Address : ${bioAlamat}` : `\nAlamat Rumah : ${bioAlamat}`;
      } else if (label) {
        const labelEn = label.toLowerCase() === 'kos' ? 'Boarding House' : label;
        alamatLine = isEnglish ? `\nDomicile Address : ${bioAlamat} (${labelEn})` : `\nAlamat Domisili : ${bioAlamat} (${label})`;
      } else {
        alamatLine = isEnglish ? `\nDomicile Address : ${bioAlamat || '-'}` : `\nAlamat Domisili : ${bioAlamat || '-'}`;
      }
    }

    const bioBlock = isEnglish 
      ? `The undersigned below:
Full Name : ${bioNama || '-'}
Place of Birth : ${tempatLahir}
Date of Birth : ${tanggalLahir}${alamatLine}
Phone Number : ${bioTelp || '-'}
Education : ${bioPendidikan || '-'}
Major : ${bioJurusan || '-'}`
      : `Saya yang bertanda tangan di bawah ini :
Nama Lengkap : ${bioNama || '-'}
Tempat Lahir : ${tempatLahir}
Tanggal Lahir : ${tanggalLahir}${alamatLine}
Nomor Telepon : ${bioTelp || '-'}
Pendidikan : ${bioPendidikan || '-'}
Jurusan : ${bioJurusan || '-'}`;

    // Match "Dengan hormat," with case-insensitivity
    const denganHormatRegex = /(Dengan\s+hormat\s*,)/i;
    if (denganHormatRegex.test(bdy)) {
      bdy = bdy.replace(denganHormatRegex, `$1\n\n${bioBlock}`);
    } else {
      // Fallback for English templates (Dear Hiring Manager, etc.)
      const dearRegex = /(Dear\s+[^,\n]+,)/i;
      if (dearRegex.test(bdy)) {
        bdy = bdy.replace(dearRegex, `$1\n\n${bioBlock}`);
      } else {
        // General fallback: prepend to the body
        bdy = `${bioBlock}\n\n${bdy}`;
      }
    }
  }

  // Insert daftar berkas terlampir if enabled
  if (includeDaftarLampiran && attachedFilesList.length > 0) {
    const listItems = attachedFilesList.map((file, idx) => {
      let labelIndo = '';
      if (file.label === 'CV') labelIndo = 'Curriculum Vitae (CV) - Kreatif';
      else if (file.label === 'CV ATS') labelIndo = 'Curriculum Vitae (CV) - ATS';
      else if (file.label === 'Portofolio') labelIndo = 'Portofolio';
      else if (file.label === 'Paklaring') labelIndo = 'Surat Pengalaman Kerja (Paklaring)';
      else if (file.label === 'Sertifikat Kompetensi Akademik') labelIndo = 'Sertifikat Kompetensi Akademik';
      else if (file.label === 'Sertifikat Kompetensi Bisnis dan Digital') labelIndo = 'Sertifikat Kompetensi Bisnis dan Digital';
      else if (file.label === 'Sertifikat Kompetensi Kepemimpinan') labelIndo = 'Sertifikat Kompetensi Kepemimpinan';
      else if (file.label === 'Sertifikat Kompetensi Public Speaking') labelIndo = 'Sertifikat Kompetensi Public Speaking';
      else if (file.label === 'Sertifikat Prestasi') labelIndo = 'Sertifikat Prestasi';
      else if (file.label === 'Ijazah') labelIndo = 'Ijazah & Transkrip Nilai';
      else labelIndo = file.label;
      return `${idx + 1}. ${labelIndo}`;
    }).join('\n');

    const listItemsEn = attachedFilesList.map((file, idx) => {
      let labelEn = '';
      if (file.label === 'CV') labelEn = 'Curriculum Vitae (CV) - Creative';
      else if (file.label === 'CV ATS') labelEn = 'Curriculum Vitae (CV) - ATS';
      else if (file.label === 'Portofolio') labelEn = 'Portfolio';
      else if (file.label === 'Paklaring') labelEn = 'Work Experience Letter (Paklaring)';
      else if (file.label === 'Sertifikat Kompetensi Akademik') labelEn = 'Academic Competency Certificate';
      else if (file.label === 'Sertifikat Kompetensi Bisnis dan Digital') labelEn = 'Business & Digital Competency Certificate';
      else if (file.label === 'Sertifikat Kompetensi Kepemimpinan') labelEn = 'Leadership Competency Certificate';
      else if (file.label === 'Sertifikat Kompetensi Public Speaking') labelEn = 'Public Speaking Competency Certificate';
      else if (file.label === 'Sertifikat Prestasi') labelEn = 'Achievement Certificate';
      else if (file.label === 'Ijazah') labelEn = 'Degree Certificate & Academic Transcript';
      else labelEn = file.label;
      return `${idx + 1}. ${labelEn}`;
    }).join('\n');

    const targetIndoNew = 'Saya sangat berharap dapat mendiskusikan lebih lanjut kualifikasi saya melalui tahapan wawancara.';
    const targetIndo1 = 'Bersama surat pengantar ini, saya lampirkan dokumen Curriculum Vitae (CV) sebagai bahan pertimbangan Bapak/Ibu. Saya sangat berharap dapat mendiskusikan lebih lanjut kualifikasi saya melalui tahapan wawancara.';
    const targetIndo2 = 'Sebagai bahan pertimbangan, saya lampirkan dokumen CV serta portofolio pencapaian saya. Saya sangat menantikan kesempatan untuk berdiskusi secara langsung melalui tahap wawancara.';
    const targetIndo3 = 'Bersama ini saya lampirkan CV terlampir yang merangkum riwayat pekerjaan saya secara detail. Saya sangat terbuka untuk mendiskusikan peluang kolaborasi ini dalam sesi wawancara.';

    const targetEnNew = 'I look forward to the possibility of discussing how my qualifications and enthusiasm can benefit your team.';
    const targetEn1 = 'Please find my enclosed resume for a more detailed overview of my qualifications. I would welcome the opportunity to further discuss how my background, skills, and enthusiasm align with the needs of your team.';
    const targetEn2 = 'Attached is my resume for your review. I look forward to the possibility of discussing how my qualifications and enthusiasm can benefit your team.';
    const targetEn3 = 'Please find my attached resume for a comprehensive review of my career history. I welcome the opportunity to further discuss how my professional experience aligns with your current needs during an interview.';

    if (bdy.includes(targetIndoNew)) {
      bdy = bdy.replace(targetIndoNew, `Sebagai bahan pertimbangan Bapak/Ibu, bersama surat pengantar ini saya lampirkan:\n${listItems}\n\nSaya sangat berharap dapat mendiskusikan lebih lanjut kualifikasi saya melalui tahapan wawancara.`);
    } else if (bdy.includes(targetIndo1)) {
      bdy = bdy.replace(targetIndo1, `Sebagai bahan pertimbangan Bapak/Ibu, bersama surat pengantar ini saya lampirkan:\n${listItems}\n\nSaya sangat berharap dapat mendiskusikan lebih lanjut kualifikasi saya melalui tahapan wawancara.`);
    } else if (bdy.includes(targetIndo2)) {
      bdy = bdy.replace(targetIndo2, `Sebagai bahan pertimbangan Bapak/Ibu, bersama surat pengantar ini saya lampirkan:\n${listItems}\n\nSaya sangat menantikan kesempatan untuk berdiskusi secara langsung melalui tahap wawancara.`);
    } else if (bdy.includes(targetIndo3)) {
      bdy = bdy.replace(targetIndo3, `Sebagai bahan pertimbangan Bapak/Ibu, bersama surat pengantar ini saya lampirkan:\n${listItems}\n\nSaya sangat terbuka untuk mendiskusikan peluang kolaborasi ini dalam sesi wawancara.`);
    } else if (bdy.includes(targetEnNew)) {
      bdy = bdy.replace(targetEnNew, `For your consideration, I have enclosed the following documents:\n${listItemsEn}\n\nI look forward to the possibility of discussing how my qualifications and enthusiasm can benefit your team.`);
    } else if (bdy.includes(targetEn1)) {
      bdy = bdy.replace(targetEn1, `For your consideration, I have enclosed the following documents:\n${listItemsEn}\n\nI would welcome the opportunity to further discuss how my background, skills, and enthusiasm align with the needs of your team.`);
    } else if (bdy.includes(targetEn2)) {
      bdy = bdy.replace(targetEn2, `For your consideration, I have enclosed the following documents:\n${listItemsEn}\n\nI look forward to the possibility of discussing how my qualifications and enthusiasm can benefit your team.`);
    } else if (bdy.includes(targetEn3)) {
      bdy = bdy.replace(targetEn3, `For your consideration, I have enclosed the following documents:\n${listItemsEn}\n\nI welcome the opportunity to further discuss how my professional experience aligns with your current needs during an interview.`);
    } else {
      // Fallback for custom templates
      const indoRegex = /([^.!?]*lampirkan[^.!?]*[.!?])/i;
      const engRegex = /([^.!?]*(?:enclose|attached|resume)[^.!?]*[.!?])/i;
      
      if (!isEnglish && indoRegex.test(bdy)) {
        bdy = bdy.replace(indoRegex, `Sebagai bahan pertimbangan Bapak/Ibu, bersama surat pengantar ini saya lampirkan:\n${listItems}\n`);
      } else if (isEnglish && engRegex.test(bdy)) {
        bdy = bdy.replace(engRegex, `For your consideration, I have enclosed the following documents:\n${listItemsEn}\n`);
      } else {
        // Absolute fallback
        const closingRegex = /(Hormat saya|Sincerely|Terima kasih|Thank you)/i;
        if (closingRegex.test(bdy)) {
          const listToInsert = isEnglish 
            ? `For your consideration, I have enclosed the following documents:\n${listItemsEn}\n\n`
            : `Sebagai bahan pertimbangan Bapak/Ibu, bersama surat pengantar ini saya lampirkan:\n${listItems}\n\n`;
          bdy = bdy.replace(closingRegex, `${listToInsert}$1`);
        }
      }
    }
  }

  return {
    subject: sub,
    body: bdy
  };
}
