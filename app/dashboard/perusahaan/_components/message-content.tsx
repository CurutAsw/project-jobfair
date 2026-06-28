'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { addChatMessage, CHATS_UPDATED_EVENT, readChats, type SharedChat } from '../../_lib/chats';
import { createNotification } from '../../_lib/notifications';

export default function MessageContent({ selectedChatId, onSelectChat }: { selectedChatId: string | null; onSelectChat: (chatId: string) => void }) {
  const [draft, setDraft] = useState('');
  const [chats, setChats] = useState<SharedChat[]>(() => readChats());
  const selectedChat = chats.find((chat) => chat.id === selectedChatId) ?? null;

  useEffect(() => {
    const syncChats = () => setChats(readChats());

    window.addEventListener(CHATS_UPDATED_EVENT, syncChats);
    window.addEventListener('storage', syncChats);
    return () => {
      window.removeEventListener(CHATS_UPDATED_EVENT, syncChats);
      window.removeEventListener('storage', syncChats);
    };
  }, []);

  const handleSendMessage = () => {
    if (!selectedChat || !draft.trim()) return;
    addChatMessage(selectedChat.id, 'company', draft.trim());
    createNotification({
      audience: 'jobseeker',
      category: 'pesan',
      title: 'Pesan Baru',
      description: `${selectedChat.companyName} mengirim pesan baru.`,
    });
    setDraft('');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-blue-900">Kotak Pesan Kandidat</h1>

      <div className="grid gap-3 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          {chats.length === 0 ? (
            <div className="p-6 text-center">
              <h2 className="text-sm font-bold text-gray-900">Belum ada chat</h2>
              <p className="text-xs text-gray-500 mt-1">Chat akan muncul setelah ada lamaran atau pesan baru.</p>
            </div>
          ) : (
            chats.map((chat) => {
              const lastMessage = chat.messages.at(-1);
              const isActive = selectedChatId === chat.id;

              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-900' : chat.unreadFor === 'company' ? 'bg-blue-50/30 border-l-4 border-l-blue-900' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <Image src={chat.avatarUrl} alt={`Foto ${chat.jobseekerName}`} width={44} height={44} className="w-11 h-11 rounded-2xl shrink-0" />
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-gray-900 truncate">{chat.jobseekerName}</h2>
                      <p className="text-[10px] text-gray-400 font-normal truncate">{chat.jobseekerRole}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{lastMessage?.text ?? 'Belum ada pesan'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{lastMessage?.time ?? 'Baru saja'}</span>
                </button>
              );
            })
          )}
        </div>

        {selectedChat ? (
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[520px] flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
              <Image src={selectedChat.avatarUrl} alt={`Foto ${selectedChat.jobseekerName}`} width={44} height={44} className="w-11 h-11 rounded-2xl" />
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">{selectedChat.jobseekerName}</h2>
                <p className="text-xs text-gray-500 truncate">{selectedChat.jobseekerRole} - online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-green-50/50 p-4 space-y-2">
              {selectedChat.messages.map((message) => {
                const isCompany = message.sender === 'company';

                return (
                  <div key={message.id} className={`flex ${isCompany ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[82%] rounded-2xl px-3 py-2 shadow-sm ${isCompany ? 'bg-blue-900 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm'}`}>
                      <p className="text-xs leading-relaxed">{message.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${isCompany ? 'text-blue-100' : 'text-gray-400'}`}>{message.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 border-t border-gray-100 bg-white p-3">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSendMessage();
                }}
                className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2 text-xs outline-none focus:border-blue-300"
                placeholder="Tulis pesan..."
              />
              <button type="button" onClick={handleSendMessage} className="rounded-full bg-blue-900 text-white px-5 py-2 text-xs font-bold hover:bg-blue-800">Kirim</button>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[320px] flex items-center justify-center p-6 text-center">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Pilih riwayat chat</h2>
              <p className="text-xs text-gray-500 mt-1">Klik kandidat di kotak pesan untuk membuka percakapan.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
