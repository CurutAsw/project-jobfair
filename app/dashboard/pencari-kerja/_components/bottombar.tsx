export default function BottomBar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) {
    return (
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-end justify-around h-16 max-w-screen-md mx-auto relative px-4">
          
          {/* Home */}
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${activeTab === 'home' ? 'text-blue-900' : 'text-gray-400'}`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-semibold">Home</span>
          </button>
  
          {/* Posting (Tombol +) */}
          <div className="relative w-14 h-14 mb-4">
            <button 
              onClick={() => setActiveTab('posting')}
              className={`absolute bottom-2 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 ${activeTab === 'posting' ? 'bg-blue-800' : 'bg-blue-900'} text-white`}
            >
              <span className="text-2xl">+</span>
            </button>
          </div>
  
          {/* Notifikasi */}
          <button 
            onClick={() => setActiveTab('notifikasi')}
            className={`flex flex-col items-center justify-center w-20 h-full transition-colors ${activeTab === 'notifikasi' ? 'text-blue-900' : 'text-gray-400'}`}
          >
            <div className="relative">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="text-[10px] font-semibold">Notifikasi</span>
          </button>
  
        </div>
      </nav>
    );
  }