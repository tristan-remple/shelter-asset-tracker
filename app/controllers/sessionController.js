const { comparePasswords, hashPassword } = require('../util/hash');
const { createToken } = require('../util/token');
const { models } = require('../data');

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password){
        return res.status(401).json({ error: 'Invalid login.'});
    }

    try {
        const user = await models.User.findOne({ where: { email } });
        const validPassword = await comparePasswords(password, user.password);

        if (!user || !validPassword) {
            return res.status(401).json({ error: 'Invalid login.' });
        }

        const facilityAuths = await models.FacilityAuth.findAll({
            where: { userId: user.id },
            attributes: ['facilityId']
        });
        const facilityIds = facilityAuths.map(auth => auth.facilityId);

        const token = await createToken(user.id, user.isAdmin, facilityIds);
        const userInfo = {
            userId: user.id,
            isAdmin: user.isAdmin,
            facilityAuths: facilityIds
        }

        // Set the token in the Authorization header
        return res.setHeader('Authorization', token).status(200).json(userInfo);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.logout = async (req, res, next) => {
    return res.clearCookie('authentication').status(200).send()
};

exports.reset = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword } = req.body;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(401).json({ error: 'Invalid request' });
        }

        const validPassword = await comparePasswords(oldPassword, user.password);
        if (validPassword) {
            const hashed = await hashPassword(newPassword);
            user.set({
                password: hashed
            });
            await user.save();

            return res.status(200).json({ user: user.id, success: true });

        } else {
            return res.status(401).json({ error: 'Invalid request' });
        }
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

module.exports = exports;