/*
    Middleware function to enforce admin only routes.
 */
const { models } = require('../data');
const { verifyToken } = require('../util/token');

const checkAdmin = async (req, res, next) => {
    try {
        // Check for auth token in cookies
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }

        // Verify token and find user
        const decoded = await verifyToken(token);
        const admin = await models.User.findOne({ 
            attributes: ['isAdmin'],
            where: { id: decoded.id } 
        });

        // If user is admin, proceed
        if (!admin || !admin.isAdmin){
            return res.status(403).json({ error: 'Forbidden.'});
        } 
           
        next();
         
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error.' });
    }
};

module.exports=checkAdmin;