const { models } = require('../data');
const { verifyToken } = require('../util/token');

exports.updateIsAdmin = async (req, res, next) => {
    const { userId, isAdmin } = req.body;
    if (!userId || isAdmin == null || userId == 1){
        console.log(userId, isAdmin);
        return res.status(400).json({ message: 'Bad request.'});
    }

    try {
        const user = await models.User.findOne({ where: { id: userId }});
        if (!user){
            return res.status(404).json({ message: 'User not found.'})
        }

        user.set({ isAdmin: isAdmin });
        const response = {
            userId: user.id,
            isAdmin: user.isAdmin,
            success: true
        }
        await user.save({ isAdmin: isAdmin });
        return res.status(200).json(response);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.updateAuthorization = async (req, res, next) => {
    const { facilityAuths } = req.body;
    const userId = +req.params.id;

    if (!userId || !facilityAuths){
        return res.status(400).json({ message: 'Bad request.'});
    }

    try {
        const facilities = await models.FacilityAuth.findAll({
            attributes: ['userId', 'facilityId' ], 
            where: { userId: userId }
        });

        const currentAuths = facilities.map(facility => facility.facilityId);
        const addedAuths = facilityAuths.filter(facilityId => !currentAuths.includes(facilityId));
        const removedAuths = currentAuths.filter(facilityId => !facilityAuths.includes(facilityId));

        for (const facilityId of addedAuths) {
            await models.FacilityAuth.create({
                userId: userId,
                facilityId: facilityId,
                authorizedBy: 1
            });
        }

        for (const facilityId of removedAuths) {
            await models.FacilityAuth.destroy({
                where: {
                    userId: userId,
                    facilityId: facilityId
                }
            });
        }

        const response = {
            addedAuths: addedAuths,
            removedAuths: removedAuths,
            userId: userId,
            // authorizedBy: req.userId,
            success: true
        }

        return res.status(200).json(response);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};