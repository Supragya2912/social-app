const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');

router.post('/register', auth.registerUser);
router.post('/login', auth.loginUser);
router.post('/refresh-token', auth.refreshToken);
router.post('/logout', auth.logoutUser);
router.get('/me', auth.protect, auth.me);

module.exports = router;
