-- Seeding data for Table: rekruter
DELETE FROM rekruter;

INSERT INTO rekruter (id, nama, jabatan, perusahaan, posisi, whatsapp, catatan, gender) VALUES
(
    'rec-1',
    'Budi Santoso',
    'HR Manager',
    'PT Global Tech',
    'Frontend Developer',
    '6281234567890',
    'Lowongan aktif hingga akhir bulan ini. Membutuhkan React developer.',
    'pria'
),
(
    'rec-2',
    'Siti Rahma',
    'Recruiter',
    'CV Kreatif Digital',
    'Social Media Specialist',
    '628987654321',
    'Sangat menyukai portofolio desain visual.',
    'wanita'
);
