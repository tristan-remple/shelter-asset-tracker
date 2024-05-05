const { models, Sequelize } = require('../data');

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
        const { src, name, alt } = req.body;

        const existingIcon = await models.Icon.findOne({ where: { name } });
        if (existingIcon) {
            return res.status(400).json({ error: 'Icon already exists.' });
        }

        const newIcon = await models.Icon.create({
            src: src,
            name: name, 
            alt: alt
        });

        const createResponse = {
            id: newIcon.id,
            src: newIcon.src,
            name: newIcon.name,
            alt: newIcon.alt,
            createdAt: newIcon.createdAt,
            success: true
        };

        return res.status(201).json(createResponse);
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};


exports.updateIcon = async (req, res, next) => {
    try {
        const iconId = req.params.id;
        const { src, name, alt } = req.body;

        const icon = await models.Icon.findByPk(iconId);

        if (!icon) {
            return res.status(404).json({ error: 'Icon not found.' });
        }

        icon.set({
            src: src,
            name: name,
            alt: alt
        });

        const updateResponse = {
            src: icon.src,
            name: icon.name,
            alt: icon.alt,
            success: true
        }

        await icon.save();

        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.deleteIcon = async (req, res, next) => {
    try {
        const iconId = req.params.id;
        const { name } = req.body;

        const icon = await models.Icon.findByPk(iconId);

        if (!icon || icon.name !== name ) {
            return res.status(404).json({ error: 'Icon not found.' });
        }

        const deletedIcon = await icon.destroy();

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