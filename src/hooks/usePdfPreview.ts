import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  resolvePresetFromQuery, 
  buildATSPDFDocument, 
  generateATSPDF, 
  renderPdfToPageImages, 
  PDFItemSelectionConfig 
} from '../utils/pdf/index';
import { ItemSelectionState } from '../data/presetItemSelections';
import { DesignPreset } from '../components/PrintableView/types';

interface UsePdfPreviewOptions {
  disableUrlActions?: boolean;
  applyPreset: (preset: string) => void;
  onOpenPreview?: () => void;
  isPreviewOpen: boolean;
  items: ItemSelectionState;
  language: 'id' | 'en';
  sectionOrders: any;
  selectedPresetRole: string;
  customHeadline: string;
  customSummary: string;
  designPreset: DesignPreset;
  textAlign?: 'left' | 'justify';
  headerColor?: string;
}

export const usePdfPreview = ({
  disableUrlActions = false,
  applyPreset,
  onOpenPreview,
  isPreviewOpen,
  items,
  language,
  sectionOrders,
  selectedPresetRole,
  customHeadline,
  customSummary,
  designPreset,
  textAlign = 'left',
  headerColor = '#0F172A',
}: UsePdfPreviewOptions) => {
  const [previewPageImages, setPreviewPageImages] = useState<string[]>([]);
  const [pdfPages, setPdfPages] = useState<number>(1);
  const [isBuildingPdf, setIsBuildingPdf] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [pendingAutoAction, setPendingAutoAction] = useState<'download' | 'print' | null>(null);
  const hasHandledUrlRef = useRef(false);

  // Parse URL query parameters on mount
  useEffect(() => {
    if (disableUrlActions) return;
    if (hasHandledUrlRef.current) return;
    hasHandledUrlRef.current = true;

    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const previewParam = searchParams.get('preview');
    const downloadParam = searchParams.get('download');
    const printParam = searchParams.get('print');

    if (previewParam !== null) {
      const targetPreset = resolvePresetFromQuery(previewParam);
      if (targetPreset) {
        applyPreset(targetPreset);
        if (onOpenPreview) onOpenPreview();
      }
    } else if (downloadParam !== null) {
      const targetPreset = resolvePresetFromQuery(downloadParam);
      if (targetPreset) {
        applyPreset(targetPreset);
        setPendingAutoAction('download');
      }
    } else if (printParam !== null) {
      const targetPreset = resolvePresetFromQuery(printParam);
      if (targetPreset) {
        applyPreset(targetPreset);
        setPendingAutoAction('print');
      }
    }
  }, [applyPreset, disableUrlActions, onOpenPreview]);

  const getPdfItemsConfig = useCallback((): PDFItemSelectionConfig => ({
    summary: items.summary,
    metrics: items.metrics,
    experiences: items.experiences,
    education: items.education,
    skills: items.skills,
    certifications: items.certifications,
    consultingProjects: items.consultingProjects,
    digitalSolutions: items.digitalSolutions,
    organizations: items.organizations,
    achievements: items.achievements,
  }), [items]);

  const getMappedHeaderStyle = useCallback((): 'solid-banner' | 'navy-solid' | 'plain' | 'badge' => {
    if (designPreset === 'line') return 'navy-solid';
    if (designPreset === 'plain') return 'plain';
    if (designPreset === 'badge') return 'badge';
    return 'solid-banner';
  }, [designPreset]);

  // Build the real PDF whenever preview modal is opened or items change
  useEffect(() => {
    let isCancelled = false;

    if (isPreviewOpen) {
      setIsBuildingPdf(true);
      (async () => {
        try {
          const pdfItemsConfig = getPdfItemsConfig();
          const mappedHeaderStyle = getMappedHeaderStyle();

          const pdfOptions = {
            language,
            marginMm: 15,
            fontSizeScale: 1.15,
            headerStyle: mappedHeaderStyle,
            boldWeight: 'refined' as const,
            headline: customHeadline,
            summaryText: customSummary,
            preset: selectedPresetRole,
            items: pdfItemsConfig,
            sectionOrders,
            textAlign,
            headerColor,
          };

          const { doc, totalPages } = buildATSPDFDocument(pdfOptions);
          const images = await renderPdfToPageImages(doc);

          if (!isCancelled) {
            setPdfPages(totalPages);
            setPreviewPageImages(images);
          }
        } catch (err) {
          console.error('Error generating PDF preview:', err);
        } finally {
          if (!isCancelled) {
            setIsBuildingPdf(false);
          }
        }
      })();
    } else {
      setPreviewPageImages([]);
    }

    return () => {
      isCancelled = true;
    };
  }, [
    isPreviewOpen,
    items,
    language,
    sectionOrders,
    selectedPresetRole,
    customHeadline,
    customSummary,
    designPreset,
    textAlign,
    headerColor,
    getPdfItemsConfig,
    getMappedHeaderStyle
  ]);

  // Automated Optimal Export
  const handleDownloadCustomPDF = useCallback(() => {
    setIsDownloading(true);

    const pdfItemsConfig = getPdfItemsConfig();
    const mappedHeaderStyle = getMappedHeaderStyle();

    try {
      generateATSPDF({
        language,
        marginMm: 15,
        fontSizeScale: 1.15,
        headerStyle: mappedHeaderStyle,
        boldWeight: 'refined',
        headline: customHeadline,
        summaryText: customSummary,
        preset: selectedPresetRole,
        items: pdfItemsConfig,
        sectionOrders,
        textAlign,
        headerColor,
      });
    } catch (err) {
      console.error('Error exporting PDF:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  }, [
    language,
    customHeadline,
    customSummary,
    selectedPresetRole,
    sectionOrders,
    textAlign,
    headerColor,
    getPdfItemsConfig,
    getMappedHeaderStyle
  ]);

  // Execute pending auto-action after preset state updates have been applied
  useEffect(() => {
    if (!pendingAutoAction) return;

    if (pendingAutoAction === 'download') {
      handleDownloadCustomPDF();
      setPendingAutoAction(null);
    } else if (pendingAutoAction === 'print') {
      window.print();
      setPendingAutoAction(null);
    }
  }, [pendingAutoAction, selectedPresetRole, handleDownloadCustomPDF]);

  return {
    previewPageImages,
    setPreviewPageImages,
    pdfPages,
    setPdfPages,
    isBuildingPdf,
    setIsBuildingPdf,
    pendingAutoAction,
    setPendingAutoAction,
    isDownloading,
    handleDownloadCustomPDF
  };
};
