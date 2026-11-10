import { useState, useRef, useEffect } from 'react';
import { CVData } from '../types';
import { PRESET_HEADLINES, PRESET_SUMMARIES } from '../data/preset/HeadlinesSummaries';
import { resolvePresetFromQuery } from '../data/preset/RoleConfig';

export const useDocumentCustomization = (
  selectedPresetRole: string,
  language: 'in' | 'en' | 'id',
  cvData: CVData
) => {
  const canonicalPreset = resolvePresetFromQuery(selectedPresetRole) || selectedPresetRole;

  const defaultHeadline =
    PRESET_HEADLINES[canonicalPreset]?.[language] ||
    PRESET_HEADLINES[selectedPresetRole]?.[language] ||
    cvData.personalInfo.headline;

  const defaultSummary =
    PRESET_SUMMARIES[canonicalPreset]?.[language] ||
    PRESET_SUMMARIES[selectedPresetRole]?.[language] ||
    cvData.personalInfo.summary;

  const [customHeadline, setCustomHeadline] = useState<string>(defaultHeadline);
  const [customSummary, setCustomSummary] = useState<string>(defaultSummary);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState<boolean>(false);
  const summaryTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync custom inputs whenever selectedPresetRole or language changes
  useEffect(() => {
    const canonical = resolvePresetFromQuery(selectedPresetRole) || selectedPresetRole;
    const newHeadline =
      PRESET_HEADLINES[canonical]?.[language] ||
      PRESET_HEADLINES[selectedPresetRole]?.[language] ||
      cvData.personalInfo.headline;
    const newSummary =
      PRESET_SUMMARIES[canonical]?.[language] ||
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
