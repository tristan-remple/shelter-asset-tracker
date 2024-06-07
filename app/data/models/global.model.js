module.exports = (db, { DataTypes }) => {
    db.define('Global', {
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
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'Globals',
        updatedAt: false
    });
};