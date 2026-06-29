'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveCurrentUser } from '../../dashboard/_lib/user-profile';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  type StoredUser = {
    nama: string;
    email: string;
    password: string;
    role: 'pencari_kerja' | 'perusahaan' | string;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Ambil data dari localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];

    // 2. Cari user yang cocok
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (foundUser) {
      saveCurrentUser(foundUser);
      alert(`Login berhasil! Selamat datang, ${foundUser.nama}`);
      
      // 3. Arahkan ke dashboard sesuai role
      if (foundUser.role === 'pencari_kerja') {
        router.push('/dashboard/pencari-kerja');
      } else if (foundUser.role === 'perusahaan') {
        router.push('/dashboard/perusahaan');
      }
    } else {
      alert('Email atau password salah!');
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleLogin}>
      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-2">Email</label>
        <input 
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-gray-800"
          placeholder="Masukkan email Anda" required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-2">Password</label>
        <input 
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-gray-800"
          placeholder="Masukkan password Anda" required
        />
      </div>
      
      <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors mt-4">
        Masuk
      </button>
    </form>
  );
}
