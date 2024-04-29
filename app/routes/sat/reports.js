const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');

// Import item controller
const reportsController = require('../../controllers/reportsController');

// Define routes for handling item operations
router.route('/')
    .get(admin, reportsController.getSummary);

router.route('/csv')
    .post(admin, reportsController.exportAll);

router.route('/csv/financial')
    .post(admin, reportsController.exportFinancial);

router.route('/csv/inventory')
    .post(admin, reportsController.exportInventory);

router.route('/csv/eol')
    .post(admin, reportsController.exportEOL);

module.exports = router;