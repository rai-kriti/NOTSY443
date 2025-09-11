"use client"
import React from 'react'

const NoteCard = ({ note, onEdit, onDelete,onView, theme }) => {
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

  // Theme-based classes
  const containerClasses = theme === "dark" 
    ? "bg-gray-800 border-cyan-500/20 hover:border-cyan-500/40 text-white"
    : "bg-white border-gray-300 hover:border-cyan-500"

  const titleClasses = theme === "dark" 
    ? "text-white" 
    : "text-gray-800"

  const contentClasses = theme === "dark" 
    ? "text-gray-300" 
    : "text-gray-600"

  const footerClasses = theme === "dark" 
    ? "text-gray-400" 
    : "text-gray-500"

  const tagClasses = theme === "dark"
    ? "bg-cyan-500/20 text-cyan-300"
    : "bg-cyan-100 text-cyan-700"

  return (
    <div
     onClick={() => onView && onView(note)} // 👈  click handler
      className={`cursor-pointer border rounded-xl p-6 transition-all duration-200 group hover:shadow-lg hover:shadow-cyan-500/10 ${containerClasses}`}
    >
      {/* Note Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-lg font-semibold truncate pr-2 ${titleClasses}`}>
          {note.title || "Untitled Note"}
        </h3>

        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              stopPropagation(e)
              onEdit(note)
            }}
            className={`p-1 rounded transition-colors duration-200 ${
              theme === "dark" 
                ? "text-cyan-400 hover:text-cyan-300" 
                : "text-cyan-600 hover:text-cyan-700"
            }`}
            title="Edit note"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              stopPropagation(e)
              onDelete(note._id)
            }}
            className={`p-1 rounded transition-colors duration-200 ${
              theme === "dark" 
                ? "text-red-400 hover:text-red-300" 
                : "text-red-600 hover:text-red-700"
            }`}
            title="Delete?"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div className="mb-4">
        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${contentClasses}`}>
          {truncateContent(note.content || "No content")}
        </p>
      </div>

      {/* Note Footer */}
      <div className={`flex justify-between items-center text-xs ${footerClasses}`}>
        <span>📅 {formatDate(note.createdAt)}</span>
        {note.updatedAt !== note.createdAt && <span>✏️ Updated {formatDate(note.updatedAt)}</span>}
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {note.tags.map((tag, index) => (
            <span key={index} className={`px-2 py-1 text-xs rounded-full ${tagClasses}`}>
              🏷️ {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default NoteCard