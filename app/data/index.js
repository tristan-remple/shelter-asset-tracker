/*
    Initialize Sequelize and define models for various entities.
 */

const Sequelize = require('sequelize');
const addAssociations = require('./addAssociations');
const sequelize = require('../config/dbConfig')
const dotenv = require('dotenv');
dotenv.config();

// List of all models to be loaded
const models = [
    require('./models/facility.model'),
    require('./models/facilityAuth.model'),
    require('./models/icon.model'),
    require('./models/comment.model'),
    require('./models/item.model'),
    require('./models/setting.model'),
    require('./models/template.model'),
    require('./models/unit.model'),
    require('./models/unitType.model'),
    require('./models/user.model')
];

// Initialize each model with Sequelize and dbConfig
models.forEach(model => {
    model(sequelize, Sequelize);
})

// Add associations between models
addAssociations(sequelize);

// Used to sync db - only enable if needed
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('Database synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing database:', error);
//   });

// Export initialized Sequelize instance
module.exports = sequelize;