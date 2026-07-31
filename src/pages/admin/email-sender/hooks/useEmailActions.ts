import React, { useRef } from 'react';
import { ApiService } from '../../../../services/api';
import { generateAndDownloadPDF } from '../../../../utils/pdfGenerator';
import { generateAtsCvDoc } from '../../../../utils/atsCvGenerator';
import { useFormState } from './useFormState';
import { EmailDraft } from '../type';
import { JobApplication } from '../tracker';
import { defaultImagesMap } from '../utils/defaultImagesMap';
import { generatePdfFromImages } from '../../../../utils/imgToPdf';
import { getCityFromAlamat } from '../utils/parser';
import { mergePdfDocuments, mergeAndOptimizePdfDocuments, optimizeSinglePdfBlob, ensureTotalAttachmentsUnderLimit } from '../utils/document';

function getCustomOrder(key: string, defaultOrder: string[]): string[] {
  try {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return defaultOrder;
}

export function useEmailActions(formState: ReturnType<typeof useFormState>) {
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleCancelSend = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    formState.setIsSending(false);
    formState.setIsBulkSending(false); // Make sure to toggle isBulkSending if formState manages it
  };

  const logToTracker = async () => {
    const role = formState.recipientRole === 'Lainnya' 
      ? (formState.customRecipientRole || 'HRD') 
      : (formState.recipientRole || 'HRD');
      
    const addressedToVal = formState.recipientName 
      ? `${formState.recipientName} (${role})` 
      : role;

    const attachmentsVal = formState.attachedFilesList.map(f => f.label);
    const locationToSend = formState.includeBio 
      ? getCityFromAlamat(formState.bioAlamat) 
      : formState.senderLocation;

    const newJob: JobApplication = {
      id: `job-${Date.now()}`,
      companyName: formState.companyName,
      positionName: formState.positionName,
      createdAt: new Date().toISOString(),
      targetEmail: formState.targetEmail,
      addressedTo: addressedToVal,
      subject: formState.subjectPreview,
      attachedFiles: attachmentsVal.join(', '),
      body: formState.bodyPreview,
      status: 'terkirim',
      location: locationToSend
    };

    await ApiService.post('email-sender', newJob);
  };

  const handleProcessMergePdfs = async (overrideSignal?: AbortSignal): Promise<boolean> => {
    if (formState.attachedFilesList.length === 0) {
      formState.setPreparedPdfs([]);
      return true;
    }

    formState.setIsPreparingPdf(true);
    formState.setPreparePdfProgress(10);
    formState.setPreparePdfStatusMsg('Mulai menggabungkan PDF...');

    const controller = overrideSignal ? null : new AbortController();
    if (controller) {
      abortControllerRef.current = controller;
    }
    const signal = overrideSignal || controller!.signal;

    try {
      const docsToAttach = [
        { id: 'cv', option: formState.cvOption, file: formState.cvFile, defaultUrl: '/gambar/cv/cv-blue-2026.webp', defaultName: formState.cvName, label: 'Curriculum Vitae' },
        { id: 'portofolio', option: formState.portofolioOption, file: formState.portofolioFile, defaultUrl: '/gambar/portofolio/app-hr1.webp', defaultName: formState.portofolioName, label: 'Portofolio' },
        { id: 'paklaring', option: formState.paklaringOption, file: formState.paklaringFile, defaultUrl: '/gambar/paklaring/gmg.webp', defaultName: formState.paklaringName, label: 'Paklaring' },
        { id: 'ijazah', option: formState.ijazahOption, file: formState.ijazahFile, defaultUrl: '/gambar/sertifikat/akademis1.webp', defaultName: formState.ijazahName, label: 'Ijazah & Transkrip Nilai' },
        { id: 'akademik', option: formState.sertifikatKompetensiAkademikOption, file: formState.sertifikatKompetensiAkademikFile, defaultUrl: '/gambar/sertifikat/akademis1.webp', defaultName: formState.sertifikatKompetensiAkademikName, label: 'Sertifikat Kompetensi Akademik' },
        { id: 'bisnis', option: formState.sertifikatKompetensiBisnisDigitalOption, file: formState.sertifikatKompetensiBisnisDigitalFile, defaultUrl: '/gambar/sertifikat/bisnis-digital1.webp', defaultName: formState.sertifikatKompetensiBisnisDigitalName, label: 'Sertifikat Kompetensi Bisnis dan Digital' },
        { id: 'kepemimpinan', option: formState.sertifikatKompetensiKepemimpinanOption, file: formState.sertifikatKompetensiKepemimpinanFile, defaultUrl: '/gambar/sertifikat/kepemimpinan1.webp', defaultName: formState.sertifikatKompetensiKepemimpinanName, label: 'Sertifikat Kompetensi Kepemimpinan' },
        { id: 'speaking', option: formState.sertifikatKompetensiPublicSpeakingOption, file: formState.sertifikatKompetensiPublicSpeakingFile, defaultUrl: '/gambar/sertifikat/public-speaking1.webp', defaultName: formState.sertifikatKompetensiPublicSpeakingName, label: 'Sertifikat Kompetensi Public Speaking' },
        { id: 'prestasi', option: formState.sertifikatPrestasiOption, file: formState.sertifikatPrestasiFile, defaultUrl: '/gambar/sertifikat/prestasi1.webp', defaultName: formState.sertifikatPrestasiName, label: 'Sertifikat Prestasi' },
      ];

      const gatheredAttachments: { id: string; blob: Blob; filename: string; subtype?: string }[] = [];

      if (formState.cvAtsOption === 'default') {
        try {
          formState.setPreparePdfStatusMsg('Membangun PDF: CV ATS...');
          if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
          const { doc, filename } = await generateAtsCvDoc(signal);
          const blob = doc.output('blob');
          gatheredAttachments.push({ id: 'cv_ats', blob, filename });
        } catch (e: any) {
          if (e.name === 'AbortError') throw e;
          console.error("Gagal membuat CV ATS:", e);
        }
      }

      for (const doc of docsToAttach) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        if (doc.id === 'portofolio') {
          if (doc.option === 'upload' && doc.file) {
            gatheredAttachments.push({ id: 'portofolio', blob: doc.file, filename: doc.file.name, subtype: 'text' });
          } else if (doc.option === 'default') {
            const activeSubtypes = formState.portofolioSubtype ? formState.portofolioSubtype.split(',').filter(Boolean) : [];
            for (const subtype of activeSubtypes) {
              const imgKey = `portofolio_${subtype}`;
              const images = defaultImagesMap[imgKey];
              let filename = doc.defaultName;
              if (subtype === 'app_hr') filename = 'Portofolio_App_HRD.pdf';
              else if (subtype === 'app_logistik') filename = 'Portofolio_App_Logistik_Ops.pdf';
              else if (subtype === 'app_marketing') filename = 'Portofolio_App_Marketing.pdf';
              else if (subtype === 'text') filename = 'Detail_Pengalaman_Kerja.pdf';

              if (images && images.length > 0) {
                formState.setPreparePdfStatusMsg(`Membangun PDF Portofolio: ${filename}...`);
                const blob = await generatePdfFromImages(images, signal);
                gatheredAttachments.push({ id: 'portofolio', blob, filename, subtype });
              }
            }
          }
        } else {
          if (doc.option === 'upload' && doc.file) {
            gatheredAttachments.push({ id: doc.id, blob: doc.file, filename: doc.file.name });
          } else if (doc.option === 'default') {
            try {
              const images = defaultImagesMap[doc.id];
              if (images && images.length > 0) {
                formState.setPreparePdfStatusMsg(`Membangun PDF dari gambar: ${doc.defaultName}...`);
                const blob = await generatePdfFromImages(images, signal);
                gatheredAttachments.push({ id: doc.id, blob, filename: doc.defaultName });
              } else {
                formState.setPreparePdfStatusMsg(`Mengunduh berkas: ${doc.defaultName}...`);
                const defaultRes = await fetch(doc.defaultUrl, { signal });
                if (defaultRes.ok) {
                  const blob = await defaultRes.blob();
                  gatheredAttachments.push({ id: doc.id, blob, filename: doc.defaultName });
                }
              }
            } catch (fetchErr: any) {
              if (fetchErr.name === 'AbortError') throw fetchErr;
              console.error("Gagal mendapatkan lampiran default", doc.id, fetchErr);
            }
          }
        }
      }

      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      formState.setPreparePdfProgress(50);

      const preparedAttachments: { blob: Blob; filename: string }[] = [];

      if (formState.mergeAttachments === 'all' && gatheredAttachments.length > 0) {
        formState.setPreparePdfStatusMsg('Menggabungkan seluruh PDF menjadi satu berkas...');
        const cvOrder = getCustomOrder('career_order_cv', ['cv', 'cv_ats']);
        const pengalamanOrder = getCustomOrder('career_order_pengalaman', ['paklaring', 'portofolio_text']);
        const sertifikatOrder = getCustomOrder('career_order_sertifikat', ['ijazah', 'akademik', 'bisnis', 'prestasi', 'kepemimpinan', 'speaking']);
        const portofolioAppOrder = getCustomOrder('career_order_portofolio', ['portofolio_app_hr', 'portofolio_app_logistik', 'portofolio_app_marketing']);

        const fullCombinedOrder = [...cvOrder, ...pengalamanOrder, ...sertifikatOrder, ...portofolioAppOrder];
        gatheredAttachments.sort((a, b) => {
          const keyA = a.id === 'portofolio' ? `portofolio_${a.subtype}` : a.id;
          const keyB = b.id === 'portofolio' ? `portofolio_${b.subtype}` : b.id;
          const indexA = fullCombinedOrder.indexOf(keyA);
          const indexB = fullCombinedOrder.indexOf(keyB);
          return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        });

        const mergedBlob = await mergePdfDocuments(gatheredAttachments, signal);
        const optMergedBlob = await optimizeSinglePdfBlob(mergedBlob, 5000, signal);
        preparedAttachments.push({ blob: optMergedBlob, filename: 'Berkas_Alvareza_Hilka_Pratama.pdf' });

      } else if (formState.mergeAttachments === 'optimal' && gatheredAttachments.length > 0) {
        formState.setPreparePdfStatusMsg('Mengelompokkan & Mengoptimalkan PDF...');
        
        const cvOrder = getCustomOrder('career_order_cv', ['cv', 'cv_ats']);
        const pengalamanOrder = getCustomOrder('career_order_pengalaman', ['paklaring', 'portofolio_text']);
        const sertifikatOrder = getCustomOrder('career_order_sertifikat', ['ijazah', 'akademik', 'bisnis', 'prestasi', 'kepemimpinan', 'speaking']);
        const portofolioAppOrder = getCustomOrder('career_order_portofolio', ['portofolio_app_hr', 'portofolio_app_logistik', 'portofolio_app_marketing']);

        const cvGroup = gatheredAttachments.filter(a => ['cv', 'cv_ats'].includes(a.id));
        cvGroup.sort((a, b) => cvOrder.indexOf(a.id) - cvOrder.indexOf(b.id));

        const pengalamanGroup = gatheredAttachments.filter(a => a.id === 'paklaring' || (a.id === 'portofolio' && a.subtype === 'text'));
        pengalamanGroup.sort((a, b) => {
          const keyA = a.id === 'paklaring' ? 'paklaring' : 'portofolio_text';
          const keyB = b.id === 'paklaring' ? 'paklaring' : 'portofolio_text';
          return pengalamanOrder.indexOf(keyA) - pengalamanOrder.indexOf(keyB);
        });

        const sertifikatGroup = gatheredAttachments.filter(a => ['ijazah', 'akademik', 'bisnis', 'prestasi', 'kepemimpinan', 'speaking'].includes(a.id));
        sertifikatGroup.sort((a, b) => sertifikatOrder.indexOf(a.id) - sertifikatOrder.indexOf(b.id));

        const portofolioAppGroup = gatheredAttachments.filter(a => a.id === 'portofolio' && a.subtype !== 'text');
        portofolioAppGroup.sort((a, b) => {
          const keyA = `portofolio_${a.subtype}`;
          const keyB = `portofolio_${b.subtype}`;
          return portofolioAppOrder.indexOf(keyA) - portofolioAppOrder.indexOf(keyB);
        });

        const handledIds = new Set([
          ...cvGroup.map(a => a.id),
          ...pengalamanGroup.map(a => a.id),
          ...sertifikatGroup.map(a => a.id),
          ...portofolioAppGroup.map(a => a.id)
        ]);
        const others = gatheredAttachments.filter(a => !handledIds.has(a.id));

        if (cvGroup.length > 1) {
          formState.setPreparePdfStatusMsg('Menggabungkan CV (Maks. 500 KB)...');
          const mergedCv = await mergeAndOptimizePdfDocuments(cvGroup, 500, signal);
          preparedAttachments.push({ blob: mergedCv, filename: 'CV.pdf' });
        } else if (cvGroup.length === 1) {
          const optCv = await optimizeSinglePdfBlob(cvGroup[0].blob, 500, signal);
          preparedAttachments.push({ blob: optCv, filename: 'CV.pdf' });
        }

        if (pengalamanGroup.length > 1) {
          formState.setPreparePdfStatusMsg('Menggabungkan Bukti Pengalaman Kerja (Maks. 1.5 MB)...');
          const mergedPengalaman = await mergeAndOptimizePdfDocuments(pengalamanGroup, 1500, signal);
          preparedAttachments.push({ blob: mergedPengalaman, filename: 'pengalaman.pdf' });
        } else if (pengalamanGroup.length === 1) {
          const optPengalaman = await optimizeSinglePdfBlob(pengalamanGroup[0].blob, 1500, signal);
          preparedAttachments.push({ blob: optPengalaman, filename: 'pengalaman.pdf' });
        }

        if (sertifikatGroup.length > 1) {
          formState.setPreparePdfStatusMsg('Menggabungkan Sertifikat Pendukung (Maks. 2 MB)...');
          const mergedSertifikat = await mergeAndOptimizePdfDocuments(sertifikatGroup, 2000, signal);
          preparedAttachments.push({ blob: mergedSertifikat, filename: 'sertifikat.pdf' });
        } else if (sertifikatGroup.length === 1) {
          const optSertifikat = await optimizeSinglePdfBlob(sertifikatGroup[0].blob, 2000, signal);
          preparedAttachments.push({ blob: optSertifikat, filename: 'sertifikat.pdf' });
        }

        if (portofolioAppGroup.length > 1) {
          formState.setPreparePdfStatusMsg('Menggabungkan Portofolio (Maks. 1 MB)...');
          const mergedPortofolioApp = await mergeAndOptimizePdfDocuments(portofolioAppGroup, 1000, signal);
          preparedAttachments.push({ blob: mergedPortofolioApp, filename: 'portofolio.pdf' });
        } else if (portofolioAppGroup.length === 1) {
          const optPortofolio = await optimizeSinglePdfBlob(portofolioAppGroup[0].blob, 1000, signal);
          preparedAttachments.push({ blob: optPortofolio, filename: 'portofolio.pdf' });
        }

        for (const item of others) {
          preparedAttachments.push({ blob: item.blob, filename: item.filename });
        }
      } else {
        for (const item of gatheredAttachments) {
          preparedAttachments.push({ blob: item.blob, filename: item.filename });
        }
      }

      const capped = await ensureTotalAttachmentsUnderLimit(preparedAttachments, 5000, signal);
      formState.setPreparedPdfs(capped);
      formState.setPreparePdfProgress(100);
      formState.setPreparePdfStatusMsg(`✓ ${capped.length} Berkas PDF Siap Kirim`);
      return true;
    } catch (e: any) {
      if (e.name === 'AbortError') return false;
      console.error("Gagal menggabungkan PDF:", e);
      formState.setPreparePdfStatusMsg('Gagal menggabungkan PDF');
      return false;
    } finally {
      formState.setIsPreparingPdf(false);
    }
  };

  const handleDispatch = async (e?: React.FormEvent, isTest: boolean = false) => {
    if (e) e.preventDefault();
    const finalTargetEmail = isTest ? 'alvareza.work@gmail.com' : formState.targetEmail;
    if (!finalTargetEmail || !formState.companyName || !formState.positionName) return;

    formState.setIsSending(true);
    formState.setSendProgress(0);
    formState.setSendStatusMsg('Menginisiasi pengiriman...');
    formState.setSendError(null);
    formState.setSuccessMsg(false);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
      formState.setSendProgress(10);
      formState.setSendStatusMsg('Menyiapkan data form...');
      await new Promise(resolve => setTimeout(resolve, 50));

      const formData = new FormData();
      formData.append('targetEmail', finalTargetEmail);
      if (formState.ccEmail) formData.append('cc', formState.ccEmail);
      if (formState.bccEmail) formData.append('bcc', formState.bccEmail);
      formData.append('subject', formState.subjectPreview);
      formData.append('body', formState.bodyPreview);
      formData.append('bodyFontFamily', formState.bodyFontFamily);
      formData.append('emailFormat', formState.emailFormat);
      formData.append('paragraphAlign', formState.paragraphAlign);
      
      const locationToSend = formState.includeBio ? getCityFromAlamat(formState.bioAlamat) : formState.senderLocation;
      formData.append('location', locationToSend);
      
      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
      formState.setSendProgress(20);
      
      // Use pre-prepared PDFs if already available, otherwise trigger merge now
      let activePdfs = formState.preparedPdfs;
      if (formState.attachedFilesList.length > 0 && !activePdfs) {
        formState.setSendStatusMsg('Menggabungkan berkas PDF sebelum pengiriman...');
        const success = await handleProcessMergePdfs(controller.signal);
        if (!success) {
          throw new Error('Gagal menggabungkan berkas PDF.');
        }
        activePdfs = formState.preparedPdfs;
      }

      formState.setSendProgress(50);

      // Cek apakah ada GAS URL dari localStorage
      let gasWebAppUrl = '';
      try {
        if (typeof window !== 'undefined') {
          gasWebAppUrl = window.localStorage.getItem('gasWebAppUrl') || '';
        }
      } catch (err) {
        console.warn('Gagal mengambil GAS URL dari localStorage:', err);
      }

      if (!gasWebAppUrl || !gasWebAppUrl.startsWith('https://script.google.com/')) {
        throw new Error('Google Apps Script (GAS) Web App URL belum dikonfigurasi. Silakan masuk ke menu Profil & Pengaturan untuk memasukkan URL GAS Web App Anda terlebih dahulu.');
      }

      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
      formState.setSendProgress(60);

      let response: Response;
      
      formState.setSendStatusMsg('Mempersiapkan template HTML email...');
      
      let compiledHtml = formState.renderedHTML;
      if (!compiledHtml) {
        try {
          const previewRes = await fetch('/api/preview-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              body: formState.bodyPreview, 
              bodyFontFamily: formState.bodyFontFamily, 
              emailFormat: formState.emailFormat, 
              paragraphAlign: formState.paragraphAlign,
              location: formState.includeBio ? getCityFromAlamat(formState.bioAlamat) : formState.senderLocation
            })
          });
          const data = await previewRes.json();
          if (previewRes.ok && data.html) {
            compiledHtml = data.html;
          }
        } catch (err) {
          console.error("Gagal compile HTML email on-the-fly:", err);
        }
      }
      if (!compiledHtml) {
        compiledHtml = formState.bodyPreview;
      }

      formState.setSendStatusMsg('Mengirim email via Google Apps Script (Bypass Nginx Limit)...');
      
      // Prepare payload for GAS (JSON with Base64 attachments)
      const payload: any = {
        targetEmail: finalTargetEmail,
        cc: formState.ccEmail || '',
        bcc: formState.bccEmail || '',
        subject: formState.subjectPreview,
        bodyHtml: compiledHtml,
        attachments: []
      };

      if (activePdfs && activePdfs.length > 0) {
        formState.setSendStatusMsg('Mengkonversi dokumen ke Base64 (GAS Mode)...');
        for (const item of activePdfs) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = reader.result as string;
              resolve(res.split(',')[1]); // get only the base64 string
            };
            reader.onerror = reject;
            reader.readAsDataURL(item.blob);
          });
          payload.attachments.push({
            filename: item.filename,
            mimeType: 'application/pdf',
            base64: base64
          });
        }
      }

      formState.setSendProgress(80);
      response = await fetch(gasWebAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Mencegah preflight OPTIONS CORS yang kompleks
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const textData = await response.text();
      let data: any = {};
      try {
        data = textData ? JSON.parse(textData) : {};
      } catch (e) {
        console.error("Response is not JSON:", textData);
        throw new Error(`Gagal mengirim email: Google Apps Script mengembalikan respons tidak valid.`);
      }

      if (response.ok && data.success !== false) {
        formState.setSendProgress(100);
        formState.setSendStatusMsg('Selesai!');
        formState.setSuccessMsg(true);
        
        // Reset prepared PDFs to return to normal individual file selection view
        formState.setPreparedPdfs(null);

        if (formState.autoLogToTracker && !isTest) {
          await logToTracker();
        }
        
        // Hapus draft yang diedit jika ada
        if (formState.editingDraftId && !isTest) {
          await ApiService.delete('email-sender', { body: JSON.stringify({ id: formState.editingDraftId }) });
          formState.setDrafts(prev => prev.filter(d => d.id !== formState.editingDraftId));
        }

        // Reset form setelah berhasil mengirim email
        formState.resetForm();

        // Pesan sukses hilang setelah 5 detik
        setTimeout(() => {
          formState.setSuccessMsg(false);
          formState.setSendStatusMsg('');
        }, 5000);
      } else {
        throw new Error(data.error || 'Terjadi kesalahan saat mengirim email');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        formState.setSendError('Pengiriman email dibatalkan oleh pengguna.');
      } else {
        formState.setSendError(err.message || 'Gagal mengirim email.');
      }
    } finally {
      formState.setIsSending(false);
      abortControllerRef.current = null;
    }
  };

  const handleSendBulk = async () => {
    // For bulk send, we have a separate state isBulkSending
    // Let's set it in formState
    // First, verify isBulkSending exists or can be set
    // Let's assume we can cast formState as any or implement setter
    const setBulk = (formState as any).setIsBulkSending;
    const setStatusMsg = (formState as any).setSendStatusMsg;
    if (setBulk) setBulk(true);
    
    let sentCount = 0;
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Fetch GAS URL once for bulk send dari localStorage
    let gasWebAppUrl = '';
    try {
      if (typeof window !== 'undefined') {
        gasWebAppUrl = window.localStorage.getItem('gasWebAppUrl') || '';
      }
    } catch (err) {
      console.warn('Gagal mengambil GAS URL dari localStorage (Bulk):', err);
    }
    
    const sentDraftIds: string[] = [];

    for (const draft of (formState.drafts || [])) {
      if (controller.signal.aborted) {
        break;
      }
      let response: Response | undefined;
      try {
        if (setStatusMsg) setStatusMsg(`Memproses pengiriman bulk: ${draft.targetEmail}...`);
        await new Promise(resolve => setTimeout(resolve, 50));

        if (setStatusMsg) setStatusMsg(`Mempersiapkan template HTML email untuk ${draft.targetEmail}...`);
        let compiledHtml = draft.body;
        try {
          const locationToSend = draft.includeBio ? getCityFromAlamat(draft.bioAlamat || '') : (draft.senderLocation || 'Purwakarta');
          const previewRes = await fetch('/api/preview-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              body: draft.body, 
              bodyFontFamily: draft.bodyFontFamily || formState.bodyFontFamily, 
              emailFormat: draft.emailFormat || formState.emailFormat, 
              paragraphAlign: draft.paragraphAlign || formState.paragraphAlign,
              location: locationToSend
            })
          });
          const data = await previewRes.json();
          if (previewRes.ok && data.html) {
            compiledHtml = data.html;
          }
        } catch (err) {
          console.error("Gagal compile HTML email bulk on-the-fly:", err);
        }

        const formData = new FormData();
        formData.append('targetEmail', draft.targetEmail);
        if (draft.ccEmail) formData.append('cc', draft.ccEmail);
        if (draft.bccEmail) formData.append('bcc', draft.bccEmail);
        formData.append('subject', draft.subject);
        formData.append('body', draft.body);
        formData.append('bodyFontFamily', draft.bodyFontFamily || formState.bodyFontFamily);
        formData.append('emailFormat', draft.emailFormat || formState.emailFormat);
        formData.append('paragraphAlign', draft.paragraphAlign || formState.paragraphAlign);
        
        const locationToSend = draft.includeBio ? getCityFromAlamat(draft.bioAlamat || '') : (draft.senderLocation || 'Purwakarta');
        formData.append('location', locationToSend);
        
        const docsToAttach = [
          { id: 'cv', option: draft.cvOption || 'default', defaultUrl: '/gambar/cv/cv-blue-2026.webp', defaultName: 'CV_Alvareza_Hilka_Pratama.pdf', label: 'CV' },
          { id: 'portofolio', option: draft.portofolioOption || 'default', defaultUrl: '/gambar/portofolio/app-hr1.webp', defaultName: 'Portofolio_Alvareza_Hilka_Pratama.pdf', label: 'Portofolio' },
          { id: 'paklaring', option: draft.paklaringOption || 'default', defaultUrl: '/gambar/paklaring/gmg.webp', defaultName: 'Paklaring_Alvareza_Hilka_Pratama.pdf', label: 'Paklaring' },
          { id: 'ijazah', option: draft.ijazahOption || 'default', defaultUrl: '/gambar/sertifikat/akademis1.webp', defaultName: 'Ijazah_Alvareza_Hilka_Pratama.pdf', label: 'Ijazah & Transkrip Nilai' },
          { id: 'akademik', option: draft.sertifikatKompetensiAkademikOption || 'default', defaultUrl: '/gambar/sertifikat/akademis1.webp', defaultName: 'Sertifikat_Kompetensi_Akademik.pdf', label: 'Sertifikat Kompetensi Akademik' },
          { id: 'bisnis', option: draft.sertifikatKompetensiBisnisDigitalOption || 'default', defaultUrl: '/gambar/sertifikat/bisnis-digital1.webp', defaultName: 'Sertifikat_Kompetensi_Bisnis_dan_Digital.pdf', label: 'Sertifikat Kompetensi Bisnis dan Digital' },
          { id: 'kepemimpinan', option: draft.sertifikatKompetensiKepemimpinanOption || 'default', defaultUrl: '/gambar/sertifikat/kepemimpinan1.webp', defaultName: 'Sertifikat_Kompetensi_Kepemimpinan.pdf', label: 'Sertifikat Kompetensi Kepemimpinan' },
          { id: 'speaking', option: draft.sertifikatKompetensiPublicSpeakingOption || 'default', defaultUrl: '/gambar/sertifikat/public-speaking1.webp', defaultName: 'Sertifikat_Kompetensi_Public_Speaking.pdf', label: 'Sertifikat Kompetensi Public Speaking' },
          { id: 'prestasi', option: draft.sertifikatPrestasiOption || 'default', defaultUrl: '/gambar/sertifikat/prestasi1.webp', defaultName: 'Sertifikat_Prestasi.pdf', label: 'Sertifikat Prestasi' },
        ];
        
        const gatheredAttachments: { id: string, blob: Blob, filename: string, subtype?: string }[] = [];
        
        if (draft.cvAtsOption === 'default') {
          try {
            if (setStatusMsg) setStatusMsg('Membangun PDF: CV ATS...');
            await new Promise(resolve => setTimeout(resolve, 50));
            if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
            const { doc, filename } = await generateAtsCvDoc(controller.signal);
            await new Promise(resolve => setTimeout(resolve, 10));
          if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
          const blob = doc.output('blob');
          await new Promise(resolve => setTimeout(resolve, 10));
          if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
            gatheredAttachments.push({ id: 'cv_ats', blob, filename });
          } catch (e: any) {
            if (e.name === 'AbortError') throw e;
            console.error("Gagal membuat CV ATS untuk bulk send draft:", draft.id, e);
          }
        }

        for (const doc of docsToAttach) {
          if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
          if (doc.id === 'portofolio') {
            if (doc.option === 'default') {
              const activeSubtypes = draft.portofolioSubtype ? draft.portofolioSubtype.split(',').filter(Boolean) : [];
              for (const subtype of activeSubtypes) {
                try {
                  const imgKey = `portofolio_${subtype}`;
                  const images = defaultImagesMap[imgKey];
                  let filename = doc.defaultName;
                  if (subtype === 'app_hr') filename = 'Portofolio_App_HRD.pdf';
                  else if (subtype === 'app_logistik') filename = 'Portofolio_App_Logistik_Ops.pdf';
                  else if (subtype === 'app_marketing') filename = 'Portofolio_App_Marketing.pdf';
                  else if (subtype === 'text') filename = 'Detail_Pengalaman_Kerja.pdf';

                  if (images && images.length > 0) {
                    if (setStatusMsg) setStatusMsg(`Membangun Portofolio: ${filename}...`);
                    await new Promise(resolve => setTimeout(resolve, 50));
                    const blob = await generatePdfFromImages(images, controller.signal);
                    gatheredAttachments.push({ id: 'portofolio', blob, filename, subtype });
                  }
                } catch (e: any) {
                  if (e.name === 'AbortError') throw e;
                  console.error("Gagal mendapatkan lampiran default portofolio subtype (bulk)", subtype, e);
                }
              }
            }
          } else {
            if (doc.option === 'default') {
              try {
                const images = defaultImagesMap[doc.id];
                if (images && images.length > 0) {
                  if (setStatusMsg) setStatusMsg(`Membangun dari gambar: ${doc.defaultName}...`);
                  await new Promise(resolve => setTimeout(resolve, 50));
                  const blob = await generatePdfFromImages(images, controller.signal);
                  gatheredAttachments.push({ id: doc.id, blob, filename: doc.defaultName });
                } else {
                  const defaultRes = await fetch(doc.defaultUrl, { signal: controller.signal });
                  if (defaultRes.ok) {
                    const blob = await defaultRes.blob();
                    gatheredAttachments.push({ id: doc.id, blob, filename: doc.defaultName });
                  }
                }
              } catch (e: any) {
                if (e.name === 'AbortError') throw e;
                console.error("Gagal mendapatkan lampiran default (bulk)", doc.id, e);
              }
            }
          }
        }
        
        if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');

        let finalAttachments: { blob: Blob; filename: string }[] = [];

        if (draft.mergeAttachments === 'all' && gatheredAttachments.length > 0) {
          try {
            if (setStatusMsg) setStatusMsg('Menggabungkan seluruh PDF menjadi satu berkas...');
            await new Promise(resolve => setTimeout(resolve, 50));
            const cvOrder = getCustomOrder('career_order_cv', ['cv', 'cv_ats']);
            const pengalamanOrder = getCustomOrder('career_order_pengalaman', ['paklaring', 'portofolio_text']);
            const sertifikatOrder = getCustomOrder('career_order_sertifikat', ['ijazah', 'akademik', 'bisnis', 'prestasi', 'kepemimpinan', 'speaking']);
            const portofolioAppOrder = getCustomOrder('career_order_portofolio', ['portofolio_app_hr', 'portofolio_app_logistik', 'portofolio_app_marketing']);

            const fullCombinedOrder = [
              ...cvOrder,
              ...pengalamanOrder,
              ...sertifikatOrder,
              ...portofolioAppOrder
            ];

            gatheredAttachments.sort((a, b) => {
              const keyA = a.id === 'portofolio' ? `portofolio_${a.subtype}` : a.id;
              const keyB = b.id === 'portofolio' ? `portofolio_${b.subtype}` : b.id;
              const indexA = fullCombinedOrder.indexOf(keyA);
              const indexB = fullCombinedOrder.indexOf(keyB);
              const valA = indexA === -1 ? 999 : indexA;
              const valB = indexB === -1 ? 999 : indexB;
              return valA - valB;
            });

            const mergedBlob = await mergePdfDocuments(gatheredAttachments, controller.signal);
            const optMergedBlob = await optimizeSinglePdfBlob(mergedBlob, 5000, controller.signal);
            finalAttachments.push({ blob: optMergedBlob, filename: 'Berkas_Alvareza_Hilka_Pratama.pdf' });
          } catch (e: any) {
            if (e.name === 'AbortError') throw e;
            console.error("Gagal menggabungkan PDF untuk bulk send:", e);
            const capped = await ensureTotalAttachmentsUnderLimit(gatheredAttachments, 5000, controller.signal);
            finalAttachments = capped;
          }
        } else if (draft.mergeAttachments === 'optimal' && gatheredAttachments.length > 0) {
          try {
            if (setStatusMsg) setStatusMsg('Melakukan pengelompokan (bundling) PDF...');
            await new Promise(resolve => setTimeout(resolve, 50));
            // 1. Group CV
            const cvGroup = gatheredAttachments.filter(a => ['cv', 'cv_ats'].includes(a.id));
            const cvOrder = getCustomOrder('career_order_cv', ['cv', 'cv_ats']);
            cvGroup.sort((a, b) => cvOrder.indexOf(a.id) - cvOrder.indexOf(b.id));
            
            // 2. Group Surat Pengalaman Kerja & Detail Pengalaman Kerja
            const pengalamanGroup = gatheredAttachments.filter(a => 
              a.id === 'paklaring' || (a.id === 'portofolio' && a.subtype === 'text')
            );
            const pengalamanOrder = getCustomOrder('career_order_pengalaman', ['paklaring', 'portofolio_text']);
            pengalamanGroup.sort((a, b) => {
              const keyA = a.id === 'paklaring' ? 'paklaring' : 'portofolio_text';
              const keyB = b.id === 'paklaring' ? 'paklaring' : 'portofolio_text';
              return pengalamanOrder.indexOf(keyA) - pengalamanOrder.indexOf(keyB);
            });
            
            // 3. Group Sertifikat (Ijazah, Akademik, Bisnis, Prestasi, Kepemimpinan, Public Speaking)
            const sertifikatGroup = gatheredAttachments.filter(a => 
              ['ijazah', 'akademik', 'bisnis', 'prestasi', 'kepemimpinan', 'speaking'].includes(a.id)
            );
            const sertifikatOrder = getCustomOrder('career_order_sertifikat', ['ijazah', 'akademik', 'bisnis', 'prestasi', 'kepemimpinan', 'speaking']);
            sertifikatGroup.sort((a, b) => sertifikatOrder.indexOf(a.id) - sertifikatOrder.indexOf(b.id));

            // 4. Group Portofolio Aplikasi (App HRD, App Logistik & Ops, App Marketing)
            const portofolioAppGroup = gatheredAttachments.filter(a => 
              a.id === 'portofolio' && a.subtype !== 'text'
            );
            const portofolioAppOrder = getCustomOrder('career_order_portofolio', ['portofolio_app_hr', 'portofolio_app_logistik', 'portofolio_app_marketing']);
            portofolioAppGroup.sort((a, b) => {
              const keyA = `portofolio_${a.subtype}`;
              const keyB = `portofolio_${b.subtype}`;
              return portofolioAppOrder.indexOf(keyA) - portofolioAppOrder.indexOf(keyB);
            });

            // Track handled IDs
            const handledIds = new Set([
              ...cvGroup.map(a => a.id),
              ...pengalamanGroup.map(a => a.id),
              ...sertifikatGroup.map(a => a.id),
              ...portofolioAppGroup.map(a => a.id),
            ]);

            const others = gatheredAttachments.filter(a => !handledIds.has(a.id));
            const preparedAttachments: { blob: Blob; filename: string }[] = [];

            // Process CV Group (Max 500 KB)
            if (cvGroup.length > 1) {
              if (setStatusMsg) setStatusMsg('Menggabungkan & Mengoptimalkan CV (Maks. 500 KB)...');
              await new Promise(resolve => setTimeout(resolve, 50));
              const mergedCv = await mergeAndOptimizePdfDocuments(cvGroup, 500, controller.signal);
              preparedAttachments.push({ blob: mergedCv, filename: 'CV.pdf' });
            } else if (cvGroup.length === 1) {
              const optCv = await optimizeSinglePdfBlob(cvGroup[0].blob, 500, controller.signal);
              preparedAttachments.push({ blob: optCv, filename: 'CV.pdf' });
            }

            // Process Surat Pengalaman Kerja & Portofolio Kerja Group -> pengalaman.pdf (Max 1.5 MB = 1500 KB)
            if (pengalamanGroup.length > 1) {
              if (setStatusMsg) setStatusMsg('Menggabungkan & Mengoptimalkan Bukti Pengalaman Kerja (Maks. 1.5 MB)...');
              await new Promise(resolve => setTimeout(resolve, 50));
              const mergedPengalaman = await mergeAndOptimizePdfDocuments(pengalamanGroup, 1500, controller.signal);
              preparedAttachments.push({ blob: mergedPengalaman, filename: 'pengalaman.pdf' });
            } else if (pengalamanGroup.length === 1) {
              const optPengalaman = await optimizeSinglePdfBlob(pengalamanGroup[0].blob, 1500, controller.signal);
              preparedAttachments.push({ blob: optPengalaman, filename: 'pengalaman.pdf' });
            }

            // Process Sertifikat Group -> sertifikat.pdf (Max 2 MB = 2000 KB)
            if (sertifikatGroup.length > 1) {
              if (setStatusMsg) setStatusMsg('Menggabungkan & Mengoptimalkan Sertifikat Pendukung (Maks. 2 MB)...');
              await new Promise(resolve => setTimeout(resolve, 50));
              const mergedSertifikat = await mergeAndOptimizePdfDocuments(sertifikatGroup, 2000, controller.signal);
              preparedAttachments.push({ blob: mergedSertifikat, filename: 'sertifikat.pdf' });
            } else if (sertifikatGroup.length === 1) {
              const optSertifikat = await optimizeSinglePdfBlob(sertifikatGroup[0].blob, 2000, controller.signal);
              preparedAttachments.push({ blob: optSertifikat, filename: 'sertifikat.pdf' });
            }

            // Process Portofolio App Group -> portofolio.pdf (Max 1 MB = 1000 KB)
            if (portofolioAppGroup.length > 1) {
              if (setStatusMsg) setStatusMsg('Menggabungkan & Mengoptimalkan Portofolio (Maks. 1 MB)...');
              await new Promise(resolve => setTimeout(resolve, 50));
              const mergedPortofolioApp = await mergeAndOptimizePdfDocuments(portofolioAppGroup, 1000, controller.signal);
              preparedAttachments.push({ blob: mergedPortofolioApp, filename: 'portofolio.pdf' });
            } else if (portofolioAppGroup.length === 1) {
              const optPortofolio = await optimizeSinglePdfBlob(portofolioAppGroup[0].blob, 1000, controller.signal);
              preparedAttachments.push({ blob: optPortofolio, filename: 'portofolio.pdf' });
            }

            for (const item of others) {
              preparedAttachments.push({ blob: item.blob, filename: item.filename });
            }

            // Ensure total combined size strictly stays under 5 MB (5000 KB)
            const capped = await ensureTotalAttachmentsUnderLimit(preparedAttachments, 5000, controller.signal);
            finalAttachments = capped;
          } catch (e: any) {
            if (e.name === 'AbortError') throw e;
            console.error("Gagal menggabungkan PDF optimal untuk bulk send:", e);
            const capped = await ensureTotalAttachmentsUnderLimit(gatheredAttachments, 5000, controller.signal);
            finalAttachments = capped;
          }
        } else {
          const capped = await ensureTotalAttachmentsUnderLimit(gatheredAttachments, 5000, controller.signal);
          finalAttachments = capped;
        }

        if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');

        if (setStatusMsg) setStatusMsg(`Mengirim via GAS: ${draft.targetEmail}...`);
        const payload: any = {
          targetEmail: draft.targetEmail,
          cc: draft.ccEmail || '',
          bcc: draft.bccEmail || '',
          subject: draft.subject,
          bodyHtml: compiledHtml,
          attachments: []
        };
        for (const item of finalAttachments) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(item.blob);
          });
          payload.attachments.push({ filename: item.filename, mimeType: 'application/pdf', base64 });
        }

        response = await fetch(gasWebAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
        
        if (!response) {
          throw new Error('Response is undefined');
        }
        
        const textData = await response.text();
        let data: any = {};
        try {
          data = textData ? JSON.parse(textData) : {};
        } catch(e) {
          console.error("Response is not JSON:", textData);
          throw new Error(`Gagal mengirim ke ${draft.targetEmail}: Server mengembalikan respons tidak valid (mungkin server restart)`);
        }

        if (!response.ok || data.success === false) {
           console.error("Failed to send bulk email:", data);
           throw new Error(`Gagal mengirim ke ${draft.targetEmail} (Error ${response.status}): ${data.error || 'Unknown error'}`);
        }

        sentDraftIds.push(draft.id);
        if (formState.autoLogToTracker) {
           const newJob = {
              id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              companyName: draft.companyName,
              positionName: draft.positionName,
              createdAt: new Date().toISOString(),
              targetEmail: draft.targetEmail,
              addressedTo: 'HRD Team',
              status: 'terkirim',
              subject: draft.subject,
              body: draft.body,
              attachedFiles: 'Bundled Files',
              location: locationToSend
           };
           await ApiService.post('email-sender', newJob);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Bulk send was aborted');
          break;
        }
        if (setStatusMsg) setStatusMsg(`Gagal mengirim ke ${draft.targetEmail}: ${err.message}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait to show error
      }
      sentCount++;
    }
    
    if (setStatusMsg) setStatusMsg(`Selesai! Berhasil mengirim ${sentDraftIds.length} email.`);
    if (sentDraftIds.length > 0) {
      formState.setDrafts(prev => prev.filter(d => !sentDraftIds.includes(d.id)));
      for (const id of sentDraftIds) {
        await ApiService.delete('email-sender', { body: JSON.stringify({ id }) });
      }
    }
    
    if (setBulk) setBulk(false);
    abortControllerRef.current = null;
  };

  const handleSaveDraft = (saveAsNew: boolean = false) => {
    if (!formState.targetEmail || !formState.companyName || !formState.positionName) {
      alert("Lengkapi Email HRD, Posisi, dan Nama Perusahaan untuk menyimpan draft.");
      return;
    }
    
    const isNewDraft = saveAsNew || !formState.editingDraftId;
    const newId = `draft-${Date.now()}`;
    const targetStatus = (formState.editingDraftStatus === 'terkirim' && saveAsNew) ? 'draft' : (formState.editingDraftStatus || 'draft');
    
    const draftData: EmailDraft = {
      id: isNewDraft ? newId : formState.editingDraftId!,
      targetEmail: formState.targetEmail,
      ccEmail: formState.ccEmail,
      bccEmail: formState.bccEmail,
      companyName: formState.companyName,
      positionName: formState.positionName,
      subject: formState.subjectPreview,
      body: formState.bodyPreview,
      createdAt: new Date().toISOString(),
      
      includePerihal: formState.includePerihal,
      includeLampiranAwal: formState.includeLampiranAwal,
      includeDaftarLampiran: formState.includeDaftarLampiran,
      includeBio: formState.includeBio,
      
      cvOption: formState.cvOption,
      cvAtsOption: formState.cvAtsOption,
      portofolioOption: formState.portofolioOption,
      portofolioSubtype: formState.portofolioSubtype,
      paklaringOption: formState.paklaringOption,
      sertifikatKompetensiAkademikOption: formState.sertifikatKompetensiAkademikOption,
      sertifikatKompetensiBisnisDigitalOption: formState.sertifikatKompetensiBisnisDigitalOption,
      sertifikatKompetensiKepemimpinanOption: formState.sertifikatKompetensiKepemimpinanOption,
      sertifikatKompetensiPublicSpeakingOption: formState.sertifikatKompetensiPublicSpeakingOption,
      sertifikatPrestasiOption: formState.sertifikatPrestasiOption,
      ijazahOption: formState.ijazahOption,
      
      bodyFontFamily: formState.bodyFontFamily,
      emailFormat: formState.emailFormat,
      paragraphAlign: formState.paragraphAlign,
      isSubjectAuto: formState.isSubjectAuto,
      customSubject: formState.customSubject,
      mergeAttachments: formState.mergeAttachments,
      status: targetStatus,
      bioAlamat: formState.bioAlamat,
      senderLocation: formState.senderLocation
    };
    
    let updatedDrafts = [...formState.drafts];
    if (!isNewDraft) {
      if (targetStatus === 'draft') {
        if (formState.drafts.some(d => d.id === formState.editingDraftId)) {
          updatedDrafts = formState.drafts.map(d => d.id === formState.editingDraftId ? draftData : d);
        } else {
          updatedDrafts = [draftData, ...formState.drafts];
        }
      } else {
        updatedDrafts = formState.drafts.filter(d => d.id !== formState.editingDraftId);
      }
      ApiService.put('email-sender', draftData);
    } else {
      if (targetStatus === 'draft') {
        updatedDrafts = [draftData, ...formState.drafts];
      }
      ApiService.post('email-sender', draftData);
    }
    
    formState.setDrafts(updatedDrafts);
    
    alert(targetStatus === 'draft' ? "Draft berhasil disimpan!" : "Data pelacakan berhasil diperbarui!");
    
    formState.resetForm();
  };

  const handleDownloadPDF = async () => {
    await generateAndDownloadPDF({
      bodyPreview: formState.bodyPreview,
      positionName: formState.positionName,
      companyName: formState.companyName,
    });
  };

  return {
    handleDispatch,
    handleSendBulk,
    handleSaveDraft,
    handleCancelSend,
    handleDownloadPDF,
    handleProcessMergePdfs
  };
}
