/**
 * Konfigurasi Tanda Tangan Elektronik Kriptografi (PKCS#7 / PAdES)
 * Modul Full View: Portofolio Eksekutif & Solusi Digital (Executive Portfolio)
 */

import type { MasterDossierCredential } from './config-esign';

export const PORTFOLIO_MASTER_DOSSIER: MasterDossierCredential = {
  authority: {
    commonName: 'Digital Profile Alvareza - Executive Portfolio Authority',
    organization: 'Digital Profile Alvareza Trust Network',
    organizationalUnit: 'Executive Showcase & Digital Solutions Board',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'portfolio-ca@digitalprofile-alvareza.app',
    validityYears: 10,
  },
  signer: {
    commonName: 'Alvareza Hilka Pratama',
    organization: 'Digital Profile Alvareza Showcase',
    organizationalUnit: 'Executive Candidate & Business Consultant',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'alvareza@digitalprofile-alvareza.app',
    validityYears: 5,
  },
  reason: 'Pengesahan Dokumen Portofolio Eksekutif & Solusi Digital Terpadu Resmi Alvareza Hilka Pratama',
  signatureFieldTitle: 'DigitalProfileAlvarezaPortfolioMasterSignature',
};
