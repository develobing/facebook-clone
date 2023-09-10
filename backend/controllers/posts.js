const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'first_name last_name picture username cover')
      .populate('comments.commentBy', 'first_name last_name picture username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.log('getAllPosts() - error', error);
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    res.json(post);
  } catch (error) {
    console.log('createPost() - error', error);
    res.status(500).json({ message: error.message });
  }
};

exports.comment = async (req, res) => {
  try {
    const { comment, image, postId } = req.body;
    let newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
            image: image,
            commentBy: req.user._id,
          },
        },
      },
      {
        new: true,
      }
    ).populate('comments.commentBy', 'picture first_name last_name username');
    res.json(newComments.comments);
  } catch (error) {
    console.log('createPost() - error', error);
    res.status(500).json({ message: error.message });
  }
};
