module.exports = (db, { DataTypes }) => {
    db.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
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
        requestDate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'Users'
    });
};