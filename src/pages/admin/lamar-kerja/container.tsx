import React from 'react';
import { JobApplyModalSheet } from './JobApplyModalSheet';
import { JobApplyBottomBar } from './JobApplyBottomBar';
import { LamarKerjaContainerProps } from './types';

/**
 * LamarKerjaContainer
 * Unified container orchestrator for Lamar Kerja modal sheet and floating trigger bar.
 */
export const LamarKerjaContainer: React.FC<LamarKerjaContainerProps> = ({
  showBottomBar = false,
  onOpenApplyModal,
  isOpen,
  onClose,
  selectedFile,
  scanResult,
  isScanning,
  scanStage,
  ocrProgress,
  onRescanFile,
  onClearFile,
  error,
}) => {
  return (
    <>
      {showBottomBar && onOpenApplyModal && (
        <JobApplyBottomBar
          onOpenApplyModal={onOpenApplyModal}
          isLoading={isScanning}
        />
      )}

      <JobApplyModalSheet
        isOpen={isOpen}
        onClose={onClose}
        selectedFile={selectedFile}
        scanResult={scanResult}
        isScanning={isScanning}
        scanStage={scanStage}
        ocrProgress={ocrProgress}
        onRescanFile={onRescanFile}
        onClearFile={onClearFile}
        error={error}
      />
    </>
  );
};

export default LamarKerjaContainer;
