const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const user = require('../controllers/user');

router.get('/get-user', auth.protect, user.getUser);
router.post('/update-user',auth.protect, user.updateUser);

module.exports = router;
