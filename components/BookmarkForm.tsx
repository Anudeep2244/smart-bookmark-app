'use client'

import { useState } from 'react'

interface Props {
  onAdd: (title: string, url: string) => Promise<void>
}

export default function BookmarkForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !url.trim()) {
      setError('Both fields are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      await onAdd(title, url)

      setTitle('')
      setUrl('')
    } catch (err) {
      setError('Failed to add bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-10 animate-slideUp">
      <div className="card p-8 max-w-2xl mx-auto">

        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Add New Bookmark
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Save a link to access it anytime
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., React Documentation"
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary-500 
              focus:border-transparent transition-all duration-200 
              disabled:opacity-50"
            />
          </div>

          {/* URL Input */}
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              URL
            </label>

            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://react.dev"
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary-500 
              focus:border-transparent transition-all duration-200 
              disabled:opacity-50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Bookmark'}
          </button>
        </form>
      </div>
    </div>
  )
}
