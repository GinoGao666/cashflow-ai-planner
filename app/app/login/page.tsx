'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!email) {
      setMessage('请输入邮箱')
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
      setMessage('登录失败，请稍后再试')
    } else {
      setMessage('登录链接已发送至邮箱')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">邮箱登录</h1>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="你的邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? '发送中...' : '发送登录链接'}
        </button>

        {message && (
          <p className="text-sm text-center text-gray-500">{message}</p>
        )}
      </div>
    </div>
  )
}
