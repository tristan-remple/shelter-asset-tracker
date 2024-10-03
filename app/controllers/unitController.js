const { models, Sequelize } = require('../data');

exports.getUnitById = async (req, res, next) => {
    try {
        const unitId = req.params.id;

        const unit = await models.Unit.findOne({
            attributes: [
                'id',
                'name',
                'createdAt',
                'updatedAt'
            ],
            where: { id: unitId },
            include: [{
                model: models.Item,
                attributes: [
                    'id',
                    'name',
                    'status',
                    'eol'
                ],
                include: {
                    model: models.Template,
                    attributes: [
                        'id',
                        'name',
                        'singleResident'
                    ],
                    paranoid: false
                },
                required: false
            }, {
                model: models.Facility,
                attributes: ['id', 'name']
            }, {
                model: models.UnitType,
                attributes: ['name'],
                paranoid: false
            }],
            group: []
        });

        if (!unit) {
            return res.status(404).json({ message: 'Unit not found.' });
        }

        const currentDate = new Date();

        if (unit.Items) {
            unit.Items.forEach(async (item) => {
                if (item.status === 'ok' && item.eol && currentDate > new Date(item.eol)) {
                    await models.Item.update({ status: 'inspect' }, { where: { id: item.id } });
                }
            });
        }

        req.data = unit;
        req.facility = unit.Facility.id;
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.sendUnit = async (req, res, next) => {
    const unit = req.data;

    if (!unit) {
        return res.status(404).send({ message: "Unit not found." });
    }

    const unitListItems = {
        id: unit.id,
        name: unit.name,
        type: unit.UnitType.name,
        facility: {
            id: unit.Facility.id,
            name: unit.Facility.name
        },
        items: unit.Items.map(item => ({
            itemId: item.id,
            itemName: item.name,
            template: {
                id: item.Template.id,
                name: item.Template.name
            },
            status: item.status
        })),
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt
    };

    return res.status(200).json(unitListItems);
}

exports.createNewUnit = async (req, res, next) => {
    try {
        const { facilityId, name, type } = req.body;

        const newUnit = await models.Unit.create({
            name: name,
            facilityId: facilityId,
            type: type
        });

        const createResponse = {
            unitId: newUnit.id,
            facility: newUnit.facilityId,
            type: newUnit.type,
            createdAt: newUnit.createdAt,
            success: true
        };

        res.status(201).json(createResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.updateUnit = async (req, res, next) => {
    try {
        const unitId = req.params.id;
        const { facilityId, name, type } = req.body;

        const unit = await models.Unit.findByPk(unitId);

        if (!unit) {
            return res.status(404).json({ error: 'Unit not found.' });
        }

        unit.set({
            facilityId: facilityId,
            name: name,
            type: type
        })

        const updateResponse = {
            facilityId: facilityId,
            name: unit.name,
            type: unit.type,
            success: true
        }

        await unit.save();

        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.deleteUnit = async (req, res, next) => {
    try {
        const unitId = req.params.id;

        const unit = await models.Unit.findByPk(unitId);

        if (!unit) {
            return res.status(404).json({ error: 'Unit not found.' });
        }

        const deletedUnit = await unit.destroy();

        const deleteResponse = {
            unitId: deletedUnit.id,
            name: deletedUnit.name,
            facilityId: deletedUnit.facilityId,
            deletedAt: deletedUnit.deletedAt,
            success: true
        };

        res.status(200).json(deleteResponse);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.getDeleted = async (req, res, next) => {
    try {
        const deletedUnits = await models.Unit.findAll({
            where: Sequelize.where(Sequelize.col('Unit.deletedAt'), 'IS NOT', null),
            include: {
                model: models.Facility,
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

exports.restoreDeleted = async (req, res, next) => {
    try {
        const unitId = req.params.id;

        const deletedUnit = await models.Unit.findOne({
            where: { id: unitId },
            include: {
                model: models.Facility,
                attributes: ['name']
            },
            paranoid: false
        });

        if (!deletedUnit) {
            return res.status(404).json({ error: 'Deleted unit not found.' });
        }

        await deletedUnit.restore();

        const restoreResponse = {
            unit: deletedUnit,
            success: true
        };

        return res.status(200).json(restoreResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.flipUnit = async (req, res, next) => {
    try {
        const unit = req.data;

        const inspectItems = [];
        const discardItems = [];

        if (unit.Items) {
            unit.Items.forEach(async (item) => {
                if (item.Template.singleResident === true) {
                    discardItems.push(item.id);
                    await models.Item.update({ status: 'discard' }, { where: { id: item.id } });
                } else if (item.status === 'ok') {
                    inspectItems.push(item.id);
                    await models.Item.update({ status: 'inspect' }, { where: { id: item.id } });
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