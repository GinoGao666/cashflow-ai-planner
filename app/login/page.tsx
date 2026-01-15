'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = '/budget';
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('注册成功，请去邮箱确认 ✉️');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-300">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl space-y-4">
        <h1 className="text-2xl font-bold text-center">💗 欢迎回来</h1>

        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        {message && (
          <p className="text-sm text-center text-red-500">{message}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-pink-500 text-white py-2 rounded-lg"
        >
          登录
        </button>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full border py-2 rounded-lg"
        >
          注册
        </button>
      </div>
    </main>
  );
}
