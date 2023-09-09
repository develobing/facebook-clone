const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/Post');
const Code = require('../models/code');
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require('../helpers/validation');
const { generateToken } = require('../helpers/token');
const { sendVerificationEmail, sendResetCode } = require('../helpers/mailer');
const generateCode = require('../helpers/generateCode');

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    // Validation checks
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Invalid Email Address.',
      });
    }

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({
        message: 'Email is already taken. Please try another one.',
      });
    }

    if (!validateLength(first_name, 3, 32)) {
      return res.status(400).json({
        message: 'First name must be between 3 to 32 characters long.',
      });
    }

    if (!validateLength(last_name, 3, 32)) {
      return res.status(400).json({
        message: 'Last name must be between 3 to 32 characters long.',
      });
    }

    if (!validateLength(password, 6, 32)) {
      return res.status(400).json({
        message: 'Password must be between 6 to 32 characters long.',
      });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);
    console.log('cryptedPassword', cryptedPassword);

    let tempUsername = first_name + last_name;
    const newUsername = await validateUsername(tempUsername);

    const user = await new User({
      first_name,
      last_name,
      username: newUsername,
      email,
      password: cryptedPassword,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();

    // Send verification email to user
    const emailVerificationToken = generateToken({ _id: user._id }, '30m');
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(email, first_name, url);

    // Send response
    const token = generateToken({ _id: user._id.toString() }, '7d');

    res.json({
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      picture: user.picture,
      verified: user.verified,
      token,
      message: 'Register successfully! Please check your email to verify.',
    });
  } catch (error) {
    console.log('register() - error', error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      throw new Error('The email you entered is not connected to an account.');

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) throw new Error('Invalid password.');

    // Send response
    const token = generateToken({ _id: user._id.toString() }, '7d');

    res.json({
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      picture: user.picture,
      verified: user.verified,
      token,
      message: 'Login successfully!',
    });
  } catch (error) {
    console.log('login() - error', error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.body;
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUserId = req.user?._id;
    if (_id !== loggedInUserId)
      return res.status(400).json({
        message: `You don't have the authorization to complete this operation.`,
      });

    const user = await User.findById(_id);
    const isAlreadyActivated = user.verified;
    if (isAlreadyActivated)
      return res
        .status(400)
        .json({ message: 'This email is already activated' });

    await User.findByIdAndUpdate(_id, { verified: true });

    res.json({
      user,
      token,
      message: 'Account has been activated successfully.',
    });
  } catch (error) {
    console.log('activateAccount() - error', error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.sendVerification = async (req, res) => {
  try {
    const _id = req.user?._id;
    const {
      email,
      first_name,
      verified: isAlreadyActivated,
    } = await User.findById(_id);

    if (isAlreadyActivated)
      return res
        .status(400)
        .json({ message: 'This email is already activated' });

    // Send verification email to user
    const emailVerificationToken = generateToken({ _id }, '30m');
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(email, first_name, url);

    res.json({
      message: 'Verification email has been sent successfully.',
    });
  } catch (error) {
    console.log('sendVerification() - error', error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return res.status(400).json({
        message: 'Account does not exists.',
      });
    }

    res.json({
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    console.log('sendVerification() - error', error);

    res.status(500).json({ message: error.message });
  }
};

exports.sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('-password');

    await Code.findOneAndRemove({ user: user._id });

    const code = generateCode(5);
    const savedCode = await new Code({
      code,
      user: user._id,
    }).save();
    sendResetCode(user.email, user.first_name, code);

    res.json({
      message: 'Email reset code has been sent to your email',
    });
  } catch (error) {
    console.log('sendVerification() - error', error);

    res.status(500).json({ message: error.message });
  }
};

exports.validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const userCode = await Code.findOne({ user: user._id });
    if (userCode.code !== code) {
      return res.status(400).json({
        message: 'Verification code is wrong..',
      });
    }

    res.json({ message: 'ok' });
  } catch (error) {
    console.log('sendVerification() - error', error);

    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cryptedPassword = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate(
      { email },
      {
        password: cryptedPassword,
      }
    );

    res.json({ message: 'ok' });
  } catch (error) {
    console.log('sendVerification() - error', error);

    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await User.findOne({ username }).select('-password');
    if (!profile) {
      return res.json({ ok: false });
    }
    const posts = await Post.find({ user: profile._id })
      .populate('user')
      .sort({ createdAt: -1 });
    res.json({ ...profile.toObject(), posts });
  } catch (error) {
    console.log('getProfile() - error', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const { url } = req.body;

    await User.findByIdAndUpdate(req.user._id, {
      picture: url,
    });
    res.json(url);
  } catch (error) {
    console.log('updateProfilePicture() - error', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateCover = async (req, res) => {
  try {
    const { url } = req.body;

    await User.findByIdAndUpdate(req.user._id, {
      cover: url,
    });
    res.json(url);
  } catch (error) {
    console.log('updateCover() - error', error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const { infos } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.json(updated.details);
  } catch (error) {
    console.log('updateDetails() - error', error);
    return res.status(500).json({ message: error.message });
  }
};
