const { DataTypes } = require('sequelize');
const dbConnect = require('../data/dbConnect');
const Unit = require('./unit');
const Template = require('./template');
const User = require('./user');

const Item = dbConnect.define('Item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Unit',
            key: 'id'
        }
    },
    templateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Template',
            key: 'id'
        }
    },
    donated: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    initialValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    depreciationRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    toInspect: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    addedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    lastInspected: {
        type: DataTypes.DATE,
        allowNull: true
    },
    inspectedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'User',
            key: 'id'
        }
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
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

Item.belongsTo(Unit, { foreignKey: 'unitId' });
Item.belongsTo(Template, { foreignKey: 'templateId' });
Item.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });
Item.belongsTo(User, { foreignKey: 'inspectedBy', as: 'inspectedByUser' });

module.exports = Item;