import { useState, useEffect, useRef, Dispatch, SetStateAction, DragEvent, ChangeEvent } from 'react';
import { PDFDocument } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import { compressPdf } from '../../../utils/pdfCompressor';
import { QueueItem, BerkasFile } from './type';

// Helper function to load image dimensions and base64 for jsPDF
export const loadImageData = (url: string): Promise<{ dataUrl: string, width: number, height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight });
        } catch (e) {
          reject(new Error('Gagal memproses gambar. Pastikan CORS diaktifkan atau unggah berkas lokal.'));
        }
      } else {
        reject(new Error('Gagal membuat canvas 2D'));
      }
    };
    img.onerror = () => reject(new Error('Gagal memuat gambar'));
    img.src = url;
  });
};

export function useBerkas() {
  const [activeTab, setActiveTab] = useState<'list' | 'merge' | 'img2pdf'>('list');
  const [files, setFiles] = useState<BerkasFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<BerkasFile | null>(null);

  // Filter states (for activeTab === 'list')
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedType, setSelectedType] = useState('Semua');

  // PDF Merger states
  const [mergeQueue, setMergeQueue] = useState<QueueItem[]>([]);
  const [outputFileName, setOutputFileName] = useState('Gabungan_Dokumen.pdf');
  const [optimizePdf, setOptimizePdf] = useState(false);
  const [pdfSearchQuery, setPdfSearchQuery] = useState('');
  const [merging, setMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState('');
  const [pdfDragActive, setPdfDragActive] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Image to PDF states
  const [imageQueue, setImageQueue] = useState<QueueItem[]>([]);
  const [img2pdfFileName, setImg2pdfFileName] = useState('Hasil_Gambar.pdf');
  const [img2pdfOrientation, setImg2pdfOrientation] = useState<'portrait' | 'landscape' | 'auto'>('auto');
  const [img2pdfSize, setImg2pdfSize] = useState<'a4' | 'letter' | 'fit'>('fit');
  const [img2pdfMargin, setImg2pdfMargin] = useState<'none' | 'thin' | 'normal'>('none');
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [converting, setConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState('');
  const [imgDragActive, setImgDragActive] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    setLoading(true);
    fetch('/api/berkas')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setFiles(res.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyLink = (url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    showToast('Link disalin!');
  };

  const handleDownloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showToast('Unduhan dimulai!');
    } catch (err) {
      console.error('Gagal mengunduh berkas:', err);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Membuka unduhan...');
    }
  };

  // -------------------------------------------------------------
  // PDF MERGER FUNCTIONS
  // -------------------------------------------------------------
  const handlePdfDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setPdfDragActive(true);
    } else if (e.type === "dragleave") {
      setPdfDragActive(false);
    }
  };

  const handlePdfDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPdfDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addLocalPdfs(e.dataTransfer.files);
    }
  };

  const addLocalPdfs = (fileList: FileList) => {
    const newItems: QueueItem[] = [];
    Array.from(fileList).forEach((file, index) => {
      if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
        newItems.push({
          id: `local-pdf-${Date.now()}-${index}`,
          name: file.name,
          url: '',
          file: file,
          type: 'local'
        });
      }
    });
    if (newItems.length > 0) {
      setMergeQueue(prev => [...prev, ...newItems]);
      showToast(`Menambahkan ${newItems.length} PDF lokal ke antrean`);
    } else {
      showToast('Hanya mendukung berkas berekstensi .pdf');
    }
  };

  const handleMergePDFs = async () => {
    if (mergeQueue.length < 2) {
      showToast('Pilih minimal 2 berkas PDF untuk digabungkan.');
      return;
    }
    setMerging(true);
    setMergeProgress('Menginisialisasi dokumen baru...');
    
    try {
      const mergedDoc = await PDFDocument.create();
      
      for (let i = 0; i < mergeQueue.length; i++) {
        const item = mergeQueue[i];
        setMergeProgress(`Menggabungkan berkas ${i + 1}/${mergeQueue.length}: ${item.name}...`);
        
        let pdfBytes: ArrayBuffer;
        if (item.type === 'local' && item.file) {
          pdfBytes = await item.file.arrayBuffer();
        } else {
          const response = await fetch(item.url);
          if (!response.ok) throw new Error(`Gagal mengunduh berkas server: ${item.name}`);
          pdfBytes = await response.arrayBuffer();
        }
        
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const copiedPages = await mergedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedDoc.addPage(page));
      }
      
      setMergeProgress('Menyimpan file hasil gabungan...');
      let mergedPdfBytes = await mergedDoc.save();
      
      if (optimizePdf) {
        setMergeProgress('Mengoptimalkan ukuran PDF (Rasterize)...');
        mergedPdfBytes = new Uint8Array(await compressPdf(mergedPdfBytes, setMergeProgress));
      }
      
      setMergeProgress('Menyiapkan unduhan...');
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = outputFileName.toLowerCase().endsWith('.pdf') ? outputFileName : `${outputFileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      showToast('PDF berhasil digabungkan!');
      setMergeQueue([]);
    } catch (err: any) {
      console.error('Merge error:', err);
      showToast(`Gagal: ${err.message || 'Error tidak diketahui'}`);
    } finally {
      setMerging(false);
      setMergeProgress('');
    }
  };

  // -------------------------------------------------------------
  // IMAGE TO PDF FUNCTIONS
  // -------------------------------------------------------------
  const handleImgDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setImgDragActive(true);
    } else if (e.type === "dragleave") {
      setImgDragActive(false);
    }
  };

  const handleImgDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addLocalImages(e.dataTransfer.files);
    }
  };

  const addLocalImages = (fileList: FileList) => {
    const newItems: QueueItem[] = [];
    Array.from(fileList).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        newItems.push({
          id: `local-img-${Date.now()}-${index}`,
          name: file.name,
          url: '',
          file: file,
          type: 'local',
          thumbnail: URL.createObjectURL(file)
        });
      }
    });
    if (newItems.length > 0) {
      setImageQueue(prev => [...prev, ...newItems]);
      showToast(`Menambahkan ${newItems.length} gambar ke antrean`);
    } else {
      showToast('Hanya mendukung berkas tipe gambar (PNG, JPG, dll)');
    }
  };

  const handleImagesToPdf = async () => {
    if (imageQueue.length === 0) {
      showToast('Pilih minimal 1 gambar untuk dikonversi.');
      return;
    }
    setConverting(true);
    setConvertProgress('Memulai konversi...');
    
    try {
      const doc = new jsPDF({
        orientation: img2pdfOrientation === 'landscape' ? 'l' : 'p',
        unit: 'mm',
        format: img2pdfSize === 'fit' ? 'a4' : img2pdfSize
      });
      
      let isFirstPage = true;
      
      for (let i = 0; i < imageQueue.length; i++) {
        const item = imageQueue[i];
        setConvertProgress(`Memproses gambar ${i + 1}/${imageQueue.length}: ${item.name}...`);
        
        let imgUrl = item.url;
        if (item.type === 'local' && item.file) {
          imgUrl = URL.createObjectURL(item.file);
        }
        
        const imgInfo = await loadImageData(imgUrl);
        
        if (item.type === 'local' && item.file) {
          URL.revokeObjectURL(imgUrl);
        }
        
        const imgWidth = imgInfo.width;
        const imgHeight = imgInfo.height;
        const imgRatio = imgWidth / imgHeight;
        
        // Page dimensions
        let pWidth = 210; // A4 default
        let pHeight = 297;
        
        if (img2pdfSize === 'letter') {
          pWidth = 215.9;
          pHeight = 279.4;
        } else if (img2pdfSize === 'fit') {
          pWidth = imgWidth * 0.264583;
          pHeight = imgHeight * 0.264583;
        }
        
        // Handle orientation
        let finalOrientation: 'portrait' | 'landscape' = 'portrait';
        if (img2pdfOrientation === 'auto') {
          finalOrientation = imgRatio > 1 ? 'landscape' : 'portrait';
        } else {
          finalOrientation = img2pdfOrientation;
        }
        
        if (finalOrientation === 'landscape') {
          const temp = pWidth;
          pWidth = Math.max(pWidth, pHeight);
          pHeight = Math.min(temp, pHeight);
        } else {
          const temp = pWidth;
          pWidth = Math.min(pWidth, pHeight);
          pHeight = Math.max(temp, pHeight);
        }
        
        if (!isFirstPage) {
          doc.addPage([pWidth, pHeight], finalOrientation);
        } else {
          isFirstPage = false;
          doc.deletePage(1);
          doc.addPage([pWidth, pHeight], finalOrientation);
        }
        
        const marginMm = img2pdfMargin === 'none' ? 0 : img2pdfMargin === 'thin' ? 10 : 20;
        const usableWidth = pWidth - (marginMm * 2);
        const usableHeight = pHeight - (marginMm * 2);
        const pageRatio = usableWidth / usableHeight;
        
        let drawWidth = usableWidth;
        let drawHeight = usableHeight;
        
        if (imgRatio > pageRatio) {
          drawWidth = usableWidth;
          drawHeight = usableWidth / imgRatio;
        } else {
          drawHeight = usableHeight;
          drawWidth = usableHeight * imgRatio;
        }
        
        const xOffset = marginMm + (usableWidth - drawWidth) / 2;
        const yOffset = marginMm + (usableHeight - drawHeight) / 2;
        
        doc.addImage(imgInfo.dataUrl, 'JPEG', xOffset, yOffset, drawWidth, drawHeight);
      }
      
      setConvertProgress('Menyimpan file PDF...');
      const outputName = img2pdfFileName.toLowerCase().endsWith('.pdf') ? img2pdfFileName : `${img2pdfFileName}.pdf`;
      doc.save(outputName);
      
      showToast('Gambar berhasil dikonversi ke PDF!');
      setImageQueue([]);
    } catch (err: any) {
      console.error('Image to PDF error:', err);
      showToast(`Gagal: ${err.message || 'Error tidak diketahui'}`);
    } finally {
      setConverting(false);
      setConvertProgress('');
    }
  };

  // Reorder queue utils
  const moveUp = (queue: QueueItem[], setQueue: Dispatch<SetStateAction<QueueItem[]>>, index: number) => {
    if (index === 0) return;
    const newQueue = [...queue];
    const temp = newQueue[index];
    newQueue[index] = newQueue[index - 1];
    newQueue[index - 1] = temp;
    setQueue(newQueue);
  };

  const moveDown = (queue: QueueItem[], setQueue: Dispatch<SetStateAction<QueueItem[]>>, index: number) => {
    if (index === queue.length - 1) return;
    const newQueue = [...queue];
    const temp = newQueue[index];
    newQueue[index] = newQueue[index + 1];
    newQueue[index + 1] = temp;
    setQueue(newQueue);
  };

  const removeFromQueue = (setQueue: Dispatch<SetStateAction<QueueItem[]>>, id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  // Filters calculation for Tab 1
  const allCategories = ['Semua', ...Array.from(new Set(files.map(f => f.category)))] as string[];

  const filteredFiles = files.filter(file => {
    const isImage = file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
    const isPdf = file.name.match(/\.(pdf)$/i) != null;
    const typeMatch = 
      selectedType === 'Semua' ||
      (selectedType === 'Gambar' && isImage) ||
      (selectedType === 'PDF' && isPdf);
    const categoryMatch = selectedCategory === 'Semua' || file.category === selectedCategory;
    const searchMatch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && categoryMatch && searchMatch;
  });

  const displayCategories = (selectedCategory === 'Semua' 
    ? Array.from(new Set(filteredFiles.map(f => f.category)))
    : [selectedCategory]) as string[];

  // PDF Merger available servers
  const availablePDFs = files.filter(file => {
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const matchesSearch = file.name.toLowerCase().includes(pdfSearchQuery.toLowerCase());
    const isNotAlreadyInQueue = !mergeQueue.some(q => q.url === file.url);
    return isPdf && matchesSearch && isNotAlreadyInQueue;
  });

  // Image to PDF available servers
  const availableImages = files.filter(file => {
    const isImg = file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
    const matchesSearch = file.name.toLowerCase().includes(imageSearchQuery.toLowerCase());
    const isNotAlreadyInQueue = !imageQueue.some(q => q.url === file.url);
    return isImg && matchesSearch && isNotAlreadyInQueue;
  });

  return {
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
  };
}
