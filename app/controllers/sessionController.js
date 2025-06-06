const { comparePasswords, hashPassword } = require('../util/password');
const { createToken } = require('../util/token');
const { models } = require('../data');

// Validates login credentials and issues session token
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ error: 'Invalid login.' });
    };

    try {
        const user = await models.user.findOne({ where: { email } });

        if (!user.password) {
            return res.status(401).json({ error: 'Invalid login.'});
        };

        const validPassword = await comparePasswords(password, user.password);

        if (!user || !validPassword) {
            return res.status(401).json({ error: 'Invalid login.' });
        };

        const facilityAuths = await models.facilityauth.findAll({
            where: { userid: user.id },
            attributes: ['facilityid']
        });

        const facilityIds = facilityAuths.map(auth => auth.facilityid);

        const token = await createToken(user.id, user.isadmin, facilityIds);
        const userInfo = {
            userId: user.id,
            isAdmin: user.isadmin,
            facilityAuths: facilityIds
        };

        res.cookie('authorization', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        return res.status(200).send({ userInfo });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Clears session cookie
exports.logout = async (req, res, next) => {
    res.clearCookie('authorization', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    return res.status(200).send();
};

// Initiates user password change request
exports.reset = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword } = req.body;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(401).json({ error: 'Invalid request' });
        };

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
        };

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

module.exports = exports;