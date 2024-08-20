module.exports = (db, { DataTypes }) => {
    db.define('Icon', {
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
        tableName: 'Icons',
        updatedAt: false,
        deletedAt: false,
        paranoid: false
    });
};