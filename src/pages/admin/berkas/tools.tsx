import React, { Dispatch, SetStateAction, RefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, File as FileIcon, FileText, Upload, Layers, 
  ArrowUp, ArrowDown, Trash2, Plus, Play, RefreshCw, Image as ImageIcon
} from 'lucide-react';
import { QueueItem, BerkasFile } from './type';

interface BerkasMergeProps {
  mergeQueue: QueueItem[];
  setMergeQueue: Dispatch<SetStateAction<QueueItem[]>>;
  outputFileName: string;
  setOutputFileName: (val: string) => void;
  optimizePdf: boolean;
  setOptimizePdf: (val: boolean) => void;
  pdfSearchQuery: string;
  setPdfSearchQuery: (val: string) => void;
  merging: boolean;
  mergeProgress: string;
  pdfDragActive: boolean;
  availablePDFs: BerkasFile[];
  pdfInputRef: RefObject<HTMLInputElement>;
  handlePdfDrag: (e: React.DragEvent) => void;
  handlePdfDrop: (e: React.DragEvent) => void;
  handleMergePDFs: () => void;
  moveUp: (queue: QueueItem[], setQueue: Dispatch<SetStateAction<QueueItem[]>>, index: number) => void;
  moveDown: (queue: QueueItem[], setQueue: Dispatch<SetStateAction<QueueItem[]>>, index: number) => void;
  removeFromQueue: (setQueue: Dispatch<SetStateAction<QueueItem[]>>, id: string) => void;
  addLocalPdfs: (fileList: FileList) => void;
  showToast: (msg: string) => void;
}

export function BerkasMerge({
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
  availablePDFs,
  pdfInputRef,
  handlePdfDrag,
  handlePdfDrop,
  handleMergePDFs,
  moveUp,
  moveDown,
  removeFromQueue,
  addLocalPdfs,
  showToast
}: BerkasMergeProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:h-full lg:min-h-0">
      {/* LEFT COLUMN: SOURCE SELECTION */}
      <div className="lg:col-span-4 flex flex-col lg:h-full lg:min-h-0 space-y-4">
        {/* Box: Server PDF Picker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm lg:h-full lg:max-h-none flex flex-col overflow-hidden">
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileIcon className="w-4 h-4 text-accent" />
              PDF dari Website
            </h4>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-500">
              {availablePDFs.length} Tersedia
            </span>
          </div>

          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari PDF website..."
              value={pdfSearchQuery}
              onChange={e => setPdfSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2 lg:min-h-0">
            {availablePDFs.map(file => (
              <div 
                key={file.url}
                onClick={() => {
                  setMergeQueue(prev => [...prev, {
                    id: file.url,
                    name: file.name,
                    url: file.url,
                    type: 'server'
                  }]);
                  showToast('Menambahkan PDF ke antrean');
                }}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">{file.category}</p>
                  </div>
                </div>
                <button className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 group-hover:text-accent group-hover:border-accent/40 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {availablePDFs.length === 0 && (
              <div className="text-center py-6 text-[11px] text-slate-400">
                Tidak ada PDF tambahan tersedia
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: QUEUE & ACTIONS */}
      <div className="lg:col-span-8 flex flex-col lg:h-full lg:min-h-0 space-y-4">
        <div 
          onDragEnter={handlePdfDrag}
          onDragOver={handlePdfDrag}
          onDragLeave={handlePdfDrag}
          onDrop={handlePdfDrop}
          className={`bg-white dark:bg-slate-900 border-2 rounded-2xl p-5 space-y-4 shadow-sm lg:h-full lg:min-h-0 flex flex-col overflow-hidden transition-all duration-200 ${
            pdfDragActive 
              ? 'border-accent bg-accent/5' 
              : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <input 
            type="file" 
            ref={pdfInputRef}
            accept="application/pdf"
            multiple
            onChange={(e) => e.target.files && addLocalPdfs(e.target.files)}
            className="hidden" 
          />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between shrink-0 border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                Urutan Penggabungan
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Susun berkas PDF dari atas ke bawah untuk urutan halaman</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => pdfInputRef.current?.click()}
                className="text-[10px] font-bold text-accent bg-accent/10 hover:bg-accent/20 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                Unggah PDF Lokal
              </button>
              {mergeQueue.length > 0 && (
                <button 
                  onClick={() => {
                    setMergeQueue([]);
                    showToast('Antrean dibersihkan');
                  }}
                  className="text-[10px] font-bold text-rose-500 hover:underline px-1"
                >
                  Hapus Semua
                </button>
              )}
              <span className="text-xs bg-accent/10 text-accent font-bold px-2.5 py-1 rounded-full">
                {mergeQueue.length} Berkas
              </span>
            </div>
          </div>

          {/* Merge Queue List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2 lg:min-h-0 flex flex-col">
            {mergeQueue.length > 0 && mergeQueue.map((item, index) => (
              <motion.div 
                layout
                key={item.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl shrink-0"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-900 w-5 h-5 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider border mt-0.5 ${
                      item.type === 'local' 
                        ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/50' 
                        : 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-200/50'
                    }`}>
                      {item.type === 'local' ? 'Komputer' : 'Website'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    disabled={index === 0}
                    onClick={() => moveUp(mergeQueue, setMergeQueue, index)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    disabled={index === mergeQueue.length - 1}
                    onClick={() => moveDown(mergeQueue, setMergeQueue, index)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => removeFromQueue(setMergeQueue, item.id)}
                    className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}

            {mergeQueue.length === 0 && (
              <div 
                onClick={() => pdfInputRef.current?.click()}
                className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 space-y-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-all"
              >
                <Upload className="w-10 h-10 opacity-30 text-accent animate-pulse" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Antrean penggabungan kosong.</span>
                <span className="text-[10px] text-slate-400 text-center max-w-xs px-4">
                  Seret & lepas PDF lokal ke area ini, klik di sini untuk memilih dari komputer, atau klik tambah dari PDF website di samping kiri.
                </span>
              </div>
            )}
          </div>

          {/* Name & Save Controls */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4 shrink-0">
            
            <div className="space-y-3">
              <div className="space-y-1 text-left">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Nama File Hasil PDF
                </label>
                <input 
                  type="text"
                  placeholder="Hasil_Gabungan.pdf"
                  value={outputFileName}
                  onChange={e => setOutputFileName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-accent focus:outline-none"
                />
              </div>
              <label className="flex items-start gap-2 cursor-pointer group bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-accent/50 transition-colors">
                <input
                  type="checkbox"
                  checked={optimizePdf}
                  onChange={(e) => setOptimizePdf(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-accent focus:ring-accent"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Gabungkan & Optimalkan (Kompresi ke maks 3MB)</span>
                  <span className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">⚠️ Peringatan: Teks pada CV tidak akan bisa dibaca oleh sistem ATS HRD karena diubah menjadi gambar.</span>
                </div>
              </label>
            </div>


            <AnimatePresence>
              {merging && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-accent/5 rounded-xl p-3 flex items-center gap-3 border border-accent/25"
                >
                  <RefreshCw className="w-4 h-4 text-accent animate-spin shrink-0" />
                  <span className="text-xs font-semibold text-accent/90 truncate">{mergeProgress}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={mergeQueue.length < 2 || merging}
              onClick={handleMergePDFs}
              className="w-full py-2.5 bg-accent hover:bg-accent/90 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow"
            >
              <Play className="w-3.5 h-3.5" />
              Gabungkan & Unduh PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BerkasImg2PdfProps {
  imageQueue: QueueItem[];
  setImageQueue: Dispatch<SetStateAction<QueueItem[]>>;
  img2pdfFileName: string;
  setImg2pdfFileName: (val: string) => void;
  img2pdfOrientation: 'portrait' | 'landscape' | 'auto';
  setImg2pdfOrientation: (val: 'portrait' | 'landscape' | 'auto') => void;
  img2pdfSize: 'a4' | 'letter' | 'fit';
  setImg2pdfSize: (val: 'a4' | 'letter' | 'fit') => void;
  img2pdfMargin: 'none' | 'thin' | 'normal';
  setImg2pdfMargin: (val: 'none' | 'thin' | 'normal') => void;
  imageSearchQuery: string;
  setImageSearchQuery: (val: string) => void;
  converting: boolean;
  convertProgress: string;
  imgDragActive: boolean;
  availableImages: BerkasFile[];
  imgInputRef: RefObject<HTMLInputElement>;
  handleImgDrag: (e: React.DragEvent) => void;
  handleImgDrop: (e: React.DragEvent) => void;
  handleImagesToPdf: () => void;
  moveUp: (queue: QueueItem[], setQueue: Dispatch<SetStateAction<QueueItem[]>>, index: number) => void;
  moveDown: (queue: QueueItem[], setQueue: Dispatch<SetStateAction<QueueItem[]>>, index: number) => void;
  removeFromQueue: (setQueue: Dispatch<SetStateAction<QueueItem[]>>, id: string) => void;
  addLocalImages: (fileList: FileList) => void;
  showToast: (msg: string) => void;
}

export function BerkasImg2Pdf({
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
  availableImages,
  imgInputRef,
  handleImgDrag,
  handleImgDrop,
  handleImagesToPdf,
  moveUp,
  moveDown,
  removeFromQueue,
  addLocalImages,
  showToast
}: BerkasImg2PdfProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:h-full lg:min-h-0">
      {/* LEFT COLUMN: SOURCE SELECTION */}
      <div className="lg:col-span-4 flex flex-col lg:h-full lg:min-h-0 space-y-4">
        {/* Box: Server Image Picker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm lg:h-full lg:max-h-none flex flex-col overflow-hidden">
          <div className="flex justify-between items-center shrink-0">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-accent" />
              Gambar dari Website
            </h4>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-500">
              {availableImages.length} Tersedia
            </span>
          </div>

          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari gambar website..."
              value={imageSearchQuery}
              onChange={e => setImageSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:border-accent focus:outline-none transition-colors"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2 lg:min-h-0">
            {availableImages.map(file => (
              <div 
                key={file.url}
                onClick={() => {
                  setImageQueue(prev => [...prev, {
                    id: file.url,
                    name: file.name,
                    url: file.url,
                    type: 'server'
                  }]);
                  showToast('Menambahkan gambar ke antrean');
                }}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/50 dark:border-slate-700/50">
                    <img src={file.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">{file.category}</p>
                  </div>
                </div>
                <button className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 group-hover:text-accent group-hover:border-accent/40 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {availableImages.length === 0 && (
              <div className="text-center py-6 text-[11px] text-slate-400">
                Tidak ada Gambar tambahan tersedia
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: QUEUE & ACTIONS */}
      <div className="lg:col-span-8 flex flex-col lg:h-full lg:min-h-0 space-y-4">
        <div 
          onDragEnter={handleImgDrag}
          onDragOver={handleImgDrag}
          onDragLeave={handleImgDrag}
          onDrop={handleImgDrop}
          className={`bg-white dark:bg-slate-900 border-2 rounded-2xl p-5 space-y-4 shadow-sm lg:h-full lg:min-h-0 flex flex-col overflow-hidden transition-all duration-200 ${
            imgDragActive 
              ? 'border-accent bg-accent/5' 
              : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <input 
            type="file" 
            ref={imgInputRef}
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
            multiple
            onChange={(e) => e.target.files && addLocalImages(e.target.files)}
            className="hidden" 
          />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between shrink-0 border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-accent" />
                Urutan Gambar
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Susun urutan halaman atau hapus gambar dari file PDF</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => imgInputRef.current?.click()}
                className="text-[10px] font-bold text-accent bg-accent/10 hover:bg-accent/20 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                Unggah Gambar Lokal
              </button>
              {imageQueue.length > 0 && (
                <button 
                  onClick={() => {
                    setImageQueue([]);
                    showToast('Antrean dibersihkan');
                  }}
                  className="text-[10px] font-bold text-rose-500 hover:underline px-1"
                >
                  Hapus Semua
                </button>
              )}
              <span className="text-xs bg-accent/10 text-accent font-bold px-2.5 py-1 rounded-full">
                {imageQueue.length} Gambar
              </span>
            </div>
          </div>

          {/* Image Queue List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2 lg:min-h-0 flex flex-col">
            {imageQueue.length > 0 && imageQueue.map((item, index) => (
              <motion.div 
                layout
                key={item.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl shrink-0"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-900 w-5 h-5 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="w-10 h-10 rounded overflow-hidden bg-slate-150 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 shrink-0">
                    <img 
                      src={item.type === 'local' ? item.thumbnail : item.url} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider border mt-0.5 ${
                      item.type === 'local' 
                        ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/50' 
                        : 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-200/50'
                    }`}>
                      {item.type === 'local' ? 'Komputer' : 'Website'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    disabled={index === 0}
                    onClick={() => moveUp(imageQueue, setImageQueue, index)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    disabled={index === imageQueue.length - 1}
                    onClick={() => moveDown(imageQueue, setImageQueue, index)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => removeFromQueue(setImageQueue, item.id)}
                    className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}

            {imageQueue.length === 0 && (
              <div 
                onClick={() => imgInputRef.current?.click()}
                className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 space-y-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-all"
              >
                <Upload className="w-10 h-10 opacity-30 text-accent animate-pulse" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Antrean gambar kosong.</span>
                <span className="text-[10px] text-slate-400 text-center max-w-xs px-4">
                  Seret & lepas Gambar lokal ke area ini, klik di sini untuk memilih dari komputer, atau klik tambah dari Gambar website di samping kiri.
                </span>
              </div>
            )}
          </div>

          {/* Settings Grid */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4 shrink-0">
            {/* 3 Grid Options */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1 text-left">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Orientasi Halaman
                </label>
                <select
                  value={img2pdfOrientation}
                  onChange={e => setImg2pdfOrientation(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-accent focus:outline-none cursor-pointer"
                >
                  <option value="auto">Sesuai Gambar (Auto)</option>
                  <option value="portrait">Tegak (Portrait)</option>
                  <option value="landscape">Lanskap (Landscape)</option>
                </select>
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Ukuran Halaman
                </label>
                <select
                  value={img2pdfSize}
                  onChange={e => setImg2pdfSize(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-accent focus:outline-none cursor-pointer"
                >
                  <option value="fit">Sesuai Gambar (Fit)</option>
                  <option value="a4">A4 (210 x 297mm)</option>
                  <option value="letter">Letter (US Letter)</option>
                </select>
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Margin Halaman
                </label>
                <select
                  value={img2pdfMargin}
                  onChange={e => setImg2pdfMargin(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-accent focus:outline-none cursor-pointer"
                >
                  <option value="none">Tanpa Margin</option>
                  <option value="thin">Tipis (10mm)</option>
                  <option value="normal">Normal (20mm)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider">
                Nama File Hasil Konversi PDF
              </label>
              <input 
                type="text"
                placeholder="Hasil_Gambar.pdf"
                value={img2pdfFileName}
                onChange={e => setImg2pdfFileName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-accent focus:outline-none"
              />
            </div>

            <AnimatePresence>
              {converting && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-accent/5 rounded-xl p-3 flex items-center gap-3 border border-accent/25"
                >
                  <RefreshCw className="w-4 h-4 text-accent animate-spin shrink-0" />
                  <span className="text-xs font-semibold text-accent/90 truncate">{convertProgress}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={imageQueue.length === 0 || converting}
              onClick={handleImagesToPdf}
              className="w-full py-2.5 bg-accent hover:bg-accent/90 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow"
            >
              <Play className="w-3.5 h-3.5" />
              Konversi & Unduh PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
