'use client';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export default function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const router = useRouter();

  // Fungsi pembuat inisial huruf dari nama (Aman dari error null/undefined)
  const getInitials = (name?: string | null) => {
    if (!name || name === 'Pengguna') return 'U';
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Fungsi Tombol Keluar Akun
  const handleLogout = () => {
    onClose(); // Tutup sidebar
    
    // Menghapus data login dari penyimpanan browser
    localStorage.removeItem('user'); 
    localStorage.removeItem('token'); 
    
    // Kembali ke halaman login
    router.push('/login'); 
  };

  return (
    <>
      {/* Latar Belakang Gelap */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />
      
      {/* Panel Menu Samping */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[70] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Atas: Profil Dinamis */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-gray-800 text-base truncate">
                {user?.name || 'Pengguna'}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'email@notlogged.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Tengah: Navigasi Menu */}
        <nav className="flex-1 p-4 space-y-1">
          <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-900 rounded-xl transition-all font-medium text-sm">
            <span className="text-lg">📄</span>
            <span>CV & Portofolio</span>
          </button>
          <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-900 rounded-xl transition-all font-medium text-sm">
            <span className="text-lg">⚙️</span>
            <span>Pengaturan Akun</span>
          </button>
        </nav>

        {/* Bawah: Tombol Keluar Kembali Ke Login */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button 
            onClick={handleLogout} 
            type="button" 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-bold text-sm shadow-sm"
          >
            <span>🚪</span>
            <span>Keluar Akun</span>
          </button>
          <button 
            onClick={onClose} 
            type="button" 
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </aside>
    </>
  );
}