'use client';
import { useState } from 'react';

export default function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Ambil data user yang sudah ada di localStorage (jika ada)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 2. Cek apakah email sudah terdaftar
    const userExists = existingUsers.some((user: any) => user.email === formData.email);
    if (userExists) {
      alert('Email sudah terdaftar! Gunakan email lain.');
      return;
    }

    // 3. Simpan user baru ke array
    existingUsers.push(formData);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    alert('Registrasi berhasil! Silakan login.');
    onSuccess(); // Kembali ke tampilan login
  };

  return (
    <form className="space-y-4" onSubmit={handleSignup}>
      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-2">Nama Lengkap</label>
        <input 
          type="text" name="nama" value={formData.nama} onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-gray-800"
          placeholder="Masukkan nama lengkap" required
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-2">Email</label>
        <input 
          type="email" name="email" value={formData.email} onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-gray-800"
          placeholder="Masukkan email Anda" required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-2">Password</label>
        <input 
          type="password" name="password" value={formData.password} onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-gray-800"
          placeholder="Buat password" required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-2">Pilihan Role</label>
        <select 
          name="role" value={formData.role} onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-gray-800 appearance-none"
          required
        >
          <option value="" disabled>Pilih Role Anda</option>
          <option value="pencari_kerja">Pencari Kerja</option>
          <option value="perusahaan">Perusahaan/Recruter</option>
        </select>
      </div>
      
      <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors mt-6">
        Daftar Sekarang
      </button>
    </form>
  );
}