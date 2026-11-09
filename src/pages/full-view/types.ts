export type FullViewMode = 'academic' | 'portfolio' | 'certification' | 'awards' | 'pdf' | 'identity';

export interface FullViewNavigationProps {
  onNavigateHome?: () => void;
  onNavigateToEditor?: () => void;
  onNavigateToPdf?: () => void;
  onNavigateToPortfolio?: () => void;
  onNavigateToCertifications?: () => void;
  onNavigateToAwards?: () => void;
  onNavigateToAcademic?: (docId?: 'skl' | 'transkrip') => void;
}

export interface FullViewContainerProps extends FullViewNavigationProps {
  activeView: FullViewMode;
  initialPreset?: string;
  initialDocId?: 'skl' | 'transkrip';
}

