'use client';

export type UserRole = 'pencari_kerja' | 'perusahaan' | string;

export type StoredUserProfile = {
  nama: string;
  email: string;
  password?: string;
  role: UserRole;
  bio?: string;
  gender?: string;
  photoUrl?: string;
  companyIndustry?: string;
  companyAddress?: string;
  employeeTotal?: string;
  website?: string;
};

export type DashboardUser = {
  name: string;
  email: string;
  role: UserRole;
  bio: string;
  gender: string;
  photoUrl: string;
  companyIndustry: string;
  companyAddress: string;
  employeeTotal: string;
  website: string;
};

export type ProfileUpdates = Pick<DashboardUser, 'name' | 'bio' | 'gender' | 'photoUrl' | 'companyIndustry' | 'companyAddress' | 'employeeTotal' | 'website'>;

export const CURRENT_USER_STORAGE_KEY = 'currentUser';
export const USERS_STORAGE_KEY = 'users';
export const CURRENT_USER_UPDATED_EVENT = 'current-user-updated';

export function getCurrentUserStorageKey(role: UserRole) {
  return `${CURRENT_USER_STORAGE_KEY}:${role}`;
}

const fallbackByRole: Record<string, DashboardUser> = {
  pencari_kerja: {
    name: 'Pengguna',
    email: 'pengguna@email.com',
    role: 'pencari_kerja',
    bio: '',
    gender: '',
    photoUrl: '',
    companyIndustry: '',
    companyAddress: '',
    employeeTotal: '',
    website: '',
  },
  perusahaan: {
    name: 'PT Teknologi Masa Depan',
    email: 'recruiter@teknologimasa.co.id',
    role: 'perusahaan',
    bio: '',
    gender: '',
    photoUrl: '/dashboard-images/avatar-company.svg',
    companyIndustry: 'Teknologi Informasi',
    companyAddress: 'Jakarta Selatan',
    employeeTotal: '200 karyawan',
    website: 'teknologimasa.co.id',
  },
};

function canUseStorage() {
  return typeof window !== 'undefined';
}

function normalizeUser(user: StoredUserProfile, fallbackRole?: UserRole): DashboardUser {
  return {
    name: user.nama || 'Pengguna',
    email: user.email || '',
    role: user.role || fallbackRole || 'pencari_kerja',
    bio: user.bio || '',
    gender: user.gender || '',
    photoUrl: user.photoUrl || '',
    companyIndustry: user.companyIndustry || '',
    companyAddress: user.companyAddress || '',
    employeeTotal: user.employeeTotal || '',
    website: user.website || '',
  };
}

export function readStoredUsers(): StoredUserProfile[] {
  if (!canUseStorage()) return [];

  try {
    return JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY) || '[]') as StoredUserProfile[];
  } catch {
    return [];
  }
}

export function saveCurrentUser(user: StoredUserProfile) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(getCurrentUserStorageKey(user.role), JSON.stringify(user));
  window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(CURRENT_USER_UPDATED_EVENT));
}

export function readCurrentUser(fallbackRole: UserRole = 'pencari_kerja'): DashboardUser {
  const fallback = fallbackByRole[fallbackRole] ?? fallbackByRole.pencari_kerja;
  if (!canUseStorage()) return fallback;

  try {
    const rawRoleUser = window.localStorage.getItem(getCurrentUserStorageKey(fallbackRole));
    if (rawRoleUser) return normalizeUser(JSON.parse(rawRoleUser) as StoredUserProfile, fallbackRole);

    const rawCurrentUser = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (rawCurrentUser) {
      const currentUser = JSON.parse(rawCurrentUser) as StoredUserProfile;
      if (currentUser.role === fallbackRole) return normalizeUser(currentUser, fallbackRole);
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export function readActiveUser(requiredRole: UserRole): DashboardUser | null {
  if (!canUseStorage()) return null;

  try {
    const rawRoleUser = window.localStorage.getItem(getCurrentUserStorageKey(requiredRole));
    if (rawRoleUser) return normalizeUser(JSON.parse(rawRoleUser) as StoredUserProfile, requiredRole);

    const rawCurrentUser = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!rawCurrentUser) return null;

    const currentUser = JSON.parse(rawCurrentUser) as StoredUserProfile;
    return currentUser.role === requiredRole ? normalizeUser(currentUser, requiredRole) : null;
  } catch {
    return null;
  }
}

export function updateCurrentUserProfile(updates: ProfileUpdates, role: UserRole = 'pencari_kerja') {
  if (!canUseStorage()) return readCurrentUser(role);

  return updateUserProfileByEmail(readActiveUser(role)?.email ?? readCurrentUser(role).email, updates, role);
}

export function updateUserProfileByEmail(email: string, updates: ProfileUpdates, role: UserRole = 'pencari_kerja') {
  if (!canUseStorage()) return readCurrentUser(role);

  const users = readStoredUsers();
  const currentUser = readActiveUser(role) ?? readCurrentUser(role);
  const updatedStoredUser: StoredUserProfile = {
    ...(users.find((user) => user.email === email && user.role === role) ?? {
      email,
      password: '',
      role,
    }),
    nama: updates.name,
    bio: updates.bio,
    gender: updates.gender,
    photoUrl: updates.photoUrl,
    companyIndustry: updates.companyIndustry,
    companyAddress: updates.companyAddress,
    employeeTotal: updates.employeeTotal,
    website: updates.website,
  };
  const nextUsers = users.some((user) => user.email === email && user.role === role)
    ? users.map((user) => user.email === email && user.role === role ? updatedStoredUser : user)
    : [...users, updatedStoredUser];

  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  saveCurrentUser(updatedStoredUser);
  if (currentUser.email !== email || currentUser.role !== role) {
    window.localStorage.setItem(getCurrentUserStorageKey(role), JSON.stringify(updatedStoredUser));
    window.dispatchEvent(new Event(CURRENT_USER_UPDATED_EVENT));
  }
  return normalizeUser(updatedStoredUser);
}
