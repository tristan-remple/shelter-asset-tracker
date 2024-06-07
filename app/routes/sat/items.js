const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const facility = require('../../middleware/facility')

// Import item controller
const itemController = require('../../controllers/itemController');

// Define routes for handling item operations
router.route('/')
    .get(admin, itemController.getAllItems)
    .post(itemController.checkFacility, auth, facility, itemController.createNewItem);

router.route('/deleted')
    .get(admin, itemController.getDeleted);

router.route('/:id/restore')
    .get(admin, itemController.restoreDeleted);

router.route('/:id')
    .get(itemController.getItemById, auth, facility, itemController.sendItem)
    .put(itemController.getItemById, auth, facility, itemController.updateItem)
    .delete(itemController.getItemById, auth, facility, itemController.deleteItem);

module.exports = router;