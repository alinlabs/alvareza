/**
 * Konfigurasi Terpusat Tanda Tangan Elektronik Kriptografi (PKCS#7 / PAdES)
 * Dokumen Resmi Alvareza Hilka Pratama - Digital Profile Alvareza Security Engine
 *
 * Di-refactor secara terstruktur dengan agregasi modul e-sign per halaman Full View:
 * - esign-awards.ts        : Kredensial E-Sign Penghargaan & Piagam
 * - esign-certification.ts : Kredensial E-Sign Sertifikasi Profesi & Lisensi
 * - esign-portfolio.ts    : Kredensial E-Sign Portofolio Eksekutif
 * - esign-academic.ts     : Kredensial E-Sign Dokumen Akademik (SKL & Transkrip)
 * - esign-identity.ts     : Kredensial E-Sign Dokumen Identitas (KTP, NPWP, KK)
 * - esign-cv.ts           : Kredensial E-Sign Curriculum Vitae ATS
 */

import { AWARDS_MASTER_DOSSIER, AWARDS_ITEM_CREDENTIALS } from './esign-awards';
import { CERTIFICATION_MASTER_DOSSIER, CERTIFICATION_ITEM_CREDENTIALS } from './esign-certification';
import { PORTFOLIO_MASTER_DOSSIER } from './esign-portfolio';
import { ACADEMIC_MASTER_DOSSIER, ACADEMIC_ITEM_CREDENTIALS } from './esign-academic';
import { IDENTITY_MASTER_DOSSIER, IDENTITY_ITEM_CREDENTIALS } from './esign-identity';
import { CV_MASTER_DOSSIER } from './esign-cv';

export interface DigitalSignatureProfile {
  commonName: string;
  organization: string;
  organizationalUnit: string;
  country: string;
  stateOrProvince: string;
  locality: string;
  email: string;
  validityYears: number;
}

export interface SignatureMetadataConfig {
  reason: string;
  location: string;
  contactInfo: string;
  certificationLevel: 'MASTER_DOSSIER' | 'UNIT_CREDENTIAL';
  signatureFieldTitle: string;
}

export interface ItemIssuerCredential {
  authority: DigitalSignatureProfile;
  signer: DigitalSignatureProfile;
  coSigner?: DigitalSignatureProfile;
  signers?: DigitalSignatureProfile[];
  reason: string;
  certificateNumber?: string;
  signatureType?: 'SINGLE' | 'DUAL' | 'MULTI';
  issueDate?: string;
}

export interface MasterDossierCredential {
  authority: DigitalSignatureProfile;
  signer: DigitalSignatureProfile;
  reason: string;
  signatureFieldTitle: string;
}

export interface AppDigitalSignatureConfig {
  authority: DigitalSignatureProfile;
  signer: DigitalSignatureProfile;
  levels: {
    masterDossier: SignatureMetadataConfig;
    unitCredential: SignatureMetadataConfig;
  };
  crypto: {
    rsaBits: 2048;
    hashAlgorithm: 'sha256';
    subFilter: 'adbe.pkcs7.detached';
    filter: 'Adobe.PPKLite';
  };
}

export const DIGITAL_SIGNATURE_CONFIG: AppDigitalSignatureConfig = {
  authority: {
    commonName: 'Digital Profile Alvareza Document Certificate Authority',
    organization: 'Digital Profile Alvareza Trust Network',
    organizationalUnit: 'Security & Public Key Infrastructure Division',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'ca@digitalprofile-alvareza.app',
    validityYears: 10,
  },
  signer: {
    commonName: 'Alvareza Hilka Pratama',
    organization: 'Digital Profile Alvareza Certified Credentials',
    organizationalUnit: 'Executive & Professional Portfolio',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'alvareza@digitalprofile-alvareza.app',
    validityYears: 5,
  },
  levels: {
    masterDossier: {
      reason: 'Pengesahan Berkas Dokumen & Kompilasi Terpadu Resmi Alvareza Hilka Pratama (Master Dossier Verifikasi Digital Profile Alvareza)',
      location: 'Indonesia',
      contactInfo: 'alvareza@digitalprofile-alvareza.app',
      certificationLevel: 'MASTER_DOSSIER',
      signatureFieldTitle: 'DigitalProfileAlvarezaMasterSignature',
    },
    unitCredential: {
      reason: 'Verifikasi Keaslian Dokumen Unit/Sertifikat Tunggal Resmi Alvareza Hilka Pratama',
      location: 'Indonesia',
      contactInfo: 'alvareza@digitalprofile-alvareza.app',
      certificationLevel: 'UNIT_CREDENTIAL',
      signatureFieldTitle: 'DigitalProfileAlvarezaUnitSignature',
    },
  },
  crypto: {
    rsaBits: 2048,
    hashAlgorithm: 'sha256',
    subFilter: 'adbe.pkcs7.detached',
    filter: 'Adobe.PPKLite',
  },
};

// Re-export modul spesifik agar dapat di-import langsung jika dibutuhkan
export * from './esign-awards';
export * from './esign-certification';
export * from './esign-portfolio';
export * from './esign-academic';
export * from './esign-identity';
export * from './esign-cv';

/**
 * Peta Kredensial Master Dossier Spesifik Per-Kategori Dokumen (PDF Lengkap)
 * Agregasi dari seluruh modul e-sign per halaman Full View.
 */
export const MASTER_DOSSIER_REGISTRY: Record<string, MasterDossierCredential> = {
  awards: AWARDS_MASTER_DOSSIER,
  certification: CERTIFICATION_MASTER_DOSSIER,
  portfolio: PORTFOLIO_MASTER_DOSSIER,
  academic: ACADEMIC_MASTER_DOSSIER,
  identity: IDENTITY_MASTER_DOSSIER,
  cv: CV_MASTER_DOSSIER,
};

/**
 * Mengambil Kredensial Master Dossier Spesifik berdasarkan kategori modul PDF Lengkap
 */
export function getMasterDossierCredentials(
  category?: string,
  documentTitle?: string
): MasterDossierCredential {
  const catKey = (category || '').toLowerCase().trim();
  if (catKey && MASTER_DOSSIER_REGISTRY[catKey]) {
    return MASTER_DOSSIER_REGISTRY[catKey];
  }

  // Fallback berdasarkan kata kunci judul jika category key tidak langsung cocok
  const title = (documentTitle || '').toLowerCase();
  if (title.includes('penghargaan') || title.includes('award') || title.includes('piagam')) {
    return MASTER_DOSSIER_REGISTRY.awards;
  }
  if (title.includes('sertifikasi') || title.includes('certif')) {
    return MASTER_DOSSIER_REGISTRY.certification;
  }
  if (title.includes('portofolio') || title.includes('portfolio')) {
    return MASTER_DOSSIER_REGISTRY.portfolio;
  }
  if (title.includes('akademik') || title.includes('academic') || title.includes('skl') || title.includes('transkrip')) {
    return MASTER_DOSSIER_REGISTRY.academic;
  }
  if (title.includes('identitas') || title.includes('ktp') || title.includes('npwp') || title.includes('kk') || title.includes('foto')) {
    return MASTER_DOSSIER_REGISTRY.identity;
  }
  if (title.includes('cv') || title.includes('curriculum')) {
    return MASTER_DOSSIER_REGISTRY.cv;
  }

  // Default fallback
  return {
    authority: DIGITAL_SIGNATURE_CONFIG.authority,
    signer: DIGITAL_SIGNATURE_CONFIG.signer,
    reason: DIGITAL_SIGNATURE_CONFIG.levels.masterDossier.reason,
    signatureFieldTitle: DIGITAL_SIGNATURE_CONFIG.levels.masterDossier.signatureFieldTitle,
  };
}

/**
 * Peta Kredensial Penerbit Resmi Spesifik Per Berkas (Per-Item Issuer Credential Registry)
 * Agregasi dari seluruh modul e-sign terpisah per halaman Full View.
 */
export const ITEM_CREDENTIAL_REGISTRY: Record<string, ItemIssuerCredential> = {
  ...AWARDS_ITEM_CREDENTIALS,
  ...CERTIFICATION_ITEM_CREDENTIALS,
  ...ACADEMIC_ITEM_CREDENTIALS,
  ...IDENTITY_ITEM_CREDENTIALS,
};

/**
 * Mengambil Kredensial Penerbit Resmi Spesifik berdasarkan itemId / filename
 * dengan fallback cerdas ke Digital Profile Alvareza Authority.
 */
export function getItemIssuerCredentials(
  itemId?: string,
  filename?: string,
  fallbackTitle?: string
): ItemIssuerCredential {
  const key = (itemId || '').trim();
  if (key && ITEM_CREDENTIAL_REGISTRY[key]) {
    return ITEM_CREDENTIAL_REGISTRY[key];
  }

  // Fallback lookup berdasarkan nama file
  const cleanFilename = (filename || '').split('/').pop()?.toLowerCase() || '';
  for (const regKey of Object.keys(ITEM_CREDENTIAL_REGISTRY)) {
    if (cleanFilename.includes(regKey.toLowerCase())) {
      return ITEM_CREDENTIAL_REGISTRY[regKey];
    }
  }

  // Fallback default ke Digital Profile Alvareza Authority
  const title = fallbackTitle || itemId || 'Dokumen Unit';
  return {
    authority: {
      commonName: 'Digital Profile Alvareza Credential Verification Authority',
      organization: 'Digital Profile Alvareza Document Security',
      organizationalUnit: 'Unit Credential Verification Division',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'ca@digitalprofile-alvareza.app',
      validityYears: 10,
    },
    signer: {
      commonName: 'Alvareza Hilka Pratama',
      organization: 'Digital Profile Alvareza Credentials',
      organizationalUnit: 'Verified Document Holder',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'alvareza@digitalprofile-alvareza.app',
      validityYears: 5,
    },
    reason: `Verifikasi Keaslian Dokumen Unit Resmi Alvareza Hilka Pratama: ${title}`,
  };
}
