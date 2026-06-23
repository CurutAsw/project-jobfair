export type CompanyTab = 'kandidat' | 'lowongan' | 'posting' | 'notifikasi' | 'pesan';

export type Candidate = {
  id: number;
  name: string;
  role: string;
  location: string;
  experience: string;
  match: number;
  skills: string[];
  status: string;
  avatarUrl: string;
};

export type Chat = {
  id: number;
  name: string;
  role: string;
  message: string;
  time: string;
  unread: boolean;
  avatarUrl: string;
};

export const company = {
  name: 'PT Teknologi Masa Depan',
  email: 'recruiter@teknologimasa.co.id',
  industry: 'Teknologi Informasi',
  location: 'Jakarta Selatan',
  size: '51-200 karyawan',
  website: 'teknologimasa.co.id',
};

export const candidates: Candidate[] = [
  {
    id: 1,
    name: 'Siti Aminah',
    role: 'Frontend Developer',
    location: 'Bandung',
    experience: '3 tahun',
    match: 94,
    skills: ['React', 'TypeScript', 'Tailwind'],
    status: 'Siap interview',
    avatarUrl: '/dashboard-images/avatar-siti.svg',
  },
  {
    id: 2,
    name: 'Rizky Pratama',
    role: 'UI/UX Designer',
    location: 'Jakarta',
    experience: '4 tahun',
    match: 89,
    skills: ['Figma', 'Design System', 'Research'],
    status: 'Aktif mencari',
    avatarUrl: '/dashboard-images/avatar-rizky.svg',
  },
  {
    id: 3,
    name: 'Nadia Putri',
    role: 'Data Analyst',
    location: 'Surabaya',
    experience: '2 tahun',
    match: 86,
    skills: ['SQL', 'Python', 'Dashboard'],
    status: 'Terbuka remote',
    avatarUrl: '/dashboard-images/avatar-nadia.svg',
  },
];

export const chats: Chat[] = [
  {
    id: 1,
    name: 'Siti Aminah',
    role: 'Frontend Developer',
    message: 'Terima kasih, saya tersedia untuk interview teknis besok pagi.',
    time: '10.30',
    unread: true,
    avatarUrl: '/dashboard-images/avatar-siti.svg',
  },
  {
    id: 2,
    name: 'Rizky Pratama',
    role: 'UI/UX Designer',
    message: 'Saya sudah mengirim portfolio terbaru melalui email.',
    time: '09.10',
    unread: false,
    avatarUrl: '/dashboard-images/avatar-rizky.svg',
  },
  {
    id: 3,
    name: 'Nadia Putri',
    role: 'Data Analyst',
    message: 'Apakah posisi ini mendukung sistem kerja hybrid?',
    time: 'Kemarin',
    unread: true,
    avatarUrl: '/dashboard-images/avatar-nadia.svg',
  },
];