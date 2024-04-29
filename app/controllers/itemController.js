const { models } = require('../data');
const { calculateCurrentValue } = require('../util/calc');

exports.getAllItems = async (req, res, next) => {
    try {
        const items = await models.Item.findAll();
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
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
                'initialValue',
                'depreciationRate',
                'toDiscard',
                'toInspect',
                'addedBy',
                'createdAt',
                'updatedAt',
                'deletedAt'
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
                as: 'addedByUser'
            },
            {
                model: models.Template,
                attributes: ['id', 'name']
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
                    attributes: ['id', 'name']
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
    const currentValue = calculateCurrentValue(item.initialValue, item.depreciationRate, item.createdAt);
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
            icon: item.Template.icon
        },
        toInspect: item.toInspect,
        toDiscard: item.toDiscard,
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
            depreciationRate: item.depreciationRate,
            currentValue: currentValue,
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    };
    
    return res.status(200).json(itemProfile);
}

exports.updateItem = async (req, res, next) => {
    try {
        const item = req.data;
        const { unitId, name, invoice, vendor, initialValue, depreciationRate, toDiscard, toInspect } = req.body;

        item.set({
            unitId: unitId,
            name: name,
            invoice: invoice,
            vendor: vendor,
            initialValue: initialValue,
            depreciationRate: depreciationRate,
            toDiscard: toDiscard,
            toInspect: toInspect
        });

        const updateResponse = {
            id: item.id,
            name: item.name,
            invoice: item.invoice,
            vendor: item.vendor,
            initialValue: item.initialValue,
            depreciationRate: item.depreciationRate,
            toAssess: item.toAssess,
            toDiscard: item.toDiscard,
            currentValue: calculateCurrentValue(item.initialValue, item.depreciationRate, item.createdAt),
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
        const { name, invoice, vendor, unitId, templateId, donated, initialValue, depreciationRate, addedBy } = req.body;
        if (!name || !invoice || !vendor || !unitId || !templateId || donated === undefined || initialValue === undefined || depreciationRate === undefined || !addedBy) {
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
            depreciationRate: depreciationRate,
            addedBy: addedBy,
            toInspect: false,
            toDiscard: false
        });

        const createResponse = {
            itemId: newItem.id,
            name: newItem.name,
            invoice: invoice,
            vendor: vendor,
            unit: newItem.unitId,
            templateId: newItem.templateId,
            donated: newItem.donated,
            initialValue: newItem.initialValue,
            depreciationRate: newItem.depreciationRate,
            addedBy: newItem.addedBy,
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