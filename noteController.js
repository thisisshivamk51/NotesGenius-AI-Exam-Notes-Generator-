const Note = require('../models/Note');
const User = require('../models/User');
const geminiService = require('../services/geminiService');
const pdfService = require('../services/pdfService');

// GET /api/v1/notes
const getNotes = async (req, res) => {
  try {
    const { subject, class: userClass, page = 1, limit = 10 } = req.query;
    const filter = { userId: req.user._id };
    if (subject) filter.subject = subject;
    if (userClass) filter.class = userClass;

    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-originalContent');

    const total = await Note.countDocuments(filter);
    res.json({ success: true, notes, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/notes/:id
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/notes/generate
const generateNote = async (req, res) => {
  try {
    const { text, title, class: userClass, subject, chapter, examType } = req.body;
    let content = text;

    // Handle PDF upload
    if (req.file) {
      content = await pdfService.extractText(req.file.buffer);
    }

    if (!content) return res.status(400).json({ success: false, message: 'No content provided' });

    // Generate notes via Gemini
    const result = await geminiService.generateNotes(content, { class: userClass, subject, examType });

    // Deduct credits
    await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -req.creditCost } });

    const note = await Note.create({
      userId: req.user._id,
      title: title || `${subject || 'Notes'} - ${chapter || new Date().toLocaleDateString()}`,
      content: result.notes,
      diagrams: result.diagrams || [],
      class: userClass || '',
      subject: subject || '',
      chapter: chapter || '',
      examType: examType || '',
      originalContent: content.substring(0, 5000),
      creditsUsed: req.creditCost,
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/notes/:id/revision
const generateRevision = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    const revisionText = await geminiService.generateRevision(note.content);
    note.revisionText = revisionText;
    await note.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -req.creditCost } });

    res.json({ success: true, revisionText });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/notes/:id/questions
const generateQuestions = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    const questions = await geminiService.generateQuestions(note.content, {
      class: note.class,
      subject: note.subject,
      examType: note.examType,
    });
    note.questions = questions;
    await note.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -req.creditCost } });

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/v1/notes/:id
const updateNote = async (req, res) => {
  try {
    const { title, class: userClass, subject, chapter } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, class: userClass, subject, chapter },
      { new: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/v1/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNotes, getNoteById, generateNote, generateRevision, generateQuestions, updateNote, deleteNote };
