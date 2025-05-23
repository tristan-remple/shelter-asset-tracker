/*
    Configuration for connecting to the database using Sequelize.
 */
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        define: {
            paranoid: true,         // Enables soft deletion for all models
            timestamps: true,       // Adds createdAt and updatedAt fields for all models
            createdAt: 'createdat', // Renames createdAt field to 'createdat' 
            updatedAt: 'updatedat', // Renames updatedAt field to 'updatedat'
            deletedAt: 'deletedat'  // Renames deletedAt field ro 'deletedat'
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = dbConfig;