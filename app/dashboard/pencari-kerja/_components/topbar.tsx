'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface TopBarProps {
  activeTab: string;
  onProfileClick: () => void;
  onMessengerClick: () => void;
  onSearch: (query: string) => void;
}

export default function TopBar({ activeTab, onProfileClick, onMessengerClick, onSearch }: TopBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const placeholder = activeTab === 'pesan' ? 'Cari obrolan atau perusahaan...' : 'Cari lowongan, perusahaan...';
  const rekomendasiKategori = ['Frontend Developer', 'UI/UX Designer', 'Data Analyst', 'Mobile Engineer'];
  const rekomendasiPerusahaan = ['GoTo Group', 'PT Teknologi Masa Depan', 'Shopee Indonesia', 'Tokopedia'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submitSearch = (value = searchQuery) => {
    const nextQuery = value.trim();
    if (!nextQuery) return;
    setSearchQuery(nextQuery);
    setIsFocused(false);
    onSearch(nextQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-gray-200 bg-white z-50 flex items-center justify-between gap-3 px-4">
      <button
        type="button"
        onClick={onProfileClick}
        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-800"
        aria-label="Buka profil pencari kerja"
      >
        <span className="text-xl font-bold">=</span>
      </button>

      <div ref={dropdownRef} className="relative flex-1 max-w-xl flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-3 py-2">
        <span className="text-gray-400 text-xs font-bold">Cari</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submitSearch();
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none"
        />

        {isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl shadow-xl border text-xs z-50 max-h-80 overflow-y-auto bg-white border-gray-100 text-gray-800">
            {searchQuery.trim() === '' ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-[10px] uppercase text-gray-400 tracking-wider mb-2">Kategori Populer</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {rekomendasiKategori.map((kat) => (
                      <button key={kat} type="button" onClick={() => submitSearch(kat)} className="px-3 py-1.5 rounded-full font-medium bg-gray-100 hover:bg-gray-200 text-gray-600">
                        {kat}
                      </button>
                    ))}
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div>
                  <h4 className="font-bold text-[10px] uppercase text-gray-400 tracking-wider mb-1.5">Perusahaan Rekomendasi</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {rekomendasiPerusahaan.map((pt) => (
                      <button key={pt} type="button" onClick={() => submitSearch(pt)} className="text-left px-3 py-2 rounded-xl font-medium hover:bg-gray-50 text-gray-700">
                        {pt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-bold text-[10px] uppercase text-gray-400 tracking-wider mb-1.5">Hasil Pencarian untuk &quot;{searchQuery}&quot;</h4>
                <button type="button" onClick={() => submitSearch()} className="w-full text-left px-3 py-2 rounded-xl font-medium hover:bg-gray-50">Cari posisi <strong>{searchQuery}</strong></button>
                <button type="button" onClick={() => submitSearch()} className="w-full text-left px-3 py-2 rounded-xl font-medium hover:bg-gray-50">Cari perusahaan <strong>{searchQuery}</strong></button>
              </div>
            )}
          </div>
        )}
      </div>

      <button type="button" onClick={onMessengerClick} className="hidden sm:flex h-10 rounded-full items-center justify-center gap-2 px-3 text-xs font-bold text-blue-900 hover:bg-blue-50">
        <Image src="/dashboard-images/nav-chat.svg" alt="" width={28} height={28} className="h-6 w-6" />
        Pesan
      </button>
    </header>
  );
}
