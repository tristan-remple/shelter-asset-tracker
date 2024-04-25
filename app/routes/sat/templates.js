const express = require('express');
const router = express.Router();

// Import template controller
const templateController = require('../../controllers/templateController');

// Define routes for handling template operations
router.route('/')
    .get(templateController.getAllTemplates)
    .post(templateController.createNewTemplate);

router.route('/:id')
    .get(templateController.getTemplateById)
    .put(templateController.updateTemplate)
    .delete(templateController.deleteTemplate);

module.exports = router;
