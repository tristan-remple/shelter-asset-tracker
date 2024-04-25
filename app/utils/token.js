/*
    Functions for creating and verifying JSON Web Tokens (JWT)
 */
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();   

exports.createToken = async (id, facilities) => {
    return jwt.sign({ id: id, facilities: facilities }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

exports.verifyToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}