/**
 * Konfigurasi Tanda Tangan Elektronik Kriptografi (PKCS#7 / PAdES)
 * Modul Full View: Dokumen Identitas (KTP, NPWP, KK, Pas Foto)
 */

import type { MasterDossierCredential, ItemIssuerCredential } from './config-esign';

export const IDENTITY_MASTER_DOSSIER: MasterDossierCredential = {
  authority: {
    commonName: 'Digital Profile Alvareza - Official Identity Authority',
    organization: 'Digital Profile Alvareza Trust Network',
    organizationalUnit: 'Identity Verification & Credentials Division',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'identity-ca@digitalprofile-alvareza.app',
    validityYears: 10,
  },
  signer: {
    commonName: 'Alvareza Hilka Pratama',
    organization: 'Digital Profile Alvareza Identity',
    organizationalUnit: 'Verified Identity Holder',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'alvareza@digitalprofile-alvareza.app',
    validityYears: 5,
  },
  reason: 'Pengesahan Berkas Terpadu Dokumen Identitas Resmi Alvareza Hilka Pratama',
  signatureFieldTitle: 'DigitalProfileAlvarezaIdentityMasterSignature',
};

export const IDENTITY_ITEM_CREDENTIALS: Record<string, ItemIssuerCredential> = {
  'ktp': {
    authority: {
      commonName: 'Republik Indonesia - Kementerian Dalam Negeri (Ditjen Dukcapil)',
      organization: 'Pemerintah Kabupaten Purwakarta - Dinas Kependudukan',
      organizationalUnit: 'Direktorat Jenderal Kependudukan & Catatan Sipil',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'dukcapil@purwakartakab.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Alvareza Hilka Pratama',
      organization: 'Warga Negara Indonesia',
      organizationalUnit: 'Pemegang KTP-el Sah',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'alvareza@digitalprofile-alvareza.app',
      validityYears: 5,
    },
    reason: 'Verifikasi Dokumen Resmi Kartu Tanda Penduduk Elektronik (KTP-el) - Alvareza Hilka Pratama',
  },
  'npwp': {
    authority: {
      commonName: 'Republik Indonesia - Kementerian Keuangan (Direktorat Jenderal Pajak)',
      organization: 'Direktorat Jenderal Pajak (DJP) KPP Pratama',
      organizationalUnit: 'Tax Identity Credentials Division',
      country: 'ID',
      stateOrProvince: 'DKI Jakarta',
      locality: 'Jakarta Selatan',
      email: 'pengaduan@pajak.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Alvareza Hilka Pratama',
      organization: 'Wajib Pajak Terdaftar RI',
      organizationalUnit: 'Wajib Pajak Orang Pribadi',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'alvareza@digitalprofile-alvareza.app',
      validityYears: 5,
    },
    reason: 'Verifikasi Dokumen Resmi Kartu Nomor Pokok Wajib Pajak (NPWP) - Alvareza Hilka Pratama',
  },
  'kk': {
    authority: {
      commonName: 'Republik Indonesia - Kementerian Dalam Negeri (Dukcapil)',
      organization: 'Dinas Kependudukan dan Catatan Sipil Purwakarta',
      organizationalUnit: 'Civil Registration & Family Records',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'dukcapil@purwakartakab.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Alvareza Hilka Pratama',
      organization: 'Warga Negara Indonesia',
      organizationalUnit: 'Anggota Kartu Keluarga Sah',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'alvareza@digitalprofile-alvareza.app',
      validityYears: 5,
    },
    reason: 'Verifikasi Dokumen Resmi Kartu Keluarga (KK) - Alvareza Hilka Pratama',
  },
};
