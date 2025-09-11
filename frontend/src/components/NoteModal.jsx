"use client";
import React, { useState, useEffect } from "react";

const NoteModal = ({ note, onSave, onClose, viewOnly = false, theme }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setTags(note.tags ? note.tags.join(", ") : "");
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const noteData = {
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };

    await onSave(noteData, e);
    setLoading(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Theme-based classes
  const modalContainer = theme === "dark" 
    ? "bg-gray-800 border-cyan-500/20 shadow-cyan-500/10"
    : "bg-white border-gray-300 shadow-gray-400/10";
  
  const borderClass = theme === "dark" 
    ? "border-gray-700" 
    : "border-gray-200";
  
  const textClass = theme === "dark" 
    ? "text-white" 
    : "text-gray-800";
  
  const labelClass = theme === "dark" 
    ? "text-gray-300" 
    : "text-gray-600";
  
  const inputBg = theme === "dark" 
    ? "bg-gray-700 border-gray-600" 
    : "bg-gray-50 border-gray-300";
  
  const inputText = theme === "dark" 
    ? "text-white placeholder-gray-400" 
    : "text-black placeholder-gray-500";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className={`rounded-xl border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden ${modalContainer}`}>
        {/* Modal Header */}
        <div className={`flex justify-between items-center p-6 border-b ${borderClass}`}>
          <h2 className={`text-xl font-semibold ${textClass}`}>
            {viewOnly
              ? "👀 Viewing Note"
              : note
              ? "✏️ Editing Note"
              : "➕ Creating New Note"}
          </h2>
          <button
            onClick={onClose}
            className={`hover:text-cyan-500 transition-colors duration-200 text-2xl ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
          onClick={(e) => viewOnly && e.preventDefault()}
        >
          {/* Title Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              📝 Title
            </label>
            {viewOnly ? (
              <div className={`px-4 py-3 rounded-lg ${textClass} font-medium text-lg`}>
                {title || "Untitled Note"}
              </div>
            ) : (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 ${inputBg} ${inputText}`}
                placeholder="Enter note title..."
                autoFocus
              />
            )}
          </div>

          {/* Content Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              📄 Content
            </label>
            {viewOnly ? (
              <div 
                className={`p-4 rounded-lg max-h-96 overflow-y-auto whitespace-pre-wrap ${textClass} leading-relaxed`}
              >
                {content || "No content"}
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none ${inputBg} ${inputText}`}
                placeholder="Write your note content here..."
              />
            )}
          </div>

          {/* Tags Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              🏷️ Tags (comma separated)
            </label>
            {viewOnly ? (
              <div className="flex flex-wrap gap-2">
                {tags.split(",")
                  .map(tag => tag.trim())
                  .filter(tag => tag.length > 0)
                  .map((tag, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        theme === "dark" 
                          ? "bg-cyan-500/20 text-cyan-300" 
                          : "bg-cyan-100 text-cyan-700"
                      }`}
                    >
                      {tag}
                    </span>
                  ))
                }
              </div>
            ) : (
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 ${inputBg} ${inputText}`}
                placeholder="work, personal, ideas..."
              />
            )}
          </div>

          {/* Modal Footer */}
          <div className={`flex justify-end space-x-4 pt-4 border-t ${borderClass}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                theme === "dark" 
                  ? "bg-gray-700 hover:bg-gray-600 text-white" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              ❌ Close
            </button>

            {/* Only show save button if not viewOnly */}
            {!viewOnly && (
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                  theme === "dark" 
                    ? "bg-cyan-600 hover:bg-cyan-700 text-white" 
                    : "bg-cyan-500 hover:bg-cyan-600 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <span>⏳</span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>{note ? "Update Note" : "Create Note"}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;