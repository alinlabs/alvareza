import React from 'react';
import { useEmailSender } from './hooks/useEmailSender';
import { EmailSenderState } from './type';
import { getCityFromAlamat } from './utils/parser';

export { getCityFromAlamat };

export function useEmailSenderLogic(): EmailSenderState & {
  cvInputRef: React.RefObject<HTMLInputElement | null>;
  portofolioInputRef: React.RefObject<HTMLInputElement | null>;
  paklaringInputRef: React.RefObject<HTMLInputElement | null>;
  sertifikatKompetensiAkademikInputRef: React.RefObject<HTMLInputElement | null>;
  sertifikatKompetensiBisnisDigitalInputRef: React.RefObject<HTMLInputElement | null>;
  sertifikatKompetensiKepemimpinanInputRef: React.RefObject<HTMLInputElement | null>;
  sertifikatKompetensiPublicSpeakingInputRef: React.RefObject<HTMLInputElement | null>;
  sertifikatPrestasiInputRef: React.RefObject<HTMLInputElement | null>;
  ijazahInputRef: React.RefObject<HTMLInputElement | null>;
} {
  const sender = useEmailSender();
  return sender as any;
}
