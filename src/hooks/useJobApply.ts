import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import { JobScanResult, EmailLanguage } from '../types/jobApplication';
import {
  parseJobTextHeuristically,
  createFallbackJobScan,
  detectLanguageFromText,
} from '../utils/jobApplicationDraft';
import {
  preprocessImageForOcr,
  fileToBase64,
} from '../utils/imageOcrPreprocessor';
import { validateAndSanitizeOcrResult } from '../utils/ocrValidatorAndMapper';

export function useJobApply() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState<'idle' | 'ocr' | 'analyzing'>('idle');
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [scanResult, setScanResult] = useState<JobScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const processImageFile = useCallback(async (file: File, preferredLanguage?: EmailLanguage) => {
    setSelectedFile(file);
    setIsModalOpen(true);
    setIsScanning(true);
    setScanStage('ocr');
    setOcrProgress(5);
    setScanError(null);

    let extractedText = '';
    let preprocessedBlob: Blob | null = null;
    let imageBase64 = '';

    // Step 1: Preprocess Image on Canvas for any aspect ratio, resolution, or quality
    try {
      const preprocessed = await preprocessImageForOcr(file, {
        contrastBoost: 1.4,
        sharpen: true,
      });
      preprocessedBlob = preprocessed.processedBlob;
      setOcrProgress(15);
    } catch (prepErr) {
      console.warn('[useJobApply] Image preprocessing fallback to raw file:', prepErr);
      preprocessedBlob = file;
    }

    // Step 2: Convert to base64 for vision fallback / augmentation
    try {
      imageBase64 = await fileToBase64(file);
    } catch {
      // Non-blocking
    }

    // Step 3: Convert Image to Text using Tesseract.js with optimized preprocessed canvas
    try {
      const ocrSource = preprocessedBlob || file;
      const ocrTimeoutPromise = new Promise<{ text: string }>((_, reject) => {
        setTimeout(() => reject(new Error('OCR timeout')), 16000);
      });

      const ocrPromise = Tesseract.recognize(ocrSource, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text' && typeof m.progress === 'number') {
            // Map progress from 15% to 90%
            const current = 15 + Math.round(m.progress * 75);
            setOcrProgress(Math.min(95, current));
          }
        },
      }).then((res) => ({ text: res.data?.text || '' }));

      const { text } = await Promise.race([ocrPromise, ocrTimeoutPromise]);
      extractedText = (text || '').trim();

      // If pass 1 returned very little text (< 20 chars), try second pass directly on raw file
      if (extractedText.length < 20 && preprocessedBlob !== file) {
        try {
          const rawOcr = await Tesseract.recognize(file, 'eng');
          if (rawOcr.data?.text && rawOcr.data.text.trim().length > extractedText.length) {
            extractedText = rawOcr.data.text.trim();
          }
        } catch {
          // Keep pass 1
        }
      }

      setOcrProgress(100);
    } catch (ocrErr: any) {
      console.warn('[useJobApply] Tesseract OCR warning:', ocrErr?.message || ocrErr);
    }

    setScanStage('analyzing');

    // Auto-detect language from extracted text
    const autoLang = detectLanguageFromText(extractedText);
    const activeLanguage = preferredLanguage || autoLang;

    // Step 4: Send to backend API (or direct strict heuristic parse)
    try {
      // Prefer scan-job-text if text was extracted, else scan-job with vision
      const endpoint = extractedText.length >= 10 ? '/api/scan-job-text' : '/api/scan-job';
      const bodyPayload = endpoint === '/api/scan-job-text'
        ? {
            extractedText,
            filename: file.name,
            language: activeLanguage,
          }
        : {
            imageBase64,
            mimeType: file.type || 'image/jpeg',
            filename: file.name,
            language: activeLanguage,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const validated = validateAndSanitizeOcrResult(
            result.data,
            result.data.rawExtractedText || extractedText,
            file.name
          );

          const finalData: JobScanResult = {
            companyName: validated.companyName,
            jobTitle: validated.jobTitle,
            recipientEmail: validated.recipientEmail,
            recipientPhone: validated.recipientPhone,
            formatSubjectNotice: validated.formatSubjectNotice,
            keyRequirements: validated.keyRequirements,
            emailSubject: validated.emailSubject,
            emailBody: validated.emailBody,
            language: validated.language,
            rawExtractedText: result.data.rawExtractedText || extractedText,
            notes: result.data.notes || '',
            isAi: result.isAi,
            isFallback: result.isFallback,
          };
          setScanResult(finalData);
          if (result.isFallback && result.errorNote) {
            setScanError(result.errorNote);
          }
          setIsScanning(false);
          setScanStage('idle');
          return;
        }
      }

      // If server response is not ok, parse strictly on client
      console.warn('[useJobApply] Server scan not ok, using client strict heuristic parser');
      const fallback = extractedText
        ? parseJobTextHeuristically(extractedText, file.name, activeLanguage)
        : createFallbackJobScan(file.name, activeLanguage);

      const validatedFallback = validateAndSanitizeOcrResult(fallback, extractedText, file.name);
      setScanResult({
        ...fallback,
        ...validatedFallback,
      });
      setIsScanning(false);
      setScanStage('idle');
    } catch (err: any) {
      console.error('[useJobApply] Failed to process scanned text:', err);
      const fallback = extractedText
        ? parseJobTextHeuristically(extractedText, file.name, activeLanguage)
        : createFallbackJobScan(file.name, activeLanguage);

      const validatedFallback = validateAndSanitizeOcrResult(fallback, extractedText, file.name);
      setScanResult({
        ...fallback,
        ...validatedFallback,
      });
      setScanError('Menggunakan mesin seleksi entitas lokal.');
      setIsScanning(false);
      setScanStage('idle');
    }
  }, []);

  const openApplyModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setScanResult(null);
    setScanError(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    selectedFile,
    isScanning,
    scanStage,
    ocrProgress,
    scanResult,
    scanError,
    processImageFile,
    openApplyModal,
    handleClearFile,
    handleCloseModal,
  };
}
