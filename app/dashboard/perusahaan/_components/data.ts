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

export const candidates: Candidate[] = [];

export const chats: Chat[] = [];
