import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { File as FileIcon } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfThumbnailProps {
  url: string;
}

export default function PdfThumbnail({ url }: PdfThumbnailProps) {
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { 
        rootMargin: '350px 0px 350px 0px' // Load when close, unload when far
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  function onDocumentLoadError() {
    setError(true);
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
        <FileIcon className="w-10 h-10 opacity-40" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-start justify-center pt-2 relative min-h-[150px]"
    >
      {isVisible ? (
        <div className="w-full flex items-center justify-center pointer-events-none origin-top" style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
          <Document
            file={url}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <FileIcon className="w-8 h-8 text-slate-400 dark:text-slate-500 opacity-45 animate-pulse" />
              </div>
            }
          >
            <Page 
              pageNumber={1} 
              renderTextLayer={false} 
              renderAnnotationLayer={false}
              width={220}
              className="w-full shadow-sm"
            />
          </Document>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 dark:bg-slate-800/50">
          <FileIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 opacity-40" />
        </div>
      )}
      <div className="absolute inset-0 bg-transparent z-10" />
    </div>
  );
}
