const { models } = require('../data');
const { hashPassword } = require('../utils/hash'); 

exports.createNewUser = async (req, res, next) => {
    try {
        const { email, password, name, isAdmin } = req.body;
        if (!email || !password || !name || isAdmin === undefined) {
            return res.status(400).json({ error: 'Bad request' });
        }

        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await models.User.create({
            email: email,      
            password: hashedPassword,
            name: name,
            isAdmin: isAdmin
        });

        const createResponse = {
            userId: newUser.id,
            name: newUser.name,
            isAdmin: newUser.isAdmin,
            created: newUser.createdAt,
            success: true
        };

        res.status(201).json(createResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

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
        }
        
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
        res.status(500).json({ error: 'Server error' });
    } 
};

exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id; 

        const user = await models.User.findOne({
            attributes: [
                'id', 
                'email', 
                'name', 
                'isAdmin', 
                'createdAt', 
                'updatedAt'],
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
        }

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

        res.status(200).json(userDetails);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { name, email, isAdmin } = req.body;

        const user = await models.User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.set({
            name: name,
            email: email,
            isAdmin: isAdmin
        })

        const updateResponse = {
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            success: true
        }

        await user.save();

        res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { email } = req.body;

        const user = await models.User.findByPk(userId);

        if (!user || user.email != email) {
            return res.status(404).json({ error: 'User not found.' });
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
        res.status(500).json({ error: 'Server error.' });
    }
};