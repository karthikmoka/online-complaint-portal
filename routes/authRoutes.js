const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// @desc    Register a new legal platform user identity data profile
// @route   POST /api/v1/auth/register
router.post('/register', registerUser);

// @desc    Authenticate registered system credentials profile indicators
// @route   POST /api/v1/auth/login
router.post('/login', loginUser);

module.exports = router;
