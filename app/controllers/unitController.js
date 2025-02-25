const { models, Sequelize } = require('../data');

// Retrieves unit specified by ID
exports.getUnitById = async (req, res, next) => {
    try {
        const unitId = req.params.id;

        const unit = await models.unit.findOne({
            attributes: [
                'id',
                'name',
                'createdat',
                'updatedat'
            ],
            where: { id: unitId },
            include: [{
                model: models.item,
                attributes: [
                    'id',
                    'name',
                    'status',
                    'eol'
                ],
                include: {
                    model: models.template,
                    attributes: [
                        'id',
                        'name',
                        'singleresident'
                    ]
                },
                required: false
            }, {
                model: models.facility,
                attributes: ['id', 'name']
            }, {
                model: models.unittype,
                attributes: ['name'],
                paranoid: false
            }],
            group: []
        });

        if (!unit) {
            return res.status(404).json({ message: 'Unit not found.' });
        };

        const currentDate = new Date();

        if (unit.items) {
            unit.items.forEach(async (item) => {
                if (item.status === 'ok' && item.eol && currentDate > new Date(item.eol)) {
                    await models.item.update({ status: 'inspect' }, { where: { id: item.id } });
                }
            });
        };

        req.data = unit;
        req.facility = unit.facility.id;
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Sends specified unit data
exports.sendUnit = async (req, res, next) => {
    const unit = req.data;

    if (!unit) {
        return res.status(404).send({ message: "Unit not found." });
    };

    const unitListItems = {
        id: unit.id,
        name: unit.name,
        type: unit.unittype.name,
        facility: {
            id: unit.facility.id,
            name: unit.facility.name
        },
        items: unit.items.map(item => ({
            itemId: item.id,
            itemName: item.name,
            template: {
                id: item.templateid,
                name: item.template.name
            },
            status: item.status
        })),
        createdAt: unit.createdat,
        updatedAt: unit.updatedat
    };

    return res.status(200).json(unitListItems);
}

// Creates new unit
exports.createNewUnit = async (req, res, next) => {
    try {
        const { facilityId, name, type } = req.body;

        const newUnit = await models.unit.create({
            name: name,
            facilityid: facilityId,
            type: type
        });

        const createResponse = {
            unitId: newUnit.id,
            facility: newUnit.facilityid,
            type: newUnit.type,
            createdAt: newUnit.createdat,
            success: true
        };

        res.status(201).json(createResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Updates specified unit
exports.updateUnit = async (req, res, next) => {
    try {
        const unitId = req.params.id;
        const { facilityId, name, type } = req.body;

        const unit = await models.unit.findByPk(unitId);

        if (!unit) {
            return res.status(404).json({ error: 'Unit not found.' });
        };

        unit.set({
            facilityid: facilityId,
            name: name,
            type: type
        });

        const updateResponse = {
            facilityId: facilityId,
            name: unit.name,
            type: unit.type,
            success: true
        };

        await unit.save();

        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Deletes specified unit
exports.deleteUnit = async (req, res, next) => {
    try {
        const unitId = req.params.id;

        const unit = await models.unit.findByPk(unitId);

        if (!unit) {
            return res.status(404).json({ error: 'Unit not found.' });
        };

        const deletedUnit = await unit.destroy();

        const deleteResponse = {
            unitId: deletedUnit.id,
            name: deletedUnit.name,
            facilityId: deletedUnit.facilityid,
            deletedAt: deletedUnit.deletedat,
            success: true
        };

        res.status(200).json(deleteResponse);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Retrieves previously deleted units
exports.getDeleted = async (req, res, next) => {
    try {
        const deletedUnits = await models.unit.findAll({
            where: Sequelize.where(Sequelize.col('unit.deletedat'), 'IS NOT', null),
            include: {
                model: models.facility,
                attributes: ['name'],
                as: 'facility'
            },
            paranoid: false
        });

        return res.status(200).json(deletedUnits);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Restores specified previously deleted unit
exports.restoreDeleted = async (req, res, next) => {
    try {
        const unitId = req.params.id;

        const deletedUnit = await models.unit.findOne({
            where: { id: unitId },
            include: {
                model: models.facility,
                attributes: ['name']
            },
            paranoid: false
        });

        if (!deletedUnit) {
            return res.status(404).json({ error: 'Deleted unit not found.' });
        };

        await deletedUnit.restore();

        const restoreResponse = {
            unit: deletedUnit,
            success: true
        };

        return res.status(200).json(restoreResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Sets the status of all items in unit to 'inspect' or 'discard'
exports.flipUnit = async (req, res, next) => {
    try {
        const unit = req.data;

        const inspectItems = [];
        const discardItems = [];

        if (unit.items) {
            unit.items.forEach(async (item) => {
                if (item.template.singleresident === true) {
                    discardItems.push(item.id);
                    await models.item.update({ status: 'discard' }, { where: { id: item.id } });
                } else if (item.status === 'ok') {
                    inspectItems.push(item.id);
                    await models.item.update({ status: 'inspect' }, { where: { id: item.id } });
                }
            });
        };

        const response = {
            inspect: inspectItems,
            discard: discardItems,
            success: true
        };

        return res.status(200).json(response);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};