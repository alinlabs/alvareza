import React from 'react';
import { FullViewContainerProps } from './types';
import { FullPageAcademicView } from './academic';
import { FullPagePortfolioView } from './portfolio';
import { FullPageCertificationView } from './certification';
import { FullPagePdfView } from './pdf';

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
}) => {
  const handleBack = onNavigateToEditor || onNavigateHome || (() => {});

  switch (activeView) {
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
