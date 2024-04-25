const express = require('express');
const router = express.Router();

// Import comment controller
const commentController = require('../../controllers/commentController');

// Define routes for handling comment operations
router.route('/')
    .get(commentController.getAllComments)
    .post(commentController.createNewComment);

router.route('/:id')
    .get(commentController.getCommentById)
    .put(commentController.updateComment)
    .delete(commentController.deleteComment);

module.exports = router;