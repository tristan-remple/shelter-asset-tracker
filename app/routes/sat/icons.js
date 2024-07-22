const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
const multer = require('multer');

const upload = multer({ dest: 'client/public/img/' });

// Import item controller
const iconController = require('../../controllers/iconController');

// Define routes for handling item operations
router.route('/')
    .get(iconController.getAllIcons)
    .post(admin, upload.single('file'), iconController.createNewIcon);

router.route('/:id')
    .get(iconController.getIconById, iconController.sendIcon)
    .delete(admin, iconController.getIconById, iconController.deleteIcon);

module.exports = router;