module.exports = (db, { DataTypes }) => {
    db.define('unit', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        facilityid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'units'
    });
};