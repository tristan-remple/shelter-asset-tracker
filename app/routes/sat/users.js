const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const user = require('../../middleware/user');
// Import user controller
const userController = require('../../controllers/userController');

// Define routes for handling user operations
router.route('/')
  .get(admin, userController.getAllUsers)
  .post(admin, userController.createNewUser);

router.route('/:id')
  .get(userController.getUserById, auth, user, userController.sendUser)
  .put(userController.getUserById, auth, user, userController.updateUser)
  .post(admin, userController.getUserById, userController.setAdmin)
  .delete(admin, userController.deleteUser);

module.exports = router;