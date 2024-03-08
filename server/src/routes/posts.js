const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const post = require('../controllers/post');

router.post('/create-post',auth.protect, post.createPost);
router.get('/get-posts',auth.protect, post.getPosts); 
router.get('/get-post',auth.protect, post.getPost);
router.post('/like',auth.protect, post.addLike);

module.exports = router;
