const express = require('express');
const router = express.Router();
const admin = require('../../middleware/admin');
// Import template controller
const templateController = require('../../controllers/templateController');

// Define routes for handling template operations
router.route('/')
    .get(templateController.getAllTemplates)
    .post(admin, templateController.createNewTemplate);

router.route('/:id')
    .get(templateController.getTemplateById)
    .put(admin, templateController.updateTemplate)
    .delete(admin, templateController.deleteTemplate);

module.exports = router;
