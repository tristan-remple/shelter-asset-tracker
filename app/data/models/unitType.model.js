module.exports = (db, { DataTypes }) => {
    db.define('UnitType', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'UnitTypes',
        deletedAt: false,
        updatedAt: false
    });
};