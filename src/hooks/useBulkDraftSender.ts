import React, { useState, useRef, useEffect } from 'react';
import { JobApplicationDraftItem, BulkSendProgressState } from '../types/jobDraft';
import { JobDraftService } from '../services/jobDraftService';
import { GasSenderService } from '../services/gasSenderService';
import {
  generateCvPdfAttachment,
  generatePortfolioPdfAttachment,
  generateCertificatesPdfAttachment,
} from '../utils/gasAttachmentGenerator';
import { getAcademicAttachments } from '../data/academicDocs';

interface UseBulkDraftSenderProps {
  drafts: JobApplicationDraftItem[];
  delaySeconds: number;
  onRefreshDrafts: () => void;
}

export function useBulkDraftSender({
  drafts,
  delaySeconds,
  onRefreshDrafts,
}: UseBulkDraftSenderProps) {
  const [sendingDraftId, setSendingDraftId] = useState<string | null>(null);

  const [bulkState, setBulkState] = useState<BulkSendProgressState>({
    isActive: false,
    isPaused: false,
    total: 0,
    currentIndex: 0,
    successCount: 0,
    failedCount: 0,
    countdownSeconds: 0,
    delayBetweenSends: 8,
  });

  const bulkCancelledRef = useRef<boolean>(false);
  const bulkPausedRef = useRef<boolean>(false);
  const isExecutingRef = useRef<boolean>(false);

  // Sync delay to bulk state
  useEffect(() => {
    setBulkState((prev) => ({ ...prev, delayBetweenSends: delaySeconds }));
  }, [delaySeconds]);

  // Clean up if component unmounts
  useEffect(() => {
    return () => {
      bulkCancelledRef.current = true;
    };
  }, []);

  /**
   * Helper to execute sending a single draft via GAS
   */
  const executeSendSingleDraft = async (
    draft: JobApplicationDraftItem
  ): Promise<{ success: boolean; error?: string; senderEmail?: string }> => {
    try {
      // 0. Validate Mandatory Fields
      const cleanCompany = (draft.companyName || '').trim();
      const cleanJob = (draft.jobTitle || '').trim();
      const cleanEmail = (draft.recipientEmail || '').trim();

      const missing: string[] = [];
      if (!cleanCompany) missing.push('Nama Perusahaan');
      if (!cleanJob) missing.push('Posisi Pekerjaan');
      if (!cleanEmail) missing.push('Email Tujuan');

      if (missing.length > 0) {
        return {
          success: false,
          error: `Draf belum lengkap: Kolom ${missing.join(', ')} wajib diisi.`,
        };
      }

      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        return {
          success: false,
          error: 'Format Email Tujuan pada draf ini tidak valid.',
        };
      }

      // 1. Resolve sender account
      let targetAccount = GasSenderService.getNextSenderAccount()?.account;
      if (draft.emailOption && draft.emailOption !== 'auto_rotate' && draft.emailOption !== 'mailto') {
        const accounts = GasSenderService.getAccounts();
        const found = accounts.find((a) => a.id === draft.emailOption || a.email === draft.emailOption);
        if (found && found.webAppUrl) {
          targetAccount = found;
        }
      }

      if (!targetAccount || !targetAccount.webAppUrl) {
        return {
          success: false,
          error: 'URL Google Apps Script belum dikonfigurasi di pengaturan GAS.',
        };
      }

      // 2. Generate PDF Attachments
      const attachments = [];

      // CV ATS PDF
      const cvAttachment = generateCvPdfAttachment({
        preset: draft.presetKey || 'optimal',
        language: draft.language || 'id',
        jobTitle: draft.jobTitle,
        companyName: draft.companyName,
        headerColor: draft.cvHeaderColor || '#0062E3',
        designPreset: draft.cvDesignPreset || 'block',
        textAlign: draft.cvTextAlign || 'left',
      });
      attachments.push(cvAttachment);

      // Dokumen Akademik jika ada (otomatis digabung jika keduanya dipilih)
      if (draft.selectedAcademicIds && draft.selectedAcademicIds.length > 0) {
        const academicAtts = await getAcademicAttachments(draft.selectedAcademicIds);
        for (const att of academicAtts) {
          attachments.push(att);
        }
      }

      // Portofolio jika ada
      if (draft.selectedPortfolioSlideIds && draft.selectedPortfolioSlideIds.length > 0) {
        const portAtt = await generatePortfolioPdfAttachment({
          preset: draft.presetKey || 'optimal',
          selectedSlideIds: draft.selectedPortfolioSlideIds,
          jobTitle: draft.jobTitle,
        });
        attachments.push(portAtt);
      }

      // Sertifikasi jika ada
      if (draft.selectedCertIds && draft.selectedCertIds.length > 0) {
        const certAtt = await generateCertificatesPdfAttachment({
          preset: draft.presetKey || 'optimal',
          selectedCertIds: draft.selectedCertIds,
          jobTitle: draft.jobTitle,
        });
        attachments.push(certAtt);
      }

      // 3. Format Subject
      const finalSubject =
        draft.subject ||
        (draft.jobTitle
          ? `Lamaran Pekerjaan: ${draft.jobTitle} - Alvareza Hilka Pratama`
          : 'Lamaran Pekerjaan - Alvareza Hilka Pratama');

      // 4. Send via GAS
      const response = await GasSenderService.sendEmail(
        {
          gasUrl: targetAccount.webAppUrl,
          accountId: targetAccount.id,
          targetEmail: draft.recipientEmail,
          companyName: draft.companyName,
          jobTitle: draft.jobTitle,
          subject: finalSubject,
          body: draft.emailBody,
          cc: draft.ccEmail,
          attachments,
        },
        targetAccount
      );

      if (response.success) {
        // Hapus draf dari daftar draf karena sudah berhasil dikirim dan tersimpan di Riwayat (History)
        JobDraftService.deleteDraft(draft.id);
        return { success: true, senderEmail: response.senderEmail || targetAccount.email };
      } else {
        const err = response.error || response.message || 'Gagal mengirim email via GAS';
        JobDraftService.updateDraft(draft.id, {
          status: 'failed',
          lastError: err,
        });
        return { success: false, error: err };
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Terjadi kesalahan teknis saat mengirim email.';
      JobDraftService.updateDraft(draft.id, {
        status: 'failed',
        lastError: errMsg,
      });
      return { success: false, error: errMsg };
    }
  };

  /**
   * Send single draft from list button
   */
  const handleSendSingle = async (draft: JobApplicationDraftItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sendingDraftId || bulkState.isActive) return;

    setSendingDraftId(draft.id);
    JobDraftService.updateDraft(draft.id, { status: 'sending' });
    onRefreshDrafts();

    const result = await executeSendSingleDraft(draft);
    setSendingDraftId(null);
    onRefreshDrafts();

    if (result.success) {
      alert(`Lamaran ke ${draft.companyName || draft.recipientEmail} berhasil terkirim via ${result.senderEmail}!`);
    } else {
      alert(`Pengiriman gagal: ${result.error}`);
    }
  };

  /**
   * Sequential Bulk Sender with Anti-Spam Tempo Engine
   */
  const handleStartBulkSend = async () => {
    const queue = [...drafts];
    if (queue.length === 0) {
      alert('Tidak ada draf dalam daftar yang dapat dikirim.');
      return;
    }

    bulkCancelledRef.current = false;
    bulkPausedRef.current = false;
    isExecutingRef.current = true;

    setBulkState({
      isActive: true,
      isPaused: false,
      total: queue.length,
      currentIndex: 0,
      successCount: 0,
      failedCount: 0,
      currentDraftId: queue[0].id,
      currentDraftName: `${queue[0].companyName || 'Perusahaan'} (${queue[0].jobTitle || 'Posisi'})`,
      countdownSeconds: 0,
      delayBetweenSends: delaySeconds,
    });

    // Mark all queue items as queued
    queue.forEach((item) => {
      JobDraftService.updateDraft(item.id, { status: 'queued' });
    });
    onRefreshDrafts();

    let success = 0;
    let failed = 0;

    for (let i = 0; i < queue.length; i++) {
      if (bulkCancelledRef.current) break;

      // Handle Pause state
      while (bulkPausedRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (bulkCancelledRef.current) break;
      }
      if (bulkCancelledRef.current) break;

      const currentDraft = queue[i];

      setBulkState((prev) => ({
        ...prev,
        currentIndex: i + 1,
        currentDraftId: currentDraft.id,
        currentDraftName: `${currentDraft.companyName || 'Perusahaan'} (${currentDraft.jobTitle || 'Posisi'})`,
        countdownSeconds: 0,
      }));

      // Set item to sending
      JobDraftService.updateDraft(currentDraft.id, { status: 'sending' });
      onRefreshDrafts();

      // Execute send
      const sendResult = await executeSendSingleDraft(currentDraft);

      if (sendResult.success) {
        success++;
      } else {
        failed++;
      }

      setBulkState((prev) => ({
        ...prev,
        successCount: success,
        failedCount: failed,
      }));
      onRefreshDrafts();

      // If not the last item and not cancelled, run countdown tempo delay
      if (i < queue.length - 1 && !bulkCancelledRef.current) {
        for (let s = delaySeconds; s > 0; s--) {
          if (bulkCancelledRef.current) break;
          while (bulkPausedRef.current) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (bulkCancelledRef.current) break;
          }
          if (bulkCancelledRef.current) break;

          setBulkState((prev) => ({
            ...prev,
            countdownSeconds: s,
          }));
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    isExecutingRef.current = false;
    setBulkState((prev) => ({
      ...prev,
      isActive: false,
      isPaused: false,
      countdownSeconds: 0,
    }));
    onRefreshDrafts();
  };

  const handlePauseBulk = () => {
    bulkPausedRef.current = true;
    setBulkState((prev) => ({ ...prev, isPaused: true }));
  };

  const handleResumeBulk = () => {
    bulkPausedRef.current = false;
    setBulkState((prev) => ({ ...prev, isPaused: false }));
  };

  const handleCancelBulk = () => {
    bulkCancelledRef.current = true;
    bulkPausedRef.current = false;
    isExecutingRef.current = false;
    setBulkState((prev) => ({
      ...prev,
      isActive: false,
      isPaused: false,
      countdownSeconds: 0,
    }));
    onRefreshDrafts();
  };

  return {
    bulkState,
    sendingDraftId,
    handleStartBulkSend,
    handlePauseBulk,
    handleResumeBulk,
    handleCancelBulk,
    handleSendSingle,
  };
}
