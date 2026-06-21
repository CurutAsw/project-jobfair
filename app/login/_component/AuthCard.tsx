'use client';
import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
          {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
        </h2>
        
        {/* Oper state ke SignupForm agar bisa kembali ke Login otomatis */}
        {isLogin ? <LoginForm /> : <SignupForm onSuccess={() => setIsLogin(true)} />}
        
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-blue-900 font-bold hover:underline focus:outline-none"
            >
              {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}