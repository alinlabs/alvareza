export interface PDFSectionsConfig {
  summary?: boolean;
  metrics?: boolean;
  experience?: boolean;
  education?: boolean;
  skills?: boolean;
  certifications?: boolean;
  consulting?: boolean;
  digitalSolutions?: boolean;
  organizations?: boolean;
  achievements?: boolean;
}

export interface PDFItemSelectionConfig {
  summary?: boolean;
  metrics?: Record<number, boolean>;
  experiences?: Record<string, boolean>;
  education?: Record<number, boolean>;
  skills?: {
    hardGroup?: boolean;
    hard?: Record<number, boolean> | boolean;
    softGroup?: boolean;
    soft?: Record<number, boolean> | boolean;
    toolsGroup?: boolean;
    tools?: Record<number, boolean> | boolean;
  };
  certifications?: Record<string, boolean>;
  consultingProjects?: Record<string, boolean>;
  digitalSolutions?: Record<string, boolean>;
  organizations?: Record<number, boolean>;
  achievements?: Record<string, boolean>;
}

export interface PDFStyleOptions {
  marginMm?: number;
  fontSizeScale?: number; // 1.0 = standard, 0.92 = compact, 1.08 = large
  accentColor?: [number, number, number]; // RGB
  boldWeight?: 'refined' | 'bold' | 'minimal';
  headerStyle?: 'solid-banner' | 'navy-solid' | 'navy-double' | 'minimal-thin' | 'plain' | 'badge';
  language?: 'id' | 'en';
  headline?: string;
  preset?: string;
  summaryText?: string;
  headerColor?: string;
  textAlign?: 'left' | 'justify';
  sections?: PDFSectionsConfig;
  items?: PDFItemSelectionConfig;
  sectionOrders?: {
    metrics?: number[];
    experiences?: string[];
    education?: number[];
    skills?: string[];
    skills_hard?: number[];
    skills_soft?: number[];
    skills_tools?: number[];
    certifications?: string[];
    consultingProjects?: string[];
    digitalSolutions?: string[];
    organizations?: number[];
    achievements?: string[];
  };
}
