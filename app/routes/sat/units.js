const express = require('express');
const router = express.Router();

// Import unit controller
const unitController = require('../../controllers/unitController');

// Define routes for handling unit operations
router.route('/')
    .post(unitController.createNewUnit);

router.route('/:id')
    .get(unitController.getUnitById)
    .put(unitController.updateUnit)
    .delete(unitController.deleteUnit);

module.exports = router;
