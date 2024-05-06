const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');

// Import item controller
const iconController = require('../../controllers/iconController');

// Define routes for handling item operations
router.route('/')
    .get(iconController.getAllIcons)
    .post(admin, iconController.createNewIcon);

router.route('/:id')
    .get(iconController.getIconById, iconController.sendIcon)
    .put(admin, iconController.getIconById, iconController.updateIcon)
    .delete(admin, iconController.getIconById, iconController.deleteIcon);

module.exports = router;