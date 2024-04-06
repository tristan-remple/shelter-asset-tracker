const express = require('express');
const router = express.Router();

// Import controller
const templateController = require('../../controllers/templateController');

router.route('/')
    .get(templateController.getAllTemplates)
    .post(templateController.createNewTemplate);

router.route('/:id')
    .get(templateController.getTemplateById)
    .put(templateController.updateTemplate)
    .delete(templateController.deleteTemplate);

module.exports = router;
