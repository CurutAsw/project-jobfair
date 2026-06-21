'use client';
import { useState, useRef, useEffect } from 'react';

interface TopBarProps {
  onProfileClick: () => void;
  onMessengerClick: () => void;
  activeTab: string;
}

export default function TopBar({ onProfileClick, onMessengerClick, activeTab }: TopBarProps) {
  const [query, setQuery] = useState('');
  const [showBarRekomendasi, setShowBarRekomendasi] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Data rekomendasi untuk tampilan popup melayang
  const rekomendasiLamaran = [
    { jabatan: 'UI/UX Designer', perusahaan: 'GoTo Group', lokasi: 'Jakarta', tag: '🔥 Populer' },
    { jabatan: 'Frontend Developer', perusahaan: 'BukaLapak', lokasi: 'Remote', tag: '✨ Sesuai Profil' },
  ];

  const rekomendasiAkun = [
    { nama: 'Siti Aminah', jabatan: 'HRD Tokopedia' },
    { nama: 'Budi Santoso', jabatan: 'Tech Recruiter' },
  ];

  // Menutup bar rekomendasi ketika mengklik di luar area search bar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowBarRekomendasi(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 h-16 flex items-center px-4 gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      
      {/* 1. Tombol Profil (Paling Kiri) */}
      <button 
        type="button"
        onClick={onProfileClick}
        className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm active:scale-95 transition-transform shrink-0"
      >
        JD
      </button>

      {/* 2. Search Bar & Dropdown Rekomendasi (Tengah) */}
      <div ref={containerRef} className="flex-1 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input 
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowBarRekomendasi(true);
            // PERBAIKAN: onSearchSubmit(e.target.value) TELAH DIHAPUS DARI SINI AGAR TIDAK ERROR
          }}
          onFocus={() => setShowBarRekomendasi(true)}
          placeholder="Cari lowongan, perusahaan..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-full text-sm transition-all focus:outline-none focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
        />

        {/* BAR REKOMENDASI (Dropdown Melayang) */}
        {showBarRekomendasi && (
          <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto p-4 space-y-4">
            
            {/* Bagian Rekomendasi Lowongan */}
            <div>
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Rekomendasi Lowongan</h4>
              <div className="space-y-2">
                {rekomendasiLamaran.map((job, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50/50 cursor-pointer transition-colors border border-gray-100">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-sm text-gray-800">{job.jabatan}</h5>
                      <span className="text-[9px] font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded">{job.tag}</span>
                    </div>
                    <p className="text-xs text-gray-500">{job.perusahaan} • {job.lokasi}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bagian Rekomendasi Akun */}
            <div>
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Rekomendasi Akun</h4>
              <div className="divide-y divide-gray-100 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                {rekomendasiAkun.map((akun, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-blue-50/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">👤</div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-800">{akun.nama}</h5>
                        <p className="text-[10px] text-gray-400">{akun.jabatan}</p>
                      </div>
                    </div>
                    <button type="button" className="text-[10px] bg-blue-900 text-white px-2.5 py-1 rounded-full font-semibold hover:bg-blue-800">Ikuti</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 3. Tombol Kotak Pesan / Messenger (Paling Kanan) */}
      <button 
        type="button"
        onClick={onMessengerClick}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 relative ${
          activeTab === 'pesan' ? 'bg-blue-50 text-blue-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
      </button>

    </header>
  );
}