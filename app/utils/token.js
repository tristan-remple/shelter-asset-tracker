/*
    Functions for creating and verifying JSON Web Tokens (JWT)
 */
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();   

<<<<<<< HEAD
exports.createToken = async ({ email, isAdmin }) => {
    return jwt.sign({ email: email, isAdmin: isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
=======
exports.createToken = async (id, facilities) => {
    return jwt.sign({ id: id, facilities: facilities }, process.env.JWT_SECRET, { expiresIn: '1h' });
>>>>>>> 798c1aad347c8f9d220bd2a51e4b526fcf5ea7bf
}

exports.verifyToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}