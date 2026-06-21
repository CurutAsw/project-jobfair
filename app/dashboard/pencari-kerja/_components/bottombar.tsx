'use client';

interface BottomBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
}

export default function BottomBar({ activeTab, setActiveTab, isDarkMode }: BottomBarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'posting', label: 'Posting', icon: '➕' },
    { id: 'notifikasi', label: 'Notifikasi', icon: '🔔' }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around px-2 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center justify-center w-16 h-full relative"
          >
            {/* Ikon Menu */}
            <span className="text-xl mb-0.5">{item.icon}</span>
            
            {/* Teks Label - Berubah warna biru saat aktif */}
            <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-blue-900 font-extrabold' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.label}
            </span>

            {/* Badges Notifikasi Merah jika ada */}
            {item.id === 'notifikasi' && (
              <span className="absolute top-2 right-4 w-2 h-2 bg-red-600 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}