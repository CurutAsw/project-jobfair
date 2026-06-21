'use client';
import { useState, useRef, useEffect } from 'react';

interface TopBarProps {
  activeTab: string;
  onProfileClick: () => void;
  onMessengerClick: () => void;
  isDarkMode?: boolean; // Dibuat opsional agar menyesuaikan dengan page.tsx
}

export default function TopBar({ activeTab, onProfileClick, onMessengerClick, isDarkMode = false }: TopBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown jika pengguna mengklik di luar area search bar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Data Dummy Rekomendasi
  const rekomendasiKategori = ['🌐 Frontend Developer', '🎨 UI/UX Designer', '📊 Data Analyst', '🚀 Mobile Engineer'];
  const rekomendasiPerusahaan = ['🏢 GoTo Group', '🏢 PT Teknologi Masa Depan', '🏢 Shopee Indonesia', '🏢 Tokopedia'];

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 border-b flex items-center justify-between px-4 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}>
      
      {/* --- TOMBOL SIDEBAR (GARIS 3) --- */}
      <button 
        type="button"
        onClick={onProfileClick}
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-gray-200' : 'hover:bg-gray-100 text-gray-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search Bar Container */}
      <div ref={dropdownRef} className="relative w-full max-w-xl mx-4 flex items-center">
        <span className="absolute left-3 text-gray-400 text-sm z-10">🔍</span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Cari lowongan, perusahaan..." 
          className={`w-full pl-9 pr-4 py-2 rounded-full text-xs border focus:outline-none transition-colors ${
            isDarkMode 
              ? 'bg-slate-950 border-slate-800 text-gray-200 placeholder-gray-500 focus:border-slate-700' 
              : 'bg-gray-100 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-300'
          }`}
        />

        {/* --- DROPDOWN REKOMENDASI PENCARIAN --- */}
        {isFocused && (
          <div className={`absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl shadow-xl border text-xs z-50 max-h-80 overflow-y-auto ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-gray-200' : 'bg-white border-gray-100 text-gray-800'
          }`}>
            {searchQuery.trim() === '' ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-[10px] uppercase text-gray-400 tracking-wider mb-2">🔥 Kategori Populer</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {rekomendasiKategori.map((kat, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSearchQuery(kat.substring(2))}
                        className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                          isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                      >
                        {kat}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className={isDarkMode ? 'border-slate-800' : 'border-gray-100'} />

                <div>
                  <h4 className="font-bold text-[10px] uppercase text-gray-400 tracking-wider mb-1.5">🏢 Perusahaan Rekomendasi</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {rekomendasiPerusahaan.map((pt, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSearchQuery(pt.substring(2))}
                        className={`text-left px-3 py-2 rounded-xl font-medium transition-colors ${
                          isDarkMode ? 'hover:bg-slate-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {pt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-bold text-[10px] uppercase text-gray-400 tracking-wider mb-1.5">🔍 Hasil Pencarian untuk "{searchQuery}"</h4>
                <div className="space-y-0.5">
                  <button 
                    type="button"
                    className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`}
                  >
                    💼 Cari posisi <strong>{searchQuery}</strong>
                  </button>
                  <button 
                    type="button"
                    className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`}
                  >
                    🏢 Cari perusahaan <strong>{searchQuery}</strong>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tombol Messenger/Chat */}
      <button 
        type="button" 
        onClick={onMessengerClick} 
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg relative transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
      >
        💬
        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
      </button>
    </header>
  );
}