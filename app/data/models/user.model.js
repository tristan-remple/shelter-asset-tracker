module.exports = (db, { DataTypes }) => {
    db.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        requestHash: {
            type: DataTypes.STRING,
            allowNull: true
        },
        requestExpiry: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'users'
    });
};