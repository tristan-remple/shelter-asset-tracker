/*
    Functions for creating and verifying JWT
 */
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.createToken = async (id, isAdmin, facilities) => {
    return jwt.sign({ id: id, isAdmin: isAdmin, facilities: facilities }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

exports.verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.id || !decoded.facilities) {
            return false;
        }
        return decoded;

    } catch (err) {
        console.error(err);
        return false;
    }

}