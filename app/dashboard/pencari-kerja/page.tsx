'use client';

import Image from 'next/image';

import { useState } from 'react';
import BottomBar from './_components/bottombar';
import Sidebar from './_components/sidebar';
import TopBar from './_components/topbar';

type TimelinePost = {
  id: number;
  nama: string;
  waktu: string;
  konten: string;
  likes: number;
  comments: number;
  isUser: boolean;
};

type Chat = {
  id: number;
  nama: string;
  perusahaan: string;
  pesan: string;
  waktu: string;
  unread: boolean;
  avatarUrl: string;
};

export default function PencariKerjaDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = {
    name: 'John Doe',
    email: 'johndoe@email.com',
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeContent />;
      case 'posting':
        return <PostingContent user={currentUser} />;
      case 'notifikasi':
        return <NotifikasiContent />;
      case 'pekerjaan':
        return <PekerjaanContent />;
      case 'pesan':
        return <PesanContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 font-sans flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} user={currentUser} />
      <TopBar activeTab={activeTab} onProfileClick={() => setSidebarOpen(true)} onMessengerClick={() => setActiveTab('pesan')} />
      <main className="flex-1 pt-20 pb-28 px-4 max-w-screen-md w-full mx-auto">
        {renderContent()}
      </main>
      <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function HomeContent() {
  const jobs = [
    { title: 'Software Engineer 1', company: 'PT Teknologi Masa Depan', type: 'Full-time', location: 'Jakarta' },
    { title: 'Software Engineer 2', company: 'PT Teknologi Masa Depan', type: 'Hybrid', location: 'Bandung' },
    { title: 'Software Engineer 3', company: 'PT Teknologi Masa Depan', type: 'Remote', location: 'Indonesia' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-blue-900">Feed Pekerjaan Terbaru</h1>
        <p className="text-xs text-gray-500 mt-1">Rekomendasi lowongan yang cocok dengan profilmu.</p>
      </div>
      <div className="space-y-3">
        {jobs.map((job) => (
          <article key={job.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">{job.title}</h2>
                <p className="text-xs text-gray-500 mt-1">{job.company} - {job.location}</p>
              </div>
              <span className="rounded-full bg-blue-50 text-blue-900 px-2 py-1 text-[11px] font-bold shrink-0">{job.type}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs font-semibold text-green-700">Lamaran dibuka</span>
              <button type="button" className="rounded-lg bg-blue-900 text-white px-3 py-2 text-xs font-bold hover:bg-blue-800">Lihat Detail</button>
            </div>
          </article>
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
  const [timelinePosts, setTimelinePosts] = useState<TimelinePost[]>([
    {
      id: 1,
      nama: 'Siti Aminah',
      waktu: '3 jam yang lalu',
      konten: 'Luar biasa! Hari ini tim Tokopedia kedatangan banyak talenta muda berbakat di acara Tech Inflow. Terima kasih buat teman-teman yang sudah mampir ke booth kami!',
      likes: 42,
      comments: 12,
      isUser: false,
    },
    {
      id: 2,
      nama: user.name,
      waktu: 'Kemarin',
      konten: 'Sedang mencari peluang baru di bidang Frontend Development. Jika ada rekan-rekan yang memiliki info lowongan, boleh kabari ya! Terima kasih.',
      likes: 15,
      comments: 3,
      isUser: true,
    },
  ]);

  const handleCreatePost = () => {
    if (!postText.trim()) return;
    setTimelinePosts([
      {
        id: Date.now(),
        nama: user.name,
        waktu: 'Baru saja',
        konten: postText,
        likes: 0,
        comments: 0,
        isUser: true,
      },
      ...timelinePosts,
    ]);
    setPostText('');
    setActiveTab('feed');
  };

  const toggleLike = (postId: number) => {
    setLikedPosts((current) => current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId]);
  };

  const handleDeletePost = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus postingan ini?')) {
      setTimelinePosts(timelinePosts.filter((post) => post.id !== id));
    }
  };

  const startEditPost = (post: TimelinePost) => {
    setEditingId(post.id);
    setEditContent(post.konten);
  };

  const saveEditPost = (id: number) => {
    if (!editContent.trim()) return;
    setTimelinePosts(timelinePosts.map((post) => post.id === id ? { ...post, konten: editContent } : post));
    setEditingId(null);
  };

  const userPosts = timelinePosts.filter((post) => post.isUser);

  return (
    <div className="space-y-4">
      <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <button type="button" onClick={() => setActiveTab('feed')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${activeTab === 'feed' ? 'bg-blue-50 text-blue-900' : 'text-gray-500 hover:bg-gray-50'}`}>
          Feed & Buat Postingan
        </button>
        <button type="button" onClick={() => setActiveTab('kelola')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${activeTab === 'kelola' ? 'bg-blue-50 text-blue-900' : 'text-gray-500 hover:bg-gray-50'}`}>
          Kelola Postingan
        </button>
      </div>

      {activeTab === 'feed' && (
        <>
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-900 text-white rounded-2xl flex items-center justify-center font-bold text-sm shrink-0">
                {user.name.split(' ').map((name) => name[0]).join('')}
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">{user.name}</h2>
                <p className="text-[11px] text-gray-500">Publik</p>
              </div>
            </div>
            <textarea
              value={postText}
              onChange={(event) => setPostText(event.target.value)}
              rows={3}
              className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none rounded-xl bg-gray-50 border border-gray-200 p-3"
              placeholder={`Apa yang Anda pikirkan, ${user.name.split(' ')[0]}?`}
            />
            <button type="button" onClick={handleCreatePost} disabled={!postText.trim()} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Kirim Postingan
            </button>
          </section>

          <div className="space-y-3">
            {timelinePosts.map((post) => {
              const isLiked = likedPosts.includes(post.id);
              return (
                <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white ${post.isUser ? 'bg-blue-900' : 'bg-orange-700'}`}>
                      {post.nama.split(' ').map((name) => name[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">{post.nama}</h2>
                      <p className="text-[11px] text-gray-400 font-medium">{post.waktu} - Publik</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.konten}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400 border-b border-gray-100 pb-2 font-medium">
                    <span>{post.likes + (isLiked ? 1 : 0)} Suka</span>
                    <span>{post.comments} Komentar</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-xs font-bold text-gray-500">
                    <button type="button" onClick={() => toggleLike(post.id)} className={`flex-1 hover:bg-gray-50 py-2 rounded-lg ${isLiked ? 'text-blue-700' : ''}`}>Suka</button>
                    <button type="button" className="flex-1 hover:bg-gray-50 py-2 rounded-lg">Komentar</button>
                    <button type="button" className="flex-1 hover:bg-gray-50 py-2 rounded-lg">Bagikan</button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'kelola' && (
        <div className="space-y-3">
          {userPosts.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
              <h3 className="font-bold text-gray-800">Belum ada postingan</h3>
              <p className="text-sm text-gray-500 mt-1">Anda belum membuat postingan apapun.</p>
            </div>
          ) : (
            userPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
                <div className="flex justify-between items-start gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Diposting pada: {post.waktu}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{post.likes} Suka - {post.comments} Komentar</p>
                  </div>
                  {editingId !== post.id && (
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => startEditPost(post)} className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">Edit</button>
                      <button type="button" onClick={() => handleDeletePost(post.id)} className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg">Hapus</button>
                    </div>
                  )}
                </div>

                {editingId === post.id ? (
                  <div className="space-y-3">
                    <textarea value={editContent} onChange={(event) => setEditContent(event.target.value)} rows={4} className="w-full text-sm text-gray-800 border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditingId(null)} className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">Batal</button>
                      <button type="button" onClick={() => saveEditPost(post.id)} className="text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded-lg">Simpan Perubahan</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.konten}</p>
                )}
              </article>
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
    { id: 1, kategori: 'lamaran', judul: 'Lamaran Ditinjau', deskripsi: 'CV Anda untuk posisi UI/UX Designer di GoTo Group telah dibuka dan ditinjau oleh HRD.', waktu: '10 menit yang lalu', isNew: true },
    { id: 2, kategori: 'sistem', judul: 'Keamanan Akun', deskripsi: 'Kata sandi akun Anda berhasil diperbarui. Jika ini bukan Anda, segera hubungi pusat bantuan.', waktu: '1 jam yang lalu', isNew: false },
    { id: 3, kategori: 'lamaran', judul: 'Undangan Wawancara', deskripsi: 'PT Teknologi Masa Depan mengundang Anda menghadiri wawancara kerja. Cek menu kotak pesan!', waktu: 'Kemarin', isNew: false },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-blue-900">Notifikasi</h1>
      <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        {[{ id: 'semua', label: 'Semua' }, { id: 'sistem', label: 'Sistem' }, { id: 'lamaran', label: 'Lamaran' }].map((tab) => (
          <button key={tab.id} type="button" onClick={() => setFilterAktif(tab.id)} className={`flex-1 py-2 text-sm font-bold rounded-lg ${filterAktif === tab.id ? 'bg-blue-50 text-blue-900' : 'text-gray-500 hover:bg-gray-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {listNotifikasi.filter((notif) => filterAktif === 'semua' || notif.kategori === filterAktif).map((notif) => (
          <article key={notif.id} className={`p-4 rounded-xl border shadow-sm ${notif.isNew ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between gap-3 mb-1">
              <h2 className="text-sm font-bold text-gray-900">{notif.judul}</h2>
              <span className="text-[10px] text-gray-400 shrink-0">{notif.waktu}</span>
            </div>
            <p className="text-xs text-gray-600">{notif.deskripsi}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function PekerjaanContent() {
  const applications = [
    {
      id: 1,
      position: 'Frontend Developer',
      company: 'PT Teknologi Masa Depan',
      submittedAt: 'Dikirim 2 hari yang lalu',
      status: 'Menunggu pesan perusahaan',
      note: 'CV dan portofolio sudah diterima. Perusahaan akan menghubungi melalui kotak pesan jika profil sesuai.',
    },
    {
      id: 2,
      position: 'UI/UX Designer',
      company: 'GoTo Group',
      submittedAt: 'Dikirim kemarin',
      status: 'Sedang ditinjau HRD',
      note: 'Lamaran sedang masuk tahap seleksi awal. Pantau kotak pesan untuk undangan berikutnya.',
    },
    {
      id: 3,
      position: 'Data Analyst',
      company: 'Shopee Indonesia',
      submittedAt: 'Dikirim hari ini',
      status: 'Menunggu konfirmasi',
      note: 'Lamaran berhasil diserahkan kepada perusahaan dan belum ada pesan baru.',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-blue-900">Pekerjaan Dilamar</h1>
        <p className="text-xs text-gray-500 mt-1">Lamaran yang sudah diserahkan kepada perusahaan. Tinggal tunggu pesan dari rekruter.</p>
      </div>
      <div className="space-y-3">
        {applications.map((application) => (
          <article key={application.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">{application.position}</h2>
                <p className="text-xs text-gray-500 mt-1">{application.company} - {application.submittedAt}</p>
              </div>
              <span className="rounded-full bg-yellow-50 text-yellow-700 px-2 py-1 text-[11px] font-bold shrink-0">Pending</span>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <p className="text-xs font-bold text-gray-800">{application.status}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{application.note}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
function PesanContent() {
  const daftarChat: Chat[] = [
    { id: 1, nama: 'Siti Aminah', perusahaan: 'Tokopedia', pesan: 'Halo John, apakah besok ada waktu untuk sesi interview teknis jam 10 pagi?', waktu: '10.30', unread: true, avatarUrl: '/dashboard-images/avatar-siti.svg' },
    { id: 2, nama: 'HRD Shopee Indonesia', perusahaan: 'Shopee', pesan: 'Selamat! Anda dinyatakan lolos ke tahap offering letter. Silakan cek email Anda.', waktu: '08.15', unread: true, avatarUrl: '/dashboard-images/avatar-company.svg' },
  ];
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-blue-900">Kotak Masuk Chat</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
        {daftarChat.map((chat) => (
          <button key={chat.id} type="button" onClick={() => setSelectedChat(chat)} className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 ${chat.unread ? 'bg-blue-50/30 border-l-4 border-l-blue-900' : ''}`}>
            <div className="flex items-center gap-3 overflow-hidden flex-1 pr-4">
              <Image src={chat.avatarUrl} alt={`Foto ${chat.nama}`} width={44} height={44} className="w-11 h-11 rounded-2xl shrink-0" />
              <div className="overflow-hidden w-full">
                <h2 className="text-sm font-bold text-gray-900 truncate">{chat.nama} <span className="text-[10px] text-gray-400 font-normal">- {chat.perusahaan}</span></h2>
                <p className="text-xs text-gray-500 truncate">{chat.pesan}</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 shrink-0">{chat.waktu}</span>
          </button>
        ))}
      </div>

      {selectedChat && (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Image src={selectedChat.avatarUrl} alt={`Foto ${selectedChat.nama}`} width={44} height={44} className="w-11 h-11 rounded-2xl" />
            <div>
              <h2 className="text-sm font-bold text-gray-900">Obrolan dengan {selectedChat.nama}</h2>
              <p className="text-xs text-gray-500">{selectedChat.perusahaan}</p>
            </div>
          </div>
          <div className="rounded-xl bg-gray-100 p-3 text-xs text-gray-700 leading-relaxed">{selectedChat.pesan}</div>
          <div className="flex gap-2">
            <input className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-300" placeholder="Tulis balasan..." />
            <button type="button" className="rounded-lg bg-blue-900 text-white px-4 py-2 text-xs font-bold hover:bg-blue-800">Kirim</button>
          </div>
        </section>
      )}
    </div>
  );
}