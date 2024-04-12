const { models } = require('../data');
const { verifyToken } = require('../utils/token');

const authorize = async (req, res, next) => {
    try {
        const token = req.cookies.authentication;
        console.log(req.headers)

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }

        const decoded = await verifyToken(token);
        console.log(decoded);
        const user = await models.User.findOne({ where: { email: decoded.email } });

        if (user.isAdmin) {
            return next();
        }

        //This doesn't make sense: lets include facilityAuth in cookie?
        // const { facilityId, unitId, itemId } = req.params;

        // let authorized = false;
        // if (facilityId) {
        //     authorized = await FacilityAuth.findOne({
        //         where: { userId: user.id, facilityId }
        //     });
        // } else if (unitId) {
        //     const unit = await Unit.findByPk(unitId);
        //     if (unit) {
        //         authorized = await FacilityAuth.findOne({
        //             where: { userId: user.id, facilityId: unit.facilityId }
        //         });
        //     }
        // } else if (itemId) {
        //     const item = await Item.findByPk(itemId, { include: Unit });
        //     if (item && item.Unit) {
        //         authorized = await FacilityAuth.findOne({
        //             where: { userId: user.id, facilityId: item.Unit.facilityId }
        //         });
        //     }
        // }

        // if (!authorized) {
        //     return res.status(403).json({ error: 'Forbidden.' });
        // }

        return next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized.' });
    }
};

module.exports=authorize;