const { models } = require('../data');

// Updates the "isAdmin" property of a specified user
exports.updateIsAdmin = async (req, res, next) => {
    const { userId, isAdmin } = req.body;

    if (!userId || isAdmin == null || userId == 1) {
        return res.status(400).json({ message: 'Bad request.' });
    };

    try {
        const user = await models.user.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        };

        user.set({ isadmin: isAdmin });

        const response = {
            userId: user.id,
            isAdmin: user.isadmin,
            success: true
        };

        await user.save({ isadmin: isAdmin });
        return res.status(200).json(response);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Updates a user's facility authorizations
exports.updateAuthorization = async (req, res, next) => {
    const { facilityAuths } = req.body;
    const userId = +req.params.id;
    if (!userId || !facilityAuths) {
        return res.status(400).json({ message: 'Bad request.' });
    };

    try {
        const facilities = await models.facilityauth.findAll({
            attributes: ['userid', 'facilityid'],
            where: { userId: userId }
        });

        const currentAuths = facilities.map(facility => facility.facilityid);
        const addedAuths = facilityAuths.filter(facilityId => !currentAuths.includes(facilityId));
        const removedAuths = currentAuths.filter(facilityId => !facilityAuths.includes(facilityId));

        for (const facilityId of addedAuths) {
            await models.facilityauth.create({
                userid: userId,
                facilityid: facilityId,
                authorizedby: 1
            });
        };

        for (const facilityId of removedAuths) {
            await models.facilityauth.destroy({
                where: {
                    userid: userId,
                    facilityid: facilityId
                }
            });
        };

        const response = {
            addedAuths: addedAuths,
            removedAuths: removedAuths,
            userId: userId,
            // authorizedBy: req.userId,
            success: true
        };

        return res.status(200).json(response);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};