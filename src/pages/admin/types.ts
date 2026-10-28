import React from 'react';
import { CVData, DesignPreset } from '../../types';
import { ItemSelectionState, SectionOrdersState } from '../../data/preset/ItemSelections';

export interface ToolsWorkspacePageProps {
  onNavigateHome: () => void;
  onNavigateToPdf?: () => void;
  onNavigateToPortfolio?: () => void;
  onNavigateToCertifications?: () => void;
  onNavigateToAcademic?: (docId?: 'skl' | 'transkrip') => void;
  initialPreset?: string;
  isAdmin?: boolean;
}

export type ToolActiveTab = 'ats-builder' | 'job-apply-scanner' | 'gas-settings' | 'presets';

export interface CustomAttachmentItem {
  id: string;
  certId?: string;
  name: string;
  size: number;
  mimeType: string;
  base64: string;
}

export type CvDesignType = 'block' | 'line' | 'badge' | 'plain';
export type CvTextAlignType = 'left' | 'justify';

export interface HeaderColorPreset {
  hex: string;
  label: string;
}

export type { DesignPreset };

export interface SectionProps {
  cvData: CVData;
  items: ItemSelectionState;
  language: 'in' | 'en' | 'id';
  expandedSections: Record<string, boolean>;
  isSectionActive: (secKey: keyof ItemSelectionState) => boolean;
  toggleAccordion: (secKey: string) => void;
  setSectionActiveState: (secKey: keyof ItemSelectionState, active: boolean) => void;
  toggleItem: (secKey: keyof ItemSelectionState, itemId: string | number, subKey?: string) => void;
  toggleEntireSection: (secKey: keyof ItemSelectionState) => void;
  sectionOrders: SectionOrdersState;
  moveItem: (sectionKey: keyof SectionOrdersState, indexOrId: string | number, direction: 'up' | 'down') => void;
  selectedPresetRole?: string;
  setItems: React.Dispatch<React.SetStateAction<ItemSelectionState>>;
  setActivePreset: React.Dispatch<React.SetStateAction<string | null>>;
  setSectionOrders: React.Dispatch<React.SetStateAction<SectionOrdersState>>;
}
