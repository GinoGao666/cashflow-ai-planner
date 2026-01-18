'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function NewExpensePage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('亲爱的，先告诉我你花了什么钱呀 🥺')
      return
    }

    setLoading(true)
    setError(null)

    // 1️⃣ 获取用户
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('登录状态异常')
      setLoading(false)
      return
    }

    // 2️⃣ 调用 AI 分类接口
    const res = await fetch('/api/ai/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!res.ok) {
      setError('AI 没听懂，再说一次好吗 🥺')
      setLoading(false)
      return
    }

    const result = await res.json()
    const { category, amount } = result

    if (!category || !amount) {
      setError('我没太听懂这笔花费 😢')
      setLoading(false)
      return
    }

    // 3️⃣ 写入 expenses 表
    const { error: insertError } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        category,
        amount,
        note: text,
      })

    if (insertError) {
      setError('记录失败了，再试一次好吗 🥺')
      setLoading(false)
      return
    }

    // 4️⃣ 成功 → 回预算页
    router.replace('/budget')
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        亲爱的，说说你刚刚花了什么钱 💬
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="例如：中午吃了麦当劳 35 元"
        className="w-full rounded-lg border p-4 min-h-[120px]"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-black py-3 text-white disabled:opacity-50"
      >
        {loading ? '记录中...' : '确认记录'}
      </button>
    </div>
  )
}
