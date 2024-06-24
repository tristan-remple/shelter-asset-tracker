const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');

// Import settings controller
const settingsController = require('../../controllers/settingsController');

router.route('/')
    .get(settingsController.getSettings, settingsController.sendSettings)
    .post(admin, settingsController.getSettings, settingsController.updateSettings, settingsController.sendSettings);

module.exports = router; 