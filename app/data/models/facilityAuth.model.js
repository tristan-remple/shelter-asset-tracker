module.exports = (db, { DataTypes }) => {
    db.define('facilityauth', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        facilityid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        authorizedby: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        tableName: 'facilityauths',
        updatedAt: false
    });
};