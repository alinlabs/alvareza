export interface Skill {
  bidang: string;
  persentase: number;
  deskripsi?: string;
  penguasaan?: string[];
}

export interface SkillGroup {
  kategori: string;
  tipeGrafik?: 'bar' | 'pie' | 'radar' | 'line';
  keahlian: Skill[];
}

export interface RingkasanTugas {
  pekerjaan: string;
  persentase: number;
}

export interface Periode {
  masuk?: string;
  keluar?: string;
}

export interface Experience {
  id: string;
  peran: string;
  tingkatan: string;
  perusahaan: string;
  mulai?: string;
  selesai?: string;
  industri?: string;
  skala?: string;
  deskripsi: string;
  spesialisasi: string[];
  tugasTanggungJawab: string[];
  ringkasan: RingkasanTugas[];
  logoUrl?: string;
  paklaring?: string;
}

export interface Education {
  id: string;
  gelar: string;
  institusi: string;
  tahunMasuk: string;
  tahunLulus: string;
  deskripsi: string[];
  logoUrl?: string;
  sertifikat?: string[];
}

export interface Project {
  id: string;
  judul: string;
  deskripsi: string;
  kategori?: string;
  gambar?: string;
  tanggal?: string;
  teknologi: string[];
  tautan?: string;
  github?: string;
  link?: string;
  demoUrl?: string;
  demo_url?: string;
  repoUrl?: string;
  repo_url?: string;
  fitur?: string[];
}

export interface Achievement {
  id: string;
  judul: string;
  penerbit: string;
  tingkat: string;
  deskripsi: string;
  kategori?: string;
  tahun: string;
  sertifikat?: string;
}

export interface Training {
  id: string;
  judul: string;
  penyelenggara: string;
  deskripsi: string;
  hasil: string[];
  tahun?: string;
  sertifikat?: string;
}

export interface OrganizationExperience {
  id: string;
  peran: string;
  organisasi: string;
  mulai?: string;
  selesai?: string;
  deskripsi: string;
  pencapaian: RingkasanTugas[];
  logoUrl?: string;
}

export interface CollaborationDampak {
  indikator: string;
  persentase: number;
}

export interface Collaboration {
  id: string;
  partner: string;
  peran: string;
  proyek: string;
  mulai: string;
  selesai: string;
  bidang: string;
  deskripsi: string;
  tujuan: string[];
  dampak: CollaborationDampak[];
  logoUrl?: string;
  paklaring?: string;
}

export interface ProfileData {
  nama: string;
  jabatan: string;
  bio: string;
  tentang: string;
  email: string;
  telepon: string;
  whatsapp?: string;
  lokasi: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  alamat_tempat_tinggal?: { label: string; alamat: string }[];
  pendidikan_terakhir?: string;
  jurusan?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  twitter?: string;
  skills: SkillGroup[];
  experience: Experience[];
  organizationExperience?: OrganizationExperience[];
  collaborations?: Collaboration[];
  education: Education[];
  trainings: Training[];
  projects: Project[];
  achievements: Achievement[];
}
