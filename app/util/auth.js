/*
    Functions for creating and verifying JSON Web Tokens (JWT)
 */
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();   

exports.createToken = async (id, facilities) => {
    return jwt.sign({ id: id, facilities: facilities }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

exports.verifyToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

exports.checkAuth = async (token, facility) => {
    try {
        const { id, facilities } = await verifyToken(token);

        // If there is no user or facilities array is empty return false
        if (!id || !facilities || !Array.isArray(facilities) || !facilities.includes(facility)) {
            return false;
        }

        // User is authorized
        return true;

    } catch (error) {
        // Return false on error
        return false;
    }
}
