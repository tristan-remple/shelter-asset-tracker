const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const dbConnect = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {   // Options
        host: process.env.DB_HOST,
        dialect: 'mysql'
    });

module.exports = dbConnect;