const { comparePasswords } = require('../utils/hash');
const { createToken } = require('../utils/token')
const { models } = require('../data');

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body)
    console.log(req.body.password)
    if (!email || !password){
        return res.status(401).json({ error: 'Invalid login'});
    }

    try {
        const user = await models.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid login (email)' });
        }

        const validPassword = await comparePasswords(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid login (password)' });
        }

        console.log(user)
        const token = await createToken({
            email: user.email,
            isAdmin: user.isAdmin
        });

        res.cookie('authentication', token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).send();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.logout = async (req, res, next) => {
    res.clearCookie('authentication').status(200).send()
};

module.exports = exports;