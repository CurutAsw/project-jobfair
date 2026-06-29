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

function readAllNotifications() {
  if (typeof window === 'undefined') return [];

  try {
    const rawNotifications = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!rawNotifications) return [];
    const parsedNotifications = JSON.parse(rawNotifications);
    return Array.isArray(parsedNotifications) ? parsedNotifications as DashboardNotification[] : [];
  } catch {
    return [];
  }
}

function writeNotifications(notifications: DashboardNotification[]) {
  window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
}

export function hasUnreadNotifications(audience: NotificationAudience) {
  return readNotifications(audience).some((notification) => notification.isNew);
}

export function markNotificationRead(notificationId: string) {
  if (typeof window === 'undefined') return;

  writeNotifications(readAllNotifications().map((notification) => (
    notification.id === notificationId
      ? { ...notification, isNew: false }
      : notification
  )));
}

export function createNotification(notification: Omit<DashboardNotification, 'id' | 'createdAt' | 'isNew'>) {
  if (typeof window === 'undefined') return;

  const notifications = readAllNotifications();
  const nextNotifications: DashboardNotification[] = [
    {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: 'Baru saja',
      isNew: true,
    },
    ...notifications,
  ];

  writeNotifications(nextNotifications);
}
