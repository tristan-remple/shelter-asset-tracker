const { models, Sequelize } = require('../data');

// Returnes all item templates
exports.getAllTemplates = async (req, res, next) => {
    try {
        const templates = await models.template.findAll({
            attributes: [
                'id',
                'name',
                'defaultvalue',
                'defaultusefullife',
                'singleresident'
            ]
        });

        if (!templates) {
            return res.status(404).json({ error: 'Templates not found' });
        };

        res.status(200).json(templates);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    };
};

// Retrieves template specified by ID
exports.getTemplateById = async (req, res, next) => {
    try {
        const templateId = req.params.id;

        const template = await models.template.findOne({
            attributes: [
                'id',
                'name',
                'defaultvalue',
                'defaultusefullife',
                'singleresident',
                'createdat',
                'updatedat',
                [Sequelize.fn('COUNT', Sequelize.col('items.id')), 'itemCount']],
            where: { id: templateId },
            include: {
                model: models.item,
                attributes: [],
                required: false
            },
            group: [
                'template.id'
            ]
        });

        if (template.id === null) {
            return res.status(404).json({ error: 'Template not found.' });
        };

        return res.status(200).json(template);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Creates new template
exports.createNewTemplate = async (req, res, next) => {
    try {
        const { name, defaultValue, defaultUsefulLife, singleResident } = req.body;

        if (!name || !defaultValue || !defaultUsefulLife ) {
            return res.status(400).json({ error: 'Bad request.' });
        };

        const existingTemplate = await models.template.findOne({ where: { name } });
        if (existingTemplate) {
            return res.status(400).json({ error: 'Template already exists.' });
        };

        const newTemplate = await models.template.create({
            name: name,
            defaultvalue: defaultValue,
            defaultusefullife: defaultUsefulLife,
            singleresident: singleResident ? true : false
        });

        const createResponse = {
            id: newTemplate.id,
            name: newTemplate.name,
            defaultValue: newTemplate.defaultvalue,
            defaultUsefulLife: newTemplate.defaultusefullife,
            singleResident: newTemplate.singleresident,
            createdAt: newTemplate.createdat,
            success: true
        };

        return res.status(201).json(createResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    };
};

// Updates specified template
exports.updateTemplate = async (req, res, next) => {
    try {
        const templateId = req.params.id;
        const { name, defaultValue, defaultUsefulLife, singleResident } = req.body;

        const template = await models.template.findByPk(templateId);

        if (!template) {
            return res.status(404).json({ error: 'Template not found.' });
        };

        template.set({
            name: name,
            defaultvalue: defaultValue,
            defaultusefullife: defaultUsefulLife,
            singleresident: singleResident ? true : false
        });

        const updateResponse = {
            name: template.name,
            defaultValue: template.defaultvalue,
            defaultUsefulLife: template.defaultusefullife,
            singleResident: template.singleresident,
            success: true
        };

        await template.save();

        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Deletes specified template
exports.deleteTemplate = async (req, res, next) => {
    try {
        const templateId = req.params.id;

        const template = await models.template.findByPk(templateId);

        if (!template) {
            return res.status(404).json({ error: 'Template not found.' });
        };

        const deletedTemplate = await template.destroy();

        const deleteResponse = {
            templateId: deletedTemplate.id,
            name: deletedTemplate.name,
            deletedAt: deletedTemplate.deletedat,
            success: true
        };

        return res.status(200).json(deleteResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Retrieves previously deleted templates
exports.getDeleted = async (req, res, next) => {
    try {
        const deletedTemplates = await models.template.findAll({
            where: Sequelize.where(Sequelize.col('template.deletedat'), 'IS NOT', null),
            paranoid: false
        });

        return res.status(200).json(deletedTemplates);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Restores specified deleted template
exports.restoreDeleted = async (req, res, next) => {
    try {
        const templateId = req.params.id;

        const deletedTemplate = await models.template.findOne({
            where: { id: templateId },
            paranoid: false
        });

        if (!deletedTemplate) {
            return res.status(404).json({ error: 'Deleted template not found.' });
        };

        await deletedTemplate.restore();

        const restoreResponse = {
            template: deletedTemplate,
            success: true
        };

        return res.status(200).json(restoreResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};