const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');

// Import item controller
const itemController = require('../../controllers/itemController');

// Define routes for handling item operations
router.route('/')
    .get(admin, itemController.getAllItems)
    .post(itemController.checkFacility, auth, itemController.createNewItem);

router.route('/:id')
    .get(itemController.getItemById, auth, itemController.sendItem)
    .put(itemController.getItemById, auth, itemController.updateItem)
    .delete(itemController.getItemById, auth, itemController.deleteItem);

module.exports = router;