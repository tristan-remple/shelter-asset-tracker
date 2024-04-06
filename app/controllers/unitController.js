const { models, Sequelize } = require('../data');

exports.getUnitById = async (req, res, next) => {
    try {
        const unitId = req.params.id; 

        const unit = await models.Unit.findOne({
            attributes: [
                'id', 
                'name', 
                'type'
            ],
            where: { id: unitId },
            include: {
                model: models.Item,
                attributes: [
                    'id',
                    'name', 
                    'toInspect',
                    'toDiscard'
                ],
                include: {
                    model: models.Template,
                    attributes: [
                        'id',
                        'name'
                    ]
                }
            },
            group: [] // Don't forget me
        });

        if (!unit) {
            return res.status(404).json({ error: 'Unit not found.' });
        }

        const unitListItems = {
            unitId: unit.id,
            unitName: unit.name,
            items: unit.Items.map(item => ({
                itemId: item.id,
                itemName: item.name,
                type: {
                    templateId: item.Template.id,
                    templateName: item.Template.name
                },
                toInspect: item.toInspect,
                toDiscard: item.toDiscard
            }))
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

        res.status(201).json({
            id: newUnit.id,
            name: newUnit.name,
            type: newUnit.type,
            facilityId: newUnit.facilityId,
            success: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.deleteUnit = async (req, res, next) => {
    try {
        const unitId = req.params.id;
        const { facilityId, name } = req.body;

        const unit = await models.Facility.findByPk(unitId);

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