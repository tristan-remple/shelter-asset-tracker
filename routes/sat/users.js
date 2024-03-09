const express = require('express');
const router = express.Router();

// Import controller
const userController = require('../../controllers/userController');

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser)

router.route('/:id')
  .get(userController.getUserById)

module.exports = router;