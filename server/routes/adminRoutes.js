const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Exam = require('../models/Exam');
const Submission = require('../models/Submission');
const Result = require('../models/Result');
const auth = require('../middleware/auth');

// Get all users
router.get('/users', auth(['admin']), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all results
router.get('/results', auth(['admin']), async (req, res) => {
    try {
        const results = await Result.find()
            .populate('studentId', 'name email')
            .populate('examId', 'title subject');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Publish results
router.patch('/results/:id/publish', auth(['admin']), async (req, res) => {
    try {
        const result = await Result.findByIdAndUpdate(
            req.params.id,
            { isPublished: true, publishedAt: new Date() },
            { new: true }
        ).populate('studentId', 'name email')
        .populate('examId', 'title subject');
        
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        
        res.status(200).json({ message: 'Result published successfully', result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unpublish results
router.patch('/results/:id/unpublish', auth(['admin']), async (req, res) => {
    try {
        const result = await Result.findByIdAndUpdate(
            req.params.id,
            { isPublished: false, publishedAt: null },
            { new: true }
        ).populate('studentId', 'name email')
        .populate('examId', 'title subject');
        
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        
        res.status(200).json({ message: 'Result unpublished successfully', result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Deleting the stored student result
router.delete('/results/:id', auth(['admin']), async (req, res) => {
    try {
        const result = await Result.findByIdAndDelete(req.params.id);
        
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        
        // Also delete the associated submission
        await Submission.findByIdAndDelete(result.submissionId);
        
        res.status(200).json({ message: 'Result deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get dashboard statistics
router.get('/dashboard', auth(['admin']), async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const examsCount = await Exam.countDocuments();
        const submissionsCount = await Submission.countDocuments();
        
        const recentExams = await Exam.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('createdBy', 'name');
            
        const recentSubmissions = await Submission.find()
            .sort({ submittedAt: -1 })
            .limit(5)
            .populate('studentId', 'name')
            .populate('examId', 'title');
            
        res.status(200).json({
            stats: {
                users: usersCount,
                exams: examsCount,
                submissions: submissionsCount
            },
            recentExams,
            recentSubmissions
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;