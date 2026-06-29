'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { APPLICATIONS_UPDATED_EVENT, readApplications, type JobApplication } from '../../_lib/applications';
import { getSocialJobId, readSocialPosts, SOCIAL_POSTS_UPDATED_EVENT, type SocialPost } from '../../_lib/social-posts';

export default function JobContent({ companyName, onContactApplicant }: { companyName: string; onContactApplicant: (application: JobApplication) => void }) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>(() => readSocialPosts());
  const [managedJob, setManagedJob] = useState<SocialPost | null>(null);

  useEffect(() => {
    const syncApplications = () => {
      setApplications(readApplications());
      setPosts(readSocialPosts());
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
  }, []);

  const lowonganPosts = posts.filter((post) => post.type === 'lowongan' && post.authorName === companyName);

  const applicationsByJobId = useMemo(() => {
    return applications.reduce<Record<number, JobApplication[]>>((groupedApplications, application) => {
      groupedApplications[application.jobId] = [...(groupedApplications[application.jobId] ?? []), application];
      return groupedApplications;
    }, {});
  }, [applications]);

  const managedApplicants = managedJob ? applicationsByJobId[getSocialJobId(managedJob.id)] ?? [] : [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-blue-900">Lowongan Perusahaan</h1>
      {lowonganPosts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <h2 className="text-sm font-bold text-gray-900">Belum ada lowongan</h2>
          <p className="text-xs text-gray-500 mt-1">Posting lowongan dari halaman posting perusahaan akan muncul di sini.</p>
        </div>
      )}
      {lowonganPosts.map((job) => (
        <article key={job.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-gray-900">Lowongan Pekerjaan</h2>
            <p className="text-xs text-gray-500 mt-1">{applicationsByJobId[getSocialJobId(job.id)]?.length ?? 0} pelamar - {job.status ?? 'Aktif'}</p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{job.content}</p>
          </div>
          <button type="button" onClick={() => setManagedJob(job)} className="rounded-lg bg-gray-100 text-gray-700 px-3 py-2 text-xs font-bold hover:bg-gray-200">Kelola</button>
        </article>
      ))}

      {managedJob && (
        <div className="fixed inset-0 z-[60] bg-black/40 px-4 py-6 flex items-end sm:items-center justify-center">
          <section className="bg-white w-full max-w-xl max-h-[82vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-blue-900">Lowongan Pekerjaan</h2>
                <p className="text-xs text-gray-500 mt-1">Daftar pelamar yang mengirim lamaran dari dashboard pencari kerja.</p>
              </div>
              <button type="button" onClick={() => setManagedJob(null)} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200">Tutup</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {managedApplicants.length === 0 ? (
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-6 text-center">
                  <h3 className="text-sm font-bold text-gray-900">Belum ada pelamar</h3>
                  <p className="text-xs text-gray-500 mt-1">Pelamar akan muncul setelah pencari kerja menekan Lamar Sekarang.</p>
                </div>
              ) : (
                managedApplicants.map((application) => (
                  <article key={application.id} className="rounded-xl border border-gray-200 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Image src={application.avatarUrl} alt={`Foto ${application.applicantName}`} width={44} height={44} className="w-11 h-11 rounded-2xl shrink-0" />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 truncate">{application.applicantName}</h3>
                          <p className="text-xs text-gray-500 truncate">{application.applicantRole} - {application.applicantEmail}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-green-50 text-green-700 px-2 py-1 text-[11px] font-bold shrink-0">{application.status}</span>
                    </div>

                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                      <p className="text-xs font-bold text-gray-800">Lamaran yang diupload</p>
                      <p className="text-xs text-gray-500 mt-1">{application.uploadedDocuments.join(', ')}</p>
                      <p className="text-xs text-gray-500 mt-1">Dikirim: {application.submittedAt}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs text-gray-500">Menunggu follow-up rekruter</span>
                      <button
                        type="button"
                        onClick={() => {
                          onContactApplicant(application);
                          setManagedJob(null);
                        }}
                        className="rounded-lg bg-blue-900 text-white px-3 py-2 text-xs font-bold hover:bg-blue-800"
                      >
                        Hubungi
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
