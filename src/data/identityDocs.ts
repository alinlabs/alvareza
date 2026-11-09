export interface IdentityDocItem {
  id: 'pas-foto-3x4' | 'pas-foto-4x6' | 'pas-foto-setengah-badan' | 'ktp' | 'npwp' | 'kk';
  title: string;
  badgeLabel: string;
  headerText: string;
  url: string;
  filename: string;
  printWidthMm?: number;
  printHeightMm?: number;
}

export const ALL_IDENTITY_DOCS: IdentityDocItem[] = [
  {
    id: 'pas-foto-3x4',
    title: 'Pas Foto 3x4',
    badgeLabel: 'Pas Foto 3x4',
    headerText: 'Lampiran : Foto 3x4',
    url: '/identitas/pas-foto-3x4.webp',
    filename: 'pas-foto-3x4.webp',
    printWidthMm: 30,
    printHeightMm: 40,
  },
  {
    id: 'pas-foto-4x6',
    title: 'Pas Foto 4x6',
    badgeLabel: 'Pas Foto 4x6',
    headerText: 'Lampiran : Foto 4x6',
    url: '/identitas/pas-foto-4x6.webp',
    filename: 'pas-foto-4x6.webp',
    printWidthMm: 40,
    printHeightMm: 60,
  },
  {
    id: 'pas-foto-setengah-badan',
    title: 'Pas Foto Setengah Badan',
    badgeLabel: 'Pas Foto Setengah Badan',
    headerText: 'Lampiran : Foto Setengah Badan',
    url: '/identitas/pas-foto-setengah-badan.webp',
    filename: 'pas-foto-setengah-badan.webp',
    printHeightMm: 60,
  },
  {
    id: 'npwp',
    title: 'Kartu NPWP',
    badgeLabel: 'Kartu NPWP',
    headerText: 'Lampiran : Kartu NPWP',
    url: '/identitas/npwp.webp',
    filename: 'npwp.webp',
    printWidthMm: 95,
  },
  {
    id: 'ktp',
    title: 'Kartu Tanda Penduduk (KTP)',
    badgeLabel: 'Kartu Tanda Penduduk (KTP)',
    headerText: 'Lampiran : Kartu Tanda Penduduk',
    url: '/identitas/ktp.webp',
    filename: 'ktp.webp',
    printWidthMm: 95,
  },
  {
    id: 'kk',
    title: 'Kartu Keluarga (KK)',
    badgeLabel: 'Kartu Keluarga (KK)',
    headerText: 'Lampiran : Kartu Keluarga',
    url: '/identitas/kk.webp',
    filename: 'kk.webp',
  },
];

