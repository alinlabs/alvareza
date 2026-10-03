import React from "react";
import { CVData } from '../../../types';
import { ItemSelectionState } from '../../../data/presetItemSelections';
import { SectionOrdersState } from '../../../data/presetItemSelections';

export interface SectionProps {
  cvData: CVData;
  items: ItemSelectionState;
  language: 'id' | 'en';
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
