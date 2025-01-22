module.exports = (db, { DataTypes }) => {
    db.define('unittype', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'unittypes',
        paranoid: false,
        deletedAt: false,
        updatedAt: false
    });
};