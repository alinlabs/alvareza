import { pdfjs } from 'react-pdf';
import { jsPDF } from 'jspdf';

export async function compressPdf(
  pdfBytes: ArrayBuffer, 
  onProgress: (progress: string) => void,
  qualityPercent: number = 85
): Promise<ArrayBuffer> {
  const loadingTask = pdfjs.getDocument({ data: pdfBytes });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const outPdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    compress: true
  });
  
  outPdf.deletePage(1);

  // Calculate quality ratio and viewport scale based on percentage
  const quality = Math.max(0.3, Math.min(1.0, qualityPercent / 100));
  const scale = qualityPercent >= 85 ? 2.2 : qualityPercent >= 70 ? 1.8 : 1.5;

  for (let i = 1; i <= numPages; i++) {
    onProgress(`Mengompresi halaman ${i}/${numPages} (${qualityPercent}% kualitas)...`);
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      await page.render({ canvasContext: ctx, canvas: ctx.canvas as any, viewport }).promise;
      const imgData = canvas.toDataURL('image/jpeg', quality);

      const pWidth = viewport.width * 0.264583;
      const pHeight = viewport.height * 0.264583;
      const orientation = pWidth > pHeight ? 'l' : 'p';
      
      outPdf.addPage([pWidth, pHeight], orientation);
      outPdf.addImage(imgData, 'JPEG', 0, 0, pWidth, pHeight, undefined, 'FAST');
    }
  }

  return outPdf.output('arraybuffer');
}
