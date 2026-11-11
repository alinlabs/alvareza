import React from 'react';
import { FullPageAcademicView } from './akademik';
import { FullPagePortfolioView } from './portofolio';
import { FullPageCertificationView } from './sertifikasi';
import { FullPageAwardsView } from './penghargaan';
import { FullPagePdfView } from './cv-view';
import { FullPageIdentityView } from './identitas';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Document Sub-View Exports
// ---------------------------------------------------------------------------
export * from './akademik';
export * from './sertifikasi';
export * from './penghargaan';
export * from './portofolio';
export * from './cv-view';
export * from './cv-render';
export * from './identitas';
export * from './menu-export';
export * from './modal-qr';

// ---------------------------------------------------------------------------
// Master Full-View Layout Container
// ---------------------------------------------------------------------------
/**
 * FullViewContainer
 * Master full-page view container coordinating document switching,
 * deep linking, and presentation modes.
 */
export const FullViewContainer: React.FC<FullViewContainerProps> = ({
  activeView,
  initialPreset = 'optimal',
  initialDocId = 'skl',
  onNavigateHome,
  onNavigateToEditor,
  onNavigateToPdf,
  onNavigateToPortfolio,
  onNavigateToCertifications,
  onNavigateToAwards,
}) => {
  const handleBack = onNavigateToEditor || onNavigateHome || (() => {});

  switch (activeView) {
    case 'identity':
      return <FullPageIdentityView />;

    case 'academic':
      return <FullPageAcademicView initialDocId={initialDocId} />;

    case 'portfolio':
      return (
        <FullPagePortfolioView
          initialPreset={initialPreset}
          onNavigateToEditor={handleBack}
          onNavigateToPdf={onNavigateToPdf}
          onNavigateToCertifications={onNavigateToCertifications}
        />
      );

    case 'certification':
      return (
        <FullPageCertificationView
          initialPreset={initialPreset}
          onNavigateToEditor={handleBack}
          onNavigateToPdf={onNavigateToPdf}
          onNavigateToPortfolio={onNavigateToPortfolio}
        />
      );

    case 'awards':
      return (
        <FullPageAwardsView
          onNavigateToEditor={handleBack}
          onNavigateToPdf={onNavigateToPdf}
          onNavigateToPortfolio={onNavigateToPortfolio}
          onNavigateToCertification={onNavigateToCertifications}
        />
      );

    case 'pdf':
    default:
      return (
        <FullPagePdfView
          initialPreset={initialPreset}
          onNavigateToEditor={handleBack}
          onNavigateToPortfolio={onNavigateToPortfolio}
          onNavigateToCertifications={onNavigateToCertifications}
        />
      );
  }
};

export default FullViewContainer;
