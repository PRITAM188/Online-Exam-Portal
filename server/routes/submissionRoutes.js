const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Exam = require('../models/Exam');
const Result = require('../models/Result');
const auth = require('../middleware/auth');

// Submit exam
router.post('/', auth(['student']), async (req, res) => {
    try {
        const { examId, answers, timeTaken } = req.body;
        
        if (!examId || !answers || !timeTaken) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        if (!exam.isPublished || 
            (exam.availableTo && new Date(exam.availableTo) < new Date())) {
            return res.status(403).json({ message: 'Exam not available' });
        }

        const attemptCount = await Submission.countDocuments({
            examId,
            studentId: req.user.id
        });
        
        if (attemptCount >= exam.maxAttempts) {
            return res.status(403).json({ message: 'Maximum attempts reached' });
        }

        let score = 0;
        const detailedAnswers = answers.map(answer => {
            const question = exam.questions.id(answer.questionId);
            if (!question) return null;

            const isCorrect = question.correctAnswer === answer.selectedOption;
            if (isCorrect) score += question.marks || 1;

            return {
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                isCorrect,
                marksObtained: isCorrect ? (question.marks || 1) : 0
            };
        }).filter(Boolean);

        const totalMarks = exam.questions.reduce((sum, q) => sum + (q.marks || 1), 0);

        const submission = new Submission({
            studentId: req.user.id,
            examId,
            answers: detailedAnswers,
            score,
            totalMarks,
            timeTaken,
            isEvaluated: true 
        });

        await submission.save();
        
        const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
        const grade = calculateGrade(percentage);

        const result = new Result({
            studentId: req.user.id,
            examId,
            submissionId: submission._id,
            score,
            totalMarks,
            percentage,
            grade,
            isPublished: false,
            publishedAt: null
        });

        await result.save();

        res.status(201).json({ 
            message: 'Exam submitted successfully', 
            submissionId: submission._id,
            score,
            totalMarks,
            percentage,
            grade
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get submission details
router.get('/:id', auth(), async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('studentId', 'name email')
            .populate('examId', 'title subject');
        
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        if (req.user.role !== 'admin' && submission.studentId._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.status(200).json(submission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all submissions for a student (for Admin view)
router.get('/student/:studentId', auth(['admin']), async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.params.studentId })
            .populate('examId', 'title subject');
        res.status(200).json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all submissions for an exam (for Admin view)
router.get('/exam/:examId', auth(['admin']), async (req, res) => {
    try {
        const submissions = await Submission.find({ examId: req.params.examId })
            .populate('studentId', 'name email');
        res.status(200).json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// This allows a logged-in student to fetch their own published results.
router.get('/me/results', auth(['student']), async (req, res) => {
    try {
        const results = await Result.find({ studentId: req.user.id, isPublished: true })
            .populate('examId', 'title subject');
        
        // Always return a successful response with the results (or an empty array)
        res.status(200).json(results);

    } catch (err) {
        // This will only catch actual server/database errors
        res.status(500).json({ message: err.message });
    }
});

// Helper function to calculate grade
function calculateGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
}

module.exports = router;