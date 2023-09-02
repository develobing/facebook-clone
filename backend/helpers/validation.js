const User = require('../models/user');

exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

exports.validateLength = (text, min, max) => {
  return text.length >= min && text.length <= max;
};

exports.validateUsername = async (username) => {
  let isExist = false;

  do {
    let check = await User.findOne({ username });
    if (check) {
      const random = Math.floor(Math.random() * 1000);
      username = `${username}${random}`;
      isExist = true;
    } else {
      isExist = false;
    }
  } while (isExist);

  return username;
};
