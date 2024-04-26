const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');

// Import facility controller
const facilityController = require('../../controllers/facilityController');

// Define routes for handling facility operations
router.route('/')
    .get(admin, facilityController.getAllFacilities)
    .post(admin, facilityController.createNewFacility);

router.route('/:id')
    .get(facilityController.getFacilityById)
    .put(admin, facilityController.updateFacility)
    .delete(admin, facilityController.deleteFacility);

module.exports = router;
