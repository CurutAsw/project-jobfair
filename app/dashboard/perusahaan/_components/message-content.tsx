'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { chats, type Chat, type ChatMessage } from './data';

export default function MessageContent({ selectedChat, onSelectChat }: { selectedChat: Chat | null; onSelectChat: (chat: Chat) => void }) {
  const [draft, setDraft] = useState('');
  const [messageHistories, setMessageHistories] = useState<Record<number, ChatMessage[]>>(() => (
    chats.reduce<Record<number, ChatMessage[]>>((histories, chat) => {
      histories[chat.id] = chat.history;
      return histories;
    }, {})
  ));

  const visibleChats = useMemo(() => {
    if (!selectedChat || chats.some((chat) => chat.id === selectedChat.id)) return chats;
    return [selectedChat, ...chats];
  }, [selectedChat]);

  const activeMessages = selectedChat ? messageHistories[selectedChat.id] ?? selectedChat.history : [];

  const handleSendMessage = () => {
    if (!selectedChat || !draft.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'company',
      text: draft.trim(),
      time: 'Baru saja',
    };

    setMessageHistories((current) => ({
      ...current,
      [selectedChat.id]: [...(current[selectedChat.id] ?? selectedChat.history), newMessage],
    }));
    setDraft('');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-blue-900">Kotak Pesan Kandidat</h1>

      <div className="grid gap-3 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          {visibleChats.map((chat) => {
            const lastMessage = (messageHistories[chat.id] ?? chat.history).at(-1);
            const isActive = selectedChat?.id === chat.id;

            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => onSelectChat(chat)}
                className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-900' : chat.unread ? 'bg-blue-50/30 border-l-4 border-l-blue-900' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <Image src={chat.avatarUrl} alt={`Foto ${chat.name}`} width={44} height={44} className="w-11 h-11 rounded-2xl shrink-0" />
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-gray-900 truncate">{chat.name}</h2>
                    <p className="text-[10px] text-gray-400 font-normal truncate">{chat.role}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{lastMessage?.text ?? chat.message}</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{lastMessage?.time ?? chat.time}</span>
              </button>
            );
          })}
        </div>

        {selectedChat ? (
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[520px] flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
              <Image src={selectedChat.avatarUrl} alt={`Foto ${selectedChat.name}`} width={44} height={44} className="w-11 h-11 rounded-2xl" />
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">{selectedChat.name}</h2>
                <p className="text-xs text-gray-500 truncate">{selectedChat.role} - online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-green-50/50 p-4 space-y-2">
              {activeMessages.map((message) => {
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
