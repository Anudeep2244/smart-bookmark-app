'use client'

interface Bookmark {
  id: string
  title: string
  url: string
}

interface Props {
  bookmarks: Bookmark[]
  onDelete: (id: string) => Promise<void>
}

export default function BookmarkList({ bookmarks, onDelete }: Props) {
  if (bookmarks.length === 0) {
    return (
      <div className="card p-8 text-center animate-fadeIn">
        <p className="text-slate-600">
          No bookmarks yet. Add one above!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="card p-6 flex justify-between items-center hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
        >
          {/* Bookmark Info */}
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {bookmark.title}
            </h3>

            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-sm underline break-all transition-colors"
            >
              {bookmark.url}
            </a>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(bookmark.id)}
            className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
