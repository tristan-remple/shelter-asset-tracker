const { models } = require('../data');
const { verifyToken } = require('../utils/token');

const authorize = async (req, res, next) => {
    try {
        const token = req.cookies.authentication;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }

        const decoded = await verifyToken(token);
        const user = await models.User.findOne({ where: { email: decoded.email } });

        if (user.isAdmin) {
            return next();
        }

        return next();
        
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized.' });
    }
};

module.exports=authorize;