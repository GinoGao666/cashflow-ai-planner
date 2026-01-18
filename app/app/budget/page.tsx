'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Budget = {
  id: string
  gross_income: number
  net_income: number
}

type Expense = {
  id: string
  category: string
  amount: number
  note: string
  created_at: string
}

export default function BudgetPage() {
  const router = useRouter()
  const [budget, setBudget] = useState<Budget | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      const { data: budgetData } = await supabase
        .from('budget')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!budgetData) {
        router.replace('/setup/income')
        return
      }

      const { data: expenseData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setBudget(budgetData)
      setExpenses(expenseData || [])
      setLoading(false)
    }

    load()
  }, [router])

  if (loading || !budget) {
    return <div className="p-6">加载中...</div>
  }

  const spent = expenses.reduce((s, e) => s + e.amount, 0)
  const remaining = budget.net_income - spent

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        亲爱的，这是你本月的财务状态 💛
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-gray-100 p-4">
          <p className="text-sm text-gray-500">可支配金额</p>
          <p className="text-xl font-semibold">¥ {budget.net_income}</p>
        </div>

        <div className="rounded-xl bg-gray-100 p-4">
          <p className="text-sm text-gray-500">剩余</p>
          <p className="text-xl font-semibold">
            ¥ {remaining}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          className="w-full rounded-lg bg-black py-3 text-white"
          onClick={() => router.push('/expenses/new')}
        >
          💬 用一句话记账（AI）
        </button>

        <button
          className="w-full text-sm underline text-gray-500"
          onClick={() => router.push('/setup/income')}
        >
          修改收入
        </button>
      </div>

      <div>
        <h2 className="font-medium mb-2">最近花费</h2>
        {expenses.length === 0 && (
          <p className="text-sm text-gray-400">还没有记录</p>
        )}
        {expenses.map((e) => (
          <div key={e.id} className="flex justify-between text-sm py-1">
            <span>{e.note}</span>
            <span>¥ {e.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
