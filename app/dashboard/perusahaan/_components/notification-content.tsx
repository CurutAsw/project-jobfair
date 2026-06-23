'use client';

import { useState } from 'react';

export default function NotificationContent() {
  const [filterAktif, setFilterAktif] = useState('semua');
  const notifications = [
    { id: 1, kategori: 'pelamar', judul: 'Pelamar Baru', deskripsi: 'Siti Aminah melamar posisi Frontend Developer dan menunggu tinjauan rekruter.', waktu: '8 menit yang lalu', isNew: true },
    { id: 2, kategori: 'sistem', judul: 'Profil Perusahaan Terverifikasi', deskripsi: 'Identitas perusahaan Anda berhasil diverifikasi oleh sistem.', waktu: '1 jam yang lalu', isNew: false },
    { id: 3, kategori: 'pelamar', judul: 'Kandidat Membalas Pesan', deskripsi: 'Rizky Pratama mengirim balasan untuk undangan interview.', waktu: 'Kemarin', isNew: true },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-blue-900">Notifikasi Perusahaan</h1>
      <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        {[{ id: 'semua', label: 'Semua' }, { id: 'sistem', label: 'Sistem' }, { id: 'pelamar', label: 'Pelamar' }].map((tab) => (
          <button key={tab.id} type="button" onClick={() => setFilterAktif(tab.id)} className={`flex-1 py-2 text-sm font-bold rounded-lg ${filterAktif === tab.id ? 'bg-blue-50 text-blue-900' : 'text-gray-500 hover:bg-gray-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {notifications.filter((notif) => filterAktif === 'semua' || notif.kategori === filterAktif).map((notif) => (
          <article key={notif.id} className={`p-4 rounded-xl border shadow-sm ${notif.isNew ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between gap-3 mb-1">
              <h2 className="text-sm font-bold text-gray-900">{notif.judul}</h2>
              <span className="text-[10px] text-gray-400 shrink-0">{notif.waktu}</span>
            </div>
            <p className="text-xs text-gray-600">{notif.deskripsi}</p>
          </article>
        ))}
      </div>
    </div>
  );
}