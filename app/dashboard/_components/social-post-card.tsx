'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { updateSocialPost, type SocialComment, type SocialPost } from '../_lib/social-posts';

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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isJobDetailOpen, setJobDetailOpen] = useState(false);
  const [isSaved, setSaved] = useState(false);
  const [isApplied, setApplied] = useState(false);
  const typeLabel = post.type === 'lowongan' ? 'Lowongan' : post.type === 'pengumuman' ? 'Acara & Pengumuman' : 'Mencari Kerja';
  const hasApplied = isJobApplied || isApplied;
  const canApplyJob = Boolean(onApplyJob);
  const previewContent = post.content.length > 180 ? `${post.content.slice(0, 180).trimEnd()}...` : post.content;
  const comments = post.comments;
  const cardClassName = 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-h-[520px] flex flex-col gap-3 overflow-hidden';
  const simpleCommentsClassName = 'max-h-28 overflow-y-auto scrollbar-hidden pr-1 space-y-2';
  const detailCommentsClassName = 'max-h-48 overflow-y-auto scrollbar-hidden pr-1 space-y-2';
  const detailBodyClassName = 'flex-1 overflow-y-auto p-4 text-sm text-gray-700 flex flex-col gap-4';
  const detailCommentsSectionClassName = 'mt-auto space-y-2';

  const submitComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText('');
  };

  const updateComments = (updater: (comments: SocialComment[]) => SocialComment[]) => {
    updateSocialPost(post.id, (currentPost) => ({
      ...currentPost,
      comments: updater(currentPost.comments),
    }));
  };

  const mapCommentTree = (items: SocialComment[], commentId: string, mapper: (comment: SocialComment) => SocialComment): SocialComment[] => (
    items.map((comment) => {
      if (comment.id === commentId) return mapper(comment);
      return {
        ...comment,
        replies: comment.replies ? mapCommentTree(comment.replies, commentId, mapper) : comment.replies,
      };
    })
  );

  const removeCommentFromTree = (items: SocialComment[], commentId: string): SocialComment[] => (
    items
      .filter((comment) => comment.id !== commentId)
      .map((comment) => ({
        ...comment,
        replies: comment.replies ? removeCommentFromTree(comment.replies, commentId) : comment.replies,
      }))
  );

  const startEditComment = (comment: SocialComment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
    setReplyingCommentId(null);
  };

  const saveEditComment = (commentId: string) => {
    if (!editCommentText.trim()) return;
    updateComments((currentComments) => mapCommentTree(currentComments, commentId, (comment) => ({ ...comment, text: editCommentText.trim() })));
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const deleteComment = (commentId: string) => {
    updateComments((currentComments) => removeCommentFromTree(currentComments, commentId));
  };

  const startReplyComment = (commentId: string) => {
    setReplyingCommentId(commentId);
    setReplyText('');
    setEditingCommentId(null);
  };

  const saveReplyComment = (commentId: string) => {
    if (!replyText.trim()) return;
    const reply: SocialComment = {
      id: `reply-${crypto.randomUUID()}`,
      authorName: currentUserName,
      text: replyText.trim(),
      createdAt: 'Baru saja',
      replies: [],
    };
    updateComments((currentComments) => mapCommentTree(currentComments, commentId, (comment) => ({
      ...comment,
      replies: [...(comment.replies ?? []), reply],
    })));
    setReplyingCommentId(null);
    setReplyText('');
  };

  const renderComments = (items: SocialComment[], depth = 0): ReactNode => (
    items.map((comment) => {
      const isEditing = editingCommentId === comment.id;
      const isReplying = replyingCommentId === comment.id;

      return (
        <div key={comment.id} className={depth > 0 ? 'ml-4 border-l border-gray-200 pl-3' : ''}>
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-gray-900 truncate">{comment.authorName}</p>
              <span className="text-[10px] text-gray-400 shrink-0">{comment.createdAt}</span>
            </div>
            {isEditing ? (
              <div className="mt-2 space-y-2">
                <input
                  value={editCommentText}
                  onChange={(event) => setEditCommentText(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 outline-none focus:border-blue-300"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => saveEditComment(comment.id)} className="text-[10px] font-bold text-blue-700">Simpan</button>
                  <button type="button" onClick={() => setEditingCommentId(null)} className="text-[10px] font-bold text-gray-500">Batal</button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-900 leading-relaxed mt-1 whitespace-pre-wrap">{comment.text}</p>
            )}
            {!isEditing && (
              <div className="mt-2 flex gap-3 text-[10px] font-bold">
                <button type="button" onClick={() => startReplyComment(comment.id)} className="text-blue-700">Balas</button>
                <button type="button" onClick={() => startEditComment(comment)} className="text-gray-500">Edit</button>
                <button type="button" onClick={() => deleteComment(comment.id)} className="text-red-600">Hapus</button>
              </div>
            )}
            {isReplying && (
              <div className="mt-2 space-y-2">
                <input
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') saveReplyComment(comment.id);
                  }}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 outline-none focus:border-blue-300"
                  placeholder={`Balas ${comment.authorName}...`}
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => saveReplyComment(comment.id)} className="text-[10px] font-bold text-blue-700">Kirim</button>
                  <button type="button" onClick={() => setReplyingCommentId(null)} className="text-[10px] font-bold text-gray-500">Batal</button>
                </div>
              </div>
            )}
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-2">
              {renderComments(comment.replies, depth + 1)}
            </div>
          )}
        </div>
      );
    })
  );

  const openJobDetail = () => {
    if (post.type === 'lowongan' && onViewJobDetails) {
      onViewJobDetails(post);
      return;
    }

    setJobDetailOpen(true);
  };

  if (post.type === 'lowongan') {
    return (
      <>
        <article className={cardClassName}>
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

          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap line-clamp-4">{previewContent}</p>

          {post.imageUrl && (
            <Image src={post.imageUrl} alt="Gambar lowongan" width={720} height={360} className="w-full h-40 object-cover rounded-xl border border-gray-100" unoptimized />
          )}

          <div className="flex justify-between items-center text-xs text-gray-400 border-b border-gray-100 pb-2 font-medium">
            <span>{post.likes} Suka</span>
            <span>{post.comments.length} Komentar</span>
            <span>{post.shares} Bagikan</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3 gap-2">
            <span className="text-xs font-semibold text-green-700">Lamaran dibuka</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => onLike(post.id)} className={`rounded-lg px-3 py-2 text-xs font-bold hover:bg-gray-50 ${isLiked ? 'text-blue-700' : 'text-gray-500'}`}>Suka</button>
              <button type="button" onClick={() => onShare(post.id)} className="rounded-lg px-3 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50">Bagikan</button>
              <button type="button" onClick={openJobDetail} className="rounded-lg bg-blue-900 text-white px-3 py-2 text-xs font-bold hover:bg-blue-800">Lihat Detail</button>
            </div>
          </div>

          <div className="min-h-0 space-y-2">
            {comments.length > 0 && (
              <div className={simpleCommentsClassName}>
                {renderComments(comments)}
              </div>
            )}

            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') submitComment();
                }}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-blue-300"
                placeholder={`Komentar sebagai ${currentUserName}...`}
              />
              <button type="button" onClick={submitComment} className="rounded-lg bg-blue-900 text-white px-4 py-2 text-xs font-bold hover:bg-blue-800">Kirim</button>
            </div>
          </div>
        </article>

        {isJobDetailOpen && (
          <div className="fixed inset-0 z-60 bg-black/40 px-4 py-6 flex items-end sm:items-center justify-center">
            <section className="bg-white w-full max-w-2xl min-h-[560px] max-h-[88vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
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

              <div className={detailBodyClassName}>
                <section className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-900">Deskripsi Lamaran</h3>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </section>

                <section className={detailCommentsSectionClassName}>
                  <h3 className="text-sm font-bold text-gray-900">Komentar</h3>
                  {comments.length > 0 ? (
                    <div className={detailCommentsClassName}>
                      {renderComments(comments)}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Belum ada komentar.</p>
                  )}
                </section>
              </div>

              <div className="shrink-0 border-t border-gray-100 bg-white p-4">
                <div className="flex gap-2">
                  <input
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') submitComment();
                    }}
                    className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-blue-300"
                    placeholder={`Komentar sebagai ${currentUserName}...`}
                  />
                  <button type="button" onClick={submitComment} className="rounded-lg bg-blue-900 text-white px-4 py-2 text-xs font-bold hover:bg-blue-800">Kirim</button>
                </div>
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
    <>
    <article className={cardClassName}>
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

      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap line-clamp-4">{previewContent}</p>

      {post.imageUrl && (
        <Image src={post.imageUrl} alt="Gambar postingan" width={720} height={360} className="w-full h-40 object-cover rounded-xl border border-gray-100" unoptimized />
      )}

      <div className="flex justify-between items-center text-xs text-gray-400 border-b border-gray-100 pb-2 font-medium">
        <span>{post.likes} Suka</span>
        <span>{post.comments.length} Komentar</span>
        <span>{post.shares} Bagikan</span>
      </div>

      <div className="flex justify-between items-center pt-1 text-xs font-bold text-gray-500">
        <button type="button" onClick={() => onLike(post.id)} className={`flex-1 hover:bg-gray-50 py-2 rounded-lg ${isLiked ? 'text-blue-700' : ''}`}>Suka</button>
        <button type="button" onClick={() => onShare(post.id)} className="flex-1 hover:bg-gray-50 py-2 rounded-lg">Bagikan</button>
        <button type="button" onClick={openJobDetail} className="flex-1 hover:bg-gray-50 py-2 rounded-lg">Lihat Detail</button>
      </div>

      <div className="min-h-0 space-y-2">
        {comments.length > 0 && (
          <div className={simpleCommentsClassName}>
            {renderComments(comments)}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitComment();
            }}
            className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-blue-300"
            placeholder={`Komentar sebagai ${currentUserName}...`}
          />
          <button type="button" onClick={submitComment} className="rounded-lg bg-blue-900 text-white px-4 py-2 text-xs font-bold hover:bg-blue-800">Kirim</button>
        </div>
      </div>
    </article>
    {isJobDetailOpen && (
      <div className="fixed inset-0 z-60 bg-black/40 px-4 py-6 flex items-end sm:items-center justify-center">
        <section className="bg-white w-full max-w-2xl min-h-[560px] max-h-[88vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-blue-700 mb-1">{typeLabel}</p>
                <h2 className="text-lg font-bold text-blue-900 leading-tight">{typeLabel}</h2>
                <p className="text-xs text-gray-500 mt-1">{post.authorName}</p>
              </div>
              <button type="button" onClick={() => setJobDetailOpen(false)} className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200">Tutup</button>
            </div>
          </div>

          <div className={detailBodyClassName}>
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900">Detail Postingan</h3>
              <p className="text-xs leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </section>

            {post.imageUrl && (
              <Image src={post.imageUrl} alt="Gambar postingan" width={720} height={360} className="w-full max-h-80 object-cover rounded-xl border border-gray-100" unoptimized />
            )}

            <section className={detailCommentsSectionClassName}>
              <h3 className="text-sm font-bold text-gray-900">Komentar</h3>
              {comments.length > 0 ? (
                <div className={detailCommentsClassName}>
                  {renderComments(comments)}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Belum ada komentar.</p>
              )}
            </section>
          </div>

          <div className="shrink-0 border-t border-gray-100 bg-white p-4">
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') submitComment();
                }}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-blue-300"
                placeholder={`Komentar sebagai ${currentUserName}...`}
              />
              <button type="button" onClick={submitComment} className="rounded-lg bg-blue-900 text-white px-4 py-2 text-xs font-bold hover:bg-blue-800">Kirim</button>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2">
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
