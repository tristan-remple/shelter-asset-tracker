// index.js
const Sequelize = require('sequelize');
const addAssociations = require('./addAssociations');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {   
        host: process.env.DB_HOST,
        dialect: 'mysql',
        define: {
            paranoid: true,     // Enables soft deletion for all models
            timestamps: true,   // Adds createdAt and updatedAt fields for all models
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const models = [
    require('./models/facility.model'),
    require('./models/facilityAuth.model'),
    require('./models/item.model'),
    require('./models/template.model'),
    require('./models/unit.model'),
    require('./models/user.model'),
    require('./models/comment.model'),
];

models.forEach(model => {
    model(sequelize, Sequelize);
})

addAssociations(sequelize);
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('Database synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing database:', error);
//   });

module.exports = sequelize;