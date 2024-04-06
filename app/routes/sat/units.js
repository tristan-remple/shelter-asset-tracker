const express = require('express');
const router = express.Router();

// Import controller
const unitController = require('../../controllers/unitController');

router.route('/')
    .post(unitController.createNewUnit);

router.route('/:id')
    .get(unitController.getUnitById)
    .delete(unitController.deleteUnit);

module.exports = router;
