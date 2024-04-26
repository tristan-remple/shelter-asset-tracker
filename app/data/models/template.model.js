module.exports = (db, { DataTypes }) => {
    db.define('Template', {
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
        }
    }, {
        tableName: 'Templates'
    });
};