module.exports = (db, { DataTypes }) => {
    db.define('attachment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        src: {
            type: DataTypes.STRING,
            allowNull: false
        },
        commentid: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'attachments',
        updatedAt: false,
        deletedAt: false,
        paranoid: false
    });
};