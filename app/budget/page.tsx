'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function BudgetPage() {
  const router = useRouter()
  const [budget, setBudget] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (!user) {
        router.replace('/login')
        return
      }

      const { data: budget } = await supabase
        .from('budget')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (!budget) {
        router.replace('/setup/income')
        return
      }

      setBudget(budget)
    }

    load()
  }, [router])

  if (!budget) return null

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">本月预算总览</h1>

      <div className="bg-gray-100 p-4 rounded">
        <p>税前收入：¥ {budget.gross_income}</p>
        <p className="text-2xl font-bold">
          可支配：¥ {budget.net_income}
        </p>
      </div>

      <div className="space-y-2">
        <button className="w-full bg-black text-white py-2 rounded">
          记录一笔花费（下一步）
        </button>

        <button
          onClick={() => router.push('/setup/income')}
          className="text-sm underline"
        >
          修改收入
        </button>
      </div>
    </div>
  )
}
