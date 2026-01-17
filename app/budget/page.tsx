'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Budget = {
  id: string
  user_id: string
  gross_income: number | null
  net_income: number
  created_at: string
}

export default function BudgetPage() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBudget = async () => {
      setLoading(true)
      setError(null)

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

      // 2️⃣ 查询该用户最近一条预算记录（不用 single）
      const { data, error } = await supabase
        .from('budget')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        setError('读取预算数据失败，请稍后重试')
        setLoading(false)
        return
      }

      // 3️⃣ 真正没有数据的情况
      if (!data || data.length === 0) {
        setError('还没有预算数据，请先完成收入设置')
        setLoading(false)
        return
      }

      // 4️⃣ 正常拿到数据
      setBudget(data[0])
      setLoading(false)
    }

    fetchBudget()
  }, [])

  // ===== UI 状态 =====

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

  if (!budget) return null

  // ===== 正常展示 =====

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        💗 亲爱的，这是你本期可以安心使用的钱
      </h1>

      <div className="rounded-xl bg-gray-100 p-6">
        <p className="text-sm text-gray-500">本期可支配金额</p>
        <p className="text-3xl font-semibold">
          ¥ {budget.net_income.toLocaleString()}
        </p>

        {budget.gross_income && (
          <p className="mt-2 text-sm text-gray-400">
            税前收入：¥ {budget.gross_income.toLocaleString()}
          </p>
        )}
      </div>

      <div className="space-y-3">
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
