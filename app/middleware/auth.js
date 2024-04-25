/*
    Middleware function to authorize users based on their JWT token.
 */
const { models } = require('../data');
const { verifyToken } = require('../utils/token');

const authorize = async (req, res, next) => {
    try {
        // Check for auth token in cookies
        const token = req.cookies.authentication;
<<<<<<< HEAD
        console.log(req.headers)

=======
>>>>>>> 798c1aad347c8f9d220bd2a51e4b526fcf5ea7bf
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }

        // Verify token and find user
        const decoded = await verifyToken(token);

        const user = await models.User.findOne({ where: { id: decoded.id } });

        if (!user){
            res.status(401).json({ error: 'Unauthorized'});
        }

        // If user is admin, proceed
        if (user.isAdmin) {
            return next();
        }

        // !!! Update to check permissions
        return next();
        
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized.' });
    }
};

module.exports=authorize;