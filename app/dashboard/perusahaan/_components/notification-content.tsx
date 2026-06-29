'use client';

import { useEffect, useState } from 'react';
import { markNotificationRead, NOTIFICATIONS_UPDATED_EVENT, readNotifications, type DashboardNotification } from '../../_lib/notifications';

export default function NotificationContent() {
  const [filterAktif, setFilterAktif] = useState('semua');
  const [notifications, setNotifications] = useState<DashboardNotification[]>(() => readNotifications('company'));
  const [openedNotificationId, setOpenedNotificationId] = useState<string | null>(null);

  useEffect(() => {
    const syncNotifications = () => setNotifications(readNotifications('company'));

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, syncNotifications);
    window.addEventListener('storage', syncNotifications);
    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, syncNotifications);
      window.removeEventListener('storage', syncNotifications);
    };
  }, []);

  const visibleNotifications = notifications.filter((notif) => filterAktif === 'semua' || notif.category === filterAktif);

  const openNotification = (notificationId: string) => {
    setOpenedNotificationId((current) => current === notificationId ? null : notificationId);
    markNotificationRead(notificationId);
  };

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
        {visibleNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <h2 className="text-sm font-bold text-gray-900">Belum ada notifikasi</h2>
            <p className="text-xs text-gray-500 mt-1">Notifikasi akan muncul ketika ada interaksi baru.</p>
          </div>
        ) : (
          visibleNotifications.map((notif) => (
            <button key={notif.id} type="button" onClick={() => openNotification(notif.id)} className={`w-full p-4 rounded-xl border shadow-sm text-left transition-colors ${notif.isNew ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
              <div className="flex justify-between gap-3 mb-1">
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-gray-900">{notif.title}</h2>
                  <p className="text-[10px] font-bold text-blue-700 mt-0.5">{notif.isNew ? 'Baru' : 'Sudah dibuka'}</p>
                </div>
                <div className="flex items-start gap-2 shrink-0">
                  {notif.isNew && <span className="mt-1 h-2 w-2 rounded-full bg-red-600" />}
                  <span className="text-[10px] text-gray-400">{notif.createdAt}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600">{notif.description}</p>
              {openedNotificationId === notif.id && (
                <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs font-bold text-gray-900">Detail Notifikasi</p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.description}</p>
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
