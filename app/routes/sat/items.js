const express = require('express');
const router = express.Router();

// Import controller
const itemController = require('../../controllers/itemController');

router.route('/')
    .get(itemController.getAllItems)
    .post(itemController.createNewItem);

router.route('/:id')
    .get(itemController.getItemById)
    .put(itemController.updateItem)
    .delete(itemController.deleteItem);

module.exports = router;