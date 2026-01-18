'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleLogin = async () => {
    if (!email) {
      setMessage('亲爱的，请先输入邮箱哦 💌')
      return
    }

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/setup/income`,
      },
    })

    setLoading(false)

    if (error) {
      setMessage('登录失败了 😢，请稍后再试')
    } else {
      setMessage('亲爱的，我已经把登录链接发到你的邮箱啦 ✨')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">
          欢迎回来 💖
        </h1>

        <p className="text-sm text-gray-500 text-center">
          输入邮箱，我们会给你发送一个安全的登录链接
        </p>

        <input
          type="email"
          placeholder="你的邮箱地址"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
        >
          {loading ? '发送中…' : '发送登录链接'}
        </button>

        {message && (
          <p className="text-sm text-center text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
