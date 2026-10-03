import { useState, useRef, useEffect } from 'react';
import { CVData } from '../types';
import { PRESET_HEADLINES, PRESET_SUMMARIES } from '../data/presetHeadlinesSummaries';

export const useDocumentCustomization = (
  selectedPresetRole: string,
  language: 'id' | 'en',
  cvData: CVData
) => {
  const defaultHeadline =
    PRESET_HEADLINES[selectedPresetRole]?.[language] ||
    cvData.personalInfo.headline;

  const defaultSummary =
    PRESET_SUMMARIES[selectedPresetRole]?.[language] ||
    cvData.personalInfo.summary;

  const [customHeadline, setCustomHeadline] = useState<string>(defaultHeadline);
  const [customSummary, setCustomSummary] = useState<string>(defaultSummary);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState<boolean>(false);
  const summaryTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync custom inputs whenever selectedPresetRole or language changes
  useEffect(() => {
    const newHeadline =
      PRESET_HEADLINES[selectedPresetRole]?.[language] ||
      cvData.personalInfo.headline;
    const newSummary =
      PRESET_SUMMARIES[selectedPresetRole]?.[language] ||
      cvData.personalInfo.summary;
    setCustomHeadline(newHeadline);
    setCustomSummary(newSummary);
  }, [selectedPresetRole, language, cvData]);

  // Adjust textarea height dynamically based on content length
  useEffect(() => {
    if (summaryTextareaRef.current) {
      summaryTextareaRef.current.style.height = 'auto';
      summaryTextareaRef.current.style.height = `${summaryTextareaRef.current.scrollHeight + 4}px`;
    }
  }, [customSummary]);

  return {
    customHeadline,
    setCustomHeadline,
    customSummary,
    setCustomSummary,
    isSummaryExpanded,
    setIsSummaryExpanded,
    summaryTextareaRef,
  };
};
