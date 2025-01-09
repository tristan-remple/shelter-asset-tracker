module.exports = (db, { DataTypes }) => {
    db.define('facilityauth', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        facilityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        authorizedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        tableName: 'facilityauths',
        updatedAt: false
    });
};