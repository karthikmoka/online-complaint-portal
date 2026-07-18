const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new platform account identity
// @route   POST /api/v1/auth/register
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, Email and Password components are required' });
        }

        let userExists = await User.findOne({ email: email.toLowerCase().trim() });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'This email is already registered inside portal' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: role || 'Customer',
            department: role === 'Agent' ? department : null
        });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret_key_2026', {
            expiresIn: '30d'
        });

        return res.status(201).json({
            success: true,
            message: 'User account processed successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Authenticate registered credentials (CRITICAL ROUTE FIX)
// @route   POST /api/v1/auth/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide both email and password' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid Login verification identifiers provided' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid Login verification identifiers provided' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret_key_2026', {
            expiresIn: '30d'
        });

        return res.status(200).json({
            success: true,
            message: 'Authentication session token verification access allowed safely',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
