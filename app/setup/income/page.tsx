'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function IncomeSetupPage() {
  const router = useRouter()

  const [grossIncome, setGrossIncome] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 临时税后逻辑（后续可换）
  const calculateNetIncome = (gross: number) => {
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

    // 1️⃣ 获取当前用户
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

    // 2️⃣ 先检查是否已有 budget（防止重复）
    const { data: existing } = await supabase
      .from('budget')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    let saveError = null

    if (existing) {
      // 更新
      const { error } = await supabase
        .from('budget')
        .update({
          gross_income: gross,
          net_income: netIncome,
        })
        .eq('user_id', user.id)

      saveError = error
    } else {
      // 新建
      const { error } = await supabase
        .from('budget')
        .insert({
          user_id: user.id,
          gross_income: gross,
          net_income: netIncome,
        })

      saveError = error
    }

    if (saveError) {
      console.error(saveError)
      setError('收入保存失败，请稍后再试')
      setLoading(false)
      return
    }

    // 3️⃣ 成功 → 进入 budget
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

      <p className="text-xs text-gray-400">
        税后计算逻辑后续可优化，这里先保证流程正确
      </p>
    </div>
  )
}
