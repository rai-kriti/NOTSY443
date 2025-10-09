  "use client";
import React from 'react'
import { useState, useEffect } from "react";
import NoteCard from "./NoteCard";
import NoteModal from "./NoteModal";

const Dashboard = ({ user, onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewingNote, setViewingNote] = useState(null); // 👈 for view-only mode
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


useEffect(() => {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  localStorage.setItem("theme", theme);
}, [theme]);

  useEffect(() => {
    if (!user) return; // just in case
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found in localStorage.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch notes:", await response.text());
        return;
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleViewNote = (note) => {
  setViewingNote(note);
};

  const handleDeleteNote = async (noteId) => {
    if (!confirm("🗑️ Are you sure you want to delete this note?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note._id !== noteId));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleSaveNote = async (noteData, event) => {
  if (event) event.preventDefault();

  try {
    const token = localStorage.getItem("token");
    const url = editingNote
      ? `${API_BASE_URL}/api/notes/${editingNote._id}`
      : `${API_BASE_URL}/api/notes/create`;
    const method = editingNote ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });

    if (response.ok) {
      const data = await response.json();
      const savedNote = data.note; // ✅ Extract `note` from response object

      console.log("✅ Saved note from backend:", savedNote);

      if (editingNote) {
        // ✅ Merge the updated note into the existing notes list
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === editingNote._id ? { ...note, ...savedNote } : note
          )
        );
      } else {
        // ✅ Add new note at the beginning
        setNotes((prevNotes) => [savedNote, ...prevNotes]);
      }

      setIsModalOpen(false);
      setEditingNote(null);
    } else {
      console.error("Failed to save note. Server responded with:", response.status);
    }
  } catch (error) {
    console.error("❌ Error saving note:", error);
  }
};


  const filteredNotes = notes.filter(
    (note) =>
      note?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note?.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
  {/* Header */}
  <header className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} border-b border-cyan-500/20 shadow-lg shadow-cyan-500/5`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-cyan-400">📝 Notsee</h1>
          <span className={theme === "dark" ? "text-gray-200 text-2xl" : "text-gray-800 text-2xl"}>
            Welcome, {user?.email}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleCreateNote}
            className="bg-cyan-200 hover:bg-green-100 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            ➕
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={`${theme === "light" ? "bg-gray-200 hover:bg-gray-300 text-black" : "bg-gray-700 hover:bg-gray-600 text-white"} px-3 py-2 rounded-lg font-medium transition-colors duration-200`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button
            onClick={onLogout}
            className="bg-red-200 hover:bg-red-100 text-white px-1 py-1 rounded-lg text-2xl transition-colors duration-200"
          >
            ↩️
          </button>
        </div>
      </div>
    </div>
  </header>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Search Bar */}
    <div className="mb-8">
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search notes..."
          className={`w-full px-4 py-3 pl-12 border rounded-lg placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 ${
            theme === "dark" ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
          }`}
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
      </div>
    </div>

    {/* Notes Grid */}
    {loading ? (
      <div className="flex justify-center items-center py-12 text-cyan-400 text-xl">⏳ Loading notes...</div>
    ) : filteredNotes.length === 0 ? (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className={`text-xl font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          {searchTerm ? "No notes found" : "No notes yet"}
        </h3>
        <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {searchTerm ? "Try a different search term" : "Create your first note to get started"}
        </p>
        {!searchTerm && (
          <button
            onClick={handleCreateNote}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            ➕ Create Note
          </button>
        )}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNotes.map((note) => (
          <NoteCard key={note._id} note={note} onEdit={handleEditNote} onDelete={handleDeleteNote} onView={handleViewNote}
            theme={theme} />
        ))}
      </div>
    )}
  </main>



      {/* Note Modal */}
      {isModalOpen && (
        <NoteModal
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => {
            setIsModalOpen(false);
            setEditingNote(null);
          }}
          theme={theme}
        />
      )}


      {/* View-Only Note Modal */}
{viewingNote && (
  <NoteModal
    note={viewingNote}
    onClose={() => setViewingNote(null)}
    viewOnly={true}
    theme={theme}
  />
)}
    </div>
  );
};

export default Dashboard;
 