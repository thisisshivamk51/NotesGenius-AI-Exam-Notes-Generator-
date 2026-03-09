const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { checkCredits } = require('../middleware/credits');
const {
  getNotes, getNoteById, generateNote, generateRevision,
  generateQuestions, updateNote, deleteNote
} = require('../controllers/noteController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(protect);

router.get('/', getNotes);
router.get('/:id', getNoteById);
router.post('/generate', checkCredits('GENERATE_NOTES'), upload.single('pdf'), generateNote);
router.post('/:id/revision', checkCredits('REVISION_MODE'), generateRevision);
router.post('/:id/questions', checkCredits('IMPORTANT_QUESTIONS'), generateQuestions);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
