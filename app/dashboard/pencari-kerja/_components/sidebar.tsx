'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ProfileEditorModal from '../../_components/profile-editor-modal';
import { CURRENT_USER_STORAGE_KEY, getCurrentUserStorageKey, updateCurrentUserProfile, type DashboardUser, type ProfileUpdates } from '../../_lib/user-profile';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: DashboardUser;
  onUserChange: (user: DashboardUser) => void;
}

export default function Sidebar({ isOpen, onClose, user, onUserChange }: SidebarProps) {
  const router = useRouter();
  const [isProfileEditorOpen, setProfileEditorOpen] = useState(false);
  const getInitials = (name?: string | null) => {
    if (!name || name === 'Pengguna') return 'U';
    return name.trim().split(/\s+/).map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogout = () => {
    window.localStorage.removeItem(getCurrentUserStorageKey('pencari_kerja'));
    const rawCurrentUser = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (rawCurrentUser) {
      const currentUser = JSON.parse(rawCurrentUser) as { email?: string; role?: string };
      if (currentUser.email === user.email && currentUser.role === user.role) {
        window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    }
    router.push('/login');
  };

  const handleSaveProfile = (updates: ProfileUpdates) => {
    const updatedUser = updateCurrentUserProfile(updates, 'pencari_kerja');
    onUserChange(updatedUser);
    setProfileEditorOpen(false);
  };

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/40 z-60 transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} />
      <aside className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white text-gray-900 shadow-2xl z-70 flex flex-col transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-gray-100 bg-gray-50/70 space-y-4">
          <div className="flex items-center gap-3">
            {user.photoUrl ? (
              <Image src={user.photoUrl} alt="Foto profil" width={48} height={48} className="w-12 h-12 rounded-2xl object-cover shrink-0" unoptimized />
            ) : (
              <div className="w-12 h-12 bg-blue-900 text-white rounded-2xl flex items-center justify-center font-bold text-base shrink-0">{getInitials(user.name)}</div>
            )}
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm truncate text-gray-900">{user.name}</h3>
              <p className="text-[11px] truncate text-gray-500">{user.email}</p>
              {user.bio && <p className="text-[10px] truncate text-gray-400 mt-0.5">{user.bio}</p>}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-gray-200 bg-white space-y-2">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-gray-500">Kelengkapan Profil</span>
              <span className="text-blue-700">100%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-gray-100">
              <div className="bg-blue-900 h-full w-100% rounded-full" />
            </div>
            <p className="text-[10px] text-gray-400">Profil sudah lengkap.</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
          <section className="space-y-2">
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aktivitas Profil</p>
            {['Dokumen', 'Tersimpan', 'Aktivitas Anda', 'Arsip Postingan'].map((item) => (
              <button key={item} type="button" className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-blue-50/60">
                {item}
              </button>
            ))}
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pengaturan Akun</p>
            {['Profil', 'Pusat Akun', 'Preferensi Notifikasi'].map((item) => (
              <button key={item} type="button" onClick={() => item === 'Profil' && setProfileEditorOpen(true)} className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-blue-50/60">
                {item}
              </button>
            ))}
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Info & Bantuan</p>
            {['Bantuan', 'Tentang Kami'].map((item) => (
              <button key={item} type="button" className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-blue-50/60">
                {item}
              </button>
            ))}
          </section>
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/40">
          <button onClick={handleLogout} type="button" className="w-full rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100">
            Log out
          </button>
        </div>
      </aside>
      <ProfileEditorModal user={user} mode="jobseeker" isOpen={isProfileEditorOpen} onClose={() => setProfileEditorOpen(false)} onSave={handleSaveProfile} />
    </>
  );
}
