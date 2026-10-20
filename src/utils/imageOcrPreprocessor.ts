/**
 * Advanced Image Preprocessor for OCR
 * Optimizes flyer/poster images of any aspect ratio, resolution, or quality
 * (including blurry, dark-mode, noisy, smartphone screenshots, or low-contrast graphics).
 */

export interface PreprocessedImageResult {
  processedCanvas: HTMLCanvasElement;
  processedDataUrl: string;
  processedBlob: Blob;
  isDarkMode: boolean;
  aspectRatio: number;
  width: number;
  height: number;
}

/**
 * Loads a File into an HTMLImageElement safely
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal memuat file gambar: ' + err));
    };
    img.src = url;
  });
}

/**
 * Preprocesses image on HTML5 Canvas:
 * 1. Rescales low-res images up to optimal OCR DPI (min 1400px width/height), caps excessively large images.
 * 2. Analyzes background brightness/polarity (dark background vs light text).
 * 3. Applies grayscale conversion, contrast stretching, and unsharp masking.
 * 4. Produces clean, readable output for Tesseract and vision analysis.
 */
export async function preprocessImageForOcr(
  file: File,
  options: {
    contrastBoost?: number;
    forceInvert?: boolean;
    sharpen?: boolean;
  } = {}
): Promise<PreprocessedImageResult> {
  const img = await loadImageFromFile(file);

  const origWidth = img.naturalWidth || img.width || 800;
  const origHeight = img.naturalHeight || img.height || 600;
  const aspectRatio = origWidth / origHeight;

  // Calculate target dimensions for optimal OCR recognition (between 1200px and 2200px)
  let targetWidth = origWidth;
  let targetHeight = origHeight;

  const minDimension = 1200;
  const maxDimension = 2400;

  const maxSide = Math.max(origWidth, origHeight);
  if (maxSide < minDimension) {
    // Upscale small or low-res images (e.g. WhatsApp screenshots)
    const scale = minDimension / maxSide;
    targetWidth = Math.round(origWidth * scale);
    targetHeight = Math.round(origHeight * scale);
  } else if (maxSide > maxDimension) {
    // Downscale massive multi-megapixel images to prevent browser memory exhaustion
    const scale = maxDimension / maxSide;
    targetWidth = Math.round(origWidth * scale);
    targetHeight = Math.round(origHeight * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context tidak didukung pada peramban ini');
  }

  // Draw image with smooth scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imageData.data;
  const numPixels = targetWidth * targetHeight;

  // Step 1: Calculate average luminance to detect dark mode flyers (light text on dark background)
  let totalLuminance = 0;
  // Sample every 4th pixel for speed
  let sampleCount = 0;
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuminance += lum;
    sampleCount++;
  }
  const avgLuminance = totalLuminance / (sampleCount || 1);
  const isDarkMode = avgLuminance < 115; // Dark background flyer

  const shouldInvert = options.forceInvert !== undefined ? options.forceInvert : isDarkMode;
  const contrastFactor = options.contrastBoost ?? 1.35; // Default boost contrast for crisp text separation

  // Step 2: Apply Grayscale + Contrast Stretch + Optional Inversion
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Standard perceptual grayscale
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // If dark mode, invert so text becomes dark on light background
    if (shouldInvert) {
      gray = 255 - gray;
    }

    // High-contrast S-curve stretch to separate text from background gradients
    gray = ((gray - 128) * contrastFactor) + 128;
    gray = Math.max(0, Math.min(255, gray));

    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
    // keep alpha unchanged
  }

  ctx.putImageData(imageData, 0, 0);

  // Step 3: Optional Convolution Sharpening to fix blurry text/photos
  if (options.sharpen !== false) {
    try {
      const sharpenedData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const sData = sharpenedData.data;
      const copyData = new Uint8ClampedArray(sData);

      // 3x3 Sharpen Kernel: [0, -1, 0, -1, 5, -1, 0, -1, 0]
      for (let y = 1; y < targetHeight - 1; y++) {
        for (let x = 1; x < targetWidth - 1; x++) {
          const idx = (y * targetWidth + x) * 4;
          const up = ((y - 1) * targetWidth + x) * 4;
          const down = ((y + 1) * targetWidth + x) * 4;
          const left = (y * targetWidth + (x - 1)) * 4;
          const right = (y * targetWidth + (x + 1)) * 4;

          const centerVal = copyData[idx];
          const val = 5 * centerVal - copyData[up] - copyData[down] - copyData[left] - copyData[right];
          const clamped = Math.max(0, Math.min(255, val));

          sData[idx] = clamped;
          sData[idx + 1] = clamped;
          sData[idx + 2] = clamped;
        }
      }
      ctx.putImageData(sharpenedData, 0, 0);
    } catch {
      // Sharpening is non-fatal enhancement
    }
  }

  // Create blob and data URL
  const processedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const processedBlob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || file), 'image/jpeg', 0.92);
  });

  return {
    processedCanvas: canvas,
    processedDataUrl,
    processedBlob,
    isDarkMode,
    aspectRatio,
    width: targetWidth,
    height: targetHeight,
  };
}

/**
 * Converts a File or Blob into a base64 string
 */
export function fileToBase64(fileOrBlob: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(fileOrBlob);
  });
}
