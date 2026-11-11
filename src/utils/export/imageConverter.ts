/**
 * Utility Konversi WebP ke JPEG Berkualitas Tinggi & Terkompresi Ringan
 * Menggunakan Canvas API di browser dengan optimasi memori dan sequential processing.
 */

export interface JpegConversionOptions {
  maxDimension?: number;
  quality?: number;
  isGrayscale?: boolean;
}

export interface ConvertedJpegItem {
  name: string;
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Konversi satu berkas gambar (WebP/PNG) ke JPEG teroptimasi.
 */
export async function convertImageToJpeg(
  imageSrc: string,
  fileNameWithoutExt: string,
  options: JpegConversionOptions = {}
): Promise<ConvertedJpegItem> {
  const maxDim = options.maxDimension || 1600;
  const quality = options.quality ?? 0.82;
  const isGrayscale = Boolean(options.isGrayscale);

  let sourceUrl = imageSrc;
  let objectUrlToRevoke: string | null = null;

  if (!imageSrc.startsWith('data:')) {
    // Ambil blob berkas gambar dari URL
    const response = await fetch(imageSrc);
    if (!response.ok) {
      throw new Error(`Gagal mengunduh gambar sumber: ${imageSrc} (${response.status})`);
    }
    const sourceBlob = await response.blob();
    sourceUrl = URL.createObjectURL(sourceBlob);
    objectUrlToRevoke = sourceUrl;
  }

  return new Promise<ConvertedJpegItem>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Skala proporsional jika melebihi maxDimension
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          throw new Error('Canvas 2D context tidak tersedia pada peramban');
        }

        // Latar putih bersih (mencegah transparansi menjadi hitam pada format JPEG)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Terapkan efek grayscale jika diminta
        if (isGrayscale) {
          ctx.filter = 'grayscale(100%) contrast(105%)';
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error(`Gagal menghasilkan Blob JPEG untuk ${imageSrc}`));
              return;
            }
            resolve({
              name: `${fileNameWithoutExt}.jpg`,
              blob,
              dataUrl,
              width,
              height,
            });
          },
          'image/jpeg',
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
      reject(new Error(`Gagal membaca elemen Image dari: ${imageSrc}`));
    };

    img.src = sourceUrl;
  });
}

/**
 * Konversi batch berkas gambar secara berurutan (Sequential Micro-task)
 * agar UI tetap responsif 60fps tanpa membeku dan tidak mengalami lonjakan memori (RAM).
 */
export async function convertBatchImagesToJpeg(
  items: Array<{ src: string; filename: string; title?: string }>,
  options: JpegConversionOptions = {},
  onProgress?: (current: number, total: number, itemName: string) => void
): Promise<ConvertedJpegItem[]> {
  const results: ConvertedJpegItem[] = [];
  const total = items.length;

  for (let i = 0; i < total; i++) {
    const item = items[i];
    if (onProgress) {
      onProgress(i + 1, total, item.title || item.filename);
    }

    const cleanBaseName = item.filename.replace(/\.[^/.]+$/, '');
    const converted = await convertImageToJpeg(item.src, cleanBaseName, options);
    results.push(converted);

    // Yield control sesaat ke browser main thread
    await new Promise((resolve) => setTimeout(resolve, 15));
  }

  return results;
}
