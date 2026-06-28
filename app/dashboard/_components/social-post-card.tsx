'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { SocialPost } from '../_lib/social-posts';

type SocialPostCardProps = {
  post: SocialPost;
  currentUserName: string;
  isLiked: boolean;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
  onViewJobDetails?: (post: SocialPost) => void;
  onApplyJob?: (post: SocialPost) => void;
  isJobApplied?: boolean;
  actions?: ReactNode;
};

export default function SocialPostCard({ post, currentUserName, isLiked, onLike, onComment, onShare, onViewJobDetails, onApplyJob, isJobApplied = false, actions }: SocialPostCardProps) {
  const [commentText, setCommentText] = useState('');
  const [isJobDetailOpen, setJobDetailOpen] = useState(false);
  const [isSaved, setSaved] = useState(false);
  const [isApplied, setApplied] = useState(false);
  const typeLabel = post.type === 'lowongan' ? 'Lowongan' : post.type === 'pengumuman' ? 'Acara & Pengumuman' : 'Mencari Kerja';
  const hasApplied = isJobApplied || isApplied;
  const canApplyJob = Boolean(onApplyJob);
  const previewContent = post.content.length > 180 ? `${post.content.slice(0, 180).trimEnd()}...` : post.content;

  const submitComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText('');
  };

  const openJobDetail = () => {
    if (onViewJobDetails) {
      onViewJobDetails(post);
      return;
    }

    setJobDetailOpen(true);
  };

  if (post.type === 'lowongan') {
    return (
      <>
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white bg-blue-900">
                {post.authorName.split(' ').map((name) => name[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">{post.authorName}</h2>
                <p className="text-[11px] text-gray-400 font-medium">{post.createdAt} - {typeLabel}</p>
              </div>
            </div>
            {actions}
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
            <h3 className="text-sm font-bold text-blue-900">Lowongan Pekerjaan</h3>
            <p className="text-xs text-blue-900/80 mt-1">{post.company ?? post.authorName}</p>
          </div>

          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{previewContent}</p>

          {post.imageUrl && (
            <Image src={post.imageUrl} alt="Gambar lowongan" width={720} height={360} className="w-full max-h-80 object-cover rounded-xl border border-gray-100" unoptimized />
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs font-semibold text-green-700">Lamaran dibuka</span>
            <button type="button" onClick={openJobDetail} className="rounded-lg bg-blue-900 text-white px-3 py-2 text-xs font-bold hover:bg-blue-800">Lihat Detail</button>
          </div>
        </article>

        {isJobDetailOpen && (
          <div className="fixed inset-0 z-[60] bg-black/40 px-4 py-6 flex items-end sm:items-center justify-center">
            <section className="bg-white w-full max-w-2xl max-h-[88vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-green-700 mb-1">Lamaran dibuka</p>
                    <h2 className="text-lg font-bold text-blue-900 leading-tight">Lowongan Pekerjaan</h2>
                    <p className="text-xs text-gray-500 mt-1">{post.company ?? post.authorName}</p>
                  </div>
                  <button type="button" onClick={() => setJobDetailOpen(false)} className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200">Tutup</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-gray-700">
                <section className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-900">Deskripsi Lamaran</h3>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </section>

                <section className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') submitComment();
                      }}
                      className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-300"
                      placeholder={`Komentar sebagai ${currentUserName}...`}
                    />
                    <button type="button" onClick={submitComment} className="rounded-lg bg-blue-900 text-white px-4 py-2 text-xs font-bold hover:bg-blue-800">Kirim</button>
                  </div>
                </section>
              </div>

              <div className={`p-4 border-t border-gray-100 grid gap-2 ${canApplyJob ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {canApplyJob && (
                  <button
                    type="button"
                    onClick={() => {
                      onApplyJob?.(post);
                      setApplied(true);
                    }}
                    disabled={hasApplied}
                    className="rounded-lg bg-blue-900 text-white px-3 py-2 text-xs font-bold hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {hasApplied ? 'Sudah Dilamar' : 'Lamar Sekarang'}
                  </button>
                )}
                <button type="button" onClick={() => setSaved((current) => !current)} className="rounded-lg bg-gray-100 text-gray-800 px-3 py-2 text-xs font-bold hover:bg-gray-200">
                  {isSaved ? 'Tersimpan' : 'Simpan'}
                </button>
                <button type="button" onClick={() => setJobDetailOpen(false)} className="rounded-lg border border-gray-200 text-gray-700 px-3 py-2 text-xs font-bold hover:bg-gray-50">Tutup</button>
              </div>
            </section>
          </div>
        )}
      </>
    );
  }

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white ${post.authorRole === 'company' ? 'bg-blue-900' : 'bg-orange-700'}`}>
            {post.authorName.split(' ').map((name) => name[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-gray-900 truncate">{post.authorName}</h2>
            <p className="text-[11px] text-gray-400 font-medium">{post.createdAt} - {typeLabel}</p>
          </div>
        </div>
        {actions}
      </div>

      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {post.imageUrl && (
        <Image src={post.imageUrl} alt="Gambar postingan" width={720} height={360} className="w-full max-h-80 object-cover rounded-xl border border-gray-100" unoptimized />
      )}

      <div className="flex justify-between items-center text-xs text-gray-400 border-b border-gray-100 pb-2 font-medium">
        <span>{post.likes} Suka</span>
        <span>{post.shares} Bagikan</span>
      </div>

      <div className="flex justify-between items-center pt-1 text-xs font-bold text-gray-500">
        <button type="button" onClick={() => onLike(post.id)} className={`flex-1 hover:bg-gray-50 py-2 rounded-lg ${isLiked ? 'text-blue-700' : ''}`}>Suka</button>
        <button type="button" onClick={() => onShare(post.id)} className="flex-1 hover:bg-gray-50 py-2 rounded-lg">Bagikan</button>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitComment();
            }}
            className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-300"
            placeholder={`Komentar sebagai ${currentUserName}...`}
          />
          <button type="button" onClick={submitComment} className="rounded-lg bg-blue-900 text-white px-4 py-2 text-xs font-bold hover:bg-blue-800">Kirim</button>
        </div>
      </div>
    </article>
  );
}
