const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedOption: { type: String },
    isCorrect: { type: Boolean },
    marksObtained: { type: Number, default: 0 }
});

const submissionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    timeTaken: { type: Number }, // in minutes
    isEvaluated: { type: Boolean, default: false }
});

module.exports = mongoose.model('Submission', submissionSchema);