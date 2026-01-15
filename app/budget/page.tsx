'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function BudgetPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.replace('/login')
      } else {
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        正在确认你的身份哦，亲爱的…
      </div>
    )
  }

  return (
    <div>
      {type Expense = {
  id: string
  amount: number
  category: string
  created_at: string
}

export default function BudgetPage() {
  const [user, setUser] = useState<any>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('餐饮')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/'
        return
      }
      setUser(data.user)
      fetchExpenses(data.user.id)
    })
  }, [])

  async function fetchExpenses(userId: string) {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    setExpenses(data || [])
    setLoading(false)
  }

  async function addExpense() {
    if (!amount) return

    await supabase.from('expenses').insert({
      user_id: user.id,
      amount: Number(amount),
      category
    })

    setAmount('')
    fetchExpenses(user.id)
  }

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        亲爱的，今天花了多少钱？ 💸
      </h1>

      <div className="space-y-2">
        <input
          type="number"
          placeholder="输入金额"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option>餐饮</option>
          <option>交通</option>
          <option>购物</option>
          <option>娱乐</option>
          <option>其他</option>
        </select>

        <button
          onClick={addExpense}
          className="w-full bg-black text-white py-2 rounded"
        >
          记录这一笔
        </button>
      </div>

      <div>
        <h2 className="font-semibold mb-2">你的最近支出</h2>

        {expenses.length === 0 && (
          <div className="text-gray-500">
            还没有记录，开始第一笔吧 🌱
          </div>
        )}

        <ul className="space-y-2">
          {expenses.map((e) => (
            <li
              key={e.id}
              className="flex justify-between border-b pb-1"
            >
              <span>{e.category}</span>
              <span>¥ {e.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
}
      <h1 className="text-xl font-bold">我的预算</h1>
    </div>
  )
}

