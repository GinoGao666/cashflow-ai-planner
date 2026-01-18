'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">
          Cashflow AI Planner
        </h1>

        <p className="text-sm text-gray-500 text-center">
          登录后开始你的月度预算规划
        </p>

        <button
          onClick={() => router.push('/login')}
          className="w-full bg-black text-white py-2 rounded"
        >
          邮箱登录 →
        </button>
      </div>
    </div>
  )
}
