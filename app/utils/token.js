const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.createToken = async (email) => {
    return jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

exports.verifyToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}