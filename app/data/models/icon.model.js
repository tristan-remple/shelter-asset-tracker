module.exports = (db, { DataTypes }) => {
    db.define('icon', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        src: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alt: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'icons',
        updatedAt: false,
        deletedAt: false,
        paranoid: false
    });
};