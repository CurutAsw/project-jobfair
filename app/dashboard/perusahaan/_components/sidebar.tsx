'use client';

import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { company } from './data';

function ProfileInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-2">
      <p className="text-gray-400 font-bold uppercase text-[9px]">{label}</p>
      <p className="text-gray-800 font-semibold truncate">{value}</p>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/40 z-60 transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} />
      <aside className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white text-gray-900 shadow-2xl z-70 flex flex-col transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-gray-100 bg-gray-50/70 space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/dashboard-images/avatar-company.svg" alt="Logo perusahaan" width={48} height={48} className="w-12 h-12 rounded-2xl" />
            <div className="min-w-0">
              <h2 className="font-bold text-sm text-gray-900 truncate">{company.name}</h2>
              <p className="text-[11px] text-gray-500 truncate">{company.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <ProfileInfo label="Perusahaan" value={company.industry} />
            <ProfileInfo label="Lokasi" value={company.location} />
            <ProfileInfo label="Karyawan" value={company.size} />
            <ProfileInfo label="Website" value={company.website} />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
          <section className="space-y-2">
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Identitas Perusahaan</p>
            {['Legalitas & NPWP', 'Branding', 'Manajemen Rekruter', 'Arsip Postingan'].map((item) => (
              <button key={item} type="button" className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-blue-50/60">
                {item}
              </button>
            ))}
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pengaturan Akun</p>
            {['Profil Perusahaan', 'Pusat Akun', 'Preferensi Notifikasi'].map((item) => (
              <button key={item} type="button" className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-blue-50/60">
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
          <button onClick={() => router.push('/login')} type="button" className="w-full rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100">
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}