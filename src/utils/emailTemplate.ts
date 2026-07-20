import fs from "fs";
import path from "path";

export const fetchTemplateFromWorker = async (id: string): Promise<string | null> => {
  try {
    const response = await fetch('https://portofolio.alvareza-work.workers.dev/email-template');
    if (response.ok) {
      const json: any = await response.json();
      if (json.success && Array.isArray(json.data)) {
        const item = json.data.find((t: any) => t.id === id);
        if (item && item.html) {
          console.log(`[D1 API] Berhasil memuat template "${id}" dari Cloudflare D1`);
          return item.html;
        }
      }
    }
  } catch (error) {
    console.error(`[D1 API] Gagal mengambil template "${id}" dari Cloudflare D1:`, error);
  }
  return null;
};

export const getOtpEmailHTML = async (bodyText: string, otpCode: string): Promise<string> => {
  const d1Template = await fetchTemplateFromWorker('otp');
  if (d1Template) {
    return d1Template.replace('{{OTP_CODE}}', otpCode);
  }
  throw new Error("Template OTP tidak ditemukan di Cloudflare D1.");
};

const renderTable = (fields: Array<{ label: string; value: string; isBold: boolean }>, bodyFontFamily: string): string => {
  const isBioTable = fields.some(f => {
    const l = f.label.toLowerCase();
    return l.includes('nama lengkap') || l.includes('tempat lahir') || l.includes('tanggal lahir') || l.includes('alamat domisili') || l.includes('nomor telepon') || l.includes('pendidikan') || l.includes('jurusan');
  });

  const labelWidth = "130";
  const colonWidth = "15";

  if (isBioTable) {
    const rows = fields.map(f => {
      const isPhone = f.label.toLowerCase().includes('nomor telepon');
      const isAddress = f.label.toLowerCase().includes('alamat');
      let displayValue = f.value;
      if (isPhone) {
        let cleanPhone = f.value.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
          cleanPhone = '62' + cleanPhone.slice(1);
        } else if (cleanPhone.startsWith('8')) {
          cleanPhone = '62' + cleanPhone;
        }
        displayValue = `<a href="https://wa.me/+${cleanPhone}" target="_blank" rel="noopener noreferrer" style="color: #02227E; text-decoration: underline; font-weight: bold;">${f.value}</a>`;
      } else if (isAddress) {
        displayValue = `<span style="color: #1f2937; text-decoration: none !important; border-bottom: none !important; pointer-events: none;">${f.value}</span>`;
      }

      return `
        <tr>
          <td width="${labelWidth}" style="width: ${labelWidth}px; min-width: ${labelWidth}px; padding: 5px 0; font-weight: normal; color: #4b5563; vertical-align: top; font-family: ${bodyFontFamily}; font-size: 14px; line-height: 1.5; text-align: left; white-space: nowrap;">${f.label}</td>
          <td width="${colonWidth}" style="width: ${colonWidth}px; min-width: ${colonWidth}px; padding: 5px 0; text-align: center; color: #4b5563; vertical-align: top; font-family: ${bodyFontFamily}; font-size: 14px; line-height: 1.5;">:</td>
          <td style="padding: 5px 0; color: #1f2937; font-weight: bold; vertical-align: top; font-family: ${bodyFontFamily}; font-size: 14px; text-align: left; line-height: 1.5; word-break: break-word;">${displayValue}</td>
        </tr>
      `;
    }).join('');

    return `
      <div style="margin: 16px 0; font-family: ${bodyFontFamily};">
        <div style="font-size: 12px; font-weight: bold; letter-spacing: 1px; color: #4b5563; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
          BIODATA DIRI
        </div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; border-collapse: collapse; text-align: left; table-layout: fixed; font-family: ${bodyFontFamily};">
          ${rows}
        </table>
      </div>
    `;
  }

  const rows = fields.map(f => {
    return `
      <tr>
        <td width="${labelWidth}" style="width: ${labelWidth}px; min-width: ${labelWidth}px; padding: 4px 0; font-weight: ${f.isBold ? 'bold' : 'normal'}; color: ${f.isBold ? '#1f2937' : '#4b5563'}; vertical-align: top; font-family: ${bodyFontFamily}; font-size: 15px; text-align: left; white-space: nowrap;">${f.label}</td>
        <td width="${colonWidth}" style="width: ${colonWidth}px; min-width: ${colonWidth}px; padding: 4px 0; text-align: center; color: #4b5563; vertical-align: top; font-family: ${bodyFontFamily}; font-size: 15px;">:</td>
        <td style="padding: 4px 0; color: #1f2937; font-weight: bold; vertical-align: top; font-family: ${bodyFontFamily}; font-size: 15px; text-align: left; word-break: break-word;">${f.value}</td>
      </tr>
    `;
  }).join('');

  return `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 12px 0; font-size: 15px; border-collapse: collapse; text-align: left; font-family: ${bodyFontFamily}; table-layout: fixed;">
      ${rows}
    </table>
  `;
};

export const getEmailHTML = async (bodyText: string, options: { bodyFontFamily?: string, emailFormat?: string, paragraphAlign?: string, location?: string } = {}): Promise<string> => {
  const {
    bodyFontFamily = "'Arial', sans-serif",
    emailFormat = "modern",
    paragraphAlign = "justify",
    location = "Purwakarta"
  } = options;
  
  const lines = bodyText.replace(/\r/g, '').split('\n');
  const formattedLines: string[] = [];
  let inTable = false;
  let currentTableFields: Array<{ label: string; value: string; isBold: boolean }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match a label (2 to 40 characters) and a non-empty value separated by a colon
    const match = line.match(/^([^:]{2,40})\s*:\s*(\S.*)$/);
    
    if (match && !match[1].includes('http') && !match[1].includes('https') && !match[1].includes('www.')) {
      const rawLabel = match[1].trim();
      const rawValue = match[2].trim();
      
      const isBold = (rawLabel.startsWith('**') && rawLabel.endsWith('**')) || 
                     rawLabel.toLowerCase().includes('perihal') || 
                     rawLabel.toLowerCase().includes('lampiran');
      
      // Strip asterisks and quotes from label and value
      const cleanLabel = rawLabel.replace(/\*\*/g, '').replace(/['"]/g, '').trim();
      const cleanValue = rawValue.replace(/\*\*/g, '').replace(/['"]/g, '').trim();
      
      if (!inTable) {
        inTable = true;
        currentTableFields = [];
      }
      currentTableFields.push({ label: cleanLabel, value: cleanValue, isBold });
    } else {
      if (inTable) {
        inTable = false;
        formattedLines.push(renderTable(currentTableFields, bodyFontFamily));
        currentTableFields = [];
      }
      formattedLines.push(line);
    }
  }

  if (inTable) {
    formattedLines.push(renderTable(currentTableFields, bodyFontFamily));
  }

  let formattedText = '';
  for (let i = 0; i < formattedLines.length; i++) {
    const fLine = formattedLines[i];
    const trimmed = fLine.trim();
    if (trimmed.startsWith('<table') || trimmed.endsWith('</table>') || trimmed.startsWith('<tr') || trimmed.startsWith('<td') || trimmed.startsWith('</tr') || trimmed.startsWith('</td')) {
      formattedText += fLine + '\n';
    } else {
      let processedLine = fLine.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      formattedText += processedLine + '<br/>';
    }
  }

  const formatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const dateString = `${location}, ${formatter.format(new Date())}`;

  if (emailFormat === 'plain') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: ${bodyFontFamily} !important; 
          background: #ffffff; 
          color: #000000; 
          font-size: 14px; 
          line-height: 1.5; 
          text-align: ${paragraphAlign};
          padding: 10px;
        }
        @media only screen and (max-width: 600px) {
          body {
            font-size: 12px !important;
            line-height: 1.4 !important;
            padding: 5px !important;
          }
        }
      </style>
      </head>
      <body>
      ${formattedText}
      </body>
      </html>
    `;
  }

  if (emailFormat === 'formal') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: ${bodyFontFamily} !important; background: #ffffff; color: #000000; margin: 0; padding: 30px; }
        .container { max-width: 800px; margin: 0 auto; line-height: 1.5; font-size: 14px; text-align: ${paragraphAlign}; }
        table { font-family: ${bodyFontFamily} !important; }
        .kop-surat { text-align: center; margin-bottom: 25px; }
        .kop-surat h1 { margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .kop-garis-tebal { margin-top: 10px; margin-bottom: 2px; border: 0; border-top: 3px solid #000; }
        .kop-garis-tipis { margin-top: 0; margin-bottom: 20px; border: 0; border-top: 1px solid #000; }
        
        /* Mobile adjustment for fast HRD review */
        @media only screen and (max-width: 600px) {
          body {
            padding: 15px !important;
          }
          .container {
            font-size: 12px !important;
            line-height: 1.4 !important;
          }
          .kop-surat {
            margin-bottom: 15px !important;
          }
          .kop-surat h1 {
            font-size: 15px !important;
          }
          .kop-garis-tipis {
            margin-bottom: 12px !important;
          }
          table td {
            font-size: 12px !important;
          }
        }
      </style>
      </head>
      <body>
      <div class="container">
      <div class="kop-surat">
        <h1>SURAT LAMARAN KERJA</h1>
        <hr class="kop-garis-tebal" />
        <hr class="kop-garis-tipis" />
      </div>
      ${formattedText}
      </div>
      </body>
      </html>
    `;
  }
  
  let template = '';
  const localTemplatePath = path.join(process.cwd(), 'public', 'email', 'surat-lamaran.html');
  if (fs.existsSync(localTemplatePath)) {
    console.log(`[Local Disk] Berhasil memuat template surat-lamaran dari berkas lokal`);
    template = fs.readFileSync(localTemplatePath, 'utf8');
  } else {
    const d1Template = await fetchTemplateFromWorker('surat-lamaran');
    if (d1Template) {
      template = d1Template;
    } else {
      throw new Error("Template surat lamaran tidak ditemukan di Cloudflare D1.");
    }
  }
  
  // Bersihkan sisa icon atau teks "APLIKASI PROFESIONAL" jika template diambil dari remote database D1
  template = template.replace(/<div style="background:\s*rgba\(255,\s*255,\s*255,\s*0\.1\);[\s\S]*?<\/div>\s*/gi, '');
  template = template.replace(/<p style="margin:\s*10px\s*0\s*0\s*0;\s*font-size:\s*14px;\s*color:\s*#e2e8f0;[\s\S]*?">APLIKASI PROFESIONAL<\/p>\s*/gi, '');
  
  // Replace styles
  template = template.replace(
    /body\s*\{\s*font-family:\s*['"]?Arial['"]?,\s*sans-serif;?/gi,
    `body { font-family: ${bodyFontFamily};`
  );
  
  // Also globally replace any other Arial font-family declarations so the rest of the template elements (like profile link) match too!
  template = template.replace(/font-family:\s*['"]?Arial['"]?,\s*sans-serif/gi, `font-family: ${bodyFontFamily}`);
  
  // Inject global style rule to force selected font-family, alignment, and modern spacing/font adjustments
  const globalFontStyle = `
  <style>
    *, body, table, td, tr, p, div, span, a, b, strong, h1, h2, h3, h4, h5, h6 {
      font-family: ${bodyFontFamily} !important;
    }
    
    /* Desktop optimization */
    .content {
      font-size: 13.5px !important;
      line-height: 1.5 !important;
      padding: 24px 32px !important; /* more compact padding */
      text-align: ${paragraphAlign} !important;
    }
    .header h1 {
      font-size: 24px !important;
    }
    .header {
      padding: 24px 20px !important;
    }
    .footer {
      padding: 20px 32px !important;
      font-size: 12.5px !important;
    }
    .date-text {
      margin-bottom: 18px !important;
      font-size: 13px !important;
    }

    /* Mobile optimization for fast HRD review */
    @media only screen and (max-width: 600px) {
      .container {
        margin: 5px auto !important;
        border-radius: 8px !important;
      }
      .header {
        padding: 16px 12px !important;
      }
      .header h1 {
        font-size: 17px !important;
      }
      .content {
        padding: 16px 16px !important; /* compact padding to save screen real estate */
        font-size: 12px !important;
        line-height: 1.45 !important;
        text-align: ${paragraphAlign} !important;
      }
      .footer {
        padding: 14px 16px !important;
        font-size: 11px !important;
      }
      .date-text {
        margin-bottom: 12px !important;
        font-size: 11.5px !important;
      }
      table td {
        font-size: 11.5px !important;
      }
      /* Profile badge scaling down on mobile */
      .content table {
        transform: scale(0.95);
        transform-origin: center;
      }
    }
  </style>`;
  template = template.replace('</head>', `${globalFontStyle}\n</head>`);
  
  return template.replace('{{BODY_CONTENT}}', formattedText).replace('{{DATE_NOW}}', dateString);
};
