const { models, Sequelize } = require('../data');

exports.getAllTemplates = async (req, res, next) => {
    try {
        const templates = await models.Template.findAll({
            attributes: [
                'id', 
                'name', 
                'defaultValue', 
                'defaultDepreciation', 
                'icon', 
                'singleResident'
            ]
        });

        if (!templates) {
            return res.status(404).json({ error: 'Templates not found' });
        }

        res.status(200).json(templates);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    } 
};


exports.getTemplateById = async (req, res, next) => {
    try {
        const templateId = req.params.id; 

        const template = await models.Template.findOne({
            attributes: [
                'id', 
                'name', 
                'defaultValue', 
                'defaultDepreciation', 
                'icon', 
                'singleResident', 
                'createdAt', 
                'updatedAt',
                [Sequelize.fn('COUNT', Sequelize.col('Items.id')), 'itemCount']],
            where: { id: templateId },
            include: {
                model: models.Item,
                attributes: [],
                required: false
            },
        });

        if (template.id === null) {
            return res.status(404).json({ error: 'Template not found.' });
        }

        return res.status(200).json(template);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.createNewTemplate = async (req, res, next) => {
    try {
        const { name, defaultValue, defaultDepreciation, icon, singleResident } = req.body;

        const existingTemplate = await models.Template.findOne({ where: { name } });
        if (existingTemplate) {
            return res.status(400).json({ error: 'Template already exists' });
        }

        const newTemplate = await models.Template.create({
            name, 
            defaultValue, 
            defaultDepreciation,
            icon,
            singleResident
        });

        const createResponse = {
            id: newTemplate.id,
            name: newTemplate.name,
            defaultValue: newTemplate.defaultValue,
            defaultDepreciation: newTemplate.defaultDepreciation,
            icon: newTemplate.icon,
            singleResident: newTemplate.singleResident,
            createdAt: newTemplate.createdAt,
            success: true
        };

        return res.status(201).json(createResponse);
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};


exports.updateTemplate = async (req, res, next) => {
    try {
        const templateId = req.params.id;
        const { name, defaultValue, defaultDepreciation, icon, singleResident } = req.body;

        const template = await models.Template.findByPk(templateId);

        if (!template) {
            return res.status(404).json({ error: 'Template not found.' });
        }

        template.set({
            name: name,
            defaultValue: defaultValue,
            defaultDepreciation: defaultDepreciation,
            icon: icon,
            singleResident: singleResident
        })

        const updateResponse = {
            name: template.name,
            defaultValue: template.defaultValue,
            defaultDepreciation: template.defaultDepreciation,
            icon: template.icon,
            singleResident: template.singleResident,
            success: true
        }

        await template.save();

        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.deleteTemplate = async (req, res, next) => {
    try {
        const templateId = req.params.id;
        const { name } = req.body;

        const template = await models.Template.findByPk(templateId);

        if (!template || template.name !== name ) {
            return res.status(404).json({ error: 'Template not found.' });
        }

        const deletedTemplate = await template.destroy();

        const deleteResponse = {
            templateId: deletedTemplate.id,
            name: deletedTemplate.name,
            deletedAt: deletedTemplate.deletedAt,
            success: true
        };

        return res.status(200).json(deleteResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};