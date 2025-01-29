const { models, Sequelize } = require('../data');

// Retrieves a list of all facilities with the count of associated units
exports.getAllFacilities = async (req, res, next) => {
    try {
        const facilities = await models.facility.findAll({
            attributes: [
                'id',
                'name'
            ],
            include: [
                {
                    model: models.unit,
                    attributes: ['id']
                },
                {
                    model: models.facilityauth,
                    attributes: ['userid'],
                    where: { userid: req.userId }
                }
            ]
        });

        if (!facilities) {
            return res.status(404).json({ error: 'Facilities not found.' })
        }; 
        
        const filteredFacilities = req.isAdmin ? facilities : facilities.filter( facility => facility.facilityauths );

        return res.status(200).json(filteredFacilities);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Retrieves details of a specific facility by its ID, including associated users and units
exports.getFacilityById = async (req, res, next) => {
    try {
        const facilityId = req.params.id;

        const facility = await models.facility.findOne({
            attributes: [
                'id',
                'name',
                'createdat',
                'updatedat'
            ],
            where: { id: facilityId },
            include: [{
                model: models.user,
                attributes: ['id', 'name'],
                required: false
            }, {
                model: models.unit,
                attributes: [
                    'id',
                    'name'
                ],
                include: [{
                    model: models.item,
                    attributes: ['id', 'status']
                }, {
                    model: models.unittype,
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
            manager: facility.user ? {
                id: facility.user.id,
                name: facility.user.name
            } : null,
            units: facility.units.map(unit => ({
                unitId: unit.id,
                name: unit.name,
                type: unit.unittype.name,
                inspectCount: unit.items.filter(item => item.status === 'inspect').length,
                discardCount: unit.items.filter(item => item.status === 'discard').length
            })),
            created: facility.createdat,
            updated: facility.updatedat,
        };

        req.data = facilityDetails;
        req.facility = facilityId;
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Sends the facility data stored in the request object
exports.sendFacility = async (req, res, next) => {
    return res.status(200).json(req.data);
};

// Creates a new facility and assigns a manager to it
exports.createNewFacility = async (req, res, next) => {
    try {
        const { locationName, managerId } = req.body;

        const authUser = await models.user.findOne({ where: { id: managerId } });
        if (!authUser) {
            return res.status(404).json({ error: "Manager not found." });
        };

        const newFacility = await models.facility.create({
            name: locationName,
            managerid: managerId
        });

        await models.facilityauth.create({
            userid: managerId,
            facilityid: newFacility.id
        });

        const createResponse = {
            facilityId: newFacility.id,
            name: newFacility.name,
            createdAt: newFacility.createdat,
            success: true
        };

        return res.status(201).json(createResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Updates an existing facility's details
exports.updateFacility = async (req, res, next) => {
    try {
        const facilityId = req.params.id;
        const { name, managerId } = req.body;

        const facility = await models.facility.findByPk(facilityId);

        if (!facility) {
            return res.status(404).json({ error: 'Facility not found.' });
        };

        facility.set({
            name: name,
            managerid: managerId
        });

        const updateResponse = {
            id: facility.id,
            name: facility.name,
            managerId: facility.managerid,
            success: true
        };

        await facility.save();
        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Deletes a facility and associated authorizations
exports.deleteFacility = async (req, res, next) => {
    try {
        const facilityId = req.params.id;

        const facility = await models.facility.findByPk(facilityId);

        if (!facility) {
            return res.status(404).json({ error: 'Facility not found.' });
        };

        await models.facilityauth.destroy({
            where: { facilityid: facilityId }
        });

        const deletedFacility = await facility.destroy();

        const deleteResponse = {
            facilityId: deletedFacility.id,
            name: deletedFacility.name,
            deleted: deletedFacility.deletedat,
            success: true
        };

        return res.status(200).json(deleteResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Retrieves all deleted facilities (soft deleted)
exports.getDeleted = async (req, res, next) => {
    try {
        const deletedFacilities = await models.facility.findAll({
            where: Sequelize.where(Sequelize.col('deletedat'), 'IS NOT', null),
            paranoid: false
        });

        return res.status(200).json(deletedFacilities);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Restores a soft-deleted facility
exports.restoreDeleted = async (req, res, next) => {
    try {
        const facilityId = req.params.id;

        const deletedFacility = await models.facility.findOne({
            where: { id: facilityId },
            paranoid: false
        });

        if (!deletedFacility) {
            return res.status(404).json({ error: 'Deleted facility not found.' });
        };

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