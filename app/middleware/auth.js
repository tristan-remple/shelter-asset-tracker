const { models } = require('../data');
const { verifyToken } = require('../util/token');

const checkAuth = async (req, res, next) => {
    try {
        const auth = await verifyToken(req.cookies.Authorization);
        const facility = +req.facility;
        req.userId = auth.id

        if (!auth) {
            return res.status(401).send({ message: 'Unauthorized.' });
        } else if (!auth.facilities || !Array.isArray(auth.facilities)  || !auth.facilities.includes(facility)) {
            return res.status(403).send({ message: 'Forbidden.' });
        }

        next();

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Server Error.'});
    }
}

module.exports=checkAuth;