const { comparePasswords, hashPassword } = require('../utils/hash');
const { createToken } = require('../utils/token');
const { models } = require('../data');

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password){
        return res.status(401).json({ error: 'Invalid login'});
    }

    try {
        const user = await models.User.findOne({where: { email }});
        if (!user) {
            return res.status(401).json({ error: 'Invalid login' });
        }

        const validPassword = await comparePasswords(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid login' });
        }

        const facilityAuths = await models.FacilityAuth.findAll({
            where: { userId: user.id },
            attributes: ['facilityId']
        });
        const facilityIds = facilityAuths.map(auth => auth.facilityId);

        const token = await createToken(user.id, facilityIds);

        res.cookie('authentication', token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).send();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.logout = async (req, res, next) => {
    res.clearCookie('Authentication').status(200).send()
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
            console.log(hashed)
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
        res.status(500).json({ error: 'Server error.' });
    }
};

module.exports = exports;