const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    type: { type: String, enum: ['mcq', 'saq'], default: 'mcq', required: true },
    options: { type: [String], required: function() { return this.type === 'mcq'; } },
    correctAnswer: { type: String, required: true },
    marks: { type: Number, default: 1 }
});

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String },
    timeLimit: { type: Number, required: true },
    questions: [questionSchema],
    maxAttempts: { type: Number, default: 1 },
    availableFrom: { type: Date, default: Date.now },
    availableTo: { type: Date },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', examSchema);