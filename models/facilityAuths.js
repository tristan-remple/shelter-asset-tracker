const { Sequelize, DataTypes } = require('sequelize');
const dbConnect = require('../data/dbConnect')

const FacilityAuth = dbConnect.define('FacilityAuth', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    facilityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Facility',
            key: 'id'
        }
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        default: null
    },
    authorizedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    updatedAt: false
});

module.exports = FacilityAuth;