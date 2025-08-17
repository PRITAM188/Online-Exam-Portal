const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { validateEmail, validatePassword } = require('../utils/validation');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, enrollmentNumber, department } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // CORRECTED: Standardized password length to match validation.js
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    try {
        const { name, enrollmentNumber, department } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { enrollmentNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or enrollment number' });
        }

        const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'student';
        const newUser = new User({ name, email, password, role, enrollmentNumber, department });
        await newUser.save();

        res.status(201).json({ 
            message: 'User registered successfully',
            user: { 
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    if (!validateEmail(req.body.email)) {
        return res.status(400).json({ error: "Invalid email!" });
    }

    // CORRECTED: Validates the password instead of the email
    if (!validatePassword(req.body.password)) {
        return res.status(400).json({ error: "Invalid password!" });
    }

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ message: 'User not found or password incorrect!' });
        }

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({ 
            message: 'Login successful', 
            user: { 
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                enrollmentNumber: user.enrollmentNumber,
                department: user.department
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Get current user
router.get('/me', auth(), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;