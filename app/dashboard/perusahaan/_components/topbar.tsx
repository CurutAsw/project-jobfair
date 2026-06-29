'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { candidates, type CompanyTab } from './data';

type TopBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onProfileClick: () => void;
  onTabChange: (tab: CompanyTab) => void;
  onSearchSubmit: (value: string) => void;
};

export default function TopBar({ query, onQueryChange, onFilterChange, onProfileClick, onTabChange, onSearchSubmit }: TopBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rekomendasiKategori = ['Frontend Developer', 'UI/UX Designer', 'Data Analyst', 'Mobile Engineer'];
  const rekomendasiKandidat = candidates.map((candidate) => candidate.name);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectSearch = (value: string, nextFilter = 'Semua') => {
    onQueryChange(value);
    onFilterChange(nextFilter);
    onSearchSubmit(value);
    onTabChange('kandidat');
    setIsFocused(false);
  };

  const submitSearch = () => {
    const nextQuery = query.trim();
    if (!nextQuery) return;
    onSearchSubmit(nextQuery);
    onTabChange('kandidat');
    setIsFocused(false);
  };

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

      <div ref={dropdownRef} className="relative flex-1 max-w-xl flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-3 py-2">
        <span className="text-gray-400 text-xs font-bold">Cari</span>
        <input
          type="text"
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
            onFilterChange('Semua');
          }}
          onFocus={() => {
            setIsFocused(true);
            onTabChange('kandidat');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submitSearch();
          }}
          className="min-w-0 flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none"
          placeholder="Cari kandidat, posisi, atau skill..."
        />

        {isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl shadow-xl border text-xs z-50 max-h-80 overflow-y-auto bg-white border-gray-100 text-gray-800">
            {query.trim() === '' ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-[10px] uppercase text-gray-400 tracking-wider mb-2">Kategori Populer</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {rekomendasiKategori.map((kategori) => (
                      <button
                        key={kategori}
                        type="button"
                        onClick={() => selectSearch(kategori, kategori)}
                        className="px-3 py-1.5 rounded-full font-medium bg-gray-100 hover:bg-gray-200 text-gray-600"
                      >
                        {kategori}
                      </button>
                    ))}
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div>
                  <h4 className="font-bold text-[10px] uppercase text-gray-400 tracking-wider mb-1.5">Kandidat Rekomendasi</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {rekomendasiKandidat.map((kandidat) => (
                      <button key={kandidat} type="button" onClick={() => selectSearch(kandidat)} className="text-left px-3 py-2 rounded-xl font-medium hover:bg-gray-50 text-gray-700">
                        {kandidat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-bold text-[10px] uppercase text-gray-400 tracking-wider mb-1.5">Hasil Pencarian untuk &quot;{query}&quot;</h4>
                <button type="button" onClick={() => selectSearch(query)} className="w-full text-left px-3 py-2 rounded-xl font-medium hover:bg-gray-50">Cari kandidat <strong>{query}</strong></button>
                <button type="button" onClick={() => selectSearch(query)} className="w-full text-left px-3 py-2 rounded-xl font-medium hover:bg-gray-50">Cari posisi <strong>{query}</strong></button>
                <button type="button" onClick={() => selectSearch(query)} className="w-full text-left px-3 py-2 rounded-xl font-medium hover:bg-gray-50">Cari skill <strong>{query}</strong></button>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onTabChange('pesan')}
        className="hidden sm:flex h-10 rounded-full items-center justify-center gap-2 px-3 text-xs font-bold text-blue-900 hover:bg-blue-50"
      >
        <Image src="/dashboard-images/nav-chat.svg" alt="" width={28} height={28} className="h-6 w-6" />
        Pesan
      </button>
    </header>
  );
}
