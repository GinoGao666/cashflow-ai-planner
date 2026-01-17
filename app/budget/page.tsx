'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Budget = {
  id: string
  net_income: number
  gross_income: number | null
  created_at: string
}

export default function BudgetPage() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBudget = async () => {
      setLoading(true)

      // 1️⃣ 获取当前登录用户
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError('未登录，请先登录')
        setLoading(false)
        return
      }

      // 2️⃣ 读取该用户最新的一条 budget
      const { data, error } = await supabase
        .from('budget')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        setError('还没有预算数据，请先完成收入设置')
      } else {
        setBudget(data)
      }

      setLoading(false)
    }

    fetchBudget()
  }, [])

  // ===== UI 状态处理 =====

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-red-500">{error}</p>
        <a
          href="/setup/income"
          className="text-blue-600 underline"
        >
          去设置收入 →
        </a>
      </div>
    )
  }

  if (!budget) {
    return null
  }

  // ===== 正常展示 =====

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        亲爱的，这是你本期可以安心使用的钱 💛
      </h1>

      <div className="rounded-xl bg-gray-100 p-6">
        <p className="text-sm text-gray-500">本期可支配金额</p>
        <p className="text-3xl font-semibold">
          ¥ {budget.net_income.toLocaleString()}
        </p>
      </div>

      <div className="space-y-2">
        <a
          href="/expenses/new"
          className="block w-full rounded-lg bg-black py-3 text-center text-white"
        >
          记录一笔花费
        </a>

        <a
          href="/setup/income"
          className="block text-center text-sm text-gray-500 underline"
        >
          修改收入设置
        </a>
      </div>
    </div>
  )
}
