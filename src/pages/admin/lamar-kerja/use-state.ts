import { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/bahasa';
import { EmailLanguage } from '../../../types/jobApplication';

export function useLamarKerjaState() {
  const [quickInputText, setQuickInputText] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [ccEmail, setCcEmail] = useState<string>('');
  const [showCcField, setShowCcField] = useState<boolean>(false);
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [isSubjectAuto, setIsSubjectAuto] = useState<boolean>(true);
  const [emailBody, setEmailBody] = useState<string>('');
  const [isEmailBodyExpanded, setIsEmailBodyExpanded] = useState<boolean>(false);
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  const [language, setLanguage] = useState<EmailLanguage>(globalLanguage || 'in');
  const [keyRequirements, setKeyRequirements] = useState<string[]>([]);
  const [jobDesk, setJobDesk] = useState<string>('');
  const [kualifikasi, setKualifikasi] = useState<string>('');
  const [showJobDetailFields, setShowJobDetailFields] = useState<boolean>(false);
  const [isDropOver, setIsDropOver] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState<boolean>(false);

  // Debounce nilai input untuk algoritma berat (ATS Preset matching, Language detection, Draft generation)
  const [debouncedJobTitle, setDebouncedJobTitle] = useState(jobTitle);
  const [debouncedJobDesk, setDebouncedJobDesk] = useState(jobDesk);
  const [debouncedKualifikasi, setDebouncedKualifikasi] = useState(kualifikasi);
  const [debouncedCompanyName, setDebouncedCompanyName] = useState(companyName);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedJobTitle(jobTitle);
      setDebouncedJobDesk(jobDesk);
      setDebouncedKualifikasi(kualifikasi);
      setDebouncedCompanyName(companyName);
    }, 100);
    return () => clearTimeout(timer);
  }, [jobTitle, jobDesk, kualifikasi, companyName]);

  // Sync modal language if global language changes
  useEffect(() => {
    if (globalLanguage && globalLanguage !== language) {
      setLanguage(globalLanguage);
    }
  }, [globalLanguage]);

  // Copy feedback states
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedCc, setCopiedCc] = useState(false);

  const handleCopy = (text: string, type: 'subject' | 'body' | 'all' | 'email' | 'cc' | 'phone') => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'subject') {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
      } else if (type === 'body') {
        setCopiedBody(true);
        setTimeout(() => setCopiedBody(false), 2000);
      } else if (type === 'all') {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      } else if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else if (type === 'cc') {
        setCopiedCc(true);
        setTimeout(() => setCopiedCc(false), 2000);
      }
    });
  };

  return {
    quickInputText,
    setQuickInputText,
    imagePreviewUrl,
    setImagePreviewUrl,
    companyName,
    setCompanyName,
    jobTitle,
    setJobTitle,
    recipientEmail,
    setRecipientEmail,
    ccEmail,
    setCcEmail,
    showCcField,
    setShowCcField,
    recipientPhone,
    setRecipientPhone,
    emailSubject,
    setEmailSubject,
    isSubjectAuto,
    setIsSubjectAuto,
    emailBody,
    setEmailBody,
    isEmailBodyExpanded,
    setIsEmailBodyExpanded,
    language,
    setLanguage,
    globalLanguage,
    setGlobalLanguage,
    keyRequirements,
    setKeyRequirements,
    jobDesk,
    setJobDesk,
    kualifikasi,
    setKualifikasi,
    showJobDetailFields,
    setShowJobDetailFields,
    isDropOver,
    setIsDropOver,
    isImageExpanded,
    setIsImageExpanded,
    debouncedJobTitle,
    debouncedJobDesk,
    debouncedKualifikasi,
    debouncedCompanyName,
    copiedSubject,
    copiedBody,
    copiedAll,
    copiedEmail,
    copiedCc,
    handleCopy,
  };
}

export type LamarKerjaStateResult = ReturnType<typeof useLamarKerjaState>;
