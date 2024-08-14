const { models, Sequelize } = require('../data');

// Admin only function enforced by admin middleware
exports.getAllFacilities = async (req, res, next) => {
    try {
        const facilities = await models.Facility.findAll({
            attributes: [
                'id',
                'name',
                [Sequelize.fn('COUNT', Sequelize.col('Units.id')),
                    'units'
                ]],
            include: [
                {
                    model: models.Unit,
                    attributes: [],
                    required: false
                }
            ],
            group: ['Facility.id', 'Facility.name']
        });

        if (!facilities) {
            return res.status(404).json({ error: 'Facilities not found.' })
        };

        return res.status(200).json(facilities);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.getFacilityById = async (req, res, next) => {
    try {
        const facilityId = req.params.id;

        const facility = await models.Facility.findOne({
            attributes: [
                'id',
                'name',
                'createdAt',
                'updatedAt'
            ],
            where: { id: facilityId },
            include: [{
                model: models.User,
                attributes: ['id', 'name'],
                required: false
            }, {
                model: models.Unit,
                attributes: [
                    'id',
                    'name'
                ],
                include: [{
                    model: models.Item,
                    attributes: ['id', 'status']
                }, {
                    model: models.UnitType,
                    attributes: ['name'],
                    paranoid: false
                }]
            }]
        });

        if (!facility) {
            return res.status(404).json({ error: 'Facility not found.' });
        }

        const facilityDetails = {
            facilityId: facility.id,
            name: facility.name,
            manager: facility.User ? {
                id: facility.User.id,
                name: facility.User.name
            } : null,
            units: facility.Units.map(unit => ({
                unitId: unit.id,
                name: unit.name,
                type: unit.UnitType.name,
                inspectCount: unit.Items.filter(item => item.status === 'inspect').length,
                discardCount: unit.Items.filter(item => item.status === 'discard').length
            })),
            created: facility.createdAt,
            updated: facility.updatedAt,
        };

        req.data = facilityDetails;
        req.facility = facilityId;
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.sendFacility = async (req, res, next) => {
    return res.status(200).json(req.data);
}

exports.createNewFacility = async (req, res, next) => {
    try {
        const { locationName, managerId } = req.body;

        const newFacility = await models.Facility.create({
            name: locationName,
            managerId: managerId
        });

        const createResponse = {
            facilityId: newFacility.id,
            name: newFacility.name,
            createdAt: newFacility.createdAt,
            success: true
        };

        return res.status(201).json(createResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.updateFacility = async (req, res, next) => {
    try {
        const facilityId = req.params.id;
        const { name, managerId } = req.body;

        const facility = await models.Facility.findByPk(facilityId);

        if (!facility) {
            return res.status(404).json({ error: 'Facility not found.' });
        }

        facility.set({
            name: name,
            managerId: managerId
        });

        const updateResponse = {
            id: facility.id,
            name: facility.name,
            managerId: facility.managerId,
            success: true
        }

        await facility.save();
        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.deleteFacility = async (req, res, next) => {
    try {
        const facilityId = req.params.id;
        const { name } = req.body;

        const facility = await models.Facility.findByPk(facilityId);

        if (!facility || facility.name != name) {
            return res.status(404).json({ error: 'Facility not found.' });
        }

        const deletedFacility = await facility.destroy();

        const deleteResponse = {
            facilityId: deletedFacility.id,
            name: deletedFacility.name,
            deleted: deletedFacility.deletedAt,
            success: true
        };

        return res.status(200).json(deleteResponse);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.getDeleted = async (req, res, next) => {
    try {
        const deletedFacilities = await models.Facility.findAll({
            where: Sequelize.where(Sequelize.col('deletedAt'), 'IS NOT', null),
            paranoid: false
        });

        return res.status(200).json(deletedFacilities);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.restoreDeleted = async (req, res, next) => {
    try {
        const facilityId = req.params.id;

        const deletedFacility = await models.Facility.findOne({
            where: { id: facilityId },
            paranoid: false
        });

        if (!deletedFacility) {
            return res.status(404).json({ error: 'Deleted facility not found.' });
        }

        await deletedFacility.restore();

        const restoreResponse = {
            facility: deletedFacility,
            success: true
        };

        return res.status(200).json(restoreResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};