const express = require('express');
const router = express.Router();

// Import item controller
const reportsController = require('../../controllers/reportsController');

// Define routes for handling item operations
router.route('/')
    .get(reportsController.getSummary);

router.route('/csv')
    .post(reportsController.exportAll);

router.route('/csv/financial')
    .post(reportsController.exportFinancial);

router.route('/csv/inventory')
    .post(reportsController.exportInventory);

router.route('/csv/eol')
    .post(reportsController.exportEOL);

module.exports = router;