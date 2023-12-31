const User = require('../models/User');
const React = require('../models/React');

exports.reactPost = async (req, res) => {
  try {
    const { postId, react } = req.body;
    const check = await React.findOne({
      postRef: postId,
      reactBy: req.user._id,
    });

    if (check == null) {
      const newReact = new React({
        react: react,
        postRef: postId,
        reactBy: req.user._id,
      });
      await newReact.save();
    } else {
      if (check.react == react) {
        await React.findByIdAndRemove(check._id);
      } else {
        await React.findByIdAndUpdate(check._id, {
          react: react,
        });
      }
    }
  } catch (error) {
    console.log('reactPost() - error', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getReacts = async (req, res) => {
  try {
    const reactsArray = await React.find({ postRef: req.params.id });

    /*
    const check1 = reacts.find(
      (x) => x.reactBy.toString() == req.user._id
    )?.react;
    */
    const newReacts = reactsArray.reduce((group, react) => {
      let key = react['react'];
      group[key] = group[key] || [];
      group[key].push(react);
      return group;
    }, {});

    const reacts = [
      {
        react: 'like',
        count: newReacts.like ? newReacts.like.length : 0,
      },
      {
        react: 'love',
        count: newReacts.love ? newReacts.love.length : 0,
      },
      {
        react: 'haha',
        count: newReacts.haha ? newReacts.haha.length : 0,
      },
      {
        react: 'sad',
        count: newReacts.sad ? newReacts.sad.length : 0,
      },
      {
        react: 'wow',
        count: newReacts.wow ? newReacts.wow.length : 0,
      },
      {
        react: 'angry',
        count: newReacts.angry ? newReacts.angry.length : 0,
      },
    ];

    const check = await React.findOne({
      postRef: req.params.id,
      reactBy: req.user._id,
    });
    const user = await User.findById(req.user._id);
    const checkSaved = user?.savedPosts.find(
      (x) => x.post.toString() === req.params.id
    );

    res.json({
      reacts,
      check: check?.react,
      total: reactsArray.length,
      checkSaved: checkSaved ? true : false,
    });
  } catch (error) {
    console.log('getReacts() - error', error);
    res.status(500).json({ message: error.message });
  }
};
