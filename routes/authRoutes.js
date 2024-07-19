const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post('/register', register);

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post('/login', login);

module.exports = router;
