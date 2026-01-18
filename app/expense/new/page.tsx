'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function NewExpensePage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const res = await fetch('/api/ai/classify', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })

    const { category, amount } = await res.json()

    await supabase.from('expenses').insert({
      user_id: user!.id,
      category,
      amount,
      note: text,
    })

    router.replace('/budget')
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">
        亲爱的，今天花了什么？
      </h1>

      <textarea
        className="w-full border rounded-lg p-3"
        rows={4}
        placeholder="例如：中午吃饭花了 35"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg"
      >
        {loading ? 'AI 识别中...' : '确认记录'}
      </button>
    </div>
  )
}
