const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new note
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const note = await Note.create({
      userId: req.userId,
      title: req.body.title,
      content: req.body.content,
    });
    res.status(201).json({note});
  } catch (err) {
    res.status(500).json({ message: 'Error creating note' });
  }
});

// Get all notes for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Get a single note by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if the logged-in user owns the note
    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json(note);
  } catch (err) {
    console.error('Get note by ID error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a note (only if owned by user)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(403).json({ message: 'Not authorized' });

    note.title = req.body.title;
    note.content = req.body.content;
    await note.save();

    res.json({ message: 'Note updated', note });
  } catch (err) {
    res.status(500).json({ message: 'Error updating note' });
  }
});

// Delete a note (only if owned by user)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(403).json({ message: 'Not authorized or already deleted' });

    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router;
