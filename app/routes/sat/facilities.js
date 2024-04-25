const express = require('express');
const router = express.Router();

// Import facility controller
const facilityController = require('../../controllers/facilityController');

// Define routes for handling facility operations
router.route('/')
    .get(facilityController.getAllFacilities)
    .post(facilityController.createNewFacility);

router.route('/:id')
    .get(facilityController.getFacilityById)
    .put(facilityController.updateFacility)
    .delete(facilityController.deleteFacility);

module.exports = router;
