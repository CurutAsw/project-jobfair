import Image from 'next/image';
import { chats, type Chat } from './data';

export default function MessageContent({ selectedChat, onSelectChat }: { selectedChat: Chat | null; onSelectChat: (chat: Chat) => void }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-blue-900">Kotak Pesan Kandidat</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
        {chats.map((chat) => (
          <button
            key={chat.id}
            type="button"
            onClick={() => onSelectChat(chat)}
            className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 ${chat.unread ? 'bg-blue-50/30 border-l-4 border-l-blue-900' : ''}`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-4">
              <Image src={chat.avatarUrl} alt={`Foto ${chat.name}`} width={44} height={44} className="w-11 h-11 rounded-2xl shrink-0" />
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">{chat.name} <span className="text-[10px] text-gray-400 font-normal">- {chat.role}</span></h2>
                <p className="text-xs text-gray-500 truncate">{chat.message}</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 shrink-0">{chat.time}</span>
          </button>
        ))}
      </div>

      {selectedChat && (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Image src={selectedChat.avatarUrl} alt={`Foto ${selectedChat.name}`} width={44} height={44} className="w-11 h-11 rounded-2xl" />
            <div>
              <h2 className="text-sm font-bold text-gray-900">Obrolan dengan {selectedChat.name}</h2>
              <p className="text-xs text-gray-500">{selectedChat.role}</p>
            </div>
          </div>
          <div className="rounded-xl bg-gray-100 p-3 text-xs text-gray-700 leading-relaxed">{selectedChat.message}</div>
          <div className="flex gap-2">
            <input className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-300" placeholder="Tulis balasan..." />
            <button type="button" className="rounded-lg bg-blue-900 text-white px-4 py-2 text-xs font-bold hover:bg-blue-800">Kirim</button>
          </div>
        </section>
      )}
    </div>
  );
}