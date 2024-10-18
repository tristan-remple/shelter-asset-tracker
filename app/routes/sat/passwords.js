const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const user = require('../../middleware/user');

// Import controllers
const passwordController = require('../../controllers/passwordController');
const userController = require('../../controllers/userController');

module.exports = router