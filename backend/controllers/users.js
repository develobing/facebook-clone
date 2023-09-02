const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require('../helpers/validation');
const { generateToken } = require('../helpers/token');
const { sendVerificationEmail } = require('../helpers/mailer');

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
    const user = await User.findById(_id);
    const isAlreadyActivated = user.verified;
    if (isAlreadyActivated) throw new Error('This email is already activated');

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
