const { models, Sequelize } = require('../data');
const fs = require("fs");
const { upload, extractFields } = require('../util/upload');

// Retrieves all icons
exports.getAllIcons = async (req, res, next) => {
    try {
        const icons = await models.icon.findAll({
            attributes: [
                'id',
                'src',
                'name',
                'alt'
            ]
        });

        if (!icons) {
            return res.status(404).json({ error: 'Icons not found.' });
        }

        res.status(200).json(icons);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Retrieves a specific icon by its ID
exports.getIconById = async (req, res, next) => {
    try {
        const iconId = req.params.id;

        const icon = await models.icon.findOne({
            attributes: [
                'id',
                'src',
                'name',
                'alt',
                'createdat',
                'updatedat'
            ],
            where: { id: iconId }
        });

        if (icon.id === null) {
            return res.status(404).json({ error: 'Icon not found.' });
        }

        req.data = icon;
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Sends the icon data stored in the request object
exports.sendIcon = async (req, res, next) => {
    return res.status(200).json(req.data);
};

// Creates a new icon
exports.createNewIcon = async (req, res, next) => {
    try {

        const { name, date, ext } = req.body;
        const newIcon = await models.icon.create({
            name: name,
            alt: `${name} icon`,
            src: `${date}-${name}.${ext}`
        });

        const createResponse = {
            id: newIcon.id,
            name: newIcon.name,
            alt: newIcon.alt,
            src: newIcon.src,
            success: true
        };
        return res.status(201).json(createResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Deletes multiple icons based on their IDs
exports.deleteIcons = async (req, res, next) => {
    try {
        const iconIds = req.body;
        const deleteResponse = {
            deletedIcons: 0,
            failed: [],
            success: true
        };

        const iconsToDelete = await models.icon.findAll({
            where: {
                id: iconIds
            }
        });

        if (iconsToDelete.length === 0) {
            return res.status(404).json({ error: 'No icons found.' });
        };

        for (const icon of iconsToDelete) {
            try {
                const deletedIcon = await icon.destroy();
                
                if (deletedIcon) {
                    deleteResponse.deletedIcons++;
                };
            } catch (err) {
                deleteResponse.failed.push({
                    id: icon.id,
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