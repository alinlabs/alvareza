import React from "react";
import { CVData, DesignPreset } from '../../../types';
import { ItemSelectionState } from '../../../data/preset/ItemSelections';

export interface AtsSectionProps {
  cvData: CVData;
  items: ItemSelectionState;
  language: 'in' | 'en' | 'id';
  sectionOrders: any;
  designPreset?: DesignPreset;
  renderSectionHeader: (title: string) => React.ReactNode;
  preset?: string | null;
  headline?: string;
  summaryText?: string;
  textAlign?: 'left' | 'justify';
}
