const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// This route for getting the user profile remains the same
router.get('/me', auth(), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// This is the route that needs to be fixed
router.patch('/me/change-password', auth(), async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({ message: 'Please provide current and new passwords (new password min 8 chars).' });
    }

    try {
        const user = await User.findById(req.user.id);
        
        // UPDATED: Changed from user.comparePassword to a direct string comparison
        if (user.password !== currentPassword) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        // This part saves the new plaintext password
        user.password = newPassword; 
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;