import { jsPDF } from 'jspdf';

function loadImageAsDataURL(src: string): Promise<{ dataUrl: string, width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      // Resize and compress
      const maxDim = 1600;
      let targetW = img.naturalWidth;
      let targetH = img.naturalHeight;
      if (targetW > maxDim || targetH > maxDim) {
        if (targetW > targetH) {
          targetH = (targetH * maxDim) / targetW;
          targetW = maxDim;
        } else {
          targetW = (targetW * maxDim) / targetH;
          targetH = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Failed to get canvas context'));
      // Fill background in case of transparent webp
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, targetW, targetH);
      resolve({
        dataUrl: canvas.toDataURL('image/jpeg', 0.7),
        width: targetW,
        height: targetH
      });
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export async function generatePdfFromImages(imagePaths: string[], signal?: AbortSignal): Promise<Blob> {
  if (imagePaths.length === 0) {
    throw new Error('No images provided for PDF generation');
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  pdf.deletePage(1); // Remove default page

  for (let i = 0; i < imagePaths.length; i++) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    
    const imgUrl = imagePaths[i];
    const { dataUrl, width: imgWidth, height: imgHeight } = await loadImageAsDataURL(imgUrl);
    
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    const orientation = imgWidth > imgHeight ? 'l' : 'p';
    const pdfPageWidth = 210;
    const pdfPageHeight = 297;
    
    pdf.addPage('a4', orientation);

    let renderWidth = pdfPageWidth;
    let renderHeight = (imgHeight * renderWidth) / imgWidth;
    let renderX = 0;
    let renderY = 0;
    
    if (orientation === 'l') {
        renderWidth = pdfPageHeight; // 297
        renderHeight = (imgHeight * renderWidth) / imgWidth;
        if (renderHeight > pdfPageWidth) { // 210
            renderHeight = pdfPageWidth;
            renderWidth = (imgWidth * renderHeight) / imgHeight;
            renderX = (pdfPageHeight - renderWidth) / 2;
        } else {
            renderY = (pdfPageWidth - renderHeight) / 2;
        }
    } else {
        if (renderHeight > pdfPageHeight) { // 297
            renderHeight = pdfPageHeight;
            renderWidth = (imgWidth * renderHeight) / imgHeight;
            renderX = (pdfPageWidth - renderWidth) / 2;
        } else {
            renderY = (pdfPageHeight - renderHeight) / 2;
        }
    }

    pdf.addImage(dataUrl, 'JPEG', renderX, renderY, renderWidth, renderHeight);
  }

  return pdf.output('blob');
}
