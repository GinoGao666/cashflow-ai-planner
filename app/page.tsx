'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        router.replace('/setup/income')
      } else {
        router.replace('/login')
      }
    }
    check()
  }, [router])

  return null
}
