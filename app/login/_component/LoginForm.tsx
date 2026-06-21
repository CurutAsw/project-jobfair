export default function LoginForm() {
  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-2">
          Email
        </label>
        <input 
          type="email" 
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 focus:bg-white outline-none transition-all text-gray-800"
          placeholder="Masukkan email Anda"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-2">
          Password
        </label>
        <input 
          type="password" 
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 focus:bg-white outline-none transition-all text-gray-800"
          placeholder="Masukkan password Anda"
          required
        />
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors mt-4 shadow-lg shadow-blue-900/30"
      >
        Masuk
      </button>
    </form>
  );
}