const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');

// Import facility controller
const authorizeController = require('../../controllers/authorizeController');

// Define routes for handling authorization operations
router.route('/')
    .post(auth, admin, authorizeController.updateIsAdmin);

router.route('/:id')
    .post(auth, admin, authorizeController.updateAuthorization);

module.exports = router;
