'use client'

import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loadingBookmarks, setLoadingBookmarks] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

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

  // Refresh 
  await fetchBookmarks()
}

if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <svg
              className="h-8 w-8 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <svg
                className="h-6 w-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Bookmark Manager</h1>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookmarkForm onAdd={handleAddBookmark} />

        {loadingBookmarks ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin mb-3">
                <svg
                  className="h-6 w-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p className="text-slate-600">Loading bookmarks...</p>
            </div>
          </div>
        ) : (
          <BookmarkList bookmarks={bookmarks} onDelete={handleDeleteBookmark} />
        )}
      </main>
    </div>
  )
}
