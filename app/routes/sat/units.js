const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
// Import unit controller
const unitController = require('../../controllers/unitController');

// Define routes for handling unit operations
router.route('/')
    .post(admin, unitController.createNewUnit);

router.route('/:id')
    .get(unitController.getUnitById)
    .put(admin, unitController.updateUnit)
    .delete(admin, unitController.deleteUnit);

module.exports = router;
