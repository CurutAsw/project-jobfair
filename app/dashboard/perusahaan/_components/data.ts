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
  history: ChatMessage[];
};

export type ChatMessage = {
  id: number;
  sender: 'candidate' | 'company';
  text: string;
  time: string;
};

export const company = {
  name: 'PT Teknologi Masa Depan',
  email: 'recruiter@teknologimasa.co.id',
  industry: 'Teknologi Informasi',
  location: 'Jakarta Selatan',
  size: '200 karyawan',
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
    history: [
      { id: 1, sender: 'company', text: 'Halo Siti, kami tertarik dengan profil Frontend Developer Anda.', time: '09.45' },
      { id: 2, sender: 'candidate', text: 'Terima kasih. Saya siap mengikuti proses rekrutmen berikutnya.', time: '10.05' },
      { id: 3, sender: 'company', text: 'Apakah Anda tersedia untuk interview teknis besok pagi?', time: '10.20' },
      { id: 4, sender: 'candidate', text: 'Terima kasih, saya tersedia untuk interview teknis besok pagi.', time: '10.30' },
    ],
  },
  {
    id: 2,
    name: 'Rizky Pratama',
    role: 'UI/UX Designer',
    message: 'Saya sudah mengirim portfolio terbaru melalui email.',
    time: '09.10',
    unread: false,
    avatarUrl: '/dashboard-images/avatar-rizky.svg',
    history: [
      { id: 1, sender: 'company', text: 'Halo Rizky, boleh kirim portofolio UI/UX terbaru Anda?', time: '08.30' },
      { id: 2, sender: 'candidate', text: 'Baik, saya kirimkan portofolio terbaru lewat email hari ini.', time: '08.45' },
      { id: 3, sender: 'candidate', text: 'Saya sudah mengirim portfolio terbaru melalui email.', time: '09.10' },
    ],
  },
  {
    id: 3,
    name: 'Nadia Putri',
    role: 'Data Analyst',
    message: 'Apakah posisi ini mendukung sistem kerja hybrid?',
    time: 'Kemarin',
    unread: true,
    avatarUrl: '/dashboard-images/avatar-nadia.svg',
    history: [
      { id: 1, sender: 'company', text: 'Halo Nadia, profil Data Analyst Anda cocok dengan kebutuhan kami.', time: 'Kemarin' },
      { id: 2, sender: 'candidate', text: 'Terima kasih. Apakah posisi ini mendukung sistem kerja hybrid?', time: 'Kemarin' },
    ],
  },
];
