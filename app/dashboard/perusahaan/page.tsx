'use client';

import { useMemo, useState } from 'react';
import BottomBar from './_components/bottombar';
import CandidateContent from './_components/candidate-content';
import { candidates, type Chat, type CompanyTab } from './_components/data';
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

  const renderContent = () => {
    switch (activeTab) {
      case 'kandidat':
        return <CandidateContent candidates={filteredCandidates} query={query} filter={filter} />;
      case 'lowongan':
        return <JobContent />;
      case 'posting':
        return <PostingContent />;
      case 'notifikasi':
        return <NotificationContent />;
      case 'pesan':
        return <MessageContent selectedChat={selectedChat} onSelectChat={setSelectedChat} />;
      default:
        return <CandidateContent candidates={filteredCandidates} query={query} filter={filter} />;
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 font-sans flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <Sidebar isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />
      <TopBar
        query={query}
        filter={filter}
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