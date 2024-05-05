module.exports = (db, { DataTypes }) => {
    db.define('Template', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        icon: {
            type: DataTypes.INTEGER,
            allowNull: true
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
        depreciationRate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        defaultUsefulLife: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        singleResident: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tableName: 'Templates'
    });
};