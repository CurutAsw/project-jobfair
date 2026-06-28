export const APPLICATIONS_STORAGE_KEY = 'jobfair_applications_v3';
export const APPLICATIONS_UPDATED_EVENT = 'jobfair-applications-updated';

export type JobApplication = {
  id: string;
  jobId: number;
  jobTitle: string;
  company: string;
  location: string;
  type: string;
  applicantName: string;
  applicantEmail: string;
  applicantRole: string;
  avatarUrl: string;
  submittedAt: string;
  status: string;
  note: string;
  uploadedDocuments: string[];
};

export function readApplications() {
  if (typeof window === 'undefined') return [];

  try {
    const rawApplications = window.localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (!rawApplications) return [];
    const parsedApplications = JSON.parse(rawApplications);
    return Array.isArray(parsedApplications) ? parsedApplications as JobApplication[] : [];
  } catch {
    return [];
  }
}

export function saveApplication(application: JobApplication) {
  const existingApplications = readApplications();
  const nextApplications = [
    application,
    ...existingApplications.filter((item) => item.id !== application.id),
  ];

  window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(nextApplications));
  window.dispatchEvent(new Event(APPLICATIONS_UPDATED_EVENT));
}

export function deleteApplicationsByJobId(jobId: number) {
  const nextApplications = readApplications().filter((application) => application.jobId !== jobId);

  window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(nextApplications));
  window.dispatchEvent(new Event(APPLICATIONS_UPDATED_EVENT));
}
