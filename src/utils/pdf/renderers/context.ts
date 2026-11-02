import { jsPDF } from 'jspdf';
import { PDFStyleOptions } from '../types';
import { CVData } from '../../../types';

export interface PDFRenderContext {
  doc: jsPDF;
  lang: 'in' | 'en';
  options?: PDFStyleOptions;
  cv: CVData;
  margin: number;
  scale: number;
  pageWidth: number;
  pageHeight: number;
  contentWidth: number;
  primaryNavy: [number, number, number];
  darkNavyAccent: [number, number, number];
  headerBannerColor: [number, number, number];
  darkSlate: [number, number, number];
  bodySlate: [number, number, number];
  mutedSlate: [number, number, number];
  ruleGray: [number, number, number];
  textAlign: string;
  headerStyle: string;
  canonicalPreset: string | undefined;
  adapt: (str: string) => string;

  // Dynamic Y coordinate
  getY: () => number;
  setY: (y: number) => void;
  addY: (dy: number) => void;

  // Helpers
  checkPageBreak: (neededHeight: number) => boolean;
  addHangingBullet: (
    text: string,
    opts?: {
      bulletChar?: string;
      bulletOffset?: number;
      textOffset?: number;
      lineHeight?: number;
      gapAfter?: number;
      fontStyle?: 'normal' | 'bold' | 'italic';
      textColor?: [number, number, number];
      bulletColor?: [number, number, number];
    }
  ) => void;
  addBoldPrefixHangingBullet: (
    boldPrefix: string,
    bodyText: string,
    opts?: {
      bulletChar?: string;
      bulletOffset?: number;
      textOffset?: number;
      lineHeight?: number;
      gapAfter?: number;
      fontSize?: number;
      prefixColor?: [number, number, number];
      bodyColor?: [number, number, number];
      bulletColor?: [number, number, number];
    }
  ) => void;
  addFourColumnBullets: (
    items: string[],
    opts?: {
      lineHeight?: number;
      gapAfter?: number;
      fontSize?: number;
      textColor?: [number, number, number];
      bulletColor?: [number, number, number];
    }
  ) => void;
  addSectionHeader: (title: string, isFirstSection?: boolean, minFirstItemHeight?: number) => void;
}
