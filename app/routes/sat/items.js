const express = require('express');
const router = express.Router();

// Import item controller
const itemController = require('../../controllers/itemController');

// Define routes for handling item operations
router.route('/')
    .get(itemController.getAllItems)
    .post(itemController.createNewItem);

router.route('/:id')
    .get(itemController.getItemById)
    .put(itemController.updateItem)
    .delete(itemController.deleteItem);

module.exports = router;