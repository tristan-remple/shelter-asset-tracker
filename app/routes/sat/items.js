const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');

// Import item controller
const itemController = require('../../controllers/itemController');

// Define routes for handling item operations
router.route('/')
    .get(admin, itemController.getAllItems)
    .post(itemController.createNewItem);

router.route('/:id')
    .get(itemController.getItemById)
    .put(itemController.updateItem)
    .delete(itemController.deleteItem);

module.exports = router;