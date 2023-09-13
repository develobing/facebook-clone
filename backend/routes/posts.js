const express = require('express');
const {
  createPost,
  getAllPosts,
  comment,
  savePost,
  deletePost,
} = require('../controllers/posts');
const { authUser } = require('../middlewares/auth');
const router = express.Router();

router.get('/getAllPosts', authUser, getAllPosts);
router.post('/createPost', authUser, createPost);
router.put('/comment', authUser, comment);
router.put('/savePost/:id', authUser, savePost);
router.delete('/deletePost/:id', authUser, deletePost);

module.exports = router;
