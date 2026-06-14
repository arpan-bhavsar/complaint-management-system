const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        // NEW: We are now accepting 'adminSecret' from the frontend
        const { name, email, password, role, adminSecret } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // NEW: Security Check!
        let finalRole = 'student'; // Default to student
        
        if (role === 'admin') {
            // Check if the secret they typed matches your .env file
            if (adminSecret === process.env.ADMIN_SECRET) {
                finalRole = 'admin';
            } else {
                return res.status(401).json({ message: 'Invalid Admin Secret Key! Nice try hacker.' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: finalRole // Save the verified role
        });
        
        await user.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// @route   POST /api/auth/login
// @desc    Log in a user and return a token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // 2. Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // 3. Create the digital VIP Pass (JWT)
        const payload = {
            id: user._id,
            role: user.role,
            name: user.name
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ 
            message: 'Logged in successfully', 
            token, 
            user: payload 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;