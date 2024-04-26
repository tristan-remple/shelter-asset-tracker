/*
    Middleware function to enforce admin only routes.
 */
const { models } = require('../data');
const { verifyToken } = require('../util/auth');

const checkAdmin = async (req, res, next) => {
    try {
        // Check for auth token in cookies
        const token = req.cookies.authentication;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }

        // Verify token and find user
        const decoded = await verifyToken(token);
        const user = await models.User.findOne({ 
            attributes: ['isAdmin'],
            where: { id: decoded.id } 
        });

        // If user is admin, proceed
        if (!user || !user.isAdmin){
            res.status(403).json({ error: 'Forbidden'});
        } else {
            return next();
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error.' });
    }
};

module.exports=checkAdmin;