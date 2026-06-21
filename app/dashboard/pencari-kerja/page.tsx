'use client';
import { useState, useEffect } from 'react';
import TopBar from './_components/topbar';
import BottomBar from './_components/bottombar';
import Sidebar from './_components/sidebar';

interface UserType {
  name: string;
  email: string;
}

export default function PencariKerjaDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<UserType>({
    name: 'Pengguna',
    email: 'email@notlogged.com'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user'); 
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Gagal membaca data login:", error);
        }
      }
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeContent />;
      case 'posting':
        return <PostingContent />;
      case 'notifikasi':
        return <NotifikasiContent />;
      case 'pesan':
        return <PesanContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} user={currentUser} />
      
      <TopBar 
        activeTab={activeTab}
        onProfileClick={() => setSidebarOpen(true)}
        onMessengerClick={() => setActiveTab('pesan')}
      />

      <main className="flex-1 pt-20 pb-28 px-4 max-w-screen-md w-full mx-auto">
        {renderContent()}
      </main>

      <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

// ======================== SUB-KOMPONEN KONTEN UTAMA ========================

function HomeContent() {
  return (
    <div>
      <h1 className="text-xl font-bold text-blue-900 mb-4">Feed Pekerjaan Terbaru</h1>
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg">Software Engineer {item}</h3>
            <p className="text-sm text-gray-500">PT Teknologi Masa Depan</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostingContent() { return <div className="text-gray-500 p-4">Halaman Buat Postingan</div>; }
function NotifikasiContent() { return <div className="text-gray-500 p-4">Halaman Notifikasi</div>; }

// REVISI TERBARU: KOTAK PESAN DENGAN BANYAK AKUN & REALISTIS
function PesanContent() {
  // Data list chat tiruan dengan berbagai variasi status
  const daftarChat = [
    {
      id: 1,
      nama: 'Siti Aminah',
      perusahaan: 'Tokopedia',
      pesan: 'Halo John, apakah besok ada waktu untuk sesi interview teknis jam 10 pagi?',
      waktu: '10.30',
      unread: true,
      inisial: 'S'
    },
    {
      id: 2,
      nama: 'HRD Shopee Indonesia',
      perusahaan: 'Shopee',
      pesan: 'Selamat! Anda dinyatakan lolos ke tahap offering letter. Silakan cek email Anda.',
      waktu: '08.15',
      unread: true,
      inisial: 'S'
    },
    {
      id: 3,
      nama: 'Budi Santoso',
      perusahaan: 'Tech Recruiter',
      pesan: 'Terima kasih atas portofolio yang dikirimkan. Tim kami akan segera meninjau kembali.',
      waktu: 'Kemarin',
      unread: false,
      inisial: 'B'
    },
    {
      id: 4,
      nama: 'Amanda Putri',
      perusahaan: 'Gojek',
      pesan: 'Halo, apakah posisi Senior Frontend Developer di profil Anda masih open?',
      waktu: '18 Jun',
      unread: false,
      inisial: 'A'
    },
    {
      id: 5,
      nama: 'Rian Wijaya',
      perusahaan: 'Dana Indonesia',
      pesan: 'Sama-sama bro, sukses ya buat test coding-nya besok! Jangan lupa istirahat.',
      waktu: '15 Jun',
      unread: false,
      inisial: 'R'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-900">Kotak Masuk Chat</h1>
        <span className="text-xs bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full font-bold">
          {daftarChat.filter(c => c.unread).length} Baru
        </span>
      </div>

      {/* Container List Chat */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
        {daftarChat.map((chat) => (
          <div 
            key={chat.id} 
            className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-all ${
              chat.unread ? 'bg-blue-50/30 border-l-4 border-l-blue-900 pl-3' : 'pl-4'
            }`}
          >
            {/* Bagian Kiri: Avatar & Teks Pesan */}
            <div className="flex items-center gap-3 overflow-hidden flex-1 pr-4">
              {/* Bulatan Avatar */}
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                chat.unread ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {chat.inisial}
              </div>

              {/* Detail Teks */}
              <div className="overflow-hidden w-full">
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <h3 className={`text-sm truncate ${chat.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>
                    {chat.nama}
                  </h3>
                  <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                    • {chat.perusahaan}
                  </span>
                </div>
                <p className={`text-xs truncate ${chat.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {chat.pesan}
                </p>
              </div>
            </div>

            {/* Bagian Kanan: Waktu & Notif Dot */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className={`text-[10px] ${chat.unread ? 'font-bold text-blue-900' : 'text-gray-400'}`}>
                {chat.waktu}
              </span>
              {chat.unread && (
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}