const { models, Sequelize } = require('../data');

// Creates a new attachment
exports.createNewAttachment = async (req, res, next) => {
    try {
        const { name, date, ext, comment } = req.body;

        const newAttachment = await models.attachment.create({
            src: `${date}-${name}.${ext}`,
            commentid: comment
        });

        const createResponse = {
            id: newAttachment.id,
            src: newAttachment.src,
            comment: newAttachment.commentid,
            success: true
        };
        return res.status(201).json(createResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Deletes multiple icons based on their IDs
exports.deleteAttachments = async (req, res, next) => {
    try {
        const attachmentIds = req.body;
        const deleteResponse = {
            deletedAttachments: 0,
            failed: [],
            success: true
        };

        const attachmentsToDelete = await models.attachment.findAll({
            where: {
                id: attachmentIds
            }
        });

        if (attachmentsToDelete.length === 0) {
            return res.status(404).json({ error: 'No attachments found.' });
        };

        for (const attachment of attachmentsToDelete) {
            try {
                const deletedAttachment = await attachment.destroy();
                
                if (deletedAttachment) {
                    deleteResponse.deletedAttachments++;
                };
            } catch (err) {
                deleteResponse.failed.push({
                    id: attachment.id,
                    error: err.name === 'SequelizeForeignKeyConstraintError' ? 'Dependency Error.' : err.name
                });
            };
        };

        return res.status(200).json(deleteResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};