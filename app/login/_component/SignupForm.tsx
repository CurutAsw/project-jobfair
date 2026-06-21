export default function SignupForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-2">
          Nama Lengkap
        </label>
        <input 
          type="text" 
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 focus:bg-white outline-none transition-all text-gray-800"
          placeholder="Masukkan nama lengkap"
          required
        />
      </div>
      
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
          placeholder="Buat password"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-2">
          Pilihan Role
        </label>
        <select 
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 focus:bg-white outline-none transition-all text-gray-800 appearance-none"
          required
        >
        
          <option value="pencari_kerja">Pencari Kerja</option>
          <option value="perusahaan">Perusahaan/Recruter</option>
        </select>
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors mt-6 shadow-lg shadow-blue-900/30"
      >
        Daftar Sekarang
      </button>
    </form>
  );
}