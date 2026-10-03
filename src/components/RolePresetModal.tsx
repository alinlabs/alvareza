import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Filter, ChevronLeft } from 'lucide-react';
import { ROLE_PRESET_GROUPS, RolePresetOption } from '../data/rolePresetsConfig';

interface RolePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'id' | 'en';
  roleSearchQuery: string;
  setRoleSearchQuery: (val: string) => void;
  filteredRoleOptions: RolePresetOption[];
  activePreset: string | null;
  applyPreset: (preset: string) => void;
}

export const RolePresetModal: React.FC<RolePresetModalProps> = ({
  isOpen,
  onClose,
  language,
  roleSearchQuery,
  setRoleSearchQuery,
  filteredRoleOptions,
  activePreset,
  applyPreset,
}) => {
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
  const [isSearchActive, setIsSearchActive] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="role-preset-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 w-full h-full min-h-[100dvh] flex items-end sm:items-center justify-center bg-slate-950/10 backdrop-blur-md p-0 sm:py-6 px-0 sm:px-6 pt-[60px] sm:pt-0"
        >
          {/* Backdrop dismiss */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Container */}
          <motion.div
            key="role-preset-modal-container"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full max-w-6xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-60px)] sm:h-auto sm:max-h-[90vh] z-10"
          >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 relative">
          <div className="flex items-center justify-between gap-3 h-9">
            {!isSearchActive ? (
              /* Title on left */
              <h3 className="text-base font-bold text-slate-900 truncate">
                {language === 'en' ? 'Role Preset' : 'Preset Peran'}
              </h3>
            ) : (
              /* Transformed Search Bar replacing title - clean input without inner icons */
              <div className="relative flex-1 min-w-0 animate-in fade-in slide-in-from-right-2 duration-150">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={roleSearchQuery}
                  onChange={(e) => setRoleSearchQuery(e.target.value)}
                  placeholder={language === 'en' ? 'Search position or keywords...' : 'Cari posisi target atau kata kunci...'}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0062E3]"
                />
              </div>
            )}

            {/* Top Action Icons */}
            <div className="flex items-center gap-1 shrink-0">
              {!isSearchActive && (
                <button
                  type="button"
                  onClick={() => setIsSearchActive(true)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer relative ${
                    roleSearchQuery
                      ? 'bg-blue-50 text-[#0062E3] border border-blue-200'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                  }`}
                  title={language === 'en' ? 'Search' : 'Cari'}
                >
                  <Search className="w-4.5 h-4.5" />
                  {roleSearchQuery && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#0062E3] rounded-full border-2 border-white" />
                  )}
                </button>
              )}

              {/* Filter Dropdown Button */}
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className={`p-2 rounded-xl transition-colors cursor-pointer relative ${
                  selectedGroup
                    ? 'bg-blue-50 text-[#0062E3] border border-blue-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                }`}
                title={language === 'en' ? 'Filter by category' : 'Filter berdasarkan kategori'}
              >
                <Filter className="w-4.5 h-4.5" />
                {selectedGroup && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#0062E3] rounded-full border-2 border-white" />
                )}
              </button>

              {/* Action Button: X (Close modal) OR ChevronLeft (Exit search) */}
              {!isSearchActive ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  title={language === 'en' ? 'Close' : 'Tutup'}
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchActive(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  title={language === 'en' ? 'Back' : 'Kembali'}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Full-width Category Filter Popup Menu */}
          {isFilterDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsFilterDropdownOpen(false)}
              />
              <div className="absolute left-3 right-3 sm:left-5 sm:right-5 top-full mt-1.5 max-h-72 overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200 z-30 p-2 animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    setSelectedGroup(null);
                    setIsFilterDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedGroup === null
                      ? 'bg-blue-50 text-[#0062E3]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {language === 'en' ? 'All Categories' : 'Semua Kategori'}
                </button>
                <div className="h-px bg-slate-100 my-1" />
                {ROLE_PRESET_GROUPS.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSelectedGroup(group.id);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors truncate ${
                      selectedGroup === group.id
                        ? 'bg-blue-50 text-[#0062E3]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {language === 'en' ? group.titleEn : group.titleId}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Role Options List Grouped by Field / Industry */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-6 flex-1">
          {filteredRoleOptions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs sm:text-sm">
              {language === 'en' ? 'No roles match your search filter' : 'Tidak ada preset peran yang cocok dengan pencarian Anda'}
            </div>
          ) : (
            ROLE_PRESET_GROUPS.filter(g => selectedGroup ? g.id === selectedGroup : true).map((group) => {
              const groupItems = filteredRoleOptions.filter((item) => item.groupKey === group.id);
              if (groupItems.length === 0) return null;
              
              return (
                <div key={group.id} className="space-y-2.5 pt-1">
                  {/* Group Header / Section Divider */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                      {language === 'en' ? group.titleEn : group.titleId}
                    </h4>
                  </div>
                  
                  {/* Group Items Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {groupItems.map((item) => {
                      const isSelected = activePreset === item.key;
                      return (
                        <div
                          key={item.key}
                          onClick={() => {
                            // Using as any to bypass strictly typed preset if needed, or import type
                            applyPreset(item.key as any);
                            onClose();
                          }}
                          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? 'bg-blue-50/60 border-[#0062E3] ring-1 ring-[#0062E3] shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-xs sm:text-sm font-bold leading-snug flex-1 min-w-0 ${isSelected ? 'text-[#0062E3]' : 'text-slate-900'}`}>
                                {language === 'en' ? item.titleEn : item.titleId}
                              </span>
                              <span className={`shrink-0 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md border tracking-wider uppercase self-start ${
                                isSelected
                                  ? 'bg-[#0062E3] text-white border-[#0062E3]'
                                  : 'bg-slate-800 text-white border-slate-800'
                              }`}>
                                {item.code}
                              </span>
                            </div>
                            
                            <div className="mt-1.5 text-[11px] sm:text-xs leading-relaxed text-slate-600">
                              <span className="font-bold text-slate-700 mr-1">
                                {language === 'en' ? 'Posisi:' : 'Posisi:'}
                              </span>
                              <span>
                                {(language === 'en' ? item.positionsEn : item.positionsId)
                                  .split(',')
                                  .map((p) => p.trim())
                                  .filter(Boolean)
                                  .join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
