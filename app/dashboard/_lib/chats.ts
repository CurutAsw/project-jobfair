export const CHATS_STORAGE_KEY = 'jobfair_chats_v1';
export const CHATS_UPDATED_EVENT = 'jobfair-chats-updated';

export type ChatParticipant = 'company' | 'jobseeker';

export type SharedChatMessage = {
  id: string;
  sender: ChatParticipant;
  text: string;
  time: string;
};

export type SharedChat = {
  id: string;
  companyName: string;
  jobseekerName: string;
  jobseekerRole: string;
  avatarUrl: string;
  unreadFor: ChatParticipant | null;
  messages: SharedChatMessage[];
};

export function readChats() {
  if (typeof window === 'undefined') return [];

  try {
    const rawChats = window.localStorage.getItem(CHATS_STORAGE_KEY);
    if (!rawChats) return [];
    const parsedChats = JSON.parse(rawChats);
    return Array.isArray(parsedChats) ? parsedChats as SharedChat[] : [];
  } catch {
    return [];
  }
}

function writeChats(chats: SharedChat[]) {
  window.localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  window.dispatchEvent(new Event(CHATS_UPDATED_EVENT));
}

export function upsertChat(chat: SharedChat) {
  const chats = readChats();
  writeChats([chat, ...chats.filter((item) => item.id !== chat.id)]);
}

export function addChatMessage(chatId: string, sender: ChatParticipant, text: string) {
  const chats = readChats();
  writeChats(chats.map((chat) => (
    chat.id === chatId
      ? {
          ...chat,
          unreadFor: sender === 'company' ? 'jobseeker' : 'company',
          messages: [
            ...chat.messages,
            { id: `message-${Date.now()}`, sender, text, time: 'Baru saja' },
          ],
        }
      : chat
  )));
}
