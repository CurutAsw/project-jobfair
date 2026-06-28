'use client';

import { useEffect, useState } from 'react';
import SocialPostCard from '../../_components/social-post-card';
import { deleteApplicationsByJobId } from '../../_lib/applications';
import { createNotification } from '../../_lib/notifications';
import { createSocialPost, deleteSocialPost, getSocialJobId, readSocialPosts, SOCIAL_POSTS_UPDATED_EVENT, updateSocialPost, type SocialPost, type SocialPostType } from '../../_lib/social-posts';

export default function PostingContent() {
  const user = { name: 'PT Teknologi Masa Depan' };
  const [postText, setPostText] = useState('');
  const [postType, setPostType] = useState<Extract<SocialPostType, 'pengumuman' | 'lowongan'>>('pengumuman');
  const [imageUrl, setImageUrl] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'kelola'>('feed');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [posts, setPosts] = useState<SocialPost[]>(() => readSocialPosts());

  useEffect(() => {
    const syncPosts = () => setPosts(readSocialPosts());

    window.addEventListener(SOCIAL_POSTS_UPDATED_EVENT, syncPosts);
    window.addEventListener('storage', syncPosts);
    return () => {
      window.removeEventListener(SOCIAL_POSTS_UPDATED_EVENT, syncPosts);
      window.removeEventListener('storage', syncPosts);
    };
  }, []);

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  };

  const handleCreatePost = () => {
    if (!postText.trim()) return;

    createSocialPost({
      id: `company-${Date.now()}`,
      authorName: user.name,
      authorRole: 'company',
      type: postType,
      content: postText.trim(),
      createdAt: 'Baru saja',
      likes: 0,
      shares: 0,
      comments: [],
      imageUrl: imageUrl || undefined,
      company: postType === 'lowongan' ? user.name : undefined,
      status: postType === 'lowongan' ? 'Aktif' : undefined,
    });
    createNotification({
      audience: 'jobseeker',
      category: postType === 'lowongan' ? 'lowongan' : 'posting',
      title: postType === 'lowongan' ? 'Lowongan Baru' : 'Postingan Perusahaan Baru',
      description: postType === 'lowongan' ? `${user.name} membuka lowongan baru.` : `${user.name} membuat postingan baru di feed.`,
    });
    setPostText('');
    setImageUrl('');
    setActiveTab('feed');
  };

  const toggleLike = (postId: string) => {
    const wasLiked = likedPosts.includes(postId);
    setLikedPosts((current) => wasLiked ? current.filter((id) => id !== postId) : [...current, postId]);
    updateSocialPost(postId, (post) => ({ ...post, likes: Math.max(0, post.likes + (wasLiked ? -1 : 1)) }));
    const post = posts.find((item) => item.id === postId);
    if (!wasLiked) {
      createNotification({
        audience: post?.authorRole === 'company' ? 'company' : 'jobseeker',
        category: 'interaksi',
        title: 'Postingan Disukai',
        description: `${user.name} menyukai postingan ${post?.authorName ?? 'Anda'}.`,
      });
    }
  };

  const addComment = (postId: string, text: string) => {
    updateSocialPost(postId, (post) => ({
      ...post,
      comments: [
        ...post.comments,
        { id: `comment-${Date.now()}`, authorName: user.name, text, createdAt: 'Baru saja' },
      ],
    }));
    const post = posts.find((item) => item.id === postId);
    createNotification({
      audience: post?.authorRole === 'company' ? 'company' : 'jobseeker',
      category: 'komentar',
      title: 'Komentar Baru',
      description: `${user.name} mengomentari postingan ${post?.authorName ?? 'Anda'}.`,
    });
  };

  const sharePost = (postId: string) => {
    updateSocialPost(postId, (post) => ({ ...post, shares: post.shares + 1 }));
    const post = posts.find((item) => item.id === postId);
    createNotification({
      audience: post?.authorRole === 'company' ? 'company' : 'jobseeker',
      category: 'interaksi',
      title: 'Postingan Dibagikan',
      description: `${user.name} membagikan postingan ${post?.authorName ?? 'Anda'}.`,
    });
  };

  const startEditPost = (post: SocialPost) => {
    setEditingId(post.id);
    setEditContent(post.content);
  };

  const saveEditPost = (id: string) => {
    if (!editContent.trim()) return;
    updateSocialPost(id, (post) => ({ ...post, content: editContent.trim() }));
    setEditingId(null);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus postingan ini?')) {
      const post = posts.find((item) => item.id === id);
      if (post?.type === 'lowongan') {
        deleteApplicationsByJobId(getSocialJobId(id));
      }
      deleteSocialPost(id);
    }
  };

  const userPosts = posts.filter((post) => post.authorName === user.name);

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

            <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
              <button type="button" onClick={() => setPostType('pengumuman')} className={`rounded-lg py-2 text-xs font-bold ${postType === 'pengumuman' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500'}`}>Acara & Pengumuman</button>
              <button type="button" onClick={() => setPostType('lowongan')} className={`rounded-lg py-2 text-xs font-bold ${postType === 'lowongan' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500'}`}>Lowongan</button>
            </div>

            <textarea
              value={postText}
              onChange={(event) => setPostText(event.target.value)}
              rows={3}
              className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none rounded-xl bg-gray-50 border border-gray-200 p-3"
              placeholder={postType === 'lowongan' ? 'Tulis deskripsi lowongan, kualifikasi, dan cara melamar...' : 'Bagikan acara, pengumuman, atau update rekrutmen...'}
            />

            <label className="block rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100">
              <input type="file" accept="image/*" onChange={(event) => handleImageChange(event.target.files?.[0])} className="hidden" />
              {imageUrl ? 'Gambar siap diunggah' : 'Tambahkan gambar'}
            </label>

            <button type="button" onClick={handleCreatePost} disabled={!postText.trim()} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Upload
            </button>
          </section>

          <div className="space-y-3">
            {posts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                <h3 className="text-sm font-bold text-gray-900">Belum ada postingan</h3>
                <p className="text-xs text-gray-500 mt-1">Postingan akan muncul setelah Anda menginput pengumuman atau lowongan.</p>
              </div>
            ) : (
              posts.map((post) => (
                <SocialPostCard key={post.id} post={post} currentUserName={user.name} isLiked={likedPosts.includes(post.id)} onLike={toggleLike} onComment={addComment} onShare={sharePost} />
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'kelola' && (
        <div className="space-y-3">
          {userPosts.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
              <h3 className="font-bold text-gray-800">Belum ada postingan</h3>
              <p className="text-sm text-gray-500 mt-1">Postingan perusahaan akan muncul di sini.</p>
            </div>
          ) : (
            userPosts.map((post) => (
              <SocialPostCard
                key={post.id}
                post={post}
                currentUserName={user.name}
                isLiked={likedPosts.includes(post.id)}
                onLike={toggleLike}
                onComment={addComment}
                onShare={sharePost}
                actions={editingId !== post.id && (
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => startEditPost(post)} className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">Edit</button>
                    <button type="button" onClick={() => handleDeletePost(post.id)} className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg">Hapus</button>
                  </div>
                )}
              />
            ))
          )}

          {editingId && (
            <section className="fixed inset-0 z-[70] bg-black/40 px-4 py-6 flex items-end sm:items-center justify-center">
              <div className="bg-white w-full max-w-lg rounded-2xl p-4 space-y-3">
                <h2 className="text-sm font-bold text-gray-900">Edit Postingan</h2>
                <textarea value={editContent} onChange={(event) => setEditContent(event.target.value)} rows={5} className="w-full text-sm text-gray-800 border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingId(null)} className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">Batal</button>
                  <button type="button" onClick={() => saveEditPost(editingId)} className="text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded-lg">Simpan Perubahan</button>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
