const bcrypt = require('bcrypt');

exports.hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};

exports.comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};