import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  File as FileIcon, Layers, Image as ImageIcon, Download, X, Copy, ExternalLink 
} from 'lucide-react';

import { BerkasProps } from './type';
import { useBerkas } from './logic';
import { BerkasList } from './list';
import { BerkasMerge, BerkasImg2Pdf } from './tools';
import PdfViewer from '../../../components/PdfViewer';

export default function BerkasMain({ setHeaderActions }: BerkasProps) {
  const {
    activeTab,
    setActiveTab,
    files,
    loading,
    toastMessage,
    selectedFile,
    setSelectedFile,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    mergeQueue,
    setMergeQueue,
    outputFileName,
    setOutputFileName,
    optimizePdf,
    setOptimizePdf,
    pdfSearchQuery,
    setPdfSearchQuery,
    merging,
    mergeProgress,
    pdfDragActive,
    imageQueue,
    setImageQueue,
    img2pdfFileName,
    setImg2pdfFileName,
    img2pdfOrientation,
    setImg2pdfOrientation,
    img2pdfSize,
    setImg2pdfSize,
    img2pdfMargin,
    setImg2pdfMargin,
    imageSearchQuery,
    setImageSearchQuery,
    converting,
    convertProgress,
    imgDragActive,
    pdfInputRef,
    imgInputRef,
    handleCopyLink,
    handleDownloadFile,
    handlePdfDrag,
    handlePdfDrop,
    addLocalPdfs,
    handleMergePDFs,
    handleImgDrag,
    handleImgDrop,
    addLocalImages,
    handleImagesToPdf,
    moveUp,
    moveDown,
    removeFromQueue,
    allCategories,
    filteredFiles,
    displayCategories,
    availablePDFs,
    availableImages,
  } = useBerkas();

  // Update parent top bar header actions
  useEffect(() => {
    if (setHeaderActions) {
      setHeaderActions(
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'list'
                ? 'bg-white dark:bg-slate-800 text-accent shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
            }`}
          >
            <FileIcon className="w-3.5 h-3.5" />
            Daftar Berkas
          </button>
          <button
            onClick={() => {
              setActiveTab('merge');
              setMergeQueue([]);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'merge'
                ? 'bg-white dark:bg-slate-800 text-accent shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Gabung PDF
          </button>
          <button
            onClick={() => {
              setActiveTab('img2pdf');
              setImageQueue([]);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'img2pdf'
                ? 'bg-white dark:bg-slate-800 text-accent shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-955 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Gambar ke PDF
          </button>
        </div>
      );
    }
    return () => {
      if (setHeaderActions) {
        setHeaderActions(null);
      }
    };
  }, [activeTab, setHeaderActions, setMergeQueue, setImageQueue, setActiveTab]);

  const showToast = (msg: string) => {
    // Call showToast using browser alerts or log if needed, 
    // but we can also manage toast in main.tsx or logic hook.
    // Our logic hook already manages toastMessage and auto-clears it.
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 lg:space-y-0 pb-10 lg:pb-0 overflow-hidden">
      {/* Sleek Custom Segmented Tab Bar - Mobile Only */}
      <div className="flex md:hidden border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto scrollbar-none mb-4 shrink-0">
        <button
          onClick={() => setActiveTab('list')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider px-5 border-b-2 transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'list' 
              ? 'border-accent text-accent' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileIcon className="w-3.5 h-3.5" />
          Daftar Berkas
        </button>
        <button
          onClick={() => {
            setActiveTab('merge');
            setMergeQueue([]);
          }}
          className={`pb-3 text-xs font-bold uppercase tracking-wider px-5 border-b-2 transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'merge' 
              ? 'border-accent text-accent' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Gabung PDF
        </button>
        <button
          onClick={() => {
            setActiveTab('img2pdf');
            setImageQueue([]);
          }}
          className={`pb-3 text-xs font-bold uppercase tracking-wider px-5 border-b-2 transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'img2pdf' 
              ? 'border-accent text-accent' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Gambar ke PDF
        </button>
      </div>

      {/* Conditionally Render Active Tab */}
      <div className="flex-1 min-h-0 lg:h-full lg:overflow-hidden">
        {activeTab === 'list' && (
          <div className="h-full overflow-y-auto pr-1">
            <BerkasList
              files={files}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              allCategories={allCategories}
              filteredFiles={filteredFiles}
              displayCategories={displayCategories}
              setSelectedFile={setSelectedFile}
            />
          </div>
        )}

        {activeTab === 'merge' && (
          <BerkasMerge
            mergeQueue={mergeQueue}
            setMergeQueue={setMergeQueue}
            outputFileName={outputFileName}
            setOutputFileName={setOutputFileName}
              optimizePdf={optimizePdf}
              setOptimizePdf={setOptimizePdf}
            pdfSearchQuery={pdfSearchQuery}
            setPdfSearchQuery={setPdfSearchQuery}
            merging={merging}
            mergeProgress={mergeProgress}
            pdfDragActive={pdfDragActive}
            availablePDFs={availablePDFs}
            pdfInputRef={pdfInputRef}
            handlePdfDrag={handlePdfDrag}
            handlePdfDrop={handlePdfDrop}
            handleMergePDFs={handleMergePDFs}
            moveUp={moveUp}
            moveDown={moveDown}
            removeFromQueue={removeFromQueue}
            addLocalPdfs={addLocalPdfs}
            showToast={showToast}
          />
        )}

        {activeTab === 'img2pdf' && (
          <BerkasImg2Pdf
            imageQueue={imageQueue}
            setImageQueue={setImageQueue}
            img2pdfFileName={img2pdfFileName}
            setImg2pdfFileName={setImg2pdfFileName}
            img2pdfOrientation={img2pdfOrientation}
            setImg2pdfOrientation={setImg2pdfOrientation}
            img2pdfSize={img2pdfSize}
            setImg2pdfSize={setImg2pdfSize}
            img2pdfMargin={img2pdfMargin}
            setImg2pdfMargin={setImg2pdfMargin}
            imageSearchQuery={imageSearchQuery}
            setImageSearchQuery={setImageSearchQuery}
            converting={converting}
            convertProgress={convertProgress}
            imgDragActive={imgDragActive}
            availableImages={availableImages}
            imgInputRef={imgInputRef}
            handleImgDrag={handleImgDrag}
            handleImgDrop={handleImgDrop}
            handleImagesToPdf={handleImagesToPdf}
            moveUp={moveUp}
            moveDown={moveDown}
            removeFromQueue={removeFromQueue}
            addLocalImages={addLocalImages}
            showToast={showToast}
          />
        )}
      </div>

      {/* Interactive Full Preview Modal & Bottom Sheet */}
      <AnimatePresence>
        {selectedFile && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFile(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Box / Bottom Sheet */}
            <motion.div
              initial={{ y: '100%', opacity: 0.5, scale: 1 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full sm:max-w-3xl bg-white dark:bg-slate-950 shadow-2xl flex flex-col bottom-0 sm:bottom-auto sm:rounded-2xl rounded-t-3xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden border border-slate-200 dark:border-slate-800 z-10"
            >
              {/* Drag indicator for mobile bottom sheet */}
              <div className="flex sm:hidden justify-center py-3 shrink-0">
                <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="space-y-1 pr-6 flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {selectedFile.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {selectedFile.name.split('.').pop()?.toUpperCase()} Dokumen
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownloadFile(selectedFile.url, selectedFile.name)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors flex items-center justify-center"
                    title="Unduh Berkas"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Interactive Preview Container */}
              <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-center">
                {selectedFile.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null ? (
                  <div className="w-full h-full max-h-[50vh] flex items-center justify-center">
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.name}
                      className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-md border border-slate-100 dark:border-slate-800"
                    />
                  </div>
                ) : selectedFile.name.match(/\.(pdf)$/i) != null ? (
                  <div className="w-full h-[50vh] sm:h-[55vh] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 relative flex flex-col">
                    <PdfViewer url={selectedFile.url} />
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
                    <FileIcon className="w-16 h-16 opacity-30" />
                    <span className="text-xs">Pratinjau tidak tersedia untuk tipe berkas ini.</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  onClick={() => handleCopyLink(selectedFile.url)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Salin Tautan Berkas
                </button>
                <a
                  href={selectedFile.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 bg-accent hover:bg-accent/90 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Berkas Penuh
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-none"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
