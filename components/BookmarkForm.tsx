'use client'

import { useState } from 'react'

interface Props {
  onAdd: (title: string, url: string) => Promise<void>
}

export default function BookmarkForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !url.trim()) {
      alert('Both fields are required')
      return
    }

    try {
      setLoading(true)
      await onAdd(title, url)

      // Reset form
      setTitle('')
      setUrl('')
    } catch (error) {
      alert('Failed to add bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Add New Bookmark
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Bookmark Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </form>
    </div>
  )
}
