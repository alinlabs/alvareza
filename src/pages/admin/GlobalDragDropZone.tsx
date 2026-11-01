import React, { useEffect, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface GlobalDragDropZoneProps {
  onDropImage: (file: File) => void;
}

export const GlobalDragDropZone: React.FC<GlobalDragDropZoneProps> = ({ onDropImage }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      // Check if dragging files
      if (e.dataTransfer?.types && Array.from(e.dataTransfer.types).includes('Files')) {
        dragCounter++;
        setIsDraggingOver(true);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        setIsDraggingOver(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDraggingOver(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);
        // Find the first image file
        const imageFile = filesArray.find((f) => f.type.startsWith('image/')) || filesArray[0];

        if (imageFile) {
          onDropImage(imageFile);
        }
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [onDropImage]);

  if (!isDraggingOver) return null;

  return (
    <div
      id="global-drag-drop-overlay"
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-slate-950/10 backdrop-blur-md transition-opacity duration-200 animate-fadeIn"
    >
      <div className="max-w-md w-full mx-4 p-8 rounded-3xl bg-slate-900/90 border-2 border-dashed border-blue-500 text-center shadow-2xl shadow-blue-500/30 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4">
          <UploadCloud className="w-8 h-8 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">
          Lepaskan Gambar di Sini
        </h3>
        <p className="text-sm text-slate-300">
          Flyer lowongan kerja akan otomatis dikonversi ke teks dan diproses untuk melamar sekarang.
        </p>
      </div>
    </div>
  );
};
