'use client';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function Sidebar({ isOpen, onClose, user, isDarkMode, setIsDarkMode }: SidebarProps) {
  const router = useRouter();

  const getInitials = (name?: string | null) => {
    if (!name || name === 'Pengguna') return 'U';
    return name.trim().split(/\s+/).map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} />
      
      {/* Sidebar Panel */}
      <aside className={`fixed top-0 left-0 h-full w-72 z-[70] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? 'bg-slate-900 border-r border-slate-800 text-gray-100' : 'bg-white text-gray-900'}`}>
        
        {/* Profil Header */}
        <div className={`p-5 border-b space-y-4 ${isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-base shrink-0">{getInitials(user?.name)}</div>
            <div className="overflow-hidden">
              <h3 className={`font-bold text-sm truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{user?.name}</h3>
              <p className={`text-[11px] truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
            </div>
          </div>

          {/* Progress Bar Kelengkapan Profil */}
          <div className={`p-2.5 rounded-xl border shadow-inner space-y-1.5 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between text-[11px] font-bold">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Kelengkapan Profil</span>
              <span className="text-blue-600">75%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <div className="bg-gradient-to-r from-blue-500 to-blue-900 h-full w-[75%] rounded-full"></div>
            </div>
            <p className="text-[9px] text-gray-400">Lengkapi CV untuk dilirik HRD 🚀</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 block mb-1">Aktivitas Karir</span>
            <button type="button" className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-semibold text-xs group ${isDarkMode ? 'text-gray-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-blue-50/50'}`}>
              <div className="flex items-center gap-2.5"><span>📄</span><span>CV & Portofolio</span></div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isDarkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>PDF</span>
            </button>
            <button type="button" className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all font-semibold text-xs ${isDarkMode ? 'text-gray-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-blue-50/50'}`}><span>⏱️</span><span>Riwayat Lamaran</span></button>
            <button type="button" className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all font-semibold text-xs ${isDarkMode ? 'text-gray-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-blue-50/50'}`}><span>🔖</span><span>Lowongan Tersimpan</span></button>
          </div>
          <hr className={isDarkMode ? 'border-slate-800' : 'border-gray-100'} />
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 block mb-1">Akun & Pengaturan</span>
            <button type="button" className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all font-semibold text-xs ${isDarkMode ? 'text-gray-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-blue-50/50'}`}><span>⚙️</span><span>Pengaturan Akun</span></button>
          </div>
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t space-y-3 ${isDarkMode ? 'border-slate-800 bg-slate-950/10' : 'border-gray-100 bg-gray-50/30'}`}>
          {/* Tombol ganti mode tersembunyi/dihilangkan di sini */}
          <button onClick={() => router.push('/login')} type="button" className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs ${isDarkMode ? 'text-red-400 bg-red-950/20 hover:bg-red-950/40' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}>
            <span>🚪</span><span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}