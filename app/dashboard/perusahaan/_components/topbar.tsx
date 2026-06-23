'use client';

import Image from 'next/image';

import { useRouter } from 'next/navigation';
import type { CompanyTab } from './data';

type TopBarProps = {
  query: string;
  filter: string;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onProfileClick: () => void;
  onTabChange: (tab: CompanyTab) => void;
};

export default function TopBar({ query, filter, onQueryChange, onFilterChange, onProfileClick, onTabChange }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-gray-200 bg-white z-50 flex items-center justify-between gap-3 px-4">
      <button
        type="button"
        onClick={onProfileClick}
        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-800"
        aria-label="Buka profil perusahaan"
      >
        <span className="text-xl font-bold">=</span>
      </button>

      <div className="flex-1 max-w-xl flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-3 py-2">
        <span className="text-gray-400 text-xs font-bold">Cari</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onFocus={() => onTabChange('kandidat')}
          className="min-w-0 flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none"
          placeholder="Cari kandidat, posisi, atau skill..."
        />
        <select
          value={filter}
          onChange={(event) => onFilterChange(event.target.value)}
          className="max-w-32 bg-white border border-gray-200 rounded-full px-2 py-1 text-[11px] font-semibold text-gray-600 outline-none"
          aria-label="Filter kandidat"
        >
          <option>Semua</option>
          <option>Frontend Developer</option>
          <option>UI/UX Designer</option>
          <option>Data Analyst</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => onTabChange('pesan')}
        className="hidden sm:flex h-10 rounded-full items-center justify-center gap-2 px-3 text-xs font-bold text-blue-900 hover:bg-blue-50"
      >
        <Image src="/dashboard-images/nav-chat.svg" alt="" width={28} height={28} className="h-6 w-6" />
        Pesan
      </button>
      <button
        type="button"
        onClick={() => router.push('/login')}
        className="h-10 rounded-full bg-red-50 px-3 text-xs font-bold text-red-600 hover:bg-red-100"
      >
        Log out
      </button>
    </header>
  );
}