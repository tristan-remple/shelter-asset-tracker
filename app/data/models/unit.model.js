module.exports = (db, { DataTypes }) => {
    db.define('Unit', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        facilityId: {
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
        tableName: 'Units'
    });
};