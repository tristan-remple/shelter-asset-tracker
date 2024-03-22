const { models } = require('../data')

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await models.User.findAll({
            attributes: ['id', 'email', 'name'],
            include: {
                model: models.FacilityAuth,
                attributes: ['userId', 'facilityId'],
                include: {
                    model: models.Facility,
                    attributes: ['id', 'name']
                }
            },
            order: [['createdAt', 'ASC']],
            where: {
                deletedAt: null
            }
        });

        if (!users) {
            return res.status(404).json({ error: 'Users not found' });
        }
        
        const usersInfo = users.map(user => ({
            userId: user.id,
            email: user.email,
            name: user.name,
            facilities: user.FacilityAuths.map(facilityAuth => ({
                facilityId: facilityAuth.Facility.id,
                name: facilityAuth.Facility.name
            }))
        }));

        res.status(200).json(usersInfo);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } 
}

exports.createNewUser = async (req, res, next) => {
    try {
        const { email, password, name, isAdmin } = req.body;

        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = await models.User.create({
            email,       //----------------------!!!
            password,   //               <-- HASH ME
            name,
            isAdmin
        });

        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id; 

        const user = await models.User.findOne({
            attributes: ['id', 'email', 'name', 'isAdmin', 'createdAt', 'updatedAt'],
            where: { id: userId },
            include: {
                model: models.FacilityAuth,
                attributes: ['userId', 'facilityId'],
                include: {
                    model: models.Facility,
                    attributes: ['id', 'name']
                }
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userProfile = {
            userId: user.id,
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

        res.status(200).json(userProfile);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { username, name, email } = req.body;

        const user = await models.User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = username || user.username;
        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();

        res.status(200).json(user);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { email } = req.body;

        const user = await models.User.findByPk(userId);

        if (!user || user.email !== email) {
            return res.status(404).json({ error: 'User not found or invalid email' });
        }

        const deletedUser = await user.destroy();

        const deleteResponse = {
            userId: deletedUser.id,
            name: deletedUser.name,
            deleted: deletedUser.deletedAt,
            success: true
        };

        res.status(200).json(deleteResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};