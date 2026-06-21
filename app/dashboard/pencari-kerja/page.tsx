'use client';
import { useState } from 'react';
import TopBar from './_components/topbar';
import BottomBar from './_components/bottombar';
import Sidebar from './_components/sidebar';

export default function PencariKerjaDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const currentUser = {
    name: 'John Doe',
    email: 'johndoe@email.com'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeContent />;
      case 'posting':
        return <PostingContent user={currentUser} />;
      case 'notifikasi':
        return <NotifikasiContent />;
      case 'pesan':
        return <PesanContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 font-sans flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Pastikan kamu juga sudah menghapus props isDarkMode dari komponen Sidebar di file sidebar.tsx */}
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

function PostingContent({ user }: { user: { name: string } }) {
  const [postText, setPostText] = useState('');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'kelola'>('feed');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  
  const [timelinePosts, setTimelinePosts] = useState([
    {
      id: 1,
      nama: 'Siti Aminah',
      waktu: '3 jam yang lalu',
      konten: 'Luar biasa! Hari ini tim Tokopedia kedatangan banyak talenta muda berbakat di acara Tech Inflow. Terima kasih buat teman-teman yang sudah mampir ke booth kami! 🚀💼',
      likes: 42,
      comments: 12,
      isUser: false
    },
    {
      id: 2,
      nama: user.name,
      waktu: 'Kemarin',
      konten: 'Sedang mencari peluang baru di bidang Frontend Development. Jika ada rekan-rekan yang memiliki info lowongan, boleh kabari ya! Terima kasih. 🙏',
      likes: 15,
      comments: 3,
      isUser: true
    }
  ]);

  const handleCreatePost = () => {
    if (!postText.trim()) return;
    const newPost = {
      id: Date.now(),
      nama: user.name,
      waktu: 'Baru saja',
      konten: postText,
      likes: 0,
      comments: 0,
      isUser: true
    };
    setTimelinePosts([newPost, ...timelinePosts]);
    setPostText('');
    setActiveTab('feed');
  };

  const toggleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const handleDeletePost = (id: number) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus postingan ini?');
    if (confirmDelete) {
      setTimelinePosts(timelinePosts.filter(post => post.id !== id));
    }
  };

  const startEditPost = (post: any) => {
    setEditingId(post.id);
    setEditContent(post.konten);
  };

  const saveEditPost = (id: number) => {
    if (!editContent.trim()) return;
    setTimelinePosts(timelinePosts.map(post => 
      post.id === id ? { ...post, konten: editContent } : post
    ));
    setEditingId(null);
  };

  const userPosts = timelinePosts.filter(post => post.isUser);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      
      {/* NAVIGASI TAB POSTING */}
      <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'feed' ? 'bg-blue-50 text-blue-900' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          📰 Feed & Buat Postingan
        </button>
        <button 
          onClick={() => setActiveTab('kelola')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'kelola' ? 'bg-blue-50 text-blue-900' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          ⚙️ Kelola Postingan
        </button>
      </div>

      {/* TAB 1: FEED & BUAT POSTINGAN */}
      {activeTab === 'feed' && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">{user.name}</h4>
                <button type="button" className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-md text-[11px] font-bold text-gray-600 mt-0.5 transition-colors">
                  🌎 <span>Publik</span> ▾
                </button>
              </div>
            </div>

            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={3}
              className="w-full text-base text-gray-800 placeholder-gray-400 focus:outline-none resize-none py-1"
              placeholder={`Apa yang Anda pikirkan, ${user.name.split(' ')[0]}?`}
            />

            <hr className="border-gray-100 my-3" />

            <div className="flex justify-between items-center gap-1">
              <button type="button" className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-50 py-2 rounded-lg transition-colors text-xs font-semibold text-gray-600"><span className="text-base text-green-500">🖼️</span><span className="hidden sm:inline">Foto/Video</span></button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-50 py-2 rounded-lg transition-colors text-xs font-semibold text-gray-600"><span className="text-base text-blue-500">👤</span><span className="hidden sm:inline">Tag Teman</span></button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-50 py-2 rounded-lg transition-colors text-xs font-semibold text-gray-600"><span className="text-base text-yellow-500">😊</span><span className="hidden sm:inline">Perasaan</span></button>
            </div>

            <button
              type="button"
              onClick={handleCreatePost}
              disabled={!postText.trim()}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Kirim Postingan
            </button>
          </div>

          <div className="space-y-3">
            {timelinePosts.map((post) => {
              const isLiked = likedPosts.includes(post.id);
              return (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${post.isUser ? 'bg-blue-900' : 'bg-orange-600'}`}>
                        {post.nama.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 hover:underline cursor-pointer">{post.nama}</h4>
                        <p className="text-[11px] text-gray-400 font-medium">{post.waktu} • 🌎</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.konten}</p>

                  <div className="flex justify-between items-center text-xs text-gray-400 border-b border-gray-100 pb-2 font-medium">
                    <div className="flex items-center gap-1"><span className="bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px]">👍</span><span>{post.likes + (isLiked ? 1 : 0)} Suka</span></div>
                    <div><span>{post.comments} Komentar</span></div>
                  </div>

                  <div className="flex justify-between items-center pt-1 text-xs font-bold text-gray-500">
                    <button onClick={() => toggleLike(post.id)} className={`flex-1 flex items-center justify-center gap-2 hover:bg-gray-50 py-2 rounded-lg transition-colors ${isLiked ? 'text-blue-600' : ''}`}><span>👍</span><span>Suka</span></button>
                    <button type="button" className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-50 py-2 rounded-lg transition-colors"><span>💬</span><span>Komentar</span></button>
                    <button type="button" className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-50 py-2 rounded-lg transition-colors"><span>↪️</span><span>Bagikan</span></button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* TAB 2: KELOLA POSTINGAN */}
      {activeTab === 'kelola' && (
        <div className="space-y-3">
          {userPosts.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
              <span className="text-4xl mb-2 block">📭</span>
              <h3 className="font-bold text-gray-800">Belum ada postingan</h3>
              <p className="text-sm text-gray-500 mt-1">Anda belum membuat postingan apapun.</p>
            </div>
          ) : (
            userPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Diposting pada: {post.waktu}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">👍 {post.likes} Suka • 💬 {post.comments} Komentar</p>
                  </div>
                  
                  {editingId !== post.id && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => startEditPost(post)}
                        className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  )}
                </div>

                {editingId === post.id ? (
                  <div className="space-y-3 animate-fadeIn">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      className="w-full text-sm text-gray-800 border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingId(null)}
                        className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={() => saveEditPost(post.id)}
                        className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.konten}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function NotifikasiContent() {
  const [filterAktif, setFilterAktif] = useState('semua');
  const listNotifikasi = [
    { id: 1, kategori: 'lamaran', judul: 'Lamaran Ditinjau 📄', deskripsi: 'CV Anda untuk posisi UI/UX Designer di GoTo Group telah dibuka dan ditinjau oleh HRD.', waktu: '10 menit yang lalu', isNew: true },
    { id: 2, kategori: 'sistem', judul: 'Keamanan Akun 🔒', deskripsi: 'Kata sandi akun Anda berhasil diperbarui. Jika ini bukan Anda, segera hubungi pusat bantuan.', waktu: '1 jam yang lalu', isNew: false },
    { id: 3, kategori: 'lamaran', judul: 'Undangan Wawancara 💼', deskripsi: 'PT Teknologi Masa Depan mengundang Anda menghadiri wawancara kerja. Cek menu kotak pesan!', waktu: 'Kemarin', isNew: false }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-blue-900">Notifikasi</h1>
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl">
        {[{ id: 'semua', label: 'Semua' }, { id: 'sistem', label: '⚙️ Sistem' }, { id: 'lamaran', label: '💼 Lamaran' }].map((tab) => (
          <button key={tab.id} type="button" onClick={() => setFilterAktif(tab.id)} className={`flex-1 text-center py-3 text-sm font-bold border-b-2 transition-all ${filterAktif === tab.id ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-400'}`}>{tab.label}</button>
        ))}
      </div>
      <div className="space-y-2">
        {listNotifikasi.filter(n => filterAktif === 'semua' || n.kategori === filterAktif).map((notif) => (
          <div key={notif.id} className={`p-4 rounded-xl border ${notif.isNew ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between mb-1"><h4 className="text-sm font-bold text-gray-800">{notif.judul}</h4><span className="text-[10px] text-gray-400">{notif.waktu}</span></div>
            <p className="text-xs text-gray-600">{notif.deskripsi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PesanContent() {
  const daftarChat = [
    { id: 1, nama: 'Siti Aminah', perusahaan: 'Tokopedia', pesan: 'Halo John, apakah besok ada waktu untuk sesi interview teknis jam 10 pagi?', waktu: '10.30', unread: true, inisial: 'S' },
    { id: 2, nama: 'HRD Shopee Indonesia', perusahaan: 'Shopee', pesan: 'Selamat! Anda dinyatakan lolos ke tahap offering letter. Silakan cek email Anda.', waktu: '08.15', unread: true, inisial: 'S' }
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-blue-900">Kotak Masuk Chat</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
        {daftarChat.map((chat) => (
          <div key={chat.id} className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${chat.unread ? 'bg-blue-50/30 border-l-4 border-l-blue-900' : ''}`}>
            <div className="flex items-center gap-3 overflow-hidden flex-1 pr-4">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${chat.unread ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-600'}`}>{chat.inisial}</div>
              <div className="overflow-hidden w-full">
                <h3 className="text-sm font-bold text-gray-900 truncate">{chat.nama} <span className="text-[10px] text-gray-400 font-normal">• {chat.perusahaan}</span></h3>
                <p className="text-xs text-gray-500 truncate">{chat.pesan}</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 shrink-0">{chat.waktu}</span>
          </div>
        ))}
      </div>
    </div>
  );
}