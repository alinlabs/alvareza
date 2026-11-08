export interface MetricHighlight {
  id: string;
  value: string;
  labelIn: string;
  labelId?: string;
  labelEn: string;
  sublabelIn: string;
  sublabelId?: string;
  sublabelEn: string;
  colorClass: string;
  borderHoverClass: string;
}

export interface ExecutiveLandingPageProps {
  onNavigateToPdf?: () => void;
  onNavigateToPortfolio?: () => void;
  onNavigateToCertifications?: () => void;
  onNavigateToAcademic?: (docId?: 'skl' | 'transkrip') => void;
  onOpenBuilder?: () => void;
  isAdmin?: boolean;
}
