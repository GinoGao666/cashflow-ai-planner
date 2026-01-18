'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function IncomePage() {
  const router = useRouter()
  const [gross, setGross] = useState('')
  const [net, setNet] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkLogin = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) router.replace('/login')
    }
    checkLogin()
  }, [router])

  const calculate = () => {
    const g = Number(gross)
    if (!g) return
    setNet(Math.floor(g * 0.8))
  }

  const save = async () => {
    if (!net) return
    setLoading(true)

    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) {
      setError('登录失效')
      setLoading(false)
      return
    }

    await supabase.from('budget').delete().eq('user_id', user.id)

    const { error } = await supabase.from('budget').insert({
      user_id: user.id,
      gross_income: Number(gross),
      net_income: net,
    })

    setLoading(false)

    if (error) {
      setError('保存失败')
    } else {
      router.replace('/budget')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">输入税前月收入</h1>

      <input
        type="number"
        className="w-full border rounded px-3 py-2"
        placeholder="例如 20000"
        value={gross}
        onChange={(e) => setGross(e.target.value)}
      />

      <button
        onClick={calculate}
        className="w-full bg-gray-800 text-white py-2 rounded"
      >
        计算税后收入
      </button>

      {net && (
        <>
          <p className="text-lg">税后约：¥ {net}</p>

          <button
            onClick={save}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded"
          >
            {loading ? '保存中...' : '进入月度预算规划'}
          </button>
        </>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
