// AI routes are handled via /api/v1/notes
// This file is a placeholder for any standalone AI endpoints
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/status', protect, (req, res) => {
  res.json({ success: true, message: 'AI service is operational' });
});

module.exports = router;
