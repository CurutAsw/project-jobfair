'use client';

import Image from 'next/image';

import { useEffect, useState } from 'react';
import { APPLICATIONS_UPDATED_EVENT, readApplications, saveApplication, type JobApplication } from '../_lib/applications';
import { addChatMessage, CHATS_UPDATED_EVENT, readChats, type SharedChat, upsertChat } from '../_lib/chats';
import { createNotification, NOTIFICATIONS_UPDATED_EVENT, readNotifications, type DashboardNotification } from '../_lib/notifications';
import SocialPostCard from '../_components/social-post-card';
import { createSocialPost, deleteSocialPost, getSocialJobId, readSocialPosts, SOCIAL_POSTS_UPDATED_EVENT, updateSocialPost, type SocialPost } from '../_lib/social-posts';
import BottomBar from './_components/bottombar';
import Sidebar from './_components/sidebar';
import TopBar from './_components/topbar';

type JobPost = {
  postId: string;
  id: number;
  title: string;
  company: string;
  type: string;
  location: string;
  description: string;
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
        return <HomeContent user={currentUser} onApplied={() => setActiveTab('pekerjaan')} />;
      case 'posting':
        return <PostingContent user={currentUser} />;
      case 'notifikasi':
        return <NotifikasiContent />;
      case 'pekerjaan':
        return <PekerjaanContent user={currentUser} />;
      case 'pesan':
        return <PesanContent />;
      default:
        return <HomeContent user={currentUser} onApplied={() => setActiveTab('pekerjaan')} />;
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 font-sans flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} user={currentUser} />
      <TopBar activeTab={activeTab} onProfileClick={() => setSidebarOpen(true)} onMessengerClick={() => setActiveTab('pesan')} />
      <main className="flex-1 pt-20 pb-28 px-4 max-w-3xl w-full mx-auto">
        {renderContent()}
      </main>
      <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function socialPostToJobPost(post: SocialPost): JobPost {
  return {
    postId: post.id,
    id: getSocialJobId(post.id),
    title: 'Lowongan Pekerjaan',
    company: post.company ?? post.authorName,
    type: post.workType ?? '-',
    location: post.location ?? '-',
    description: post.content,
  };
}

function HomeContent({ user, onApplied }: { user: { name: string; email: string }; onApplied: () => void }) {
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [likedJobs, setLikedJobs] = useState<number[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>(() => (
    readApplications().filter((application) => application.applicantEmail === user.email).map((application) => application.jobId)
  ));
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => readSocialPosts());
  const [likedSocialPosts, setLikedSocialPosts] = useState<string[]>([]);
  const [commentText, setCommentText] = useState('');

  const isSelectedJobLiked = selectedJob ? likedJobs.includes(selectedJob.id) : false;
  const isSelectedJobSaved = selectedJob ? savedJobs.includes(selectedJob.id) : false;
  const isSelectedJobApplied = selectedJob ? appliedJobIds.includes(selectedJob.id) : false;

  useEffect(() => {
    const syncPosts = () => setSocialPosts(readSocialPosts());

    window.addEventListener(SOCIAL_POSTS_UPDATED_EVENT, syncPosts);
    window.addEventListener('storage', syncPosts);
    return () => {
      window.removeEventListener(SOCIAL_POSTS_UPDATED_EVENT, syncPosts);
      window.removeEventListener('storage', syncPosts);
    };
  }, []);

  const toggleJobLike = (jobId: number) => {
    if (!selectedJob) return;
    const wasLiked = likedJobs.includes(jobId);
    setLikedJobs((current) => wasLiked ? current.filter((id) => id !== jobId) : [...current, jobId]);
    updateSocialPost(selectedJob.postId, (post) => ({ ...post, likes: Math.max(0, post.likes + (wasLiked ? -1 : 1)) }));
    if (!wasLiked) {
      createNotification({
        audience: 'company',
        category: 'interaksi',
        title: 'Lowongan Disukai',
        description: `${user.name} menyukai lowongan yang dibuka perusahaan.`,
      });
    }
  };

  const toggleSavedJob = (jobId: number) => {
    setSavedJobs((current) => current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId]);
    createNotification({
      audience: 'jobseeker',
      category: 'interaksi',
      title: 'Lowongan Disimpan',
      description: 'Lowongan berhasil disimpan untuk dilihat kembali nanti.',
    });
  };

  const toggleSocialLike = (postId: string) => {
    const wasLiked = likedSocialPosts.includes(postId);
    setLikedSocialPosts((current) => wasLiked ? current.filter((id) => id !== postId) : [...current, postId]);
    updateSocialPost(postId, (post) => ({ ...post, likes: Math.max(0, post.likes + (wasLiked ? -1 : 1)) }));
    const post = socialPosts.find((item) => item.id === postId);
    if (!wasLiked) {
      createNotification({
        audience: post?.authorRole === 'company' ? 'company' : 'jobseeker',
        category: 'interaksi',
        title: 'Postingan Disukai',
        description: `${user.name} menyukai postingan ${post?.authorName ?? 'Anda'}.`,
      });
    }
  };

  const addSocialComment = (postId: string, text: string) => {
    updateSocialPost(postId, (post) => ({
      ...post,
      comments: [
        ...post.comments,
        { id: `comment-${Date.now()}`, authorName: user.name, text, createdAt: 'Baru saja' },
      ],
    }));
    const post = socialPosts.find((item) => item.id === postId);
    createNotification({
      audience: post?.authorRole === 'company' ? 'company' : 'jobseeker',
      category: 'komentar',
      title: 'Komentar Baru',
      description: `${user.name} mengomentari postingan ${post?.authorName ?? 'Anda'}.`,
    });
  };

  const shareSocialPost = (postId: string) => {
    updateSocialPost(postId, (post) => ({ ...post, shares: post.shares + 1 }));
    const post = socialPosts.find((item) => item.id === postId);
    createNotification({
      audience: post?.authorRole === 'company' ? 'company' : 'jobseeker',
      category: 'interaksi',
      title: 'Postingan Dibagikan',
      description: `${user.name} membagikan postingan ${post?.authorName ?? 'Anda'}.`,
    });
  };

  const addJobComment = () => {
    if (!selectedJob || !commentText.trim()) return;
    addSocialComment(selectedJob.postId, commentText.trim());
    setCommentText('');
  };

  const applyToJob = () => {
    if (!selectedJob) return;

    const application: JobApplication = {
      id: `${user.email}-${selectedJob.id}`,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      location: selectedJob.location,
      type: selectedJob.type,
      applicantName: user.name,
      applicantEmail: user.email,
      applicantRole: 'Frontend Developer',
      avatarUrl: '/dashboard-images/avatar-company.svg',
      submittedAt: 'Baru saja',
      status: 'Lamaran terkirim',
      note: 'CV dan portofolio sudah diupload. Menunggu perusahaan meninjau lamaran.',
      uploadedDocuments: ['CV_John_Doe.pdf', 'Portfolio_John_Doe.pdf'],
    };

    saveApplication(application);
    upsertChat({
      id: `application-${selectedJob.id}-${user.email}`,
      companyName: selectedJob.company,
      jobseekerName: user.name,
      jobseekerRole: 'Frontend Developer',
      avatarUrl: '/dashboard-images/avatar-company.svg',
      unreadFor: 'company',
      messages: [
        {
          id: `message-${Date.now()}`,
          sender: 'jobseeker',
          text: `${user.name} mengirim lamaran untuk posisi ${selectedJob.title}.`,
          time: 'Baru saja',
        },
      ],
    });
    createNotification({
      audience: 'company',
      category: 'pelamar',
      title: 'Pelamar Baru',
      description: `${user.name} melamar posisi ${selectedJob.title}.`,
    });
    createNotification({
      audience: 'jobseeker',
      category: 'lamaran',
      title: 'Lamaran Terkirim',
      description: `Lamaran Anda untuk ${selectedJob.title} berhasil dikirim.`,
    });
    setAppliedJobIds((current) => current.includes(selectedJob.id) ? current : [...current, selectedJob.id]);
    setSelectedJob(null);
    onApplied();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-blue-900">Feed Pekerjaan Terbaru</h1>
        <p className="text-xs text-gray-500 mt-1">Rekomendasi lowongan yang cocok dengan profilmu.</p>
      </div>
      <div className="space-y-3">
        {socialPosts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <h2 className="text-sm font-bold text-gray-900">Belum ada postingan</h2>
            <p className="text-xs text-gray-500 mt-1">Postingan akan muncul setelah perusahaan atau pencari kerja menginput data.</p>
          </div>
        ) : (
          socialPosts.map((post) => (
            <SocialPostCard
              key={post.id}
              post={post}
              currentUserName={user.name}
              isLiked={likedSocialPosts.includes(post.id)}
              onLike={toggleSocialLike}
              onComment={addSocialComment}
              onShare={shareSocialPost}
              onViewJobDetails={(jobPost) => setSelectedJob(socialPostToJobPost(jobPost))}
            />
          ))
        )}
      </div>
      {selectedJob && (
        <div className="fixed inset-0 z-60 bg-black/40 px-4 py-6 flex items-end sm:items-center justify-center">
          <section className="bg-white w-full max-w-2xl max-h-[88vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-green-700 mb-1">Lamaran dibuka</p>
                  <h2 className="text-lg font-bold text-blue-900 leading-tight">{selectedJob.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">{selectedJob.company}</p>
                </div>
                <button type="button" onClick={() => setSelectedJob(null)} className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200">Tutup</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-gray-700">
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900">Deskripsi Lamaran</h3>
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
              </section>

              <div className="flex items-center gap-2 border-y border-gray-100 py-2">
                <button type="button" onClick={() => toggleJobLike(selectedJob.id)} className={`flex-1 rounded-lg py-2 text-xs font-bold hover:bg-gray-50 ${isSelectedJobLiked ? 'text-blue-700' : 'text-gray-500'}`}>
                  {isSelectedJobLiked ? 'Disukai' : 'Suka'}
                </button>
                <button type="button" onClick={() => shareSocialPost(selectedJob.postId)} className="flex-1 rounded-lg py-2 text-xs font-bold text-gray-500 hover:bg-gray-50">Bagikan</button>
              </div>

              <section className="space-y-2">
                <div className="flex gap-2">
                  <input
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-300"
                    placeholder="Tulis komentar..."
                  />
                  <button type="button" onClick={addJobComment} className="rounded-lg bg-blue-900 text-white px-4 py-2 text-xs font-bold hover:bg-blue-800">Kirim</button>
                </div>
              </section>
            </div>

            <div className="p-4 border-t border-gray-100 grid grid-cols-3 gap-2">
              <button type="button" onClick={applyToJob} disabled={isSelectedJobApplied} className="rounded-lg bg-blue-900 text-white px-3 py-2 text-xs font-bold hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed">
                {isSelectedJobApplied ? 'Sudah Dilamar' : 'Lamar Sekarang'}
              </button>
              <button type="button" onClick={() => toggleSavedJob(selectedJob.id)} className="rounded-lg bg-gray-100 text-gray-800 px-3 py-2 text-xs font-bold hover:bg-gray-200">
                {isSelectedJobSaved ? 'Tersimpan' : 'Simpan'}
              </button>
              <button type="button" onClick={() => setSelectedJob(null)} className="rounded-lg border border-gray-200 text-gray-700 px-3 py-2 text-xs font-bold hover:bg-gray-50">Tutup</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function PostingContent({ user }: { user: { name: string; email: string } }) {
  const [postText, setPostText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'kelola'>('feed');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [posts, setPosts] = useState<SocialPost[]>(() => readSocialPosts());
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>(() => (
    readApplications().filter((application) => application.applicantEmail === user.email).map((application) => application.jobId)
  ));

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const syncPosts = () => setPosts(readSocialPosts());

    window.addEventListener(SOCIAL_POSTS_UPDATED_EVENT, syncPosts);
    window.addEventListener('storage', syncPosts);
    return () => {
      window.removeEventListener(SOCIAL_POSTS_UPDATED_EVENT, syncPosts);
      window.removeEventListener('storage', syncPosts);
    };
  }, []);

  useEffect(() => {
    const syncApplications = () => {
      setAppliedJobIds(readApplications().filter((application) => application.applicantEmail === user.email).map((application) => application.jobId));
    };

    syncApplications();
    window.addEventListener(APPLICATIONS_UPDATED_EVENT, syncApplications);
    window.addEventListener('storage', syncApplications);
    return () => {
      window.removeEventListener(APPLICATIONS_UPDATED_EVENT, syncApplications);
      window.removeEventListener('storage', syncApplications);
    };
  }, [user.email]);

  const handleCreatePost = () => {
    if (!postText.trim()) return;
    createSocialPost({
      id: `jobseeker-${Date.now()}`,
      authorName: user.name,
      authorRole: 'jobseeker',
      type: 'pencari-kerja',
      content: postText.trim(),
      createdAt: 'Baru saja',
      likes: 0,
      shares: 0,
      comments: [],
      imageUrl: imageUrl || undefined,
    });
    createNotification({
      audience: 'company',
      category: 'posting',
      title: 'Postingan Pencari Kerja Baru',
      description: `${user.name} membuat postingan baru di feed.`,
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

  const handleDeletePost = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus postingan ini?')) {
      deleteSocialPost(id);
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

  const applyToSocialJob = (post: SocialPost) => {
    const job = socialPostToJobPost(post);
    const application: JobApplication = {
      id: `${user.email}-${job.id}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      applicantName: user.name,
      applicantEmail: user.email,
      applicantRole: 'Frontend Developer',
      avatarUrl: '/dashboard-images/avatar-company.svg',
      submittedAt: 'Baru saja',
      status: 'Lamaran terkirim',
      note: 'CV dan portofolio sudah diupload. Menunggu perusahaan meninjau lamaran.',
      uploadedDocuments: ['CV_John_Doe.pdf', 'Portfolio_John_Doe.pdf'],
    };

    saveApplication(application);
    upsertChat({
      id: `application-${job.id}-${user.email}`,
      companyName: job.company,
      jobseekerName: user.name,
      jobseekerRole: 'Frontend Developer',
      avatarUrl: '/dashboard-images/avatar-company.svg',
      unreadFor: 'company',
      messages: [
        {
          id: `message-${Date.now()}`,
          sender: 'jobseeker',
          text: `${user.name} mengirim lamaran untuk posisi ${job.title}.`,
          time: 'Baru saja',
        },
      ],
    });
    createNotification({
      audience: 'company',
      category: 'pelamar',
      title: 'Pelamar Baru',
      description: `${user.name} melamar posisi ${job.title}.`,
    });
    createNotification({
      audience: 'jobseeker',
      category: 'lamaran',
      title: 'Lamaran Terkirim',
      description: `Lamaran Anda untuk ${job.title} berhasil dikirim.`,
    });
    setAppliedJobIds((current) => current.includes(job.id) ? current : [...current, job.id]);
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
            <label className="block rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100">
              <input type="file" accept="image/*" onChange={(event) => handleImageChange(event.target.files?.[0])} className="hidden" />
              {imageUrl ? 'Gambar siap diunggah' : 'Tambahkan gambar'}
            </label>
            <button type="button" onClick={handleCreatePost} disabled={!postText.trim()} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Kirim Postingan
            </button>
          </section>

          <div className="space-y-3">
            {posts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                <h3 className="text-sm font-bold text-gray-900">Belum ada postingan</h3>
                <p className="text-xs text-gray-500 mt-1">Postingan akan muncul setelah Anda atau perusahaan menginput data.</p>
              </div>
            ) : (
              posts.map((post) => (
                <SocialPostCard
                  key={post.id}
                  post={post}
                  currentUserName={user.name}
                  isLiked={likedPosts.includes(post.id)}
                  onLike={toggleLike}
                  onComment={addComment}
                  onShare={sharePost}
                  onApplyJob={applyToSocialJob}
                  isJobApplied={post.type === 'lowongan' ? appliedJobIds.includes(getSocialJobId(post.id)) : false}
                />
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
              <p className="text-sm text-gray-500 mt-1">Anda belum membuat postingan apapun.</p>
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
                onApplyJob={applyToSocialJob}
                isJobApplied={post.type === 'lowongan' ? appliedJobIds.includes(getSocialJobId(post.id)) : false}
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

function NotifikasiContent() {
  const [filterAktif, setFilterAktif] = useState('semua');
  const [notifications, setNotifications] = useState<DashboardNotification[]>(() => readNotifications('jobseeker'));

  useEffect(() => {
    const syncNotifications = () => setNotifications(readNotifications('jobseeker'));

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, syncNotifications);
    window.addEventListener('storage', syncNotifications);
    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, syncNotifications);
      window.removeEventListener('storage', syncNotifications);
    };
  }, []);

  const visibleNotifications = notifications.filter((notif) => filterAktif === 'semua' || notif.category === filterAktif);

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
        {visibleNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <h2 className="text-sm font-bold text-gray-900">Belum ada notifikasi</h2>
            <p className="text-xs text-gray-500 mt-1">Notifikasi akan muncul ketika ada interaksi baru.</p>
          </div>
        ) : (
          visibleNotifications.map((notif) => (
            <article key={notif.id} className={`p-4 rounded-xl border shadow-sm ${notif.isNew ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between gap-3 mb-1">
                <h2 className="text-sm font-bold text-gray-900">{notif.title}</h2>
                <span className="text-[10px] text-gray-400 shrink-0">{notif.createdAt}</span>
              </div>
              <p className="text-xs text-gray-600">{notif.description}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function PekerjaanContent({ user }: { user: { email: string } }) {
  const [uploadedApplications, setUploadedApplications] = useState<JobApplication[]>([]);
  const [activeJobIds, setActiveJobIds] = useState<number[]>(() => (
    readSocialPosts().filter((post) => post.type === 'lowongan').map((post) => getSocialJobId(post.id))
  ));
  const allApplications = uploadedApplications.filter((application) => activeJobIds.includes(application.jobId)).map((application) => ({
    id: application.id,
    position: application.jobTitle,
    company: application.company,
    submittedAt: application.submittedAt,
    status: application.status,
    note: `${application.note} Dokumen: ${application.uploadedDocuments.join(', ')}.`,
    badge: 'Terkirim',
  }));

  useEffect(() => {
    const syncApplications = () => {
      setUploadedApplications(readApplications().filter((application) => application.applicantEmail === user.email));
      setActiveJobIds(readSocialPosts().filter((post) => post.type === 'lowongan').map((post) => getSocialJobId(post.id)));
    };

    syncApplications();
    window.addEventListener(APPLICATIONS_UPDATED_EVENT, syncApplications);
    window.addEventListener(SOCIAL_POSTS_UPDATED_EVENT, syncApplications);
    window.addEventListener('storage', syncApplications);
    return () => {
      window.removeEventListener(APPLICATIONS_UPDATED_EVENT, syncApplications);
      window.removeEventListener(SOCIAL_POSTS_UPDATED_EVENT, syncApplications);
      window.removeEventListener('storage', syncApplications);
    };
  }, [user.email]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-blue-900">Pekerjaan Dilamar</h1>
        <p className="text-xs text-gray-500 mt-1">Lamaran yang sudah diserahkan kepada perusahaan. Tinggal tunggu pesan dari rekruter.</p>
      </div>
      <div className="space-y-3">
        {allApplications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <h2 className="text-sm font-bold text-gray-900">Belum ada pekerjaan dilamar</h2>
            <p className="text-xs text-gray-500 mt-1">Pekerjaan akan muncul setelah Anda menekan Lamar Sekarang pada lowongan.</p>
          </div>
        ) : (
          allApplications.map((application) => (
            <article key={application.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-gray-900 truncate">{application.position}</h2>
                  <p className="text-xs text-gray-500 mt-1">{application.company} - {application.submittedAt}</p>
                </div>
                <span className="rounded-full bg-yellow-50 text-yellow-700 px-2 py-1 text-[11px] font-bold shrink-0">{application.badge}</span>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                <p className="text-xs font-bold text-gray-800">{application.status}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{application.note}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
function PesanContent() {
  const [draft, setDraft] = useState('');
  const [chats, setChats] = useState<SharedChat[]>(() => readChats());
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const selectedChat = chats.find((chat) => chat.id === selectedChatId) ?? null;

  useEffect(() => {
    const syncChats = () => setChats(readChats());

    window.addEventListener(CHATS_UPDATED_EVENT, syncChats);
    window.addEventListener('storage', syncChats);
    return () => {
      window.removeEventListener(CHATS_UPDATED_EVENT, syncChats);
      window.removeEventListener('storage', syncChats);
    };
  }, []);

  const handleSendMessage = () => {
    if (!selectedChat || !draft.trim()) return;
    addChatMessage(selectedChat.id, 'jobseeker', draft.trim());
    createNotification({
      audience: 'company',
      category: 'pesan',
      title: 'Pesan Baru',
      description: `${selectedChat.jobseekerName} mengirim pesan baru.`,
    });
    setDraft('');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-blue-900">Kotak Masuk Chat</h1>

      <div className="grid gap-3 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          {chats.length === 0 ? (
            <div className="p-6 text-center">
              <h2 className="text-sm font-bold text-gray-900">Belum ada chat</h2>
              <p className="text-xs text-gray-500 mt-1">Chat akan muncul setelah ada lamaran atau pesan baru.</p>
            </div>
          ) : (
            chats.map((chat) => {
              const lastMessage = chat.messages.at(-1);
              const isActive = selectedChatId === chat.id;

              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-900' : chat.unreadFor === 'jobseeker' ? 'bg-blue-50/30 border-l-4 border-l-blue-900' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <Image src={chat.avatarUrl} alt={`Foto ${chat.companyName}`} width={44} height={44} className="w-11 h-11 rounded-2xl shrink-0" />
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-gray-900 truncate">{chat.companyName}</h2>
                      <p className="text-[10px] text-gray-400 font-normal truncate">{chat.jobseekerRole}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{lastMessage?.text ?? 'Belum ada pesan'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{lastMessage?.time ?? 'Baru saja'}</span>
                </button>
              );
            })
          )}
        </div>

        {selectedChat ? (
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[520px] flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
              <Image src={selectedChat.avatarUrl} alt={`Foto ${selectedChat.companyName}`} width={44} height={44} className="w-11 h-11 rounded-2xl" />
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">{selectedChat.companyName}</h2>
                <p className="text-xs text-gray-500 truncate">Perusahaan - online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-green-50/50 p-4 space-y-2">
              {selectedChat.messages.map((message) => {
                const isJobseeker = message.sender === 'jobseeker';

                return (
                  <div key={message.id} className={`flex ${isJobseeker ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[82%] rounded-2xl px-3 py-2 shadow-sm ${isJobseeker ? 'bg-blue-900 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm'}`}>
                      <p className="text-xs leading-relaxed">{message.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${isJobseeker ? 'text-blue-100' : 'text-gray-400'}`}>{message.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 border-t border-gray-100 bg-white p-3">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSendMessage();
                }}
                className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2 text-xs outline-none focus:border-blue-300"
                placeholder="Tulis pesan..."
              />
              <button type="button" onClick={handleSendMessage} className="rounded-full bg-blue-900 text-white px-5 py-2 text-xs font-bold hover:bg-blue-800">Kirim</button>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[320px] flex items-center justify-center p-6 text-center">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Pilih riwayat chat</h2>
              <p className="text-xs text-gray-500 mt-1">Klik perusahaan di kotak pesan untuk membuka percakapan.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
