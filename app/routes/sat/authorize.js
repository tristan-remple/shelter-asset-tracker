const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');

// Import facility controller
const authorizeController = require('../../controllers/authorizeController');

// Define routes for handling authorization operations
router.route('/')
    .post(admin, authorizeController.updateIsAdmin);

router.route('/:id')
    .post(admin, authorizeController.updateAuthorization);

module.exports = router;
