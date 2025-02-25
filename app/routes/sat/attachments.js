const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');


// Import item controller
const attachmentController = require('../../controllers/attachmentController');

// Define routes for handling item operations
router.route('/delete')
    .post(admin, attachmentController.deleteAttachments);

module.exports = router;