import React, { useRef } from 'react';
import { ApiService } from '../../../../services/api';
import { generateAndDownloadPDF } from '../../../../utils/pdfGenerator';
import { generateAtsCvDoc } from '../../../../utils/atsCvGenerator';
import { useFormState } from './useFormState';
import { EmailDraft } from '../type';
import { JobApplication } from '../Tracker';
import { getCityFromAlamat } from '../utils/parser';
import { mergePdfDocuments } from '../utils/document';

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

  const handleDispatch = async (e?: React.FormEvent, isTest: boolean = false) => {
    if (e) e.preventDefault();
    const finalTargetEmail = isTest ? 'alvareza.work@gmail.com' : formState.targetEmail;
    if (!finalTargetEmail || !formState.companyName || !formState.positionName) return;

    formState.setIsSending(true);
    formState.setSendProgress(0);
    formState.setSendError(null);
    formState.setSuccessMsg(false);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
      formState.setSendProgress(10);
      const formData = new FormData();
      formData.append('targetEmail', finalTargetEmail);
      formData.append('subject', formState.subjectPreview);
      formData.append('body', formState.bodyPreview);
      formData.append('bodyFontFamily', formState.bodyFontFamily);
      formData.append('emailFormat', formState.emailFormat);
      formData.append('paragraphAlign', formState.paragraphAlign);
      
      const locationToSend = formState.includeBio ? getCityFromAlamat(formState.bioAlamat) : formState.senderLocation;
      formData.append('location', locationToSend);
      
      const docsToAttach = [
        { id: 'cv', option: formState.cvOption, file: formState.cvFile, defaultUrl: '/pdf/cv.pdf', defaultName: formState.cvName, label: 'Curriculum Vitae' },
        { id: 'portofolio', option: formState.portofolioOption, file: formState.portofolioFile, defaultUrl: '/pdf/portofolio.pdf', defaultName: formState.portofolioName, label: 'Portofolio' },
        { id: 'paklaring', option: formState.paklaringOption, file: formState.paklaringFile, defaultUrl: '/pdf/paklaring.pdf', defaultName: formState.paklaringName, label: 'Paklaring' },
        { id: 'akademik', option: formState.sertifikatKompetensiAkademikOption, file: formState.sertifikatKompetensiAkademikFile, defaultUrl: '/pdf/sertifikat/akademis.pdf', defaultName: formState.sertifikatKompetensiAkademikName, label: 'Sertifikat Kompetensi Akademik' },
        { id: 'bisnis', option: formState.sertifikatKompetensiBisnisDigitalOption, file: formState.sertifikatKompetensiBisnisDigitalFile, defaultUrl: '/pdf/sertifikat/bisnis-digital.pdf', defaultName: formState.sertifikatKompetensiBisnisDigitalName, label: 'Sertifikat Kompetensi Bisnis dan Digital' },
        { id: 'kepemimpinan', option: formState.sertifikatKompetensiKepemimpinanOption, file: formState.sertifikatKompetensiKepemimpinanFile, defaultUrl: '/pdf/sertifikat/kepemimpinan.pdf', defaultName: formState.sertifikatKompetensiKepemimpinanName, label: 'Sertifikat Kompetensi Kepemimpinan' },
        { id: 'speaking', option: formState.sertifikatKompetensiPublicSpeakingOption, file: formState.sertifikatKompetensiPublicSpeakingFile, defaultUrl: '/pdf/sertifikat/public-speaking.pdf', defaultName: formState.sertifikatKompetensiPublicSpeakingName, label: 'Sertifikat Kompetensi Public Speaking' },
        { id: 'prestasi', option: formState.sertifikatPrestasiOption, file: formState.sertifikatPrestasiFile, defaultUrl: '/pdf/sertifikat/prestasi.pdf', defaultName: formState.sertifikatPrestasiName, label: 'Sertifikat Prestasi' },
        { id: 'ijazah', option: formState.ijazahOption, file: formState.ijazahFile, defaultUrl: '/pdf/ijazah.pdf', defaultName: formState.ijazahName, label: 'Ijazah' },
      ];

      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
      formState.setSendProgress(30);
      
      const gatheredAttachments: { id: string, blob: Blob, filename: string }[] = [];

      if (formState.cvAtsOption === 'default') {
        try {
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
          console.error("Gagal membuat CV ATS saat mengirim email:", e);
        }
      }

      for (const doc of docsToAttach) {
        if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
        if (doc.option === 'upload') {
          if (doc.file) {
            gatheredAttachments.push({ id: doc.id, blob: doc.file, filename: doc.file.name });
          }
        } else if (doc.option === 'default') {
          try {
            const defaultRes = await fetch(doc.defaultUrl, { signal: controller.signal });
            if (defaultRes.ok) {
              const blob = await defaultRes.blob();
              gatheredAttachments.push({ id: doc.id, blob, filename: doc.defaultName });
            }
          } catch (fetchErr: any) {
            if (fetchErr.name === 'AbortError') throw fetchErr;
          }
        }
      }

      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
      
      if (formState.mergeAttachments === 'all' && gatheredAttachments.length > 0) {
        try {
          const mergedBlob = await mergePdfDocuments(gatheredAttachments, controller.signal);
          const mergedFilename = 'Berkas_Alvareza_Hilka_Pratama.pdf';
          formData.append('attachments', mergedBlob, mergedFilename);
        } catch (e: any) {
          if (e.name === 'AbortError') throw e;
          console.error("Gagal menggabungkan PDF:", e);
          // Fallback to individual attachments
          for (const item of gatheredAttachments) {
            formData.append('attachments', item.blob, item.filename);
          }
        }
      } else if (formState.mergeAttachments === 'optimal' && gatheredAttachments.length > 0) {
        try {
          const cvGroup = gatheredAttachments.filter(a => ['cv', 'cv_ats', 'portofolio'].includes(a.id));
          const ijazahGroup = gatheredAttachments.filter(a => ['ijazah', 'akademik'].includes(a.id));
          const sertifikatGroup = gatheredAttachments.filter(a => ['kepemimpinan', 'speaking', 'bisnis', 'prestasi'].includes(a.id));
          const others = gatheredAttachments.filter(a => !['cv', 'cv_ats', 'portofolio', 'ijazah', 'akademik', 'kepemimpinan', 'speaking', 'bisnis', 'prestasi'].includes(a.id));

          if (cvGroup.length > 1) {
            const mergedCv = await mergePdfDocuments(cvGroup, controller.signal);
            formData.append('attachments', mergedCv, 'CV_Portofolio_Alvareza.pdf');
          } else if (cvGroup.length === 1) {
            formData.append('attachments', cvGroup[0].blob, cvGroup[0].filename);
          }

          if (ijazahGroup.length > 1) {
            const mergedIjazah = await mergePdfDocuments(ijazahGroup, controller.signal);
            formData.append('attachments', mergedIjazah, 'Ijazah_dan_Akademik_Alvareza.pdf');
          } else if (ijazahGroup.length === 1) {
            formData.append('attachments', ijazahGroup[0].blob, ijazahGroup[0].filename);
          }

          if (sertifikatGroup.length > 1) {
            const order = ['kepemimpinan', 'speaking', 'bisnis', 'prestasi'];
            sertifikatGroup.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
            const mergedSertifikat = await mergePdfDocuments(sertifikatGroup, controller.signal);
            formData.append('attachments', mergedSertifikat, 'Kumpulan_Sertifikat_Alvareza.pdf');
          } else if (sertifikatGroup.length === 1) {
            formData.append('attachments', sertifikatGroup[0].blob, sertifikatGroup[0].filename);
          }

          for (const item of others) {
            formData.append('attachments', item.blob, item.filename);
          }
        } catch (e: any) {
          if (e.name === 'AbortError') throw e;
          console.error("Gagal menggabungkan PDF secara optimal:", e);
          for (const item of gatheredAttachments) {
            formData.append('attachments', item.blob, item.filename);
          }
        }
      } else {
        for (const item of gatheredAttachments) {
          formData.append('attachments', item.blob, item.filename);
        }
      }

      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
      formState.setSendProgress(60);
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      const textData = await response.text();
      let data: any = {};
      try {
        data = textData ? JSON.parse(textData) : {};
      } catch (e) {
        console.error("Response is not JSON:", textData);
        if (!response.ok) {
          throw new Error(`Gagal mengirim email (Server Error ${response.status}): ${textData.substring(0, 150) || 'Unknown server error'}`);
        } else {
          data = { message: "Email berhasil terkirim!" };
        }
      }

      if (response.ok) {
        formState.setSendProgress(100);
        formState.setSuccessMsg(true);
        if (formState.autoLogToTracker && !isTest) {
          await logToTracker();
        }
        
        // Hapus draft yang diedit jika ada
        if (formState.editingDraftId && !isTest) {
          await ApiService.delete('email-sender', { body: JSON.stringify({ id: formState.editingDraftId }) });
          formState.setDrafts(prev => prev.filter(d => d.id !== formState.editingDraftId));
        }
      } else {
        throw new Error(data.error || 'Server API Error');
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
    if (setBulk) setBulk(true);
    
    let sentCount = 0;
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    const sentDraftIds: string[] = [];

    for (const draft of (formState.drafts || [])) {
      if (controller.signal.aborted) {
        break;
      }
      try {
        const formData = new FormData();
        formData.append('targetEmail', draft.targetEmail);
        formData.append('subject', draft.subject);
        formData.append('body', draft.body);
        formData.append('bodyFontFamily', draft.bodyFontFamily || formState.bodyFontFamily);
        formData.append('emailFormat', draft.emailFormat || formState.emailFormat);
        formData.append('paragraphAlign', draft.paragraphAlign || formState.paragraphAlign);
        
        const locationToSend = draft.includeBio ? getCityFromAlamat(draft.bioAlamat || '') : (draft.senderLocation || 'Purwakarta');
        formData.append('location', locationToSend);
        
        const docsToAttach = [
          { id: 'cv', option: draft.cvOption || 'default', defaultUrl: '/pdf/cv.pdf', defaultName: 'CV_Alvareza_Hilka_Pratama.pdf', label: 'CV' },
          { id: 'portofolio', option: draft.portofolioOption || 'default', defaultUrl: '/pdf/portofolio.pdf', defaultName: 'Portofolio_Alvareza_Hilka_Pratama.pdf', label: 'Portofolio' },
          { id: 'paklaring', option: draft.paklaringOption || 'default', defaultUrl: '/pdf/paklaring.pdf', defaultName: 'Paklaring_Alvareza_Hilka_Pratama.pdf', label: 'Paklaring' },
          { id: 'akademik', option: draft.sertifikatKompetensiAkademikOption || 'default', defaultUrl: '/pdf/sertifikat/akademis.pdf', defaultName: 'Sertifikat_Kompetensi_Akademik.pdf', label: 'Sertifikat Kompetensi Akademik' },
          { id: 'bisnis', option: draft.sertifikatKompetensiBisnisDigitalOption || 'default', defaultUrl: '/pdf/sertifikat/bisnis-digital.pdf', defaultName: 'Sertifikat_Kompetensi_Bisnis_dan_Digital.pdf', label: 'Sertifikat Kompetensi Bisnis dan Digital' },
          { id: 'kepemimpinan', option: draft.sertifikatKompetensiKepemimpinanOption || 'default', defaultUrl: '/pdf/sertifikat/kepemimpinan.pdf', defaultName: 'Sertifikat_Kompetensi_Kepemimpinan.pdf', label: 'Sertifikat Kompetensi Kepemimpinan' },
          { id: 'speaking', option: draft.sertifikatKompetensiPublicSpeakingOption || 'default', defaultUrl: '/pdf/sertifikat/public-speaking.pdf', defaultName: 'Sertifikat_Kompetensi_Public_Speaking.pdf', label: 'Sertifikat Kompetensi Public Speaking' },
          { id: 'prestasi', option: draft.sertifikatPrestasiOption || 'default', defaultUrl: '/pdf/sertifikat/prestasi.pdf', defaultName: 'Sertifikat_Prestasi.pdf', label: 'Sertifikat Prestasi' },
          { id: 'ijazah', option: draft.ijazahOption || 'default', defaultUrl: '/pdf/ijazah.pdf', defaultName: 'Ijazah_Alvareza_Hilka_Pratama.pdf', label: 'Ijazah' },
        ];
        
        const gatheredAttachments: { id: string, blob: Blob, filename: string }[] = [];
        
        if (draft.cvAtsOption === 'default') {
          try {
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
          if (doc.option === 'default') {
            try {
              const defaultRes = await fetch(doc.defaultUrl, { signal: controller.signal });
              if (defaultRes.ok) {
                const blob = await defaultRes.blob();
                gatheredAttachments.push({ id: doc.id, blob, filename: doc.defaultName });
              }
            } catch (e: any) {
              if (e.name === 'AbortError') throw e;
            }
          }
        }
        
        if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');

        if (draft.mergeAttachments === 'all' && gatheredAttachments.length > 0) {
          try {
            const mergedBlob = await mergePdfDocuments(gatheredAttachments, controller.signal);
            formData.append('attachments', mergedBlob, 'Berkas_Alvareza_Hilka_Pratama.pdf');
          } catch (e: any) {
            if (e.name === 'AbortError') throw e;
            console.error("Gagal menggabungkan PDF untuk bulk send:", e);
            for (const item of gatheredAttachments) {
              formData.append('attachments', item.blob, item.filename);
            }
          }
        } else if (draft.mergeAttachments === 'optimal' && gatheredAttachments.length > 0) {
          try {
            const cvGroup = gatheredAttachments.filter(a => ['cv', 'cv_ats', 'portofolio'].includes(a.id));
            const ijazahGroup = gatheredAttachments.filter(a => ['ijazah', 'akademik'].includes(a.id));
            const sertifikatGroup = gatheredAttachments.filter(a => ['kepemimpinan', 'speaking', 'bisnis', 'prestasi'].includes(a.id));
            const others = gatheredAttachments.filter(a => !['cv', 'cv_ats', 'portofolio', 'ijazah', 'akademik', 'kepemimpinan', 'speaking', 'bisnis', 'prestasi'].includes(a.id));

            if (cvGroup.length > 1) {
              const mergedCv = await mergePdfDocuments(cvGroup, controller.signal);
              formData.append('attachments', mergedCv, 'CV_Portofolio_Alvareza.pdf');
            } else if (cvGroup.length === 1) {
              formData.append('attachments', cvGroup[0].blob, cvGroup[0].filename);
            }

            if (ijazahGroup.length > 1) {
              const mergedIjazah = await mergePdfDocuments(ijazahGroup, controller.signal);
              formData.append('attachments', mergedIjazah, 'Ijazah_dan_Akademik_Alvareza.pdf');
            } else if (ijazahGroup.length === 1) {
              formData.append('attachments', ijazahGroup[0].blob, ijazahGroup[0].filename);
            }

            if (sertifikatGroup.length > 1) {
              const order = ['kepemimpinan', 'speaking', 'bisnis', 'prestasi'];
              sertifikatGroup.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
              const mergedSertifikat = await mergePdfDocuments(sertifikatGroup, controller.signal);
              formData.append('attachments', mergedSertifikat, 'Kumpulan_Sertifikat_Alvareza.pdf');
            } else if (sertifikatGroup.length === 1) {
              formData.append('attachments', sertifikatGroup[0].blob, sertifikatGroup[0].filename);
            }

            for (const item of others) {
              formData.append('attachments', item.blob, item.filename);
            }
          } catch (e: any) {
            if (e.name === 'AbortError') throw e;
            console.error("Gagal menggabungkan PDF optimal untuk bulk send:", e);
            for (const item of gatheredAttachments) {
              formData.append('attachments', item.blob, item.filename);
            }
          }
        } else {
          for (const item of gatheredAttachments) {
            formData.append('attachments', item.blob, item.filename);
          }
        }

        if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
        const response = await fetch('/api/send-email', {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });
        
        if (response.ok) {
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
        } else {
          throw new Error('API failed');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Bulk send was aborted');
          break;
        }
      }
      sentCount++;
    }
    
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
    handleDownloadPDF
  };
}
