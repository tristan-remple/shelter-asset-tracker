const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const facility = require('../../middleware/facility');

// Import unit controller
const unitController = require('../../controllers/unitController');

// Define routes for handling unit operations
router.route('/')
    .post(admin, unitController.createNewUnit);

router.route('/deleted')
    .get(admin, unitController.getDeleted);

router.route('/:id/restore')
    .get(admin, unitController.restoreDeleted);

router.route('/:id/flip')
    .get(unitController.getUnitById, auth, facility, unitController.flipUnit);

router.route('/:id')
    .get(unitController.getUnitById, auth, facility, unitController.sendUnit)
    .put(admin, unitController.updateUnit)
    .delete(admin, unitController.deleteUnit);

module.exports = router;
