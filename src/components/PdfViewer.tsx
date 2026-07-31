import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2, FileImage } from 'lucide-react';
import { defaultImagesMap } from '../pages/admin/email-sender/utils/defaultImagesMap';

// Setup worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url?: string;
  urls?: string[];
  zoom?: number;
}

export default function PdfViewer({ url, urls, zoom = 1 }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Determine list of images to render
  const getDisplayUrls = (): string[] => {
    if (urls && urls.length > 0) return urls;
    if (!url) return [];
    
    // Check if url belongs to any key in defaultImagesMap
    const matchingLists: string[][] = [];
    for (const key of Object.keys(defaultImagesMap)) {
      if (key === 'portofolio') continue; // skip umbrella key to match specific subtypes
      const list = defaultImagesMap[key];
      if (list && list.includes(url)) {
        matchingLists.push(list);
      }
    }
    
    if (matchingLists.length > 0) {
      matchingLists.sort((a, b) => a.length - b.length);
      return matchingLists[0];
    }
    
    return [url];
  };

  const displayUrls = getDisplayUrls();
  const primaryUrl = url || (displayUrls.length > 0 ? displayUrls[0] : '');

  const isImage = 
    !primaryUrl ||
    primaryUrl.startsWith('/gambar/') || 
    /\.(webp|png|jpe?g|gif|svg)(\?.*)?$/i.test(primaryUrl) || 
    primaryUrl.startsWith('data:image/');

  useEffect(() => {
    setLoading(true);
    setHasError(false);
  }, [url, JSON.stringify(urls)]);

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

  function onDocumentLoadError(error: Error) {
    console.warn("PdfViewer load error, fallback to image:", error);
    setLoading(false);
    setHasError(true);
  }

  // If it's explicitly an image or loading PDF failed, render all images stacked
  if (isImage || hasError) {
    return (
      <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-start bg-slate-200 dark:bg-slate-900 p-4 sm:p-6 overflow-y-auto overflow-x-auto relative space-y-6">
        {displayUrls.map((imgUrl, index) => (
          <div 
            key={`${imgUrl}-${index}`}
            className="transition-all duration-200 shadow-xl rounded-xl overflow-hidden bg-white dark:bg-slate-800 shrink-0 relative group"
            style={{ width: containerWidth ? `${Math.min(containerWidth * 0.95 * zoom, 1200)}px` : '100%' }}
          >
            {displayUrls.length > 1 && (
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <span>Halaman {index + 1} dari {displayUrls.length}</span>
                <span className="text-[10px] text-slate-400 font-normal">Scroll ke bawah untuk melihat halaman berikutnya</span>
              </div>
            )}
            <img 
              src={imgUrl} 
              alt={`Preview Berkas ${index + 1}`} 
              className="w-full h-auto object-contain mx-auto block"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setHasError(true);
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center bg-slate-200 dark:bg-slate-900 overflow-y-auto overflow-x-auto relative p-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 z-10 backdrop-blur-xs">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className="flex flex-col items-center"
        loading={null}
        error={
          <div className="text-slate-600 dark:text-slate-300 p-6 text-center flex flex-col items-center gap-3 bg-white dark:bg-slate-800 rounded-xl shadow-md my-auto max-w-md">
            <FileImage className="w-10 h-10 text-slate-400" />
            <span className="font-semibold text-sm">Dokumen tidak dapat dibuka sebagai PDF.</span>
            <a href={url} target="_blank" rel="noreferrer" className="bg-accent text-white px-4 py-2 rounded-lg font-bold text-xs hover:opacity-90 transition-all">
              Buka berkas di tab baru
            </a>
          </div>
        }
      >
        {Array.from(new Array(numPages || 0), (el, index) => (
          <div key={`page_${index + 1}`} className="mb-4 shadow-lg first:mt-0 mt-2 bg-white rounded-md overflow-hidden" style={{ width: containerWidth ? `${containerWidth * zoom}px` : 'auto' }}>
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
