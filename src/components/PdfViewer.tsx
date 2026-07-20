import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2 } from 'lucide-react';

// Setup worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  zoom?: number;
}

export default function PdfViewer({ url, zoom = 1 }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    
    // Initial width
    updateWidth();
    
    // Small delay to ensure container is fully rendered before measuring
    const timeout = setTimeout(updateWidth, 100);
    
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center bg-slate-200 dark:bg-slate-800 overflow-y-auto overflow-x-auto relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center"
        loading={null}
        error={
          <div className="text-red-500 p-4 text-center flex flex-col items-center gap-2">
            <span>Gagal memuat dokumen PDF.</span>
            <a href={url} target="_blank" rel="noreferrer" className="bg-accent text-white px-4 py-2 rounded-lg font-bold text-xs mt-2">Buka PDF Langsung</a>
          </div>
        }
      >
        {Array.from(new Array(numPages || 0), (el, index) => (
          <div key={`page_${index + 1}`} className="mb-4 shadow-lg first:mt-0 mt-4" style={{ width: containerWidth ? `${containerWidth * zoom}px` : 'auto' }}>
            <Page
              pageNumber={index + 1}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              width={containerWidth ? containerWidth * zoom : undefined}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
