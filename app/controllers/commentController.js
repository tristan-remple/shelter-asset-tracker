const { models } = require('../data');

exports.getAllComments = async (req, res, next) => {
    try {
        const comments = await models.Comment.findAll({
            attributes: [
                'id',
                'comment',
                'createdAt',
                'updatedAt'
            ],
            include: [
                {
                    model: models.Item,
                    attributes: [
                        'id', 
                        'name', 
                        'toInspect', 
                        'toDiscard'],
                    include: [
                        {
                            model: models.Unit,
                            attributes: [
                                'id', 
                                'name', 
                                'type'
                            ],
                            include: {
                                model: models.Facility,
                                attributes: ['id', 'name']
                            }
                        }
                    ]
                }, {
                    model: models.User,
                    attributes: [
                        'id',
                        'name',
                        'isAdmin'
                    ]
                }
            ]
            
        });

        if (!comments) {
            return res.status(404).json({ error: 'Comments not found.'})
        }
        
        const commentsInfo = comments.map(comment => ({
                id: comment.id,
                comment: comment.comment,
                item: {
                    id: comment.Item.id,
                    name: comment.Item.name,
                    type: comment.Item.type,
                    location: {
                        facilityId: comment.Item.Unit.Facility.id,
                        facilityName: comment.Item.Unit.Facility.name,
                        unitId: comment.Item.Unit.id,
                        unitName: comment.Item.Unit.name
                    }
                },
                user: {
                    id: comment.User.id,
                    name: comment.User.name,
                    isAdmin: comment.User.isAdmin
                },
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt
        }));

        res.status(200).json(commentsInfo);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getCommentById = async (req, res, next) => {
    try {

        const commentId = req.params.id;

        const comment = await models.Comment.findOne({
            attributes: [
                'id',
                'userId',
                'itemId',
                'comment',
                'archive',
                'createdAt',
                'updatedAt'
            ],
            where: { id: commentId },
            include: [
                {
                    model: models.Item,
                    attributes: [
                        'id', 
                        'name', 
                        'toInspect', 
                        'toDiscard'],
                    include: [
                        {
                            model: models.Unit,
                            attributes: [
                                'id', 
                                'name', 
                                'type'
                            ],
                            include: {
                                model: models.Facility,
                                attributes: ['id', 'name']
                            }
                        }
                    ]
                }, {
                    model: models.User,
                    attributes: [
                        'id',
                        'name',
                        'isAdmin'
                    ]
                }
            ] });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        const commentDetails = {
            id: comment.id,
            comment: comment.comment,
            item: {
                id: comment.Item.id,
                name: comment.Item.name,
                type: comment.Item.type,
                location: {
                    facilityId: comment.Item.Unit.Facility.id,
                    facilityName: comment.Item.Unit.Facility.name,
                    unitId: comment.Item.Unit.id,
                    unitName: comment.Item.Unit.name
                }
            },
            user: {
                id: comment.User.id,
                name: comment.User.name,
                isAdmin: comment.User.isAdmin
            },
            archive: comment.archive,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        }

        res.status(200).json(commentDetails);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.createNewComment = async (req, res, next) => {
    try {
        const { userId, itemId, comment } = req.body;

        const newComment = await models.Comment.create({
            userId: userId,
            itemId: itemId,
            comment: comment
        });

        const createResponse = {
            commentId: newComment.id,
            userId: newComment.userId,
            itemId: newComment.itemId,
            comment: newComment.comment,
            createdAt: newComment.createdAt,
            success: true
        }

        res.status(201).json(createResponse);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.updateComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const { comment } = req.body;

        const existingComment = await models.Comment.findByPk(commentId);

        if (!existingComment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        existingComment.set({
            comment: comment
        });

        await existingComment.save();

        const updateResponse = {
            userId: existingComment.userId,
            itemId: existingComment.itemId,
            comment: existingComment.comment,
            archive: existingComment.archive,
            success: true
        }

        res.status(200).json(updateResponse);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const { userId, itemId } = req.body;

        const comment = await models.Comment.findByPk(commentId);

        if (!comment || comment.userId != userId || comment.itemId != itemId){
            return res.status(404).json({ error: "Comment not found."});
        }

        const deletedComment = await comment.destroy();

        const deleteResponse = {
            commentId: deletedComment.id,
            userId: deletedComment.userId,
            itemId: deletedComment.itemId,
            comment: deletedComment.comment,
            deletedAt: deletedComment.deletedAt,
            success: true
        }

        res.status(200).json(deleteResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
};