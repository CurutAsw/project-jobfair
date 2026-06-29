'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import SocialPostCard from '../../_components/social-post-card';
import { createNotification } from '../../_lib/notifications';
import { readSocialPosts, SOCIAL_POSTS_UPDATED_EVENT, updateSocialPost, type SocialPost } from '../../_lib/social-posts';
import type { StoredUserProfile } from '../../_lib/user-profile';
import type { Candidate } from './data';

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function matchesSearch(query: string, values: Array<string | undefined>) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  return values.some((value) => {
    const normalizedValue = normalizeSearchText(value ?? '');
    return normalizedValue.includes(normalizedQuery) || normalizedQuery.split(/\s+/).some((word) => word.length > 2 && normalizedValue.includes(word));
  });
}

function getInitials(name: string) {
  return name.trim().split(/\s+/).map((word) => word[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

type CandidateContentProps = {
  candidates: Candidate[];
  query: string;
  filter: string;
  companyName: string;
  searchAccounts?: StoredUserProfile[];
  searchQuery?: string;
  onClearSearch?: () => void;
  onContact: (candidate: Candidate) => void;
};

export default function CandidateContent({ candidates, query, filter, companyName, searchAccounts = [], searchQuery = '', onClearSearch, onContact }: CandidateContentProps) {
  const [posts, setPosts] = useState<SocialPost[]>(() => readSocialPosts());
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  useEffect(() => {
    const syncPosts = () => setPosts(readSocialPosts());

    window.addEventListener(SOCIAL_POSTS_UPDATED_EVENT, syncPosts);
    window.addEventListener('storage', syncPosts);
    return () => {
      window.removeEventListener(SOCIAL_POSTS_UPDATED_EVENT, syncPosts);
      window.removeEventListener('storage', syncPosts);
    };
  }, []);

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
        description: `${companyName} menyukai postingan ${post?.authorName ?? 'Anda'}.`,
      });
    }
  };

  const addComment = (postId: string, text: string) => {
    updateSocialPost(postId, (post) => ({
      ...post,
      comments: [
        ...post.comments,
        { id: `comment-${Date.now()}`, authorName: companyName, text, createdAt: 'Baru saja', replies: [] },
      ],
    }));
    const post = posts.find((item) => item.id === postId);
    createNotification({
      audience: post?.authorRole === 'company' ? 'company' : 'jobseeker',
      category: 'komentar',
      title: 'Komentar Baru',
      description: `${companyName} mengomentari postingan ${post?.authorName ?? 'Anda'}.`,
    });
  };

  const sharePost = (postId: string) => {
    updateSocialPost(postId, (post) => ({ ...post, shares: post.shares + 1 }));
    const post = posts.find((item) => item.id === postId);
    createNotification({
      audience: post?.authorRole === 'company' ? 'company' : 'jobseeker',
      category: 'interaksi',
      title: 'Postingan Dibagikan',
      description: `${companyName} membagikan postingan ${post?.authorName ?? 'Anda'}.`,
    });
  };


  const isSearchMode = searchQuery.trim().length > 0;

  
  const matchedPosts = posts.filter((post) => matchesSearch(searchQuery, [
    post.authorName,
    post.company,
    post.type,
    post.content,
    post.jobTitle,
    post.location,
    post.workType,
    post.salary,
    post.deadline,
  ]));

  
  if (isSearchMode) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-blue-900">Hasil Pencarian</h1>
          <p className="text-xs text-gray-500 mt-1">Menampilkan akun dan postingan yang cocok dengan &quot;{searchQuery}&quot;.</p>
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-gray-900">Akun yang cocok</h2>
            {onClearSearch && (
              <button type="button" onClick={onClearSearch} className="text-xs font-bold text-blue-700 hover:text-blue-900">
                Kembali ke feed
              </button>
            )}
          </div>

          {searchAccounts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p className="text-xs text-gray-500">Tidak ada akun yang cocok.</p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {searchAccounts.map((account) => (
                <article key={`${account.role}-${account.email}`} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white ${account.role === 'perusahaan' ? 'bg-blue-900' : 'bg-orange-700'}`}>
                    {getInitials(account.nama || 'U')}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{account.nama || 'Pengguna'}</h3>
                    <p className="text-xs text-gray-500 truncate">{account.role === 'perusahaan' ? 'Perusahaan' : 'Pencari Kerja'} - {account.email}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900">Postingan yang cocok</h2>
          {matchedPosts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <h2 className="text-sm font-bold text-gray-900">Postingan tidak ditemukan</h2>
              <p className="text-xs text-gray-500 mt-1">Coba gunakan nama akun, perusahaan, posisi, atau kata kunci lain.</p>
            </div>
          ) : (
            matchedPosts.map((post) => (
              <SocialPostCard key={post.id} post={post} currentUserName={companyName} isLiked={likedPosts.includes(post.id)} onLike={toggleLike} onComment={addComment} onShare={sharePost} />
            ))
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-blue-900">Cari Kandidat</h1>
        <p className="text-xs text-gray-500 mt-1">Filter aktif: {filter}. {query ? `Pencarian untuk ${query}.` : 'Tampilkan kandidat rekomendasi terbaik.'}</p>
      </div>

      <div className="space-y-3">
        {candidates.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <h2 className="text-sm font-bold text-gray-900">Belum ada kandidat</h2>
            <p className="text-xs text-gray-500 mt-1">Kandidat akan muncul setelah ada data yang diinput ke sistem.</p>
          </div>
        ) : (
          candidates.map((candidate) => (
            <article key={candidate.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Image src={candidate.avatarUrl} alt={`Foto ${candidate.name}`} width={44} height={44} className="w-11 h-11 rounded-2xl shrink-0" />
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-gray-900 truncate">{candidate.name}</h2>
                    <p className="text-xs text-gray-500 truncate">{candidate.role} - {candidate.location} - {candidate.experience}</p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-50 text-blue-900 px-2 py-1 text-[11px] font-bold shrink-0">{candidate.match}% cocok</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-gray-100 text-gray-600 px-2.5 py-1 text-[11px] font-semibold">{skill}</span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs font-semibold text-green-700">{candidate.status}</span>
                <button type="button" onClick={() => onContact(candidate)} className="rounded-lg bg-blue-900 text-white px-3 py-2 text-xs font-bold hover:bg-blue-800">Hubungi</button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="pt-2 space-y-3">
        <div>
          <h2 className="text-lg font-bold text-blue-900">Feed Terbaru</h2>
          <p className="text-xs text-gray-500 mt-1">Postingan perusahaan dan pencari kerja yang bisa dikomentari oleh rekruter.</p>
        </div>
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <h2 className="text-sm font-bold text-gray-900">Belum ada postingan</h2>
            <p className="text-xs text-gray-500 mt-1">Feed akan terisi setelah ada postingan yang dibuat.</p>
          </div>
        ) : (
          posts.map((post) => (
            <SocialPostCard key={post.id} post={post} currentUserName={companyName} isLiked={likedPosts.includes(post.id)} onLike={toggleLike} onComment={addComment} onShare={sharePost} />
          ))
        )}
      </div>
    </div>
  );
}
