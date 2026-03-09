const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    revisionText: { type: String, default: '' },
    diagrams: [
      {
        type: { type: String, enum: ['flowchart', 'bar', 'pie', 'line', 'concept'] },
        title: String,
        description: String,
        data: mongoose.Schema.Types.Mixed,
      },
    ],
    questions: {
      shortAnswer: [{ question: String, answer: String }],
      longAnswer: [{ question: String, answer: String }],
      mcq: [
        {
          question: String,
          options: [String],
          correct: Number,
        },
      ],
    },
    class: { type: String, default: '' },
    subject: { type: String, default: '' },
    chapter: { type: String, default: '' },
    examType: { type: String, default: '' },
    originalContent: { type: String, default: '' },
    creditsUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, subject: 1 });

module.exports = mongoose.model('Note', noteSchema);
