'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')

      console.log(data, error)
    }

    testConnection()
  }, [])

  return <div>Testing Supabase Connection...</div>
}
