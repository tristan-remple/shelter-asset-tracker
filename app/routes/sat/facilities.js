const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const facility = require('../../middleware/facility')

// Import facility controller
const facilityController = require('../../controllers/facilityController');

// Define routes for handling facility operations
router.route('/')
    .get(admin, facilityController.getAllFacilities)
    .post(admin, facilityController.createNewFacility);

router.route('/deleted')
    .get(admin, facilityController.getDeleted);

router.route('/:id/restore')
    .get(admin, facilityController.restoreDeleted);

router.route('/:id')
    .get(facilityController.getFacilityById, auth, facility, facilityController.sendFacility)
    .put(admin, facilityController.updateFacility)
    .delete(admin, facilityController.deleteFacility);

module.exports = router;
