import { pdfjs } from 'react-pdf';
import { jsPDF } from 'jspdf';

export async function compressPdf(pdfBytes: ArrayBuffer, onProgress: (progress: string) => void): Promise<ArrayBuffer> {
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

  for (let i = 1; i <= numPages; i++) {
    onProgress(`Mengompresi halaman ${i}/${numPages}...`);
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 }); // Lower scale for compression

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (ctx) {
      await page.render({ canvasContext: ctx, canvas: ctx.canvas as any, viewport }).promise;
      const imgData = canvas.toDataURL('image/jpeg', 0.6); // 60% quality JPEG

      const pWidth = viewport.width * 0.264583;
      const pHeight = viewport.height * 0.264583;
      const orientation = pWidth > pHeight ? 'l' : 'p';
      
      outPdf.addPage([pWidth, pHeight], orientation);
      outPdf.addImage(imgData, 'JPEG', 0, 0, pWidth, pHeight, undefined, 'FAST');
    }
  }

  return outPdf.output('arraybuffer');
}
