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
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">
          No bookmarks yet. Add one above!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">{bookmark.title}</h3>
            <a
              href={bookmark.url}
              target="_blank"
              className="text-blue-600 text-sm"
            >
              {bookmark.url}
            </a>
          </div>

          <button
            onClick={() => onDelete(bookmark.id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
