'use client';

import Image from 'next/image';

import type { CompanyTab } from './data';

type BottomBarProps = {
  activeTab: CompanyTab;
  setActiveTab: (tab: CompanyTab) => void;
};

const navItems: Array<{ id: CompanyTab; label: string; image: string }> = [
  { id: 'kandidat', label: 'Kandidat', image: '/dashboard-images/nav-users.svg' },
  { id: 'lowongan', label: 'Lowongan', image: '/dashboard-images/nav-briefcase.svg' },
  { id: 'posting', label: 'Posting', image: '/dashboard-images/nav-post.svg' },
  { id: 'notifikasi', label: 'Notifikasi', image: '/dashboard-images/nav-bell.svg' },
];

export default function BottomBar({ activeTab, setActiveTab }: BottomBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-gray-200 bg-white z-50 flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className="h-full w-20 flex flex-col items-center justify-center gap-1 text-xs font-bold relative"
          >
            <Image src={item.image} alt="" width={28} height={28} className={`h-7 w-7 rounded-xl transition-transform ${isActive ? 'scale-110 shadow-sm' : 'opacity-75'}`} />
            <span className={isActive ? 'text-blue-900' : 'text-gray-500'}>{item.label}</span>
            {item.id === 'notifikasi' && <span className="absolute top-2 right-5 w-2 h-2 bg-red-600 rounded-full" />}
          </button>
        );
      })}
    </nav>
  );
}