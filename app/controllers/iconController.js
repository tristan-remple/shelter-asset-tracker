const { models, Sequelize } = require('../data');
const fs = require("fs");
const { upload, extractFields } = require('../util/upload')

exports.getAllIcons = async (req, res, next) => {
    try {
        const icons = await models.Icon.findAll({
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


exports.getIconById = async (req, res, next) => {
    try {
        const iconId = req.params.id;

        const icon = await models.Icon.findOne({
            attributes: [
                'id',
                'src',
                'name',
                'alt',
                'createdAt',
                'updatedAt'
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

exports.sendIcon = async (req, res, next) => {
    return res.status(200).json(req.data);
};

exports.createNewIcon = async (req, res, next) => {
    try {

        const { name, date, ext } = req.body;
        const newIcon = await models.Icon.create({
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
        }
        return res.status(201).json(createResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.deleteIcon = async (req, res, next) => {
    try {
        const iconId = req.params.id;

        const icon = await models.Icon.findByPk(iconId);

        if (!icon) {
            return res.status(404).json({ error: 'Icon not found.' });
        }

        const deletedIcon = await icon.destroy({
            force: true     // No soft deletes on Icons
        });

        const deleteResponse = {
            iconId: deletedIcon.id,
            src: deletedIcon.src,
            name: deletedIcon.name,
            alt: deletedIcon.alt,
            deletedAt: deletedIcon.deletedAt,
            success: true
        };

        return res.status(200).json(deleteResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};