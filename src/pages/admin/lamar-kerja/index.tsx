import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, FileText, X, AlertCircle, History } from 'lucide-react';
import { useLanguage } from '../../../context/bahasa';
import { EmailLanguage } from '../../../types/jobApplication';
import { generateTailoredApplicationDraft } from '../../../utils/draft';
import { formatFileSize } from '../../../utils/google-apps-script/preview';
import { SubModals } from './router-modal';
import { SendingLottieAnimation } from './animasi-kirim';
import { SmartInputSection } from './section-smart-input';
import { JobFormFields } from './form';
import { AttachmentsSection } from './section-lampiran';
import { Footer } from './Footer';
import { StatusAlerts, type ModalSheetProps, type JobApplyModalSheetProps } from './container';
import { useLamarKerjaFlow } from './use-flow';

export const ModalSheet: React.FC<ModalSheetProps> = (props) => {
  const {
    isOpen,
    onClose,
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
    gasAccounts,
    gasSendMsg,
    gasSendState,
    handleCopy,
    handleEmailOptionChange,
    handleLoadDraftForEdit,
    handleOpenMailClient,
    handlePreviewAcademicPdf,
    handlePreviewAwardsPdf,
    handlePreviewCertsPdf,
    handlePreviewCoverLetterPdf,
    handlePreviewCvPdf,
    handlePreviewIdentityPdf,
    handlePreviewPortfolioPdf,
    handleQuickTextChange,
    handleRemoveCustomAttachment,
    handleResetAcademicToDefault,
    handleResetAllToAuto,
    handleResetCertsToRoleDefault,
    handleResetIdentityToDefault,
    handleResetPortfolioToRoleDefault,
    handleSaveToDraft,
    handleSelectHistoryItemForEdit,
    handleSendViaGas,
    handleToggleAcademicDoc,
    handleToggleCert,
    handleToggleIdentityDoc,
    handleTogglePortfolioSlide,
    highlightDraftId,
    imagePreviewUrl,
    isAttachmentDropOver,
    isColorPrint,
    isAcademicGrayscale,
    setIsAcademicGrayscale,
    isAcademicCompressed,
    setIsAcademicCompressed,
    isIdentityColorPrint,
    setIsIdentityColorPrint,
    isIdentityCompressed,
    setIsIdentityCompressed,
    isIdentitySeparatePhotoPrint,
    setIsIdentitySeparatePhotoPrint,
    isIdentityPhotoAsJpg,
    setIsIdentityPhotoAsJpg,
    isPortfolioGrayscale,
    setIsPortfolioGrayscale,
    isPortfolioCompressed,
    setIsPortfolioCompressed,
    isCertsGrayscale,
    setIsCertsGrayscale,
    isCertsCompressed,
    setIsCertsCompressed,
    isAwardsGrayscale,
    isAwardsCompressed,
    isPreviewingAwards,
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
    isPreviewingIdentity,
    isPreviewingPortfolio,
    isResettingAll,
    isSubjectAuto,
    jobDesk,
    jobTitle,
    keyRequirements,
    kualifikasi,
    language,
    processUploadedFiles,
    quickInputText,
    recipientEmail,
    refreshSenderInfo,
    selectedAcademicIds,
    selectedCertIds,
    defaultCertIds,
    selectedCvPreset,
    selectedIdentityIds,
    selectedPortfolioSlideIds,
    defaultPortfolioSlideIds,
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
    setIsAwardsGrayscale,
    setIsAwardsCompressed,
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
    setQuickInputText,
    setRecipientEmail,
    setRecipientPhone,
    setSelectedAcademicIds,
    setSelectedCvPreset,
    setSelectedIdentityIds,
    setShowAcademicBreakdown,
    setShowCcField,
    setShowCertsBreakdown,
    setShowCoverLetterBreakdown,
    setShowCvBreakdown,
    setShowIdentityBreakdown,
    setShowJobDetailFields,
    setShowPortfolioBreakdown,
    showAcademicBreakdown,
    showCcField,
    showCertsBreakdown,
    showCoverLetterBreakdown,
    showCvBreakdown,
    showIdentityBreakdown,
    showJobDetailFields,
    showPortfolioBreakdown,
    setTargetCertIdForPick,
    selectedAwardIds,
    defaultAwardIds,
    setSelectedAwardIds,
    showAwardsBreakdown,
    setShowAwardsBreakdown,
    onResetAwards,
    resolvedApplicantEmail,
    activeDownloadSection,
    setActiveDownloadSection,
  } = useLamarKerjaFlow(props);

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
          className="fixed inset-0 z-50 bg-slate-950/20 dark:bg-black/60 backdrop-blur-md flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 pt-[60px] md:pt-0 overflow-hidden"
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
          {/* Main Container: Mobile Bottom Sheet (rounded-t-3xl) vs Desktop Centered Modal (rounded-2xl) */}
          <motion.div
            key="modal-view-apply-container"
            id="job-apply-modal-container"
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full md:max-w-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[calc(100vh-60px)] md:max-h-[88vh] overflow-hidden"
          >
            {/* Header Bar */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-900/90">
              <div className="flex items-center gap-2.5 min-w-0">
                {activeEditingDraft && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDraftId(null);
                      setIsDraftsModalOpen(true);
                    }}
                    className="p-1 -ml-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Kembali ke Daftar Draf"
                    aria-label="Kembali ke Daftar Draf"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                    {gasSendState === 'generating' || gasSendState === 'sending'
                      ? 'Mengirimkan Lamaran'
                      : activeEditingDraft
                      ? 'Edit Draft'
                      : 'Lamar Kerja'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {gasSendState === 'generating' || gasSendState === 'sending'
                      ? 'Sedang memproses pengiriman...'
                      : activeEditingDraft
                      ? 'Perbarui data draf lamaran'
                      : 'Otomatisasi Mail'}
                  </p>
                </div>
              </div>

              {gasSendState !== 'generating' && gasSendState !== 'sending' && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Tombol Draf Lamaran & Riwayat Pengiriman (Hanya tampil saat mode buat lamaran baru) */}
                  {!activeEditingDraft && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsDraftsModalOpen(true)}
                        className="relative p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title={`Draf Lamaran (${draftCount} tersimpan)`}
                        aria-label="Draf Lamaran"
                      >
                        <FileText className="w-5 h-5" />
                        {draftCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                            {draftCount > 99 ? '99+' : draftCount}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsGasHistoryOpen(true)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
                    className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
                  <SmartInputSection
                    activeEditingDraft={activeEditingDraft}
                    quickInputText={quickInputText}
                    setQuickInputText={setQuickInputText}
                    handleQuickTextChange={handleQuickTextChange}
                  />

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
                        rawText={[quickInputText, ...(keyRequirements || [])].filter(Boolean).join(' ')}
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
                        selectedIdentityIds={selectedIdentityIds}
                        showIdentityBreakdown={showIdentityBreakdown}
                        setShowIdentityBreakdown={setShowIdentityBreakdown}
                        handlePreviewIdentityPdf={handlePreviewIdentityPdf}
                        isPreviewingIdentity={isPreviewingIdentity}
                        onOpenIdentityPreviewModal={() => selectedIdentityIds.length > 0 && setActivePreviewModal('identitas')}
                        handleToggleIdentityDoc={handleToggleIdentityDoc}
                        onResetIdentity={handleResetIdentityToDefault}
                        isIdentityColorPrint={isIdentityColorPrint}
                        setIsIdentityColorPrint={setIsIdentityColorPrint}
                        isIdentityCompressed={isIdentityCompressed}
                        setIsIdentityCompressed={setIsIdentityCompressed}
                        isIdentitySeparatePhotoPrint={isIdentitySeparatePhotoPrint}
                        setIsIdentitySeparatePhotoPrint={setIsIdentitySeparatePhotoPrint}
                        isIdentityPhotoAsJpg={isIdentityPhotoAsJpg}
                        setIsIdentityPhotoAsJpg={setIsIdentityPhotoAsJpg}
                        selectedAcademicIds={selectedAcademicIds}
                        showAcademicBreakdown={showAcademicBreakdown}
                        setShowAcademicBreakdown={setShowAcademicBreakdown}
                        handlePreviewAcademicPdf={handlePreviewAcademicPdf}
                        isPreviewingAcademic={isPreviewingAcademic}
                        onOpenAcademicPreviewModal={() => selectedAcademicIds.length > 0 && setActivePreviewModal('akademik')}
                        handleToggleAcademicDoc={handleToggleAcademicDoc}
                        onResetAcademic={handleResetAcademicToDefault}
                        isAcademicGrayscale={isAcademicGrayscale}
                        setIsAcademicGrayscale={setIsAcademicGrayscale}
                        isAcademicCompressed={isAcademicCompressed}
                        setIsAcademicCompressed={setIsAcademicCompressed}
                        selectedPortfolioSlideIds={selectedPortfolioSlideIds}
                        defaultPortfolioSlideIds={defaultPortfolioSlideIds}
                        showPortfolioBreakdown={showPortfolioBreakdown}
                        setShowPortfolioBreakdown={setShowPortfolioBreakdown}
                        handlePreviewPortfolioPdf={handlePreviewPortfolioPdf}
                        isPreviewingPortfolio={isPreviewingPortfolio}
                        onOpenPortfolioPreviewModal={() => setActivePreviewModal('portofolio')}
                        handleTogglePortfolioSlide={handleTogglePortfolioSlide}
                        onResetPortfolio={handleResetPortfolioToRoleDefault}
                        isPortfolioGrayscale={isPortfolioGrayscale}
                        setIsPortfolioGrayscale={setIsPortfolioGrayscale}
                        isPortfolioCompressed={isPortfolioCompressed}
                        setIsPortfolioCompressed={setIsPortfolioCompressed}
                        selectedCertIds={selectedCertIds}
                        defaultCertIds={defaultCertIds}
                        showCertsBreakdown={showCertsBreakdown}
                        setShowCertsBreakdown={setShowCertsBreakdown}
                        handlePreviewCertsPdf={handlePreviewCertsPdf}
                        isPreviewingCerts={isPreviewingCerts}
                        onOpenCertsPreviewModal={() => setActivePreviewModal('sertifikasi')}
                        handleToggleCert={handleToggleCert}
                        onResetCerts={handleResetCertsToRoleDefault}
                        isCertsGrayscale={isCertsGrayscale}
                        setIsCertsGrayscale={setIsCertsGrayscale}
                        isCertsCompressed={isCertsCompressed}
                        setIsCertsCompressed={setIsCertsCompressed}
                        selectedAwardIds={selectedAwardIds}
                        defaultAwardIds={defaultAwardIds}
                        setSelectedAwardIds={setSelectedAwardIds}
                        showAwardsBreakdown={showAwardsBreakdown}
                        setShowAwardsBreakdown={setShowAwardsBreakdown}
                        onOpenAwardsPreviewModal={() => selectedAwardIds.length > 0 && setActivePreviewModal('penghargaan')}
                        onResetAwards={onResetAwards}
                        isAwardsGrayscale={isAwardsGrayscale}
                        setIsAwardsGrayscale={setIsAwardsGrayscale}
                        isAwardsCompressed={isAwardsCompressed}
                        setIsAwardsCompressed={setIsAwardsCompressed}
                        handlePreviewAwardsPdf={handlePreviewAwardsPdf}
                        isPreviewingAwards={isPreviewingAwards}
                        customAttachments={customAttachments}
                        handleRemoveCustomAttachment={handleRemoveCustomAttachment}
                        processUploadedFiles={processUploadedFiles}
                        setTargetCertIdForPick={setTargetCertIdForPick}
                        attachmentInputRef={attachmentInputRef}
                        isAttachmentDropOver={isAttachmentDropOver}
                        setIsAttachmentDropOver={setIsAttachmentDropOver}
                      />
                    </div>

                  {/* SECTION: Status Pengiriman & Feedback */}
                  <StatusAlerts
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
            <Footer
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
          <SubModals
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
            setImagePreviewUrl={setImagePreviewUrl}
            setIsImageExpanded={setIsImageExpanded}
            setKeyRequirements={setKeyRequirements}
            setEmailSubject={setEmailSubject}
            setIsSubjectAuto={setIsSubjectAuto}
            setSelectedCvPreset={setSelectedCvPreset}
            setIsPresetAuto={setIsPresetAuto}
            setCoverLetterCity={setCoverLetterCity}
            setCoverLetterDate={setCoverLetterDate}
            setSelectedIdentityIds={setSelectedIdentityIds}
            setIsIdentityColorPrint={setIsIdentityColorPrint}
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
            selectedIdentityIds={selectedIdentityIds}
            isIdentityColorPrint={isIdentityColorPrint}
            isIdentitySeparatePhotoPrint={isIdentitySeparatePhotoPrint}
            isIdentityPhotoAsJpg={isIdentityPhotoAsJpg}
            isIdentityCompressed={isIdentityCompressed}
            selectedAcademicIds={selectedAcademicIds}
            isColorPrint={isColorPrint}
            isAcademicGrayscale={isAcademicGrayscale}
            isAcademicCompressed={isAcademicCompressed}
            selectedPortfolioSlideIds={selectedPortfolioSlideIds}
            isPortfolioGrayscale={isPortfolioGrayscale}
            isPortfolioCompressed={isPortfolioCompressed}
            selectedCertIds={selectedCertIds}
            isCertsGrayscale={isCertsGrayscale}
            isCertsCompressed={isCertsCompressed}
            selectedAwardIds={selectedAwardIds}
            isAwardsGrayscale={isAwardsGrayscale}
            isAwardsCompressed={isAwardsCompressed}
            activeDownloadSection={activeDownloadSection}
            setActiveDownloadSection={setActiveDownloadSection}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const JobApplyModalSheet = ModalSheet;
export default ModalSheet;

// Module Barrel Re-exports
export * from './container';
export * from './Comboboxes';
export * from './Footer';
export * from './router-modal';
export * from './use-flow';
export * from './use-state';
export * from './use-attachments';
export * from './use-preview';
export * from './use-dispatcher';
export * from '../lamar-kerja-draft';
export * from '../lamar-kerja-history';
export * from './form';
export * from './section-body-email';
export * from './animasi-kirim';
export * from './section-smart-input';
export * from './section-lampiran';
export * from './section-surat-lamaran';
export * from './section-kontrol-cv';
export * from './section-sertifikat';
export * from './section-penghargaan';
export * from './section-berkas-kustom';
export { AcademicSection as LamarKerjaAcademicSection } from './section-akademik';
export { IdentitySection as LamarKerjaIdentitySection } from './section-identitas';
export { PortfolioSection as LamarKerjaPortfolioSection } from './section-portofolio';
export * from '../pdf-preview/cv';
export * from '../pdf-preview/akademik';
export * from '../pdf-preview/portofolio';
export * from '../pdf-preview/sertifikasi';

