const express = require('express');
const { register, login, activateAccount } = require('../controllers/users');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/activate', activateAccount);

module.exports = router;
