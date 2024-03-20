const { DataTypes } = require('sequelize');
const dbConnect = require('../data/dbConnect');
const User = require('./user');
const Facility = require('./facility');

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
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
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

FacilityAuth.belongsTo(User, { foreignKey: 'userId', as: 'authorizedUser' });
FacilityAuth.belongsTo(Facility, { foreignKey: 'facilityId', as: 'facility' });

module.exports = FacilityAuth;