'use client';

import { useMemo, useState } from 'react';
import type { JobApplication } from '../_lib/applications';
import BottomBar from './_components/bottombar';
import CandidateContent from './_components/candidate-content';
import { candidates, chats, type Candidate, type Chat, type CompanyTab } from './_components/data';
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
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

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
    const existingChat = chats.find((chat) => chat.name === candidate.name);
    const candidateChat: Chat = existingChat ?? {
      id: candidate.id,
      name: candidate.name,
      role: candidate.role,
      message: `Halo, kami tertarik dengan profil ${candidate.role} Anda.`,
      time: 'Baru saja',
      unread: false,
      avatarUrl: candidate.avatarUrl,
      history: [
        {
          id: 1,
          sender: 'company',
          text: `Halo ${candidate.name}, kami tertarik dengan profil ${candidate.role} Anda.`,
          time: 'Baru saja',
        },
      ],
    };

    setSelectedChat(candidateChat);
    setActiveTab('pesan');
  };

  const openApplicantChat = (application: JobApplication) => {
    const applicantChat: Chat = {
      id: 1000 + application.jobId,
      name: application.applicantName,
      role: application.applicantRole,
      message: `Halo ${application.applicantName}, kami sudah menerima lamaran Anda untuk posisi ${application.jobTitle}.`,
      time: 'Baru saja',
      unread: false,
      avatarUrl: application.avatarUrl,
      history: [
        {
          id: 1,
          sender: 'company',
          text: `Halo ${application.applicantName}, kami sudah menerima lamaran Anda untuk posisi ${application.jobTitle}.`,
          time: 'Baru saja',
        },
      ],
    };

    setSelectedChat(applicantChat);
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
        return <MessageContent selectedChat={selectedChat} onSelectChat={setSelectedChat} />;
      default:
        return <CandidateContent candidates={filteredCandidates} query={query} filter={filter} onContact={openCandidateChat} />;
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 font-sans flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <Sidebar isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />
      <TopBar
        query={query}
        onQueryChange={setQuery}
        onFilterChange={setFilter}
        onProfileClick={() => setProfileOpen(true)}
        onTabChange={setActiveTab}
      />
      <main className="flex-1 pt-20 pb-28 px-4 max-w-screen-md w-full mx-auto">
        {renderContent()}
      </main>
      <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
