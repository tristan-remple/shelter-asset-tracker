const checkFacility = async (req, res, next) => {
    try {
        if (req.isAdmin) {
            next();
            return;
        }

        if (!req.facilities.includes(+req.facility)) {
            return res.status(403).send({ message: 'Forbidden.' });
        }

        next();
    } catch {
        console.error(error);
        return res.status(500).send({ message: 'Server Error.' });
    }
}

module.exports = checkFacility;