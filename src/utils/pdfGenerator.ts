import { jsPDF } from 'jspdf';

interface PDFGeneratorOptions {
  bodyPreview: string;
  positionName: string;
  companyName: string;
}

export const generateAndDownloadPDF = async ({
  bodyPreview,
  positionName,
  companyName,
}: PDFGeneratorOptions) => {
  if (!bodyPreview) return;

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    
    // Split text by newlines and handle wrapping
    const rawLines = bodyPreview.split('\n');
    let textLines: string[] = [];
    
    rawLines.forEach(line => {
      if (line.trim() === '') {
        textLines.push('');
      } else {
        const wrapped = pdf.splitTextToSize(line, 170);
        textLines.push(...wrapped);
      }
    });
    
    let y = 20;
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    for (let i = 0; i < textLines.length; i++) {
      if (y > pageHeight - 20) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(textLines[i], 20, y);
      y += 6;
    }

    const fileName = `Surat_Lamaran_${(positionName || 'Lamaran').replace(/\s+/g, '_')}_${(companyName || 'Perusahaan').replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
};
