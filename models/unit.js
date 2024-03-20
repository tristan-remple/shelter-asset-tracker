const { DataTypes } = require('sequelize');
const dbConnect = require('../data/dbConnect');
const Facility = require('./facility');

const Unit = dbConnect.define('Unit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    facilityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Facility',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        default: null
    }
});

Unit.belongsTo(Facility, { foreignKey: 'facilityId' });

module.exports = Unit;