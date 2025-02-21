module.exports = (db, { DataTypes }) => {
    db.define('template', {
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
        defaultvalue: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        defaultusefullife: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        singleresident: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tableName: 'templates'
    });
};