export const NOTIFICATIONS_STORAGE_KEY = 'jobfair_notifications_v1';
export const NOTIFICATIONS_UPDATED_EVENT = 'jobfair-notifications-updated';

export type NotificationAudience = 'company' | 'jobseeker';

export type DashboardNotification = {
  id: string;
  audience: NotificationAudience;
  category: string;
  title: string;
  description: string;
  createdAt: string;
  isNew: boolean;
};

export function readNotifications(audience: NotificationAudience) {
  if (typeof window === 'undefined') return [];

  try {
    const rawNotifications = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!rawNotifications) return [];
    const parsedNotifications = JSON.parse(rawNotifications);
    return Array.isArray(parsedNotifications)
      ? (parsedNotifications as DashboardNotification[]).filter((notification) => notification.audience === audience)
      : [];
  } catch {
    return [];
  }
}

export function createNotification(notification: Omit<DashboardNotification, 'id' | 'createdAt' | 'isNew'>) {
  if (typeof window === 'undefined') return;

  const rawNotifications = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  const currentNotifications = rawNotifications ? JSON.parse(rawNotifications) : [];
  const notifications = Array.isArray(currentNotifications) ? currentNotifications as DashboardNotification[] : [];
  const nextNotifications: DashboardNotification[] = [
    {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: 'Baru saja',
      isNew: true,
    },
    ...notifications,
  ];

  window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(nextNotifications));
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
}
