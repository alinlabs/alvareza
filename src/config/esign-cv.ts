/**
 * Konfigurasi Tanda Tangan Elektronik Kriptografi (PKCS#7 / PAdES)
 * Modul Full View: Curriculum Vitae ATS (Executive CV)
 */

import type { MasterDossierCredential } from './config-esign';

export const CV_MASTER_DOSSIER: MasterDossierCredential = {
  authority: {
    commonName: 'Digital Profile Alvareza - Executive CV Authority',
    organization: 'Digital Profile Alvareza Trust Network',
    organizationalUnit: 'ATS Curriculum Vitae Verification Division',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'cv-ca@digitalprofile-alvareza.app',
    validityYears: 10,
  },
  signer: {
    commonName: 'Alvareza Hilka Pratama',
    organization: 'Digital Profile Alvareza Curriculum Vitae',
    organizationalUnit: 'Lead Executive Candidate',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'alvareza@digitalprofile-alvareza.app',
    validityYears: 5,
  },
  reason: 'Pengesahan Dokumen Official Curriculum Vitae (CV ATS) Alvareza Hilka Pratama',
  signatureFieldTitle: 'DigitalProfileAlvarezaCvMasterSignature',
};
