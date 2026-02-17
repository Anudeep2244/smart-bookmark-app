'use client'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
const [bookmarks, setBookmarks] = useState<any[]>([])
const [loadingBookmarks, setLoadingBookmarks] = useState(true)

  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      router.push('/')
    } else {
      setUser(data.user)
      await fetchBookmarks()
    }

    setLoading(false)
  }

  getUser()
}, [router])
useEffect(() => {
  const channel = supabase
    .channel('bookmarks-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookmarks',
      },
      (payload) => {
        console.log('Realtime change received:', payload)
        fetchBookmarks()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])



  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleAddBookmark = async (title: string, url: string) => {
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase.from('bookmarks').insert([
    {
      title,
      url,
      user_id: userData.user.id
    }
  ])

  if (error) {
    console.error(error)
    throw error
  }

  // Refresh list after insert
  await fetchBookmarks()
}

const fetchBookmarks = async () => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookmarks:', error)
  } else {
    setBookmarks(data)
  }

  setLoadingBookmarks(false)
}

const handleDeleteBookmark = async (id: string) => {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete error:', error)
    alert('Failed to delete bookmark')
    return
  }

  // Refresh manually (optional because realtime also handles it)
  await fetchBookmarks()
}

  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading dashboard...</p>
    </div>
  )
}


 return (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">
        Welcome, {user?.email}
      </h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>

    <BookmarkForm onAdd={handleAddBookmark} />
{loadingBookmarks ? (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <p>Loading bookmarks...</p>
  </div>
) : (
<BookmarkList
  bookmarks={bookmarks}
  onDelete={handleDeleteBookmark}
/>
)}
  </div>
)

}
