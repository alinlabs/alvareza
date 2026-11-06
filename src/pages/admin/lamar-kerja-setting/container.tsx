import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Send,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { GasAccountConfig } from '../../../types/gasSender';
import { useScrollLock } from '../../../utils/scrollLock';
import { GasSenderService } from '../../../services/gasSenderService';
import { GasSettingsModalProps } from './types';

export const GasSettingsContainer: React.FC<GasSettingsModalProps> = ({
  isOpen,
  onClose,
  onAccountsUpdated,
}) => {
  const [accounts, setAccounts] = useState<GasAccountConfig[]>([]);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [visibleUrls, setVisibleUrls] = useState<Record<string, boolean>>({});
  const [expandedUrls, setExpandedUrls] = useState<Record<string, boolean>>({});

  useScrollLock(isOpen, 'modal-setting');

  // Load initial accounts
  useEffect(() => {
    if (isOpen) {
      const loadedAccounts = GasSenderService.getAccounts();
      setAccounts(loadedAccounts);
      setTestResults({});
      setExpandedUrls({}); // Default: all URL inputs collapsed
    }
  }, [isOpen]);

  const toggleShowUrl = (id: string) => {
    setVisibleUrls((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleExpandUrl = (id: string) => {
    setExpandedUrls((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleUrlChange = (id: string, newUrl: string) => {
    const updated = accounts.map((acc) => {
      if (acc.id === id) {
        return {
          ...acc,
          webAppUrl: newUrl.trim(),
          status: (newUrl.trim().length > 10 ? 'ready' : 'needs_url') as any,
        };
      }
      return acc;
    });
    setAccounts(updated);
    GasSenderService.saveAccounts(updated);
    if (onAccountsUpdated) onAccountsUpdated();
  };

  const handleToggleActive = (id: string) => {
    const updated = accounts.map((acc) => {
      if (acc.id === id) {
        return { ...acc, isActive: !acc.isActive };
      }
      return acc;
    });
    setAccounts(updated);
    GasSenderService.saveAccounts(updated);
    if (onAccountsUpdated) onAccountsUpdated();
  };

  const handleTestConnection = async (account: GasAccountConfig) => {
    if (!account.webAppUrl || account.webAppUrl.length < 15) {
      setTestResults((prev) => ({
        ...prev,
        [account.id]: {
          success: false,
          message: 'URL Google Apps Script belum diisi.',
        },
      }));
      return;
    }

    setTestingId(account.id);
    try {
      const result = await GasSenderService.testConnection(account.webAppUrl);
      setTestResults((prev) => ({
        ...prev,
        [account.id]: result,
      }));

      // Update account status in state & storage
      const updated = accounts.map((acc) => {
        if (acc.id === account.id) {
          return {
            ...acc,
            status: (result.success ? 'ready' : 'error') as any,
            lastError: result.success ? undefined : result.message,
          };
        }
        return acc;
      });
      setAccounts(updated);
      GasSenderService.saveAccounts(updated);
      if (onAccountsUpdated) onAccountsUpdated();
    } finally {
      setTestingId(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="gas-settings-modal-backdrop"
          id="gas-settings-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-md flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 pt-[60px] md:pt-0 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="gas-settings-modal-container"
            id="gas-settings-modal-container"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="w-full md:max-w-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[calc(100vh-60px)] md:max-h-[88vh] overflow-hidden"
          >
            {/* Modal Header Bar */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-900/90">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  Pengaturan Akun
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Konfigurasi 6 akun GAS
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - List Akun Terdaftar */}
            <div className="overflow-y-auto p-4 sm:p-5 flex-1 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Email Terdaftar
                </h3>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {accounts.filter((a) => a.isActive).length}/6 Aktif
                </span>
              </div>

              <div className="space-y-3">
                {accounts.map((acc) => {
                  const testResult = testResults[acc.id];
                  const isTesting = testingId === acc.id;
                  const hasUrl = acc.webAppUrl && acc.webAppUrl.length > 15;
                  const isUrlVisible = visibleUrls[acc.id] || false;
                  const isExpanded = expandedUrls[acc.id] || false;

                  return (
                    <div
                      key={acc.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        acc.isActive
                          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Left: Email & Terkirim */}
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                            {acc.email}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Terkirim: {acc.totalSent || 0}
                          </div>
                        </div>

                        {/* Right: Test GAS Button, Seekbar Toggle & Down Icon */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleTestConnection(acc)}
                            disabled={isTesting || !hasUrl}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                              !hasUrl
                                ? 'text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed'
                                : 'text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border-slate-300 dark:border-slate-700 shadow-2xs cursor-pointer'
                            }`}
                            title="Test"
                          >
                            {isTesting ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin text-blue-600 dark:text-blue-400" />
                                <span>Test</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3 h-3" />
                                <span>Test</span>
                              </>
                            )}
                          </button>

                          {/* Seekbar / Toggle Switch */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={acc.isActive}
                              onChange={() => handleToggleActive(acc.id)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>

                          {/* Icon Down Samping Kanan Seekbar */}
                          <button
                            type="button"
                            onClick={() => toggleExpandUrl(acc.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer shrink-0 ml-0.5"
                            title={isExpanded ? 'Sembunyikan Link URL GAS' : 'Tampilkan Link URL GAS'}
                            aria-label={isExpanded ? 'Sembunyikan Link URL GAS' : 'Tampilkan Link URL GAS'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Input Web App URL */}
                      {isExpanded && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 relative flex items-center animate-in fade-in duration-150">
                          <input
                            type={isUrlVisible ? 'text' : 'password'}
                            value={acc.webAppUrl}
                            onChange={(e) => handleUrlChange(acc.id, e.target.value)}
                            placeholder={`Paste Web App URL dari ${acc.email}`}
                            className="w-full pl-3 pr-9 py-1.5 text-xs rounded-lg border border-slate-200/90 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-colors shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => toggleShowUrl(acc.id)}
                            className="absolute right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors cursor-pointer"
                            title={isUrlVisible ? 'Sembunyikan URL' : 'Tampilkan URL'}
                            aria-label={isUrlVisible ? 'Sembunyikan URL' : 'Tampilkan URL'}
                          >
                            {isUrlVisible ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Test Connection Result Feedback */}
                      {testResult && (
                        <div
                          className={`mt-2 p-2 rounded-lg text-xs flex items-start gap-2 ${
                            testResult.success
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
                              : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                          }`}
                        >
                          {testResult.success ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <span className="font-semibold">{testResult.success ? 'Sukses: ' : 'Error: '}</span>
                            {testResult.message}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const GasSettingsModal = GasSettingsContainer;
export const ModalSetting = GasSettingsContainer;
