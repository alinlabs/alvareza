import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, FileText, X, AlertCircle, History } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { EmailLanguage } from '../../../types/jobApplication';
import { generateTailoredApplicationDraft } from '../../../utils/jobApplicationDraft';
import { formatFileSize } from '../../../utils/gasAttachmentPreview';
import { JobApplySubModals } from './JobApplySubModals';
import { SendingLottieAnimation } from './SendingLottieAnimation';
import { SmartInputSection } from './SmartInputSection';
import { JobFormFields } from './JobFormFields';
import { AttachmentsSection } from './AttachmentsSection';
import { JobApplyFooter } from './JobApplyFooter';
import { JobApplyScanningView } from './JobApplyScanningView';
import { JobApplyStatusAlerts } from './JobApplyStatusAlerts';
import { useJobApplyFlow } from './useJobApplyFlow';
import type { JobApplyModalSheetProps } from './types';

export const JobApplyModalSheet: React.FC<JobApplyModalSheetProps> = (props) => {
  const {
    isOpen,
    onClose,
    selectedFile,
    scanResult,
    isScanning,
    scanStage = 'idle',
    ocrProgress = 0,
    onRescanFile,
    onClearFile,
    error,
  } = props;
  const { setLanguage: setGlobalLanguage } = useLanguage();

  const {
    activeDraftId,
    activeEditingDraft,
    activeModalView,
    activeSenderInfo,
    attachmentInputRef,
    ccEmail,
    companyName,
    copiedAll,
    copiedBody,
    copiedCc,
    copiedEmail,
    copiedSubject,
    coverLetterCity,
    coverLetterDate,
    coverLetterTextAlign,
    customAttachments,
    cvDesignPreset,
    cvHeaderColor,
    cvTextAlign,
    draftCount,
    draftSaveFeedback,
    effectiveCvHeaderColor,
    emailBody,
    emailOption,
    emailSubject,
    fileInputRef,
    gasAccounts,
    gasSendMsg,
    gasSendState,
    handleCopy,
    handleDrop,
    handleEmailOptionChange,
    handleFileChange,
    handleLoadDraftForEdit,
    handleOcrTextChange,
    handleOpenMailClient,
    handlePreviewAcademicPdf,
    handlePreviewCertsPdf,
    handlePreviewCoverLetterPdf,
    handlePreviewCvPdf,
    handlePreviewPortfolioPdf,
    handleQuickTextChange,
    handleRemoveCustomAttachment,
    handleRemoveFile,
    handleResetAcademicToDefault,
    handleResetAllToAuto,
    handleResetCertsToRoleDefault,
    handleResetPortfolioToRoleDefault,
    handleSaveToDraft,
    handleSelectHistoryItemForEdit,
    handleSendViaGas,
    handleToggleAcademicDoc,
    handleToggleCert,
    handleTogglePortfolioSlide,
    highlightDraftId,
    imagePreviewUrl,
    isAttachmentDropOver,
    isColorPrint,
    isCoverLetterCityActive,
    isCoverLetterDateAuto,
    isDraftsModalOpen,
    isDropOver,
    isEmailBodyExpanded,
    isGasHistoryOpen,
    isGasSettingsOpen,
    isImageExpanded,
    isPresetAuto,
    isPreviewingAcademic,
    isPreviewingCerts,
    isPreviewingCoverLetter,
    isPreviewingCv,
    isPreviewingPortfolio,
    isResettingAll,
    isSubjectAuto,
    jobDesk,
    jobTitle,
    keyRequirements,
    kualifikasi,
    language,
    ocrResultText,
    processUploadedFiles,
    quickInputText,
    recipientEmail,
    refreshSenderInfo,
    selectedAcademicIds,
    selectedCertIds,
    selectedCvPreset,
    selectedPortfolioSlideIds,
    sendProgress,
    sendingSenderEmail,
    setActiveDraftId,
    setActivePreviewModal,
    setCcEmail,
    setCompanyName,
    setCoverLetterCity,
    setCoverLetterDate,
    setCoverLetterTextAlign,
    setCustomAttachments,
    setCvDesignPreset,
    setCvHeaderColor,
    setCvTextAlign,
    setDraftCount,
    setEmailBody,
    setEmailSubject,
    setImagePreviewUrl,
    setIsAttachmentDropOver,
    setIsColorPrint,
    setIsCoverLetterCityActive,
    setIsCoverLetterDateAuto,
    setIsDraftsModalOpen,
    setIsDropOver,
    setIsEmailBodyExpanded,
    setIsGasHistoryOpen,
    setIsGasSettingsOpen,
    setIsImageExpanded,
    setIsPresetAuto,
    setIsSubjectAuto,
    setJobDesk,
    setJobTitle,
    setKeyRequirements,
    setKualifikasi,
    setLanguage,
    setOcrResultText,
    setQuickInputText,
    setRecipientEmail,
    setRecipientPhone,
    setSelectedAcademicIds,
    setSelectedCvPreset,
    setShowAcademicBreakdown,
    setShowCcField,
    setShowCertsBreakdown,
    setShowCoverLetterBreakdown,
    setShowCvBreakdown,
    setShowJobDetailFields,
    setShowPortfolioBreakdown,
    setTargetCertIdForPick,
    showAcademicBreakdown,
    showCcField,
    showCertsBreakdown,
    showCoverLetterBreakdown,
    showCvBreakdown,
    showJobDetailFields,
    showPortfolioBreakdown,
    isPortfolioCompressed,
    setIsPortfolioCompressed,
    resolvedApplicantEmail,
    triggerFileInput
  } = useJobApplyFlow(props);

  return (
    <AnimatePresence mode="wait">
      {activeModalView === 'apply' && (
        <motion.div
          key="modal-view-apply-backdrop"
          id="job-apply-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-slate-950/10 backdrop-blur-md flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 pt-[60px] md:pt-0 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (activeEditingDraft) {
                setActiveDraftId(null);
                setIsDraftsModalOpen(true);
              } else {
                onClose();
              }
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            aria-label="Pilih flyer lowongan kerja"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Main Container: Mobile Bottom Sheet (rounded-t-3xl) vs Desktop Centered Modal (rounded-2xl) */}
          <motion.div
            key="modal-view-apply-container"
            id="job-apply-modal-container"
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full md:max-w-2xl bg-white text-slate-800 rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[calc(100vh-60px)] md:max-h-[88vh] overflow-hidden"
          >
            {/* Header Bar */}
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/80">
              <div className="flex items-center gap-2.5 min-w-0">
                {activeEditingDraft && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDraftId(null);
                      setIsDraftsModalOpen(true);
                    }}
                    className="p-1 -ml-1 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Kembali ke Daftar Draf"
                    aria-label="Kembali ke Daftar Draf"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                    {isScanning
                      ? 'Scan Gambar'
                      : gasSendState === 'generating' || gasSendState === 'sending'
                      ? 'Mengirimkan Lamaran'
                      : activeEditingDraft
                      ? 'Edit Draft'
                      : 'Lamar Kerja'}
                  </h2>
                  <p className="text-xs text-slate-500 truncate">
                    {isScanning
                      ? 'Mengekstrak informasi lowongan...'
                      : gasSendState === 'generating' || gasSendState === 'sending'
                      ? 'Sedang memproses pengiriman...'
                      : activeEditingDraft
                      ? 'Perbarui data draf lamaran'
                      : 'Otomatisasi Mail'}
                  </p>
                </div>
              </div>

              {!isScanning && (gasSendState !== 'generating' && gasSendState !== 'sending') && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Tombol Draf Lamaran & Riwayat Pengiriman (Hanya tampil saat mode buat lamaran baru) */}
                  {!activeEditingDraft && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsDraftsModalOpen(true)}
                        className="relative p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                        title={`Draf Lamaran (${draftCount} tersimpan)`}
                        aria-label="Draf Lamaran"
                      >
                        <FileText className="w-5 h-5" />
                        {draftCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                            {draftCount > 99 ? '99+' : draftCount}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsGasHistoryOpen(true)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                        title="Riwayat Pengiriman Email"
                        aria-label="Riwayat Pengiriman Email"
                      >
                        <History className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (activeEditingDraft) {
                        setActiveDraftId(null);
                        setIsDraftsModalOpen(true);
                      } else {
                        onClose();
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                    aria-label={activeEditingDraft ? 'Kembali ke Daftar Draf' : 'Tutup modal'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Modal / Sheet Body */}
            <div className="relative overflow-y-auto p-4 sm:p-5 space-y-3.5 min-h-[220px]">
              {/* Sending State: Only Lottie Animation, Title, & Subtitle */}
              {(gasSendState === 'generating' || gasSendState === 'sending') ? (
                <div className="py-10 px-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-200 min-h-[300px]">
                  <SendingLottieAnimation
                    className="w-44 h-44 sm:w-52 sm:h-52"
                    senderEmail={sendingSenderEmail || activeSenderInfo?.account.email || 'halo.alvareza@gmail.com'}
                  />
                </div>
              ) : (
                <>
                  {/* Smart Teks Input & OCR Image Pick Button */}
                  <SmartInputSection
                    isScanning={isScanning}
                    activeEditingDraft={activeEditingDraft}
                    quickInputText={quickInputText}
                    setQuickInputText={setQuickInputText}
                    handleQuickTextChange={handleQuickTextChange}
                    triggerFileInput={triggerFileInput}
                    handleDrop={handleDrop}
                    isDropOver={isDropOver}
                    setIsDropOver={setIsDropOver}
                    isImageExpanded={isImageExpanded}
                    setIsImageExpanded={setIsImageExpanded}
                    imagePreviewUrl={imagePreviewUrl}
                    ocrResultText={ocrResultText}
                    handleOcrTextChange={handleOcrTextChange}
                    handleRemoveFile={handleRemoveFile}
                    handleCopy={handleCopy}
                    copiedAll={copiedAll}
                  />

                  {/* Scanning State */}
                  <JobApplyScanningView
                    isScanning={isScanning}
                    imagePreviewUrl={imagePreviewUrl}
                    scanStage={scanStage}
                    ocrProgress={ocrProgress}
                  />

                  {/* Error Notice if any */}
                  {!isScanning && error && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Catatan:</span> Menggunakan draf asistensi cerdas berbasis data CV Alvareza. Anda dapat mengedit detail di bawah.
                      </div>
                    </div>
                  )}

                  {/* Form Fields - Perfectly uniform 14px (space-y-3.5) vertical spacing */}
                  {!isScanning && (
                    <div className="space-y-3.5">
                      <JobFormFields
                        companyName={companyName}
                        setCompanyName={setCompanyName}
                        jobTitle={jobTitle}
                        setJobTitle={setJobTitle}
                        jobDesk={jobDesk}
                        setJobDesk={setJobDesk}
                        kualifikasi={kualifikasi}
                        setKualifikasi={setKualifikasi}
                        showJobDetailFields={showJobDetailFields}
                        setShowJobDetailFields={setShowJobDetailFields}
                        isPresetAuto={isPresetAuto}
                        setIsPresetAuto={setIsPresetAuto}
                        selectedCvPreset={selectedCvPreset}
                        setSelectedCvPreset={setSelectedCvPreset}
                        onPresetChangeWithDraft={(newPreset) => {
                          setSelectedCvPreset(newPreset);
                          const combinedReqs = [
                            ...keyRequirements,
                            ...(kualifikasi ? kualifikasi.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.length > 3) : []),
                            ...(jobDesk ? jobDesk.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.length > 3) : []),
                          ];
                          const draft = generateTailoredApplicationDraft({
                            companyName: companyName.trim(),
                            jobTitle: jobTitle.trim(),
                            recipientEmail: recipientEmail.trim() || 'recruitment@perusahaan.com',
                            keyRequirements: combinedReqs,
                            tone: 'concise',
                            language,
                            presetKey: newPreset,
                          });
                          setEmailBody(draft.emailBody);
                        }}
                        recipientEmail={recipientEmail}
                        setRecipientEmail={setRecipientEmail}
                        ccEmail={ccEmail}
                        setCcEmail={setCcEmail}
                        showCcField={showCcField}
                        setShowCcField={setShowCcField}
                        emailSubject={emailSubject}
                        setEmailSubject={setEmailSubject}
                        isSubjectAuto={isSubjectAuto}
                        setIsSubjectAuto={setIsSubjectAuto}
                        emailBody={emailBody}
                        isEmailBodyExpanded={isEmailBodyExpanded}
                        setIsEmailBodyExpanded={setIsEmailBodyExpanded}
                        copiedEmail={copiedEmail}
                        copiedCc={copiedCc}
                        copiedSubject={copiedSubject}
                        copiedBody={copiedBody}
                        handleCopy={handleCopy}
                        activeDraftId={activeDraftId}
                      />

                      {/* SECTION: Paket Dokumen Terpadu Otomatis (Curriculum Vitae, Akademik, Portofolio, Sertifikasi, Lampiran Tambahan) */}
                      <AttachmentsSection
                        selectedCvPreset={selectedCvPreset}
                        setSelectedCvPreset={setSelectedCvPreset}
                        setIsPresetAuto={setIsPresetAuto}
                        onPresetChangeWithDraft={(newPreset) => {
                          const draft = generateTailoredApplicationDraft({
                            companyName: companyName.trim(),
                            jobTitle: jobTitle.trim(),
                            recipientEmail: recipientEmail.trim() || 'recruitment@perusahaan.com',
                            keyRequirements,
                            tone: 'concise',
                            language,
                            presetKey: newPreset,
                          });
                          setEmailBody(draft.emailBody);
                        }}
                        cvDesignPreset={cvDesignPreset}
                        setCvDesignPreset={setCvDesignPreset}
                        cvHeaderColor={cvHeaderColor}
                        setCvHeaderColor={setCvHeaderColor}
                        cvTextAlign={cvTextAlign}
                        setCvTextAlign={setCvTextAlign}
                        handlePreviewCvPdf={handlePreviewCvPdf}
                        isPreviewingCv={isPreviewingCv}
                        onOpenCvPreviewModal={() => setActivePreviewModal('cv')}
                        showCvBreakdown={showCvBreakdown}
                        setShowCvBreakdown={setShowCvBreakdown}
                        showCoverLetterBreakdown={showCoverLetterBreakdown}
                        setShowCoverLetterBreakdown={setShowCoverLetterBreakdown}
                        coverLetterDate={coverLetterDate}
                        setCoverLetterDate={setCoverLetterDate}
                        isCoverLetterDateAuto={isCoverLetterDateAuto}
                        setIsCoverLetterDateAuto={setIsCoverLetterDateAuto}
                        coverLetterCity={coverLetterCity}
                        setCoverLetterCity={setCoverLetterCity}
                        isCoverLetterCityActive={isCoverLetterCityActive}
                        setIsCoverLetterCityActive={setIsCoverLetterCityActive}
                        coverLetterTextAlign={coverLetterTextAlign}
                        setCoverLetterTextAlign={setCoverLetterTextAlign}
                        handlePreviewCoverLetterPdf={handlePreviewCoverLetterPdf}
                        isPreviewingCoverLetter={isPreviewingCoverLetter}
                        onOpenCoverLetterPreviewModal={() => setActivePreviewModal('surat-lamaran')}
                        emailBody={emailBody}
                        copiedBody={copiedBody}
                        handleCopy={handleCopy}
                        isColorPrint={isColorPrint}
                        setIsColorPrint={setIsColorPrint}
                        jobTitle={jobTitle}
                        jobDesk={jobDesk}
                        kualifikasi={kualifikasi}
                        rawText={[ocrResultText, quickInputText, ...(keyRequirements || [])].filter(Boolean).join(' ')}
                        language={language}
                        onSelectLanguage={(targetLang: EmailLanguage) => {
                          if (targetLang === language) return;
                          setLanguage(targetLang);
                          setGlobalLanguage(targetLang === 'en' ? 'en' : 'in');
                          const draft = generateTailoredApplicationDraft({
                            companyName: companyName.trim(),
                            jobTitle: jobTitle.trim(),
                            recipientEmail: recipientEmail.trim() || 'recruitment@perusahaan.com',
                            keyRequirements,
                            tone: 'concise',
                            language: targetLang,
                            presetKey: selectedCvPreset,
                          });
                          setEmailBody(draft.emailBody);
                        }}
                        onToggleLanguage={() => {
                          const nextLang: EmailLanguage = language === 'in' ? 'en' : 'in';
                          setLanguage(nextLang);
                          setGlobalLanguage(nextLang);
                          const draft = generateTailoredApplicationDraft({
                            companyName: companyName.trim(),
                            jobTitle: jobTitle.trim(),
                            recipientEmail: recipientEmail.trim() || 'recruitment@perusahaan.com',
                            keyRequirements,
                            tone: 'concise',
                            language: nextLang,
                            presetKey: selectedCvPreset,
                          });
                          setEmailBody(draft.emailBody);
                        }}
                        selectedAcademicIds={selectedAcademicIds}
                        showAcademicBreakdown={showAcademicBreakdown}
                        setShowAcademicBreakdown={setShowAcademicBreakdown}
                        handlePreviewAcademicPdf={handlePreviewAcademicPdf}
                        isPreviewingAcademic={isPreviewingAcademic}
                        onOpenAcademicPreviewModal={() => selectedAcademicIds.length > 0 && setActivePreviewModal('akademik')}
                        handleToggleAcademicDoc={handleToggleAcademicDoc}
                        onResetAcademic={handleResetAcademicToDefault}
                        selectedPortfolioSlideIds={selectedPortfolioSlideIds}
                        showPortfolioBreakdown={showPortfolioBreakdown}
                        setShowPortfolioBreakdown={setShowPortfolioBreakdown}
                        handlePreviewPortfolioPdf={handlePreviewPortfolioPdf}
                        isPreviewingPortfolio={isPreviewingPortfolio}
                        onOpenPortfolioPreviewModal={() => setActivePreviewModal('portofolio')}
                        handleTogglePortfolioSlide={handleTogglePortfolioSlide}
                        onResetPortfolio={handleResetPortfolioToRoleDefault}
                        isPortfolioCompressed={isPortfolioCompressed}
                        setIsPortfolioCompressed={setIsPortfolioCompressed}
                        selectedCertIds={selectedCertIds}
                        showCertsBreakdown={showCertsBreakdown}
                        setShowCertsBreakdown={setShowCertsBreakdown}
                        handlePreviewCertsPdf={handlePreviewCertsPdf}
                        isPreviewingCerts={isPreviewingCerts}
                        onOpenCertsPreviewModal={() => setActivePreviewModal('sertifikasi')}
                        handleToggleCert={handleToggleCert}
                        onResetCerts={handleResetCertsToRoleDefault}
                        customAttachments={customAttachments}
                        handleRemoveCustomAttachment={handleRemoveCustomAttachment}
                        processUploadedFiles={processUploadedFiles}
                        setTargetCertIdForPick={setTargetCertIdForPick}
                        attachmentInputRef={attachmentInputRef}
                        isAttachmentDropOver={isAttachmentDropOver}
                        setIsAttachmentDropOver={setIsAttachmentDropOver}
                        formatFileSize={formatFileSize}
                      />
                    </div>
                  )}

                  {/* SECTION: Status Pengiriman & Feedback */}
                  <JobApplyStatusAlerts
                    isScanning={isScanning}
                    gasSendState={gasSendState}
                    gasSendMsg={gasSendMsg}
                    sendingSenderEmail={sendingSenderEmail}
                    activeSenderEmail={activeSenderInfo?.account.email}
                    recipientEmail={recipientEmail}
                    onOpenGasSettings={() => setIsGasSettingsOpen(true)}
                  />
                </>
              )}
            </div>

            {/* Action Buttons Footer */}
            {!isScanning && (
              <JobApplyFooter
                gasSendState={gasSendState}
                sendProgress={sendProgress}
                emailOption={emailOption}
                handleEmailOptionChange={handleEmailOptionChange}
                gasAccounts={gasAccounts}
                handleSaveToDraft={handleSaveToDraft}
                draftSaveFeedback={draftSaveFeedback}
                activeEditingDraft={activeEditingDraft}
                handleOpenMailClient={handleOpenMailClient}
                handleSendViaGas={handleSendViaGas}
                handleResetAllToAuto={handleResetAllToAuto}
                isResettingAll={isResettingAll}
              />
            )}
          </motion.div>
        </motion.div>
      )}

      {activeModalView && activeModalView !== 'apply' && (
        <motion.div
          key={`submodal-view-${activeModalView}`}
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 pointer-events-auto"
        >
          <JobApplySubModals
            activeModalView={activeModalView}
            isGasSettingsOpen={isGasSettingsOpen}
            setIsGasSettingsOpen={setIsGasSettingsOpen}
            refreshSenderInfo={refreshSenderInfo}
            isGasHistoryOpen={isGasHistoryOpen}
            setIsGasHistoryOpen={setIsGasHistoryOpen}
            handleSelectHistoryItemForEdit={handleSelectHistoryItemForEdit}
            isDraftsModalOpen={isDraftsModalOpen}
            setIsDraftsModalOpen={setIsDraftsModalOpen}
            setDraftCount={setDraftCount}
            setActiveDraftId={setActiveDraftId}
            handleLoadDraftForEdit={handleLoadDraftForEdit}
            highlightDraftId={highlightDraftId}
            setQuickInputText={setQuickInputText}
            setCompanyName={setCompanyName}
            setJobTitle={setJobTitle}
            setJobDesk={setJobDesk}
            setKualifikasi={setKualifikasi}
            setRecipientEmail={setRecipientEmail}
            setCcEmail={setCcEmail}
            setShowCcField={setShowCcField}
            setRecipientPhone={setRecipientPhone}
            setOcrResultText={setOcrResultText}
            setImagePreviewUrl={setImagePreviewUrl}
            setIsImageExpanded={setIsImageExpanded}
            setKeyRequirements={setKeyRequirements}
            setEmailSubject={setEmailSubject}
            setIsSubjectAuto={setIsSubjectAuto}
            setSelectedCvPreset={setSelectedCvPreset}
            setIsPresetAuto={setIsPresetAuto}
            setCoverLetterCity={setCoverLetterCity}
            setCoverLetterDate={setCoverLetterDate}
            setSelectedAcademicIds={setSelectedAcademicIds}
            setIsColorPrint={setIsColorPrint}
            setCustomAttachments={setCustomAttachments}
            setEmailBody={setEmailBody}
            setActivePreviewModal={setActivePreviewModal}
            applicantEmail={resolvedApplicantEmail}
            selectedCvPreset={selectedCvPreset}
            cvDesignPreset={cvDesignPreset}
            effectiveCvHeaderColor={effectiveCvHeaderColor}
            cvTextAlign={cvTextAlign}
            language={language}
            jobTitle={jobTitle}
            companyName={companyName}
            jobDesk={jobDesk}
            kualifikasi={kualifikasi}
            ocrResultText={ocrResultText}
            quickInputText={quickInputText}
            keyRequirements={keyRequirements}
            setLanguage={setLanguage}
            setGlobalLanguage={setGlobalLanguage}
            coverLetterDate={coverLetterDate}
            coverLetterCity={coverLetterCity}
            isCoverLetterCityActive={isCoverLetterCityActive}
            setIsCoverLetterCityActive={setIsCoverLetterCityActive}
            coverLetterTextAlign={coverLetterTextAlign}
            setCvHeaderColor={setCvHeaderColor}
            setCoverLetterTextAlign={setCoverLetterTextAlign}
            selectedAcademicIds={selectedAcademicIds}
            isColorPrint={isColorPrint}
            selectedPortfolioSlideIds={selectedPortfolioSlideIds}
            isPortfolioCompressed={isPortfolioCompressed}
            selectedCertIds={selectedCertIds}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

