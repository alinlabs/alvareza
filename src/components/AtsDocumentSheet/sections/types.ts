import React from "react";
import { CVData } from '../../../types';
import { ItemSelectionState } from '../../../data/presetItemSelections';
import { DesignPreset } from '../../PrintableView/types';

export interface AtsSectionProps {
  cvData: CVData;
  items: ItemSelectionState;
  language: 'id' | 'en';
  sectionOrders: any;
  designPreset?: DesignPreset;
  renderSectionHeader: (title: string) => React.ReactNode;
  preset?: string | null;
  headline?: string;
  summaryText?: string;
  textAlign?: 'left' | 'justify';
}
