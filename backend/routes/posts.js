const express = require('express');
const { getAllPosts, createPost, comment } = require('../controllers/posts');
const { authUser } = require('../middlewares/auth');
const router = express.Router();

router.get('/getAllPosts', authUser, getAllPosts);
router.post('/createPost', authUser, createPost);
router.put('/comment', authUser, comment);

module.exports = router;
