/*
    Configuration for connecting to the database using Sequelize.
 */
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = new Sequelize(
    process.env.DB_URL,
    {   
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true, // Render requires SSL
            },
        },
        define: {
            paranoid: true,     // Enables soft deletion for all models
            timestamps: true,   // Adds createdAt and updatedAt fields for all models
        },
        pool: {
            max: 20,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    }
);

module.exports = dbConfig;