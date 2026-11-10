/**
 * Konfigurasi Tanda Tangan Elektronik Kriptografi (PKCS#7 / PAdES)
 * Modul Full View: Dokumen Akademik (SKL & Transkrip Nilai)
 */

import type { MasterDossierCredential, ItemIssuerCredential } from './digitalSignatureConfig';

export const ACADEMIC_MASTER_DOSSIER: MasterDossierCredential = {
  authority: {
    commonName: 'Digital Profile Alvareza - Academic Credentials Authority',
    organization: 'Digital Profile Alvareza Trust Network',
    organizationalUnit: 'Academic Verification & Records Division',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'academic-ca@digitalprofile-alvareza.app',
    validityYears: 10,
  },
  signer: {
    commonName: 'Alvareza Hilka Pratama',
    organization: 'Digital Profile Alvareza Academic Records',
    organizationalUnit: 'Alumni & Graduate Degree Candidate',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'alvareza@digitalprofile-alvareza.app',
    validityYears: 5,
  },
  reason: 'Pengesahan Dokumen Terpadu Berkas Akademik Resmi (SKL & Transkrip Nilai) Alvareza Hilka Pratama',
  signatureFieldTitle: 'DigitalProfileAlvarezaAcademicMasterSignature',
};

export const ACADEMIC_ITEM_CREDENTIALS: Record<string, ItemIssuerCredential> = {
  'skl': {
    authority: {
      commonName: 'STIE Wikara Purwakarta - Bagian Administrasi Akademik',
      organization: 'Sekolah Tinggi Ilmu Ekonomi Wikara',
      organizationalUnit: 'Academic Records Authority',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'akademik@stiewikara.ac.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Ketua & Bagian Akademik STIE Wikara',
      organization: 'Sekolah Tinggi Ilmu Ekonomi Wikara',
      organizationalUnit: 'Pejabat Pengesahan Surat Keterangan Lulus',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'akademik@stiewikara.ac.id',
      validityYears: 5,
    },
    reason: 'Verifikasi Keaslian Surat Keterangan Lulus (SKL) Resmi STIE Wikara - Alvareza Hilka Pratama',
  },
  'transkrip': {
    authority: {
      commonName: 'STIE Wikara Purwakarta - Ketua & Senat Akademik',
      organization: 'Sekolah Tinggi Ilmu Ekonomi Wikara',
      organizationalUnit: 'Academic Senate & Transcripts Board',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'akademik@stiewikara.ac.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Ketua STIE Wikara Purwakarta',
      organization: 'Sekolah Tinggi Ilmu Ekonomi Wikara',
      organizationalUnit: 'Pejabat Penandatangan Transkrip Nilai Resmi',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'akademik@stiewikara.ac.id',
      validityYears: 5,
    },
    reason: 'Verifikasi Keaslian Transkrip Nilai Akademik Resmi STIE Wikara (IPK 3.63 Cum Laude) - Alvareza Hilka Pratama',
  },
};
