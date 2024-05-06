const checkUser = async (req, res, next) => {
    try {
        if (req.isAdmin || req.userId == req.params.id) {
            next();
            return;
        }
    
        return res.status(403).send({ message: 'Forbidden.'});
    } catch {
        console.error(error);
        return res.status(500).send({ message: 'Server Error.'});
    }
}

module.exports=checkUser;