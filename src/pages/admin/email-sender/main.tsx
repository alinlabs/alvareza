import React from 'react';
import { createPortal } from 'react-dom';
import { Send, Eye, X, Download } from 'lucide-react';
import { useEmailSenderLogic } from './logic';
import EmailSenderForm from './form';
import EmailSenderPreview from './preview';
import Tracker from './Tracker';
import Templates from './Templates';
import EmailTemplates from './email-templates';

export default function EmailSender() {
  const state = useEmailSenderLogic();
  const {
    activeTab,
    setActiveTab,
    drafts,
    isPreviewModalOpen,
    setIsPreviewModalOpen,
    desktopActionTarget,
    handleDownloadPDF,
    renderedHTML,
    positionName,
    companyName
  } = state;

  const headerActions = (
    <div className="flex items-center gap-3 w-full justify-end">
      {/* Tabs */}
      {!isPreviewModalOpen && (
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('editor')}
            className={`whitespace-nowrap px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'editor' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Buat Email
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`whitespace-nowrap px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'status' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Status
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`whitespace-nowrap px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'templates' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Cover Letter
          </button>
          <button
            onClick={() => setActiveTab('email-templates')}
            className={`whitespace-nowrap px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'email-templates' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Email Template
          </button>
        </div>
      )}
      
      {/* Download PDF Button */}
      {isPreviewModalOpen && (
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={!renderedHTML}
          className="text-[10px] sm:text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm shrink-0"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Unduh PDF</span>
        </button>
      )}

      {/* Back Button */}
      {isPreviewModalOpen && (
        <button
          onClick={() => setIsPreviewModalOpen(false)}
          className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent font-bold text-xs rounded-lg transition-colors cursor-pointer border border-accent/20 shrink-0"
        >
          <X className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      )}
    </div>
  );

  return (
    <div id="admin-email-sender-page" className="space-y-6 md:space-y-6 w-full">
      {/* Desktop Portal Actions */}
      {desktopActionTarget && createPortal(
        headerActions,
        desktopActionTarget
      )}

      {/* Header */}
      <div className="md:hidden flex flex-col gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Send className="w-7 h-7 text-accent" />
            Utilitas Karir
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personalisasi lamaran, kelola tracker, dan kirim berkas kerja secara instan ke kontak email HRD
          </p>
        </div>
        {headerActions}
      </div>

      {!isPreviewModalOpen ? (
        activeTab === 'editor' ? (
          <div className="grid grid-cols-1 gap-8 items-start">
            <EmailSenderForm state={state} />
          </div>
        ) : activeTab === 'status' ? (
          <div className="w-full">
            <Tracker 
              type="status" 
              onSendBulk={state.handleSendBulk} 
              isBulkSending={state.isBulkSending} 
              onCancelSend={state.handleCancelSend}
              onEditDraft={state.handleEditDraft}
            />
          </div>
        ) : activeTab === 'templates' ? (
          <div className="w-full">
            <Templates />
          </div>
        ) : activeTab === 'email-templates' ? (
          <div className="w-full">
            <EmailTemplates />
          </div>
        ) : (
          <EmailSenderPreview state={state} />
        )
      ) : (
        <EmailSenderPreview state={state} />
      )}
    </div>
  );
}
