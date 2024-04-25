module.exports = (db, { DataTypes }) => {
    db.define('Item', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        unitId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        templateId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        donated: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        vendor: {
            type: DataTypes.STRING,
            allowNull: true
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
            allowNull: false,
            default: false
        },
        toDiscard: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false
        },
        addedBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'addedBy'
        },
        lastInspected: {
            type: DataTypes.DATE,
            allowNull: true
        },
        inspectedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'inspectedBy'
        },         
        inspectionRecord: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        tableName: 'Items'
    }).addHook('beforeUpdate', (item, options) => {
        if (item.changed('toInspect') && item.toInspect == false) {
            item.inspectionRecord = [...(item.inspectionRecord || []), {
                inspectionDate: new Date(),
                inspectedBy: item.inspectedBy
            }];
        }
    });;
};