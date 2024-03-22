const { DataTypes } = require('sequelize');

module.exports = (db) => {
    db.define('Unit', {
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
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            default: null
        }
    }, {
        tableName: 'Units'
    });
};