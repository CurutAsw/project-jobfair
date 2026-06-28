'use client';

import { useMemo, useState } from 'react';
import type { JobApplication } from '../_lib/applications';
import { upsertChat } from '../_lib/chats';
import { createNotification } from '../_lib/notifications';
import BottomBar from './_components/bottombar';
import CandidateContent from './_components/candidate-content';
import { candidates, type Candidate, type CompanyTab } from './_components/data';
import JobContent from './_components/job-content';
import NotificationContent from './_components/notification-content';
import PostingContent from './_components/posting-content';
import MessageContent from './_components/message-content';
import Sidebar from './_components/sidebar';
import TopBar from './_components/topbar';

export default function PerusahaanDashboard() {
  const [activeTab, setActiveTab] = useState<CompanyTab>('kandidat');
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesQuery = `${candidate.name} ${candidate.role} ${candidate.skills.join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter = filter === 'Semua' || candidate.role === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  const openCandidateChat = (candidate: Candidate) => {
    const chatId = `candidate-${candidate.id}`;
    upsertChat({
      id: chatId,
      companyName: 'PT Teknologi Masa Depan',
      jobseekerName: candidate.name,
      jobseekerRole: candidate.role,
      avatarUrl: candidate.avatarUrl,
      unreadFor: 'jobseeker',
      messages: [
        {
          id: `message-${Date.now()}`,
          sender: 'company',
          text: `Halo ${candidate.name}, kami tertarik dengan profil ${candidate.role} Anda.`,
          time: 'Baru saja',
        },
      ],
    });
    createNotification({
      audience: 'jobseeker',
      category: 'pesan',
      title: 'Pesan Baru',
      description: `PT Teknologi Masa Depan menghubungi Anda untuk posisi ${candidate.role}.`,
    });

    setSelectedChatId(chatId);
    setActiveTab('pesan');
  };

  const openApplicantChat = (application: JobApplication) => {
    const chatId = `application-${application.jobId}-${application.applicantEmail}`;
    upsertChat({
      id: chatId,
      companyName: application.company,
      jobseekerName: application.applicantName,
      jobseekerRole: application.applicantRole,
      avatarUrl: application.avatarUrl,
      unreadFor: 'jobseeker',
      messages: [
        {
          id: `message-${Date.now()}`,
          sender: 'company',
          text: `Halo ${application.applicantName}, kami sudah menerima lamaran Anda untuk posisi ${application.jobTitle}.`,
          time: 'Baru saja',
        },
      ],
    });
    createNotification({
      audience: 'jobseeker',
      category: 'pesan',
      title: 'Pesan Baru',
      description: `${application.company} menghubungi Anda tentang lamaran ${application.jobTitle}.`,
    });

    setSelectedChatId(chatId);
    setActiveTab('pesan');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'kandidat':
        return <CandidateContent candidates={filteredCandidates} query={query} filter={filter} onContact={openCandidateChat} />;
      case 'lowongan':
        return <JobContent onContactApplicant={openApplicantChat} />;
      case 'posting':
        return <PostingContent />;
      case 'notifikasi':
        return <NotificationContent />;
      case 'pesan':
        return <MessageContent selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />;
      default:
        return <CandidateContent candidates={filteredCandidates} query={query} filter={filter} onContact={openCandidateChat} />;
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 font-sans flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <Sidebar isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />
      <TopBar
        query={query}
        onQueryChange={setQuery}
        onFilterChange={setFilter}
        onProfileClick={() => setProfileOpen(true)}
        onTabChange={setActiveTab}
      />
      <main className="flex-1 pt-20 pb-28 px-4 max-w-3xl w-full mx-auto">
        {renderContent()}
      </main>
      <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
