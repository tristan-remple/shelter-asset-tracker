const express = require('express');
const router = express.Router();

// Import controller
const commentController = require('../../controllers/commentController');

router.route('/')
    .get(commentController.getAllComments)
    .post(commentController.createNewComment);

router.route('/:id')
    .get(commentController.getCommentById)
    .put(commentController.updateComment)
    .delete(commentController.deleteComment);

module.exports = router;