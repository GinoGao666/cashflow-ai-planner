'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function BudgetPage() {
  const router = useRouter()
  const [netIncome, setNetIncome] = useState<number | null>(null)

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      const { data } = await supabase
        .from('budget')
        .select('net_income')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!data) {
        router.replace('/setup/income')
        return
      }

      setNetIncome(data.net_income)
    }

    init()
  }, [router])

  if (!netIncome) {
    return <div className="p-6">加载中...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        亲爱的，这是你本月的预算中心 💛
      </h1>

      <div className="rounded-xl bg-gray-100 p-6">
        <p className="text-sm text-gray-500">本月可支配金额</p>
        <p className="text-3xl font-semibold">
          ¥ {netIncome.toLocaleString()}
        </p>
      </div>

      <div className="space-y-3">
        <button
          className="w-full rounded-lg bg-black py-3 text-white"
          onClick={() => router.push('/expenses/new')}
        >
          🤖 AI 记一笔花费
        </button>

        <button
          className="w-full text-sm text-gray-500 underline"
          onClick={() => router.push('/setup/income')}
        >
          修改收入设置
        </button>
      </div>
    </div>
  )
}
