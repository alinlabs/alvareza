-- Seeding data for Table: email_sender
DELETE FROM email_sender;

INSERT INTO email_sender (
    id, target_email, company_name, position_name, subject, body, status, addressed_to, attached_files, created_at,
    include_perihal, include_lampiran_awal, include_daftar_lampiran, include_bio,
    cv_option, cv_ats_option, portofolio_option, paklaring_option, sertifikat_kompetensi_akademik_option, sertifikat_kompetensi_bisnis_digital_option, sertifikat_kompetensi_kepemimpinan_option, sertifikat_kompetensi_public_speaking_option, sertifikat_prestasi_option, ijazah_option,
    header_bg_color, header_text_color, body_font_family, email_format, paragraph_align, is_subject_auto, custom_subject, merge_attachments
) VALUES 
(
    'job-1',
    'hrd@konicaminolta.co.id',
    'Konica Minolta Indonesia',
    'Business Development Specialist',
    'Lamaran Pekerjaan - Business Development Specialist - Alvareza Hilka Pratama',
    'Melalui email ini saya bermaksud mengajukan diri untuk bergabung di Konica Minolta Indonesia pada posisi Business Development Specialist. Dengan latar belakang pendidikan Manajemen dari STIE Wikara serta pengalaman memimpin organisasi kemahasiswaan...',
    'terkirim',
    'Bapak Rian Hermawan (HR Manager)',
    'CV, Paklaring, Sertifikat',
    '2026-06-15 09:30:00',
    0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'justify', 0, '', 0
),
(
    'job-2',
    'recruitment@shopee.co.id',
    'Shopee Indonesia',
    'Operations Associate',
    'Application for Operations Associate - Alvareza Hilka Pratama',
    'Dear Hiring Team, I am writing to express my strong interest in the Operations Associate position at Shopee Indonesia. My background as President of Student Executive Board at STIE Wikara has provided me with exceptional operational coordination and project management skills...',
    'terkirim',
    'Ibu Shinta Bella (Talent Acquisition Specialist)',
    'CV, Sertifikat, Ijazah',
    '2026-06-20 14:45:00',
    0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'justify', 0, '', 0
),
(
    'job-3',
    'kerjasama@jabarprov.go.id',
    'Pemerintah Provinsi Jawa Barat',
    'Project Coordinator (Stand Up Comedy Event)',
    'Pengajuan Proposal Kerjasama Penyelenggaraan Stand Up Comedy Regional Jawa Barat',
    'Dengan hormat, sehubungan dengan rencana pengembangan kreativitas pemuda di bidang seni komedi tunggal, kami mengajukan proposal kerjasama pelaksanaan event Stand Up Comedy Piala Gubernur Jawa Barat...',
    'terkirim',
    'Bapak Dr. H. Setiawan Wangsaatmaja (Sekretaris Daerah Jabar)',
    'CV, Sertifikat, Proposal Kerjasama',
    '2026-05-10 10:15:00',
    0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'justify', 0, '', 0
),
(
    'job-4',
    'dutagenre@purwakartakab.go.id',
    'DPPKB Purwakarta',
    'Program Ambassador (Duta Genre)',
    'Pendaftaran Calon Duta GenRe Kabupaten Purwakarta',
    'Dengan hormat, saya Alvareza Hilka Pratama, mahasiswa Manajemen STIE Wikara. Melalui surat ini, saya mendaftarkan diri sebagai peserta seleksi Duta GenRe Kabupaten Purwakarta dengan komitmen mengedukasi remaja...',
    'terkirim',
    'Ibu Dra. H. Yayat Hidayat (Kepala DPPKB Purwakarta)',
    'CV, Ijazah, Sertifikat Prestasi',
    '2025-02-18 08:00:00',
    0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'justify', 0, '', 0
),
(
    'draft-sample-1',
    'hrd@company.co.id',
    'PT Global Inovasi',
    'Operational Manager',
    'Lamaran Pekerjaan - Operational Manager - Alvareza Hilka Pratama',
    'Yth. Bapak/Ibu HRD PT Global Inovasi,
\nMelalui email ini saya ingin menyampaikan ketertarikan saya untuk melamar posisi Operational Manager di PT Global Inovasi.
\nSaya merupakan lulusan program studi Manajemen dari STIE Wikara dengan fokus pengembangan keterampilan di bidang operasional, manajemen kemitraan, dan kepemimpinan. Selama masa studi, saya aktif memimpin sebagai Presiden Mahasiswa serta terlibat dalam inisiatif strategis tingkat daerah seperti Aliansi BEM Purwakarta. Selain rekam jejak akademis dan organisasi, saya juga memiliki pengalaman profesional yang relevan dalam operasional bisnis dan penyelesaian proyek di lingkungan kerja nyata.
\nKemampuan komunikasi saya yang kuat, dikombinasikan dengan etos kerja tinggi dan kapasitas adaptasi yang baik, memungkinkan saya untuk mengkoordinasikan tim lintas divisi serta menyelesaikan tantangan kerja secara efisien. Saya meyakini bahwa latar belakang dan keterampilan saya selaras dengan kebutuhan PT Global Inovasi untuk posisi Operational Manager.
\nAtas perhatian dan waktu Bapak/Ibu, saya ucapkan terima kasih.
\nHormat saya,
Alvareza Hilka Pratama',
    'draft',
    '',
    '',
    '2026-07-11T13:00:00Z',
    1,
    1,
    1,
    1,
    'default',
    'default',
    'default',
    'default',
    'default',
    'default',
    'default',
    'default',
    'default',
    'default',
    '#1e293b',
    '#ffffff',
    'Arial, sans-serif',
    'formal',
    'justify',
    1,
    'Lamaran Pekerjaan - Operational Manager - Alvareza Hilka Pratama',
    0
);
