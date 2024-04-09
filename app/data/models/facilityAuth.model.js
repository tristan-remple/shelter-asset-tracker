module.exports = (db, { DataTypes }) => {
    db.define('FacilityAuth', {
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
        tableName: 'FacilityAuths',
        updatedAt: false
    });
};