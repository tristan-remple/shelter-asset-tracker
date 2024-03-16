const { DataTypes } = require('sequelize');

module.exports = (db) => {
    db.define('FacilityAuth', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
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
    }, {
        tableName: 'FacilityAuths'
    });
};