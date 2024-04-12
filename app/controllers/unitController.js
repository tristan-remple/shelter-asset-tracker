const { models, Sequelize } = require('../data');

exports.getUnitById = async (req, res, next) => {
    try {
        const unitId = req.params.id; 

        const unit = await models.Unit.findOne({
            attributes: [
                'id', 
                'name', 
                'type',
                'createdAt',
                'updatedAt'
            ],
            where: { id: unitId },
            include: [{
                model: models.Item,
                attributes: [
                    'id',
                    'name', 
                    'toInspect',
                    'toDiscard'
                ],
                include: {
                    model: models.Template,
                    attributes: ['id', 'name']
                },
                required: false
            }, {
                model: models.Facility,
                attributes: ['id','name']
            }],
            group: [] 
        });

        if (!unit) {
            return res.status(404).json({ error: 'Unit not found.' });
        }

        const unitListItems = {
            id: unit.id,
            name: unit.name,
            type: unit.type,
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
                toInspect: item.toInspect,
                toDiscard: item.toDiscard
            })),
            createdAt: unit.createdAt,
            updatedAt: unit.updatedAt
        };

        res.status(200).json(unitListItems);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

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
        res.status(500).json({ error: 'Server error.' });
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

        res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.deleteUnit = async (req, res, next) => {
    try {
        const unitId = req.params.id;
        const { facilityId, name } = req.body;

        const unit = await models.Unit.findByPk(unitId);

        if (!unit || unit.name !== name || unit.facilityId != facilityId ) {
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
        res.status(500).json({ error: 'Server error.' });
    }
};