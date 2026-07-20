import React from 'react';
import { motion } from 'motion/react';
import { Search, Filter, File as FileIcon, FileText, Eye } from 'lucide-react';
import { BerkasFile } from './type';
import PdfThumbnail from '../../../components/PdfThumbnail';

interface BerkasListProps {
  files: BerkasFile[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  allCategories: string[];
  filteredFiles: BerkasFile[];
  displayCategories: string[];
  setSelectedFile: (file: BerkasFile) => void;
}

export function BerkasList({
  files,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  allCategories,
  filteredFiles,
  displayCategories,
  setSelectedFile
}: BerkasListProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari nama berkas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-accent focus:outline-none transition-colors"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-accent focus:outline-none appearance-none cursor-pointer"
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full sm:w-32 px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-accent focus:outline-none appearance-none cursor-pointer"
          >
            <option value="Semua">Semua Tipe</option>
            <option value="Gambar">Gambar</option>
            <option value="PDF">PDF</option>
          </select>
        </div>
      </div>

      <div className="space-y-8 animate-none">
        {displayCategories.map((category, idx) => {
          const catFiles = filteredFiles.filter(f => f.category === category);
          if (catFiles.length === 0) return null;
          
          return (
            <div key={idx} className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2 uppercase tracking-widest">
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {catFiles.map((file, i) => {
                  const isImage = file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
                  const isPdf = file.name.match(/\.(pdf)$/i) != null;
                  return (
                    <motion.div 
                      key={file.url}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i, 8) * 0.03, duration: 0.2 }}
                      onClick={() => setSelectedFile(file)}
                      className="group bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-all duration-300 flex flex-col cursor-pointer"
                    >
                      {isImage ? (
                        <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden shrink-0">
                          <img 
                            src={file.url} 
                            alt={file.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 drop-shadow" />
                          </div>
                        </div>
                      ) : isPdf ? (
                        <div className="aspect-square w-full bg-slate-100/50 dark:bg-slate-950 flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
                          <PdfThumbnail url={file.url} />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center z-20">
                            <Eye className="w-5 h-5 text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100" />
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 relative">
                          <FileIcon className="w-10 h-10 opacity-40" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 drop-shadow" />
                          </div>
                        </div>
                      )}
                      <div className="p-3 flex flex-col flex-1 justify-center">
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate group-hover:text-accent transition-colors" title={file.name}>
                          {file.name}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            Tidak ada berkas yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
