import { ImageOptimizationOptions } from './types';

// In-memory cache for loaded and compressed base64 images
const imageBase64Cache = new Map<string, string>();

export function clearImageBase64Cache(): void {
  imageBase64Cache.clear();
}

export async function loadImageAsDataUrl(
  imagePath: string,
  options: ImageOptimizationOptions = { maxDimension: 1440, quality: 0.78 }
): Promise<string> {
  const maxDim = options.maxDimension || 1440;
  const rawQuality = options.quality ?? 0.78;
  const quality = Math.round(rawQuality * 100) / 100;
  const isGrayscale = Boolean(options.isGrayscale);
  const cacheKey = `${imagePath}_${maxDim}_${quality}_${isGrayscale ? 'bw' : 'color'}`;

  if (imageBase64Cache.has(cacheKey)) {
    return imageBase64Cache.get(cacheKey)!;
  }

  // Fetch file dari direktori public
  const response = await fetch(imagePath);
  if (!response.ok) {
    throw new Error(`Gagal memuat gambar: ${imagePath} (${response.status})`);
  }

  const blob = await response.blob();

  // Optimasi resolusi dan kompresi kanvas di sisi klien (Browser)
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    try {
      const optimizedDataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(blob);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          try {
            let targetWidth = img.naturalWidth || img.width;
            let targetHeight = img.naturalHeight || img.height;

            // Hitung skala jika dimensi melebihi batas resolusi optimal
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
              throw new Error('Canvas 2D context tidak tersedia');
            }

            // Gunakan interpolation berkualitas tinggi untuk ketajaman teks/grafis
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            // Jika mode greyscale / BW aktif, ubah piksel canvas ke grayscale
            if (isGrayscale) {
              try {
                const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
                const d = imgData.data;
                for (let i = 0; i < d.length; i += 4) {
                  const gray = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
                  d[i] = gray;
                  d[i + 1] = gray;
                  d[i + 2] = gray;
                }
                ctx.putImageData(imgData, 0, 0);
              } catch (grayErr) {
                console.warn('Canvas pixel data conversion warning:', grayErr);
              }
            }

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          } catch (e) {
            reject(e);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error(`Gagal memproses gambar: ${imagePath}`));
        };

        img.src = objectUrl;
      });

      imageBase64Cache.set(cacheKey, optimizedDataUrl);
      return optimizedDataUrl;
    } catch (err) {
      console.warn('Canvas optimization fallback to standard reader:', err);
    }
  }

  // Fallback standar bila canvas tidak dapat diakses
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      imageBase64Cache.set(cacheKey, dataUrl);
      resolve(dataUrl);
    };
    reader.onerror = () => reject(new Error(`Gagal membaca berkas: ${imagePath}`));
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate PDF Portofolio Adaptif secara Base64 Attachment Object
 */
