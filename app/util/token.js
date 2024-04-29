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
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.error(err);
        return false;
    }

}