'use client';

import { useState } from 'react';

type CompanyPost = {
  id: number;
  nama: string;
  waktu: string;
  konten: string;
  likes: number;
  comments: number;
  isUser: boolean;
};

export default function PostingContent() {
  const user = { name: 'PT Teknologi Masa Depan' };
  const [postText, setPostText] = useState('');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'kelola'>('feed');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [timelinePosts, setTimelinePosts] = useState<CompanyPost[]>([
    {
      id: 1,
      nama: 'PT Teknologi Masa Depan',
      waktu: '2 jam yang lalu',
      konten: 'Kami membuka kesempatan untuk talenta Frontend Developer yang ingin membangun produk digital berdampak. Kandidat dengan pengalaman React dan TypeScript dipersilakan melamar.',
      likes: 56,
      comments: 18,
      isUser: true,
    },
    {
      id: 2,
      nama: 'GoTo Group',
      waktu: 'Kemarin',
      konten: 'Terima kasih untuk seluruh kandidat yang sudah hadir di sesi career talk hari ini. Tim kami akan menghubungi peserta terpilih melalui kotak pesan.',
      likes: 73,
      comments: 21,
      isUser: false,
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

  const startEditPost = (post: CompanyPost) => {
    setEditingId(post.id);
    setEditContent(post.konten);
  };

  const saveEditPost = (id: number) => {
    if (!editContent.trim()) return;
    setTimelinePosts(timelinePosts.map((post) => post.id === id ? { ...post, konten: editContent } : post));
    setEditingId(null);
  };

  const handleDeletePost = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus postingan ini?')) {
      setTimelinePosts(timelinePosts.filter((post) => post.id !== id));
    }
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
              <div className="w-11 h-11 bg-blue-900 text-white rounded-2xl flex items-center justify-center font-bold text-sm shrink-0">PT</div>
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
              placeholder="Bagikan update rekrutmen atau info lowongan terbaru..."
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
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white ${post.isUser ? 'bg-blue-900' : 'bg-teal-700'}`}>
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
          {userPosts.map((post) => (
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
          ))}
        </div>
      )}
    </div>
  );
}