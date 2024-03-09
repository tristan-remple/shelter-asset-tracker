const { Sequelize, DataTypes } = require('sequelize');
const dbConnect = require('../data/dbConnect')

const Template = dbConnect.define('Template', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    defaultValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    defaultDepreciation: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    singleResident: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        default: null
    }
});

module.exports = Template;