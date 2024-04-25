/*
    Functions for hashing passwords and comparing passwords using bcrypt.
 */
const bcrypt = require('bcrypt');

exports.hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
};

exports.comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};