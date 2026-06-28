'use client';

import { useEffect, useState } from 'react';
import { NOTIFICATIONS_UPDATED_EVENT, readNotifications, type DashboardNotification } from '../../_lib/notifications';

export default function NotificationContent() {
  const [filterAktif, setFilterAktif] = useState('semua');
  const [notifications, setNotifications] = useState<DashboardNotification[]>(() => readNotifications('company'));

  useEffect(() => {
    const syncNotifications = () => setNotifications(readNotifications('company'));

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, syncNotifications);
    window.addEventListener('storage', syncNotifications);
    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, syncNotifications);
      window.removeEventListener('storage', syncNotifications);
    };
  }, []);

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
        {notifications.filter((notif) => filterAktif === 'semua' || notif.category === filterAktif).length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <h2 className="text-sm font-bold text-gray-900">Belum ada notifikasi</h2>
            <p className="text-xs text-gray-500 mt-1">Notifikasi akan muncul ketika ada interaksi baru.</p>
          </div>
        ) : (
          notifications.filter((notif) => filterAktif === 'semua' || notif.category === filterAktif).map((notif) => (
            <article key={notif.id} className={`p-4 rounded-xl border shadow-sm ${notif.isNew ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between gap-3 mb-1">
                <h2 className="text-sm font-bold text-gray-900">{notif.title}</h2>
                <span className="text-[10px] text-gray-400 shrink-0">{notif.createdAt}</span>
              </div>
              <p className="text-xs text-gray-600">{notif.description}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
