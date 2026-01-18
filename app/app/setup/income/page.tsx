'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function IncomeSetupPage() {
  const router = useRouter()

  const [grossIncome, setGrossIncome] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ 页面一进来就校验登录状态
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/')
      }
    }

    checkAuth()
  }, [router])

  const calculateNetIncome = (gross: number) => {
    // MVP：先用固定 80%
    return Math.floor(gross * 0.8)
  }

  const handleSubmit = async () => {
    setError(null)

    const gross = Number(grossIncome)
    if (!gross || gross <= 0) {
      setError('请输入正确的税前收入')
      return
    }

    setLoading(true)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('登录状态异常，请重新登录')
      setLoading(false)
      return
    }

    const netIncome = calculateNetIncome(gross)

    // ✅ 永远只保留一条 budget
    const { error: deleteError } = await supabase
      .from('budget')
      .delete()
      .eq('user_id', user.id)

    if (deleteError) {
      setError('系统异常，请稍后再试')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('budget')
      .insert({
        user_id: user.id,
        gross_income: gross,
        net_income: netIncome,
      })

    if (insertError) {
      console.error(insertError)
      setError('收入保存失败，请稍后再试')
      setLoading(false)
      return
    }

    // ✅ 成功后，强制进入 budget
    router.replace('/budget')
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        亲爱的，先告诉我你的税前月收入 💼
      </h1>

      <div className="space-y-2">
        <label className="text-sm text-gray-600">
          税前月收入（元）
        </label>
        <input
          type="number"
          value={grossIncome}
          onChange={(e) => setGrossIncome(e.target.value)}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="例如 20000"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-black py-3 text-white disabled:opacity-50"
      >
        {loading ? '保存中...' : '保存并进入预算'}
      </button>
    </div>
  )
}
