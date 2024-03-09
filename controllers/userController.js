const User = require('../models/users')

exports.getAllUsers = async (req, res, next) => {
    res.send("Get all users route");
}

exports.createNewUser = async (req, res, next) => {

    const newUser = await User.create({
        password: "password",
        email: "email@email.com",
        name: "Test Name",
        isAdmin: false
    });
    console.log(newUser);
    res.send("Create user route");
}

exports.getUserById = async (req, res, next) => {
    res.send("Get user by id route.")
}