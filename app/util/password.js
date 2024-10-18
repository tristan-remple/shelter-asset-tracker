/*
    Functions for hashing passwords and comparing passwords using bcrypt.
 */
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");

const hashLength = 16;
const expiryDays = 7;

exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

exports.checkPassword = async (pw) => {
    return (
        pw.length > 8 &&
        pw.match(/[0-9]/) &&
        pw.match(/[a-z]/) &&
        pw.match(/[A-Z]/) &&
        pw.match(/[!@#\$%\^&\*\(\)\-_\+=:;"'<>,\.\/\?\\\|`~\[\]\{\}]/)
    )
};

exports.comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

exports.createReset = async () => {
    return {
        requestHash: randomstring.generate(hashLength),
        requestExpiry: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
    }
};