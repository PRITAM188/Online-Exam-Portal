const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Submission = require('../models/Submission');
const Result = require('../models/Result');
const auth = require('../middleware/auth');
const { validateExam } = require('../utils/validation');

// Create exam (Admin only)
router.post('/', auth(['admin']), async (req, res) => {
    try {
        const { title, subject, description, timeLimit, questions, maxAttempts, availableTo } = req.body;
        
        if (!validateExam(req.body)) {
            return res.status(400).json({ 
                message: 'Validation failed: Exam must have title (min 5 chars) and at least 1 question' 
            });
        }

        const exam = new Exam({
            title,
            subject,
            description,
            timeLimit,
            questions,
            maxAttempts,
            availableTo,
            createdBy: req.user.id
        });

        await exam.save();
        res.status(201).json({ message: 'Exam created successfully', exam });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all exams (Admin gets all, Student gets only published)
router.get("/", auth(), async (req, res) => {
    try {
        let exams;
        if (req.user.role === 'admin') {
            exams = await Exam.find().populate('createdBy', 'name email');
        } else {
            const now = new Date();
            exams = await Exam.find({
                isPublished: true,
                availableFrom: { $lte: now },
                $or: [
                    { availableTo: null },
                    { availableTo: { $gte: now } }
                ]
            }).select('-questions.correctAnswer');
        }
        res.status(200).json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get exam details
router.get('/:id', auth(), async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        if (req.user.role === 'student' && !exam.isPublished) {
            return res.status(403).json({ message: 'Exam not available' });
        }

        if (req.user.role === 'student') {
            const examObj = exam.toObject();
            examObj.questions.forEach(q => delete q.correctAnswer);
            return res.status(200).json(examObj);
        }

        res.status(200).json(exam);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Publish exam (Admin only)
router.patch('/:id/publish', auth(['admin']), async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(
            req.params.id,
            { isPublished: true, publishedAt: new Date() },
            { new: true }
        );
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        
        res.status(200).json({ message: 'Exam published successfully', exam });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Unpublish exam
router.patch("/:id/unpublish", auth(['admin']), async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(
            req.params.id,
            { 
                isPublished: false,
                publishedAt: null 
            },
            { new: true }
        );
        
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        
        res.status(200).json({ message: "Exam unpublished successfully", exam });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get exam attempts count for student
router.get('/:id/attempts', auth(['student']), async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const attemptCount = await Submission.countDocuments({
            examId: req.params.id,
            studentId: req.user.id
        });

        res.status(200).json({ 
            attempts: attemptCount, 
            maxAttempts: exam.maxAttempts,
            allowed: attemptCount < exam.maxAttempts 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
    try {
        const examId = req.params.id;
        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Important: Delete associated submissions and results to maintain data integrity
        await Submission.deleteMany({ examId: examId });
        await Result.deleteMany({ examId: examId });

        // Finally, delete the exam itself
        await Exam.findByIdAndDelete(examId);

        res.status(200).json({ message: 'Exam and all associated data deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;