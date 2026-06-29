export const SOCIAL_POSTS_STORAGE_KEY = 'jobfair_social_posts_v2';
export const SOCIAL_POSTS_UPDATED_EVENT = 'jobfair-social-posts-updated';

export type SocialPostType = 'pengumuman' | 'lowongan' | 'pencari-kerja';

export type SocialComment = {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
  replies?: SocialComment[];
};

export type SocialPost = {
  id: string;
  authorName: string;
  authorRole: 'company' | 'jobseeker';
  type: SocialPostType;
  content: string;
  createdAt: string;
  likes: number;
  shares: number;
  comments: SocialComment[];
  imageUrl?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  workType?: string;
  status?: string;
  salary?: string;
  deadline?: string;
  extraInfo?: string;
  responsibilities?: string[];
  requirements?: string[];
  qualificationTerms?: string[];
};

export const seedSocialPosts: SocialPost[] = [];

export function getSocialJobId(postId: string) {
  return postId.split('').reduce((total, character) => total + character.charCodeAt(0), 0);
}

export function readSocialPosts() {
  if (typeof window === 'undefined') return seedSocialPosts;

  try {
    const rawPosts = window.localStorage.getItem(SOCIAL_POSTS_STORAGE_KEY);
    if (!rawPosts) return seedSocialPosts;

    const parsedPosts = JSON.parse(rawPosts);
    return Array.isArray(parsedPosts) ? parsedPosts as SocialPost[] : seedSocialPosts;
  } catch {
    return seedSocialPosts;
  }
}

export function writeSocialPosts(posts: SocialPost[]) {
  window.localStorage.setItem(SOCIAL_POSTS_STORAGE_KEY, JSON.stringify(posts));
  window.dispatchEvent(new Event(SOCIAL_POSTS_UPDATED_EVENT));
}

export function createSocialPost(post: SocialPost) {
  writeSocialPosts([post, ...readSocialPosts()]);
}

export function updateSocialPost(postId: string, updater: (post: SocialPost) => SocialPost) {
  writeSocialPosts(readSocialPosts().map((post) => post.id === postId ? updater(post) : post));
}

export function deleteSocialPost(postId: string) {
  writeSocialPosts(readSocialPosts().filter((post) => post.id !== postId));
}
