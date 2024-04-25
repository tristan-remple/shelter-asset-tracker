const express = require('express');
const router = express.Router();

// Import user controller
const userController = require('../../controllers/userController');

// Define routes for handling user operations
router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

router.route('/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;