import { useState, useCallback } from 'react';
import { JobScanResult } from '../types/jobApplication';

export function useJobApply() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openApplyModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleClearFile = useCallback(() => {
    // No-op for backwards compatibility
  }, []);

  const processImageFile = useCallback(async () => {
    // No-op for backwards compatibility
  }, []);

  return {
    isModalOpen,
    selectedFile: null as File | null,
    isScanning: false,
    scanStage: 'idle' as const,
    ocrProgress: 0,
    scanResult: null as JobScanResult | null,
    scanError: null as string | null,
    processImageFile,
    openApplyModal,
    handleClearFile,
    handleCloseModal,
  };
}
