const { models } = require('../data');

// Creates new user
exports.createNewUser = async (req, res, next) => {
    try {
        const { email, name, isAdmin, auths, authorizedBy } = req.body;
        if (!email || !name || isAdmin === undefined) {
            return res.status(400).json({ error: 'Bad request' });
        };

        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        };

        const newUser = await models.User.create({
            email: email,
            password: null,
            name: name,
            isAdmin: isAdmin
        });

        if (Array.isArray(auths)) {
            const facilityAuths = auths.map(async facilityId => {
                await models.FacilityAuth.create({
                    userId: newUser.id,
                    facilityId: facilityId,
                    authorizedBy: authorizedBy
                });
            });

            await Promise.all(facilityAuths);
        };

        const user = await models.User.findOne({ where: { email } });
        
        req.data = user;
        req.isNewUser = true;

        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    };
};

// Retrieves all user data
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await models.User.findAll({
            attributes: [
                'id',
                'email',
                'name',
                'createdAt'
            ],
            include: {
                model: models.FacilityAuth,
                attributes: ['userId', 'facilityId'],
                include: {
                    model: models.Facility,
                    attributes: ['id', 'name']
                },
                required: false
            },
            order: [['createdAt', 'ASC']]
        });

        if (!users) {
            return res.status(404).json({ error: 'Users not found' });
        };

        const usersInfo = users.map(user => ({
            userId: user.id,
            email: user.email,
            name: user.name,
            facilities: user.FacilityAuths.map(facilityAuth => ({
                facilityId: facilityAuth.Facility.id,
                name: facilityAuth.Facility.name
            })),
            createdAt: user.createdAt
        }));

        res.status(200).json(usersInfo);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    };
};

// Retrieve specified user by ID
exports.getUserById = async (req, res, next) => {
    try {
        const userId = +req.params.id;

        const user = await models.User.findOne({
            attributes: [
                'id',
                'email',
                'name',
                'isAdmin',
                'requestHash',
                'requestExpiry',
                'createdAt',
                'updatedAt'
            ],
            where: { id: userId },
            include: {
                model: models.FacilityAuth,
                attributes: ['userId', 'facilityId'],
                include: {
                    model: models.Facility,
                    attributes: ['id', 'name']
                },
                required: false
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        };

        req.data = user;
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Update specified user
exports.updateUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const user = req.data;

        user.set({
            name: name,
            email: email
        });

        await user.save();

        const updateResponse = {
            userId: user.id,
            name: user.name,
            email: user.email,
            success: true
        };

        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Update admin status of specified user
exports.setAdmin = async (req, res, next) => {
    try {
        const user = req.data;
        const { isAdmin } = req.body;
        if (user.id === 1) {
            return res.status(403).send({ message: "Forbidden" });
        };

        user.set({
            isAdmin: isAdmin
        });

        await user.save();

        const setAdminResponse = {
            userId: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            success: true
        };

        return res.status(200).json(setAdminResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Send user data
exports.sendUser = async (req, res, next) => {
    try {
        let user = req.data;
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        };

        const userDetails = {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            created: user.createdAt,
            updated: user.updatedAt,
            facilities: user.FacilityAuths.map(facilityAuth => ({
                facilityId: facilityAuth.Facility.id,
                name: facilityAuth.Facility.name
            }))
        };

        return res.status(200).json(userDetails);

    } catch {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
}

// Delete specified user
exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await models.User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        };

        const deletedUser = await user.destroy({
            force: true
        });

        const deleteResponse = {
            userId: deletedUser.id,
            name: deletedUser.name,
            deleted: deletedUser.deletedAt,
            success: true
        };

        return res.status(200).json(deleteResponse);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};