module.exports = (db, { DataTypes }) => {
    db.define('Facility', {
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
        managerId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'Facilities'
    });  
};