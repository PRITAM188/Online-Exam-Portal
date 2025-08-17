const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    remarks: { type: String }
});

module.exports = mongoose.model('Result', resultSchema);