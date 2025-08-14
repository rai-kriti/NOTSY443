"use client"
import React from 'react'

const NoteCard = ({ note, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  // Prevent bubbling so clicking on buttons doesn't trigger onView
  const stopPropagation = (e) => e.stopPropagation()

  return (
    <div
      onClick={() => onView && onView(note)} // handle note viewing
      className="cursor-pointer bg-gray-800 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/10 group"
    >
      {/* Note Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white truncate pr-2">
          {note.title || "Untitled Note"}
        </h3>

        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              stopPropagation(e)
              onEdit(note)
            }}
            className="text-cyan-400 hover:text-cyan-300 p-1 rounded transition-colors duration-200"
            title="Edit note"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              stopPropagation(e)
              onDelete(note._id)
            }}
            className="text-red-400 hover:text-red-300 p-1 rounded transition-colors duration-200"
            title="Delete?"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {truncateContent(note.content || "No content")}
        </p>
      </div>

      {/* Note Footer */}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>📅 {formatDate(note.createdAt)}</span>
        {note.updatedAt !== note.createdAt && <span>✏️ Updated {formatDate(note.updatedAt)}</span>}
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {note.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">
              🏷️ {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default NoteCard
