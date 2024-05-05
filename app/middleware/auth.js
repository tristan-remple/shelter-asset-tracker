const { models } = require('../data');
const { verifyToken } = require('../util/token');

const checkAuth = async (req, res, next) => {
    try {
        const auth = await verifyToken(req.cookies.authorization);

        if (!auth) {
            return res.status(401).send({ message: 'Unauthorized.' });
        } else if (!auth.facilities || !Array.isArray(auth.facilities)) {
            return res.status(403).send({ message: 'Forbidden.' });
        }

        req.userId = auth.id;
        req.facilities = auth.facilities;
        req.isAdmin = auth.isAdmin;

        if (req.isAdmin) {
            next();
            return;
        }

        next();

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Server Error.'});
    }
}

module.exports=checkAuth;