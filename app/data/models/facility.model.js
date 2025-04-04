module.exports = (db, { DataTypes }) => {
    db.define('facility', {
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
        managerid: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'facilities'
    });
};