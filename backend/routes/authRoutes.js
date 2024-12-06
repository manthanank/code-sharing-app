const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

const useSocket = (handler) => (req, res) => handler(req, res, req.app.get('io'));

// Authentication Routes
router.post('/register', useSocket(register));
router.post('/login', useSocket(login));
router.get('/me', verifyToken, useSocket(getCurrentUser));

module.exports = router;