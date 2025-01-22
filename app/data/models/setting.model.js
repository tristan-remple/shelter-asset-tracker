module.exports = (db, { DataTypes }) => {
    db.define('setting', {
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
        tableName: 'settings',
        createdAt: false,
        updatedAt: false,
        paranoid: false
    });
};