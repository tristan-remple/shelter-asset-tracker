const { models, Sequelize } = require('../data');

exports.getAllFacilities = async (req, res, next) => {
    try {
        const facilities = await models.Facility.findAll({
            attributes: ['id', 'name', [Sequelize.fn('COUNT', Sequelize.col('Units.id')), 'units']],
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
            return res.status(404).json({ error: 'Facilities not found.'})
        }

        res.status(200).json(facilities);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

exports.getFacilityById = async (req, res, next) => {
    try {
        const facilityId = req.params.id; 

        const facility = await models.Facility.findOne({
            attributes: [
                'id', 
                'name', 
                'phone', 
                'createdAt', 
                'updatedAt',
                [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT CASE WHEN `Units->Items`.`toInspect` = true THEN `Units`.`id` END')), 'inspectCount'],
                [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT CASE WHEN `Units->Items`.`toDiscard` = true THEN `Units`.`id` END')), 'discardCount']
            ],
            where: { id: facilityId },
            include: [{
                model: models.User,
                attributes: ['name'],
            }, {
                model: models.Unit,
                attributes: ['id', 'name', 'type'],
                include: {
                    model: models.Item,
                    attributes: []
                }
            }],
            group: ['Facility.id', 'Facility.name', 'Facility.phone', 'Facility.createdAt', 'Facility.updatedAt', 'User.id', 'User.name', 'Units.id', 'Units.name', 'Units.type']
        });

        if (!facility) {
            return res.status(404).json({ error: 'Facility not found.' });
        }

        const facilityDetails = {
            facilityId: facility.id,
            name: facility.name,
            created: facility.createdAt,
            updated: facility.updatedAt,
            units: facility.Units.map(unit => ({
                unitId: unit.id,
                name: unit.name,
                type: unit.type,
                inspectCount: unit.inspectCount || 0,
                deleteCount: unit.discardCount || 0
            }))
        };

        res.status(200).json(facilityDetails);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.createNewFacility = async (req, res, next) => {
    try {
        const { locationName, managerId, phone } = req.body;

        const newFacility = await models.Facility.create({
            name: locationName,
            managerId: managerId,
            phone: phone
        });

        res.status(201).json({
            id: newFacility.id,
            name: newFacility.name,
            managerId: newFacility.managerId,
            phone: newFacility.phone
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.updateFacility = async (req, res, next) => {
    try {
        const facilityId = req.params.id;
        const { name, managerId, phone } = req.body;

        const facility = await models.Facility.findByPk(facilityId);

        if (!facility) {
            return res.status(404).json({ error: 'Facility not found.' });
        }

        facility.set({
            name: name,
            managerId: managerId,
            phone: phone
        });
        
        await facility.save();

        res.status(200).json(facility);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
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

        res.status(200).json(deleteResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};