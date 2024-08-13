const { models, Sequelize } = require('../data');
const { calculateCurrentValue, getEoL } = require('../util/calc');

exports.getAllItems = async (req, res, next) => {
    try {
        const items = await models.Item.findAll();
        return res.json(items);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.getItemById = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const item = await models.Item.findOne({
            attributes: [
                'id',
                'name',
                'invoice',
                'vendor',
                'donated',
                'initialValue',
                'eol',
                'status',
                'addedBy',
                'createdAt',
                'updatedAt'
            ],
            where: { id: itemId },
            include: [{
                model: models.Unit,
                attributes: ['id', 'name'],
                include: {
                    model: models.Facility,
                    attributes: ['id', 'name']
                }
            },
            {
                model: models.User,
                attributes: ['id', 'name'],
                as: 'addedByUser',
                paranoid: false
            },
            {
                model: models.Template,
                attributes: ['id', 'name'],
                include: {
                    model: models.Icon,
                    attributes: [
                        'id',
                        'src',
                        'name',
                        'alt'
                    ]
                },
                paranoid: false
            },
            {
                model: models.Inspection,
                attributes: [
                    'id',
                    'comment',
                    'createdAt'
                ],
                include: {
                    model: models.User,
                    attributes: ['id', 'name'],
                    paranoid: false,
                },
                order: [['createdAt', 'DESC']]
            }
            ]
        })

        if (!item) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        req.data = item;
        req.facility = item.Unit.Facility.id;
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.sendItem = async (req, res, next) => {
    const item = req.data;
    const depreciationRate = await models.Setting.findOne({
        attributes: ['value'],
        where: { name: 'depreciationRate'}
    });
    const currentValue = calculateCurrentValue(item.initialValue, item.createdAt, depreciationRate);

    const itemProfile = {
        id: item.id,
        name: item.name,
        invoice: item.invoice,
        vendor: item.vendor,
        unit: {
            id: item.Unit.id,
            name: item.Unit.name,
            facility: {
                id: item.Unit.Facility.id,
                name: item.Unit.Facility.name
            }
        },
        template: {
            id: item.Template.id,
            name: item.Template.name,
            icon: item.Template.icon ? {
                id: item.Template.Icon.id,
                src: item.Template.Icon.src,
                name: item.Template.Icon.name,
                alt: item.Template.Icon.alt,
            } : null
        },
        addedBy: {
            id: item.addedByUser.id,
            name: item.addedByUser.name,
        },
        inspectionRecord: item.Inspections ? item.Inspections.map(inspection => ({
            id: inspection.id,
            inspectedBy: {
                id: inspection.User.id,
                name: inspection.User.name
            },
            comment: inspection.comment,
            createdAt: inspection.createdAt
        })) : [],
        value: {
            initialValue: item.initialValue,
            donated: item.donated,
            currentValue: currentValue,
        },
        eol: item.eol,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    };
    
    return res.status(200).json(itemProfile);
}

exports.updateItem = async (req, res, next) => {
    try {
        const item = req.data;
        const { name, invoice, vendor, initialValue, usefulLifeOffset, status, comment } = req.body;

        if (item.status == 'inspect' && status !== 'inspect'){
            await models.Inspection.create({
                comment: comment,
                itemId: item.id,
                userId: req.userId
            });
        };

        item.set({
            name: name,
            invoice: invoice,
            vendor: vendor,
            initialValue: initialValue,
            eol: usefulLifeOffset ? getEoL(usefulLifeOffset, item.eol) : item.eol,
            status: status
        });

        const depreciationRate = await models.Setting.findOne({
            attributes: ['value'],
            where: { name: 'depreciationRate'}
        });

        const updateResponse = {
            id: item.id,
            name: item.name,
            invoice: item.invoice,
            vendor: item.vendor,
            donates: item.donated,
            initialValue: item.initialValue,
            eol: item.eol,
            status: item.status,
            currentValue: calculateCurrentValue(item.initialValue, item.createdAt, depreciationRate),
            success: true
        }

        await item.save();

        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.checkFacility = async (req, res, next) => {
    const facility = await models.Unit.findOne({
        where: { id: req.body.unitId },
        include: {
            model: models.Facility,
            attributes: ['id']
        }
    });

    req.facility = facility.Facility.id;
    next();
}

exports.createNewItem = async (req, res, next) => {
    try {
        const { name, invoice, vendor, unitId, templateId, donated, initialValue, usefulLifeOffset, addedBy } = req.body;
        if (!name || !invoice || !vendor || !unitId || !templateId || donated === undefined || !initialValue || !usefulLifeOffset || !addedBy) {
            return res.status(400).json({ error: 'Bad request.' });
        }

        const newItem = await models.Item.create({
            name: name,
            invoice: invoice,
            vendor: vendor,
            unitId: unitId,
            templateId: templateId,
            donated: donated,
            initialValue: initialValue,
            eol: getEoL(usefulLifeOffset),
            addedBy: addedBy,
            status: 'ok'
        });

        const createResponse = {
            itemId: newItem.id,
            name: newItem.name,
            invoice: newItem.invoice,
            vendor: newItem.vendor,
            unit: newItem.unitId,
            templateId: newItem.templateId,
            donated: newItem.donated,
            initialValue: newItem.initialValue,
            addedBy: newItem.addedBy,
            eol: newItem.eol,
            success: true
        };

        return res.status(201).json(createResponse);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.deleteItem = async (req, res, next) => {
    try {
        const item = req.data;
        const deletedItem = await item.destroy();

        const deleteResponse = {
            itemId: deletedItem.id,
            name: deletedItem.name,
            deleted: deletedItem.deletedAt,
            success: true
        }

        return res.status(200).json(deleteResponse);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.getDeleted = async (req, res, next) => {
    try {
        const deletedItems = await models.Item.findAll({
            where: Sequelize.where(Sequelize.col('Item.deletedAt'), 'IS NOT', null),
            include: {
                model: models.Unit,
                attributes: ['name'],
                include: {
                    model: models.Facility,
                    attributes: ['name']
                }
            },
            paranoid: false
        });

        return res.status(200).json(deletedItems);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.restoreDeleted = async (req, res, next) => {
    try {
        const itemId = req.params.id;

        const deletedItem = await models.Item.findOne({
            where: {id: itemId},
            include: [{
                model: models.Unit,
                attributes: ['name'],
                include: {
                    model: models.Facility,
                    attributes: ['name']
                }
            },{
                model: models.Template,
                attributes: ['name'],
                paranoid: false
            }],
            paranoid: false 
        });

        if (!deletedItem) {
            return res.status(404).json({ error: 'Deleted item not found.' });
        }

        await deletedItem.restore();

        const restoreResponse = {
            item: deletedItem,
            success: true
        };

        return res.status(200).json(restoreResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};