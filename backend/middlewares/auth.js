const jwt = require('jsonwebtoken');

exports.authUser = async (req, res, next) => {
  try {
    let tmp = req.header('Authorization');
    const token = tmp.replace('Bearer ', '');
    console.log('authUser() - token', token);

    if (!token) {
      return res.status(401).json({
        message: 'You are not authorized to access this resource.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.log('authUser() - error', error);
    res.status(401).json({
      message: 'You are not authorized to access this resource.',
    });
  }
};
