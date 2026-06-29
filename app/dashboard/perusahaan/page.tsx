'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JobApplication } from '../_lib/applications';
import { upsertChat } from '../_lib/chats';
import { createNotification, hasUnreadNotifications, NOTIFICATIONS_UPDATED_EVENT } from '../_lib/notifications';
import BottomBar from './_components/bottombar';
import CandidateContent from './_components/candidate-content';
import { candidates, type Candidate, type CompanyTab } from './_components/data';
import JobContent from './_components/job-content';
import NotificationContent from './_components/notification-content';
import PostingContent from './_components/posting-content';
import MessageContent from './_components/message-content';
import Sidebar from './_components/sidebar';
import TopBar from './_components/topbar';
import { CURRENT_USER_UPDATED_EVENT, readActiveUser, readCurrentUser, readStoredUsers, type StoredUserProfile } from '../_lib/user-profile';

function registeredUserToCandidate(user: StoredUserProfile, index: number): Candidate {
  const role = user.bio?.trim() || 'Pencari Kerja';
  const skills = user.bio
    ? user.bio.split(/[,\n]/).map((skill) => skill.trim()).filter(Boolean).slice(0, 4)
    : ['Siap bekerja', 'Komunikatif'];

  return {
    id: 10000 + index,
    name: user.nama || 'Pencari Kerja',
    role,
    location: user.companyAddress || 'Lokasi belum diisi',
    experience: 'Akun terdaftar',
    match: Math.max(72, 96 - index * 3),
    skills,
    status: 'Terdaftar di web',
    avatarUrl: user.photoUrl || '/dashboard-images/avatar-company.svg',
  };
}

export default function PerusahaanDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CompanyTab>('kandidat');
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(() => readCurrentUser('perusahaan'));
  const [isHydrated, setHydrated] = useState(false);
  const [hasUnreadNotif, setHasUnreadNotif] = useState(false);
  const [registeredCandidates, setRegisteredCandidates] = useState<Candidate[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<StoredUserProfile[]>([]);
  const [submittedSearch, setSubmittedSearch] = useState('');

  useEffect(() => {
    const syncCurrentUser = () => {
      const activeUser = readActiveUser('perusahaan');
      if (!activeUser) {
        router.replace('/login');
        return;
      }

      setCurrentUser(activeUser);
    };

    const hydrationTimer = window.setTimeout(() => {
      syncCurrentUser();
      setHydrated(true);
    }, 0);
    window.addEventListener(CURRENT_USER_UPDATED_EVENT, syncCurrentUser);
    window.addEventListener('storage', syncCurrentUser);
    return () => {
      window.clearTimeout(hydrationTimer);
      window.removeEventListener(CURRENT_USER_UPDATED_EVENT, syncCurrentUser);
      window.removeEventListener('storage', syncCurrentUser);
    };
  }, [router]);

  useEffect(() => {
    const syncRegisteredCandidates = () => {
      const users = readStoredUsers();
      setRegisteredUsers(users);
      setRegisteredCandidates(users
        .filter((user) => user.role === 'pencari_kerja')
        .map(registeredUserToCandidate));
    };

    syncRegisteredCandidates();
    window.addEventListener(CURRENT_USER_UPDATED_EVENT, syncRegisteredCandidates);
    window.addEventListener('storage', syncRegisteredCandidates);
    return () => {
      window.removeEventListener(CURRENT_USER_UPDATED_EVENT, syncRegisteredCandidates);
      window.removeEventListener('storage', syncRegisteredCandidates);
    };
  }, []);

  useEffect(() => {
    const syncUnreadNotifications = () => setHasUnreadNotif(hasUnreadNotifications('company'));

    syncUnreadNotifications();
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, syncUnreadNotifications);
    window.addEventListener('storage', syncUnreadNotifications);
    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, syncUnreadNotifications);
      window.removeEventListener('storage', syncUnreadNotifications);
    };
  }, []);

  const filteredCandidates = useMemo(() => {
    const allCandidates = [...registeredCandidates, ...candidates];
    const activeQuery = submittedSearch;

    return allCandidates.filter((candidate) => {
      const matchesQuery = `${candidate.name} ${candidate.role} ${candidate.skills.join(' ')}`
        .toLowerCase()
        .includes(activeQuery.toLowerCase());
      const matchesFilter = filter === 'Semua' || candidate.role === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, registeredCandidates, submittedSearch]);

  const matchedAccounts = useMemo(() => {
    const normalizedQuery = submittedSearch.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return registeredUsers.filter((user) => {
      const searchableText = [
        user.nama,
        user.email,
        user.role,
        user.bio,
        user.companyIndustry,
        user.companyAddress,
        user.website,
      ].join(' ').toLowerCase();

      return searchableText.includes(normalizedQuery) || normalizedQuery.split(/\s+/).some((word) => word.length > 2 && searchableText.includes(word));
    });
  }, [registeredUsers, submittedSearch]);

  const openCandidateChat = (candidate: Candidate) => {
    const chatId = `candidate-${candidate.id}`;
    const result = upsertChat({
      id: chatId,
      companyName: currentUser.name,
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
    if (result.isNew) {
      createNotification({
        audience: 'jobseeker',
        category: 'pesan',
        title: 'Pesan Baru',
        description: `${currentUser.name} menghubungi Anda untuk posisi ${candidate.role}.`,
      });
    }

    setSelectedChatId(result.chat.id);
    setActiveTab('pesan');
  };

  const openApplicantChat = (application: JobApplication) => {
    const chatId = `application-${application.jobId}-${application.applicantEmail}`;
    const result = upsertChat({
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
    if (result.isNew) {
      createNotification({
        audience: 'jobseeker',
        category: 'pesan',
        title: 'Pesan Baru',
        description: `${application.company} menghubungi Anda tentang lamaran ${application.jobTitle}.`,
      });
    }

    setSelectedChatId(result.chat.id);
    setActiveTab('pesan');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'kandidat':
        return (
          <CandidateContent
            candidates={filteredCandidates}
            query={submittedSearch}
            filter={filter}
            companyName={currentUser.name}
            searchAccounts={matchedAccounts}
            searchQuery={submittedSearch}
            onClearSearch={() => {
              setSubmittedSearch('');
              setQuery('');
              setFilter('Semua');
            }}
            onContact={openCandidateChat}
          />
        );
      case 'lowongan':
        return <JobContent companyName={currentUser.name} onContactApplicant={openApplicantChat} />;
      case 'posting':
        return <PostingContent user={currentUser} />;
      case 'notifikasi':
        return <NotificationContent />;
      case 'pesan':
        return <MessageContent selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />;
      default:
        return <CandidateContent candidates={filteredCandidates} query={submittedSearch} filter={filter} companyName={currentUser.name} searchAccounts={matchedAccounts} searchQuery={submittedSearch} onContact={openCandidateChat} />;
    }
  };

  if (!isHydrated) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-100 font-sans flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <TopBar
          query={query}
          onQueryChange={setQuery}
          onFilterChange={setFilter}
          onProfileClick={() => setProfileOpen(true)}
          onTabChange={setActiveTab}
          onSearchSubmit={setSubmittedSearch}
        />
        <main className="flex-1 pt-20 pb-28 px-4 max-w-3xl w-full mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <h1 className="text-sm font-bold text-gray-900">Memuat dashboard...</h1>
            <p className="text-xs text-gray-500 mt-1">Menyiapkan data akun dan postingan.</p>
          </div>
        </main>
        <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} hasUnreadNotifications={hasUnreadNotif} />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 font-sans flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <Sidebar isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} user={currentUser} onUserChange={setCurrentUser} />
      <TopBar
        query={query}
        onQueryChange={setQuery}
        onFilterChange={setFilter}
        onProfileClick={() => setProfileOpen(true)}
        onTabChange={setActiveTab}
        onSearchSubmit={setSubmittedSearch}
      />
      <main className="flex-1 pt-20 pb-28 px-4 max-w-3xl w-full mx-auto">
        {renderContent()}
      </main>
      <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} hasUnreadNotifications={hasUnreadNotif} />
    </div>
  );
}
