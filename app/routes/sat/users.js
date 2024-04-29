const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
// Import user controller
const userController = require('../../controllers/userController');

// Define routes for handling user operations
router.route('/')
  .get(admin, userController.getAllUsers)
  .post(admin, userController.createNewUser);

router.route('/:id')
  .get(userController.getUserById)
  .put(userController.getUserById, auth, userController.updateUser)
  .delete(admin, userController.deleteUser);

module.exports = router;