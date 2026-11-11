import { jsPDF } from 'jspdf';
import { GasAttachment } from '../../../types/gasSender';
import { ALL_IDENTITY_DOCS, IdentityDocItem } from '../../../data/identitas';

export interface ProcessedIdentityImage {
  id: string;
  title: string;
  dataUrl: string;
  width: number;
  height: number;
  aspect: number;
}

export interface RenderedIdentityPagePreview {
  id: string;
  title: string;
  pageNum: number;
  totalDocPages: number;
  imageUrl: string;
  isLandscape: boolean;
}

// In-memory cache for processed identity images to prevent redundant canvas decoding & processing
const identityImageCache = new Map<string, ProcessedIdentityImage>();

/**
 * Loads an image from a URL, converts it to grayscale if isColorPrint is false,
 * and returns the processed image dataUrl and dimensions.
 * Optimized with GPU hardware-accelerated canvas filters, smart resolution capping, and in-memory caching.
 */
export async function loadIdentityImage(
  url: string,
  id: string,
  title: string,
  isColorPrint: boolean = false,
  isCompressed: boolean = true
): Promise<ProcessedIdentityImage> {
  const cacheKey = `${id}_${url}_${isColorPrint ? 'color' : 'bw'}_${isCompressed ? 'comp' : 'raw'}`;
  if (identityImageCache.has(cacheKey)) {
    return identityImageCache.get(cacheKey)!;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const naturalWidth = img.naturalWidth || img.width;
        const naturalHeight = img.naturalHeight || img.height;

        // Optimized DPI target:
        // Saat dikompresi: KTP/NPWP printed at ~95mm width -> maxDim 1200px, KK -> maxDim 1800px (~DPI seimbang dan ringan)
        // Saat tidak dikompresi: KTP/NPWP -> maxDim 2400px, KK -> maxDim 3200px (kualitas maksimal ultra-high res)
        const maxDim = isCompressed
          ? (id === 'kk' ? 1800 : 1200)
          : (id === 'kk' ? 3200 : 2400);

        let targetWidth = naturalWidth;
        let targetHeight = naturalHeight;

        if (targetWidth > maxDim || targetHeight > maxDim) {
          if (targetWidth >= targetHeight) {
            targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
            targetWidth = maxDim;
          } else {
            targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
            targetHeight = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context not available');
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Set white background for translucent webp/png assets
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Native GPU hardware-accelerated grayscale filter (0ms overhead, no raw pixel loop)
        if (!isColorPrint) {
          ctx.filter = 'grayscale(100%)';
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Reset filter
        ctx.filter = 'none';

        // Kualitas JPEG kompresi vs non-kompresi:
        // isCompressed=true: 0.85 (padat, ukuran ringan < 300KB)
        // isCompressed=false: 0.98 (kualitas gambar maksimal tanpa kompresi)
        const quality = isCompressed ? 0.85 : 0.98;
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        const result: ProcessedIdentityImage = {
          id,
          title,
          dataUrl,
          width: targetWidth,
          height: targetHeight,
          aspect: targetWidth / targetHeight,
        };

        identityImageCache.set(cacheKey, result);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error(`Gagal memuat gambar identitas: ${url}`));
    };

    img.src = url;
  });
}

const PAS_FOTO_IDS = ['pas-foto-setengah-badan', 'pas-foto-4x6', 'pas-foto-3x4'];

interface PasFotoItemDim {
  item: IdentityDocItem;
  img: ProcessedIdentityImage;
  w: number;
  h: number;
}

type PortraitBlock =
  | {
      type: 'pas-foto-row';
      items: PasFotoItemDim[];
      totalWidth: number;
      maxRowHeight: number;
      totalBlockHeight: number;
    }
  | {
      type: 'single-doc';
      item: IdentityDocItem;
      img: ProcessedIdentityImage;
      w: number;
      h: number;
      totalBlockHeight: number;
    };

function createPortraitBlocks(
  portraitDocs: IdentityDocItem[],
  imageMap: Map<string, ProcessedIdentityImage>
): PortraitBlock[] {
  const blocks: PortraitBlock[] = [];

  // Separate pas foto items and sort from largest (left: setengah badan) to smallest (right: 3x4)
  const pasFotoDocs = portraitDocs
    .filter((d) => PAS_FOTO_IDS.includes(d.id))
    .sort((a, b) => PAS_FOTO_IDS.indexOf(a.id) - PAS_FOTO_IDS.indexOf(b.id));

  const nonPasFotoDocs = portraitDocs.filter((d) => !PAS_FOTO_IDS.includes(d.id));

  // Build Pas Foto Row block if any pas foto items selected
  if (pasFotoDocs.length > 0) {
    const gap = 12; // gap in mm between photos in the horizontal row
    let totalWidth = 0;
    let maxRowHeight = 0;

    const items: PasFotoItemDim[] = [];
    for (const item of pasFotoDocs) {
      const img = imageMap.get(item.id);
      if (!img) continue;

      let h = item.printHeightMm || (item.printWidthMm ? item.printWidthMm / img.aspect : 60);
      let w = item.printWidthMm || h * img.aspect;

      // Ensure Pas Foto Setengah Badan height matches 4x6 height (60mm max)
      if (item.id === 'pas-foto-setengah-badan') {
        h = 60;
        w = h * img.aspect;
      }

      if (h > maxRowHeight) maxRowHeight = h;
      totalWidth += w;
      items.push({ item, img, w, h });
    }

    if (items.length > 0) {
      totalWidth += gap * (items.length - 1);
      blocks.push({
        type: 'pas-foto-row',
        items,
        totalWidth,
        maxRowHeight,
        totalBlockHeight: 6 + maxRowHeight,
      });
    }
  }

  // Build single doc blocks for KTP, NPWP, etc.
  for (const item of nonPasFotoDocs) {
    const img = imageMap.get(item.id);
    if (!img) continue;

    const w = item.printWidthMm || 95;
    const h = item.printHeightMm || w / img.aspect;

    blocks.push({
      type: 'single-doc',
      item,
      img,
      w,
      h,
      totalBlockHeight: 6 + h,
    });
  }

  return blocks;
}

/**
 * Builds the PDF for the selected identity documents with specific layout:
 * - Pas Foto (Setengah Badan, 4x6, 3x4): Arranged in 1 horizontal row from largest (left) to smallest (right).
 * - KTP, NPWP: Portrait A4 page(s), stacked vertically below the photo row.
 * - Kartu Keluarga (KK): Landscape A4 sheet.
 * When isSeparatePhotoPrint is true, photos are printed in a separate PDF file without header labels ("Lampiran : ...").
 * Respects isColorPrint (grayscale if false).
 */
export async function buildIdentityDocsPdf(options: {
  selectedIds: string[];
  isColorPrint?: boolean;
  isSeparatePhotoPrint?: boolean;
  isSingleCardDirectFit?: boolean;
  isPhotoAsJpg?: boolean;
  isCompressed?: boolean;
}): Promise<GasAttachment[]> {
  const {
    selectedIds,
    isColorPrint = false,
    isSeparatePhotoPrint = false,
    isSingleCardDirectFit = false,
    isPhotoAsJpg = true,
    isCompressed = true,
  } = options;

  if (!selectedIds || selectedIds.length === 0) {
    throw new Error('Tidak ada dokumen identitas yang dipilih.');
  }

  const selectedDocs = ALL_IDENTITY_DOCS.filter((d) => selectedIds.includes(d.id));
  if (selectedDocs.length === 0) {
    throw new Error('Pilihan dokumen identitas tidak valid.');
  }

  const loadedImagesList = await Promise.all(
    selectedDocs.map((docItem) =>
      loadIdentityImage(docItem.url, docItem.id, docItem.title, isColorPrint, isCompressed)
    )
  );

  const imageMap = new Map<string, ProcessedIdentityImage>();
  loadedImagesList.forEach((img) => imageMap.set(img.id, img));

  const attachments: GasAttachment[] = [];

  // 0. Direct Image-to-PDF Mode for single specific identity card (KTP, NPWP, KK)
  // Renders full-size matching natural card/document aspect ratio without blank A4 margins or Lampiran text
  if (isSingleCardDirectFit || (selectedDocs.length === 1 && !PAS_FOTO_IDS.includes(selectedDocs[0].id))) {
    const singleDoc = selectedDocs[0];
    const img = imageMap.get(singleDoc.id);
    if (img) {
      const isLandscape = img.aspect >= 1;
      const targetW = isLandscape ? 210 : 210 * img.aspect;
      const targetH = isLandscape ? 210 / img.aspect : 210;

      const cardDoc = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [targetW, targetH],
        compress: isCompressed,
      });

      cardDoc.addImage(img.dataUrl, 'JPEG', 0, 0, targetW, targetH, undefined, 'FAST');

      const arrayBuffer = cardDoc.output('arraybuffer');
      const base64 = cardDoc.output('datauristring').split(',')[1];
      const filename = `${singleDoc.id}-alvareza${isColorPrint ? '' : '-bw'}.pdf`;

      attachments.push({
        filename,
        mimeType: 'application/pdf',
        base64,
        sizeBytes: arrayBuffer.byteLength,
      });

      return attachments;
    }
  }

  const photoDocs = selectedDocs
    .filter((d) => PAS_FOTO_IDS.includes(d.id))
    .sort((a, b) => PAS_FOTO_IDS.indexOf(a.id) - PAS_FOTO_IDS.indexOf(b.id));

  const otherDocs = selectedDocs.filter((d) => !PAS_FOTO_IDS.includes(d.id));

  if (isSeparatePhotoPrint && photoDocs.length > 0) {
    // 1. Berkas Dokumen Identitas Utama (KTP, NPWP, KK) di lembar kertas A4 standar dengan teks lampiran
    if (otherDocs.length > 0) {
      const portraitOtherDocs = otherDocs.filter((d) => d.id !== 'kk');
      const kkDoc = otherDocs.find((d) => d.id === 'kk');

      let mainDoc: jsPDF | null = null;
      if (portraitOtherDocs.length > 0) {
        const otherBlocks = createPortraitBlocks(portraitOtherDocs, imageMap);
        const pageHeightMax = 275;
        const startY = 30;
        const itemGap = 16;

        const pageBuckets: PortraitBlock[][] = [];
        let currentBucket: PortraitBlock[] = [];
        let currentY = startY;

        for (const block of otherBlocks) {
          if (currentY + block.totalBlockHeight > pageHeightMax && currentBucket.length > 0) {
            pageBuckets.push(currentBucket);
            currentBucket = [block];
            currentY = startY + block.totalBlockHeight + itemGap;
          } else {
            currentBucket.push(block);
            currentY += block.totalBlockHeight + itemGap;
          }
        }
        if (currentBucket.length > 0) {
          pageBuckets.push(currentBucket);
        }

        mainDoc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: isCompressed,
        });

        for (let pIdx = 0; pIdx < pageBuckets.length; pIdx++) {
          if (pIdx > 0) {
            mainDoc.addPage('a4', 'portrait');
          }

          const bucket = pageBuckets[pIdx];
          let yMmMain = startY;

          for (const block of bucket) {
            if (block.type === 'single-doc') {
              const { item, img, w, h } = block;
              const targetX = (210 - w) / 2;

              mainDoc.setFont('helvetica', 'bold');
              mainDoc.setFontSize(10);
              mainDoc.setTextColor(40, 40, 40);
              mainDoc.text(item.headerText, targetX + w / 2, yMmMain - 4, { align: 'center' });

              mainDoc.addImage(img.dataUrl, 'JPEG', targetX, yMmMain, w, h, undefined, 'FAST');
              yMmMain += h + itemGap;
            }
          }
        }
      }

      if (kkDoc) {
        const kkImg = imageMap.get('kk');
        if (kkImg) {
          if (!mainDoc) {
            mainDoc = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'a4',
              compress: isCompressed,
            });
          } else {
            mainDoc.addPage('a4', 'landscape');
          }

          const maxWidth = 277;
          const maxHeight = 190;
          let kkTargetW = maxWidth;
          let kkTargetH = kkTargetW / kkImg.aspect;
          if (kkTargetH > maxHeight) {
            kkTargetH = maxHeight;
            kkTargetW = kkTargetH * kkImg.aspect;
          }

          const kkX = (297 - kkTargetW) / 2;
          const kkY = (210 - kkTargetH) / 2;

          mainDoc.addImage(kkImg.dataUrl, 'JPEG', kkX, kkY, kkTargetW, kkTargetH, undefined, 'FAST');
        }
      }

      if (mainDoc) {
        const arrayBuffer = mainDoc.output('arraybuffer');
        const base64 = mainDoc.output('datauristring').split(',')[1];
        const filename = isColorPrint ? 'identitas-alvareza.pdf' : 'identitas-alvareza-bw.pdf';

        attachments.push({
          filename,
          mimeType: 'application/pdf',
          base64,
          sizeBytes: arrayBuffer.byteLength,
        });
      }
    }

    // 2. Berkas Foto Terpisah:
    // Jika isPhotoAsJpg aktif (default ON saat Full Foto aktif), berkas foto dilampirkan sebagai image/jpeg
    // Jika nonaktif, berkas foto dilampirkan sebagai PDF (foto-alvareza.pdf)
    const photoImages = photoDocs
      .map((doc) => imageMap.get(doc.id))
      .filter(Boolean) as ProcessedIdentityImage[];

    if (photoImages.length > 0) {
      if (isPhotoAsJpg) {
        photoImages.forEach((imgItem) => {
          const rawBase64 = imgItem.dataUrl.includes(',')
            ? imgItem.dataUrl.split(',')[1]
            : imgItem.dataUrl;
          const byteLen = Math.round((rawBase64.length * 3) / 4);
          const cleanDocId = imgItem.id.replace(/_/g, '-');
          const extSuffix = isColorPrint ? '' : '-bw';
          const filename = `${cleanDocId}-alvareza${extSuffix}.jpg`;

          attachments.push({
            filename,
            mimeType: 'image/jpeg',
            base64: rawBase64,
            sizeBytes: byteLen,
          });
        });
      } else {
        const firstImg = photoImages[0];
        const targetW = 210; // mm (A4 width)
        const targetH = 210 / firstImg.aspect; // mm (proportional height)

        const photoDoc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [targetW, targetH],
          compress: isCompressed,
        });

        photoDoc.addImage(
          firstImg.dataUrl,
          'JPEG',
          0,
          0,
          targetW,
          targetH,
          undefined,
          'FAST'
        );

        for (let i = 1; i < photoImages.length; i++) {
          const curImg = photoImages[i];
          const curH = 210 / curImg.aspect;
          photoDoc.addPage([210, curH], 'portrait');
          photoDoc.addImage(
            curImg.dataUrl,
            'JPEG',
            0,
            0,
            210,
            curH,
            undefined,
            'FAST'
          );
        }

        const photoArrayBuffer = photoDoc.output('arraybuffer');
        const photoBase64 = photoDoc.output('datauristring').split(',')[1];
        const photoFilename = isColorPrint ? 'foto-alvareza.pdf' : 'foto-alvareza-bw.pdf';

        attachments.push({
          filename: photoFilename,
          mimeType: 'application/pdf',
          base64: photoBase64,
          sizeBytes: photoArrayBuffer.byteLength,
        });
      }
    }
  } else {
    // Single combined identity PDF (photos with headers + KTP + NPWP + KK)
    const portraitDocs = selectedDocs.filter((d) => d.id !== 'kk');
    const kkDoc = selectedDocs.find((d) => d.id === 'kk');

    let doc: jsPDF | null = null;

    if (portraitDocs.length > 0) {
      const blocks = createPortraitBlocks(portraitDocs, imageMap);
      const pageHeightMax = 275;
      const startY = 30;
      const itemGap = 16;

      const pageBuckets: PortraitBlock[][] = [];
      let currentBucket: PortraitBlock[] = [];
      let currentY = startY;

      for (const block of blocks) {
        if (currentY + block.totalBlockHeight > pageHeightMax && currentBucket.length > 0) {
          pageBuckets.push(currentBucket);
          currentBucket = [block];
          currentY = startY + block.totalBlockHeight + itemGap;
        } else {
          currentBucket.push(block);
          currentY += block.totalBlockHeight + itemGap;
        }
      }
      if (currentBucket.length > 0) {
        pageBuckets.push(currentBucket);
      }

      doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: isCompressed,
      });

      for (let pIdx = 0; pIdx < pageBuckets.length; pIdx++) {
        if (pIdx > 0) {
          doc.addPage('a4', 'portrait');
        }

        const bucket = pageBuckets[pIdx];
        let yMm = startY;

        for (const block of bucket) {
          if (block.type === 'pas-foto-row') {
            const gap = 12;
            const startX = (210 - block.totalWidth) / 2;
            let currentX = startX;

            for (const { item, img, w, h } of block.items) {
              const centerX = currentX + w / 2;

              doc.setFont('helvetica', 'bold');
              doc.setFontSize(9);
              doc.setTextColor(40, 40, 40);
              doc.text(item.headerText, centerX, yMm - 4, { align: 'center' });

              doc.addImage(img.dataUrl, 'JPEG', currentX, yMm, w, h, undefined, 'FAST');
              currentX += w + gap;
            }

            yMm += block.maxRowHeight + itemGap;
          } else {
            const { item, img, w, h } = block;
            const targetX = (210 - w) / 2;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(40, 40, 40);
            doc.text(item.headerText, targetX + w / 2, yMm - 4, { align: 'center' });

            doc.addImage(img.dataUrl, 'JPEG', targetX, yMm, w, h, undefined, 'FAST');

            yMm += h + itemGap;
          }
        }
      }
    }

    if (kkDoc) {
      const kkImg = imageMap.get('kk');
      if (kkImg) {
        if (!doc) {
          doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
            compress: isCompressed,
          });
        } else {
          doc.addPage('a4', 'landscape');
        }

        const maxWidth = 277;
        const maxHeight = 190;
        let kkTargetW = maxWidth;
        let kkTargetH = kkTargetW / kkImg.aspect;
        if (kkTargetH > maxHeight) {
          kkTargetH = maxHeight;
          kkTargetW = kkTargetH * kkImg.aspect;
        }

        const kkX = (297 - kkTargetW) / 2;
        const kkY = (210 - kkTargetH) / 2;

        doc.addImage(kkImg.dataUrl, 'JPEG', kkX, kkY, kkTargetW, kkTargetH, undefined, 'FAST');
      }
    }

    if (doc) {
      const arrayBuffer = doc.output('arraybuffer');
      const base64 = doc.output('datauristring').split(',')[1];
      const filename = isColorPrint ? 'identitas-alvareza.pdf' : 'identitas-alvareza-bw.pdf';

      attachments.push({
        filename,
        mimeType: 'application/pdf',
        base64,
        sizeBytes: arrayBuffer.byteLength,
      });
    }
  }

  return attachments;
}

/**
 * Generates canvas-rendered high-res page previews for ModalIdentitasPreview.
 * Perfectly mirrors the exact layout of the PDF.
 */
export async function renderIdentityPagesForPreview(options: {
  selectedIds: string[];
  isColorPrint?: boolean;
  isSeparatePhotoPrint?: boolean;
  isSingleCardDirectFit?: boolean;
}): Promise<RenderedIdentityPagePreview[]> {
  const {
    selectedIds,
    isColorPrint = false,
    isSeparatePhotoPrint = false,
    isSingleCardDirectFit = false,
  } = options;

  if (!selectedIds || selectedIds.length === 0) {
    return [];
  }

  const selectedDocs = ALL_IDENTITY_DOCS.filter((d) => selectedIds.includes(d.id));
  if (selectedDocs.length === 0) return [];

  const loadedImagesList = await Promise.all(
    selectedDocs.map((docItem) =>
      loadIdentityImage(docItem.url, docItem.id, docItem.title, isColorPrint)
    )
  );

  const imageMap = new Map<string, ProcessedIdentityImage>();
  loadedImagesList.forEach((img) => imageMap.set(img.id, img));

  const pages: RenderedIdentityPagePreview[] = [];

  // Direct Fit Mode for single specific identity card/document (KTP, NPWP, KK)
  // Renders full-size matching natural card aspect ratio without blank A4 sheet margins or Lampiran text
  if (isSingleCardDirectFit || (selectedDocs.length === 1 && !PAS_FOTO_IDS.includes(selectedDocs[0].id))) {
    for (const doc of selectedDocs) {
      const img = imageMap.get(doc.id);
      if (!img) continue;

      const canvas = document.createElement('canvas');
      const isLandscape = img.aspect >= 1;
      if (isLandscape) {
        canvas.width = 1600;
        canvas.height = Math.round(1600 / img.aspect);
      } else {
        canvas.width = 1200;
        canvas.height = Math.round(1200 / img.aspect);
      }

      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imgElem = new Image();
      imgElem.src = img.dataUrl;
      await new Promise((r) => (imgElem.onload = r));
      ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);

      pages.push({
        id: `page-${doc.id}`,
        title: doc.title,
        pageNum: pages.length + 1,
        totalDocPages: 0,
        imageUrl: canvas.toDataURL('image/jpeg', 0.95),
        isLandscape,
      });
    }

    const totalDocPages = pages.length;
    pages.forEach((p) => (p.totalDocPages = totalDocPages));
    return pages;
  }

  const photoDocs = selectedDocs
    .filter((d) => PAS_FOTO_IDS.includes(d.id))
    .sort((a, b) => PAS_FOTO_IDS.indexOf(a.id) - PAS_FOTO_IDS.indexOf(b.id));
  const otherDocs = selectedDocs.filter((d) => !PAS_FOTO_IDS.includes(d.id));
  const portraitOtherDocs = otherDocs.filter((d) => d.id !== 'kk');
  const kkDoc = otherDocs.find((d) => d.id === 'kk');

  if (isSeparatePhotoPrint && photoDocs.length > 0) {
    // 1. Pratinjau Dokumen Identitas Utama (identitas-alvareza.pdf) jika ada (KTP, NPWP, KK)
    if (portraitOtherDocs.length > 0) {
      const otherBlocks = createPortraitBlocks(portraitOtherDocs, imageMap);
      const pageHeightMax = 275;
      const startY = 30;
      const itemGap = 16;

      const pageBuckets: PortraitBlock[][] = [];
      let currentBucket: PortraitBlock[] = [];
      let currentY = startY;

      for (const block of otherBlocks) {
        if (currentY + block.totalBlockHeight > pageHeightMax && currentBucket.length > 0) {
          pageBuckets.push(currentBucket);
          currentBucket = [block];
          currentY = startY + block.totalBlockHeight + itemGap;
        } else {
          currentBucket.push(block);
          currentY += block.totalBlockHeight + itemGap;
        }
      }
      if (currentBucket.length > 0) {
        pageBuckets.push(currentBucket);
      }

      for (let pIdx = 0; pIdx < pageBuckets.length; pIdx++) {
        const bucket = pageBuckets[pIdx];
        const canvas = document.createElement('canvas');
        canvas.width = 1240;
        canvas.height = 1754;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const pxPerMm = canvas.width / 210;
        let yMm = startY;
        const pageTitles: string[] = [];

        for (const block of bucket) {
          if (block.type === 'single-doc') {
            const { item, img, w, h } = block;
            const cardW = w * pxPerMm;
            const cardH = h * pxPerMm;
            const cardX = ((210 - w) / 2) * pxPerMm;
            const cardY = yMm * pxPerMm;

            ctx.font = 'bold 22px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = '#282828';
            ctx.textAlign = 'center';
            ctx.fillText(item.headerText, cardX + cardW / 2, cardY - 6 * pxPerMm);
            ctx.textAlign = 'left';

            const imgElem = new Image();
            imgElem.src = img.dataUrl;
            await new Promise((r) => (imgElem.onload = r));
            ctx.drawImage(imgElem, cardX, cardY, cardW, cardH);

            pageTitles.push(item.title);
            yMm += h + itemGap;
          }
        }

        pages.push({
          id: `page-portrait-other-${pIdx + 1}`,
          title: pageTitles.join(', '),
          pageNum: pages.length + 1,
          totalDocPages: 0,
          imageUrl: canvas.toDataURL('image/jpeg', 0.95),
          isLandscape: false,
        });
      }
    }

    if (kkDoc) {
      const kkImg = imageMap.get('kk');
      if (kkImg) {
        const canvas = document.createElement('canvas');
        canvas.width = 1754;
        canvas.height = 1240;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const pxPerMm = canvas.width / 297;
        const maxWidthMm = 277;
        const maxHeightMm = 190;
        let targetWMm = maxWidthMm;
        let targetHMm = targetWMm / kkImg.aspect;
        if (targetHMm > maxHeightMm) {
          targetHMm = maxHeightMm;
          targetWMm = targetHMm * kkImg.aspect;
        }

        const targetW = targetWMm * pxPerMm;
        const targetH = targetHMm * pxPerMm;
        const targetX = ((297 - targetWMm) / 2) * pxPerMm;
        const targetY = ((210 - targetHMm) / 2) * pxPerMm;

        const kkElem = new Image();
        kkElem.src = kkImg.dataUrl;
        await new Promise((r) => (kkElem.onload = r));
        ctx.drawImage(kkElem, targetX, targetY, targetW, targetH);

        pages.push({
          id: 'page-kk',
          title: 'Kartu Keluarga (KK)',
          pageNum: pages.length + 1,
          totalDocPages: 0,
          imageUrl: canvas.toDataURL('image/jpeg', 0.95),
          isLandscape: true,
        });
      }
    }

    // 2. Pratinjau Berkas Foto Terpisah (foto-alvareza.pdf):
    // Setiap foto dibuat dengan canvas berlebar 1240px (presisi lebar A4 normal) dan tinggi proporsional sesuai rasio asli foto
    for (const doc of photoDocs) {
      const img = imageMap.get(doc.id);
      if (!img) continue;

      const canvas = document.createElement('canvas');
      canvas.width = 1240; // Presisi lebar A4 standar
      canvas.height = Math.round(1240 / img.aspect); // Tinggi proporsional
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imgElem = new Image();
      imgElem.src = img.dataUrl;
      await new Promise((r) => (imgElem.onload = r));
      ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);

      pages.push({
        id: `page-photo-${doc.id}`,
        title: doc.title,
        pageNum: pages.length + 1,
        totalDocPages: 0,
        imageUrl: canvas.toDataURL('image/jpeg', 0.95),
        isLandscape: false,
      });
    }
  } else {
    // Standard combined preview logic
    const portraitDocs = selectedDocs.filter((d) => d.id !== 'kk');
    const kkDoc = selectedDocs.find((d) => d.id === 'kk');

    if (portraitDocs.length > 0) {
      const blocks = createPortraitBlocks(portraitDocs, imageMap);
      const pageHeightMax = 275;
      const startY = 30;
      const itemGap = 16;

      const pageBuckets: PortraitBlock[][] = [];
      let currentBucket: PortraitBlock[] = [];
      let currentY = startY;

      for (const block of blocks) {
        if (currentY + block.totalBlockHeight > pageHeightMax && currentBucket.length > 0) {
          pageBuckets.push(currentBucket);
          currentBucket = [block];
          currentY = startY + block.totalBlockHeight + itemGap;
        } else {
          currentBucket.push(block);
          currentY += block.totalBlockHeight + itemGap;
        }
      }
      if (currentBucket.length > 0) {
        pageBuckets.push(currentBucket);
      }

      for (let pIdx = 0; pIdx < pageBuckets.length; pIdx++) {
        const bucket = pageBuckets[pIdx];
        const canvas = document.createElement('canvas');
        canvas.width = 1240;
        canvas.height = 1754;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const pxPerMm = canvas.width / 210;
        let yMm = startY;
        const pageTitles: string[] = [];

        for (const block of bucket) {
          if (block.type === 'pas-foto-row') {
            const gapMm = 12;
            const startXMm = (210 - block.totalWidth) / 2;
            let currentXMm = startXMm;

            for (const { item, img, w, h } of block.items) {
              const centerXMm = currentXMm + w / 2;
              const cardW = w * pxPerMm;
              const cardH = h * pxPerMm;
              const cardX = currentXMm * pxPerMm;
              const cardY = yMm * pxPerMm;
              const textX = centerXMm * pxPerMm;

              ctx.font = 'bold 20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
              ctx.fillStyle = '#282828';
              ctx.textAlign = 'center';
              ctx.fillText(item.headerText, textX, cardY - 5 * pxPerMm);
              ctx.textAlign = 'left';

              const imgElem = new Image();
              imgElem.src = img.dataUrl;
              await new Promise((r) => (imgElem.onload = r));
              ctx.drawImage(imgElem, cardX, cardY, cardW, cardH);

              currentXMm += w + gapMm;
            }

            pageTitles.push(block.items.map((i) => i.item.title).join(', '));
            yMm += block.maxRowHeight + itemGap;
          } else {
            const { item, img, w, h } = block;

            const cardW = w * pxPerMm;
            const cardH = h * pxPerMm;
            const cardX = ((210 - w) / 2) * pxPerMm;
            const cardY = yMm * pxPerMm;

            ctx.font = 'bold 22px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = '#282828';
            ctx.textAlign = 'center';
            ctx.fillText(item.headerText, cardX + cardW / 2, cardY - 6 * pxPerMm);
            ctx.textAlign = 'left';

            const imgElem = new Image();
            imgElem.src = img.dataUrl;
            await new Promise((r) => (imgElem.onload = r));
            ctx.drawImage(imgElem, cardX, cardY, cardW, cardH);

            pageTitles.push(item.title);
            yMm += h + itemGap;
          }
        }

        pages.push({
          id: `page-portrait-${pIdx + 1}`,
          title: pageTitles.join(', '),
          pageNum: pages.length + 1,
          totalDocPages: 0,
          imageUrl: canvas.toDataURL('image/jpeg', 0.95),
          isLandscape: false,
        });
      }
    }

    if (kkDoc) {
      const kkImg = imageMap.get('kk');
      if (kkImg) {
        const canvas = document.createElement('canvas');
        canvas.width = 1754;
        canvas.height = 1240;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const pxPerMm = canvas.width / 297;
        const maxWidthMm = 277;
        const maxHeightMm = 190;
        let targetWMm = maxWidthMm;
        let targetHMm = targetWMm / kkImg.aspect;
        if (targetHMm > maxHeightMm) {
          targetHMm = maxHeightMm;
          targetWMm = targetHMm * kkImg.aspect;
        }

        const targetW = targetWMm * pxPerMm;
        const targetH = targetHMm * pxPerMm;
        const targetX = ((297 - targetWMm) / 2) * pxPerMm;
        const targetY = ((210 - targetHMm) / 2) * pxPerMm;

        const kkElem = new Image();
        kkElem.src = kkImg.dataUrl;
        await new Promise((r) => (kkElem.onload = r));
        ctx.drawImage(kkElem, targetX, targetY, targetW, targetH);

        pages.push({
          id: 'page-kk',
          title: 'Kartu Keluarga (KK)',
          pageNum: pages.length + 1,
          totalDocPages: 0,
          imageUrl: canvas.toDataURL('image/jpeg', 0.95),
          isLandscape: true,
        });
      }
    }
  }

  const totalDocPages = pages.length;
  pages.forEach((p) => (p.totalDocPages = totalDocPages));

  return pages;
}

/**
 * Downloads the Identity Documents PDF directly to the user's browser.
 * Handles multiple files sequentially with browser-safe delay.
 */
export async function downloadIdentityDocsPdf(
  selectedIds: string[],
  isColorPrint: boolean = false,
  isSeparatePhotoPrint: boolean = false,
  isSingleCardDirectFit: boolean = false,
  isPhotoAsJpg: boolean = true,
  isCompressed: boolean = true
): Promise<void> {
  const attachments = await buildIdentityDocsPdf({
    selectedIds,
    isColorPrint,
    isSeparatePhotoPrint,
    isSingleCardDirectFit,
    isPhotoAsJpg,
    isCompressed,
  });

  for (let i = 0; i < attachments.length; i++) {
    const attachment = attachments[i];
    const byteCharacters = atob(attachment.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let j = 0; j < byteCharacters.length; j++) {
      byteNumbers[j] = byteCharacters.charCodeAt(j);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: attachment.mimeType || 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = attachment.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    // Give browser small interval between downloads so popup blocker doesn't block 2nd file
    if (i < attachments.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 450));
    }
  }
}

