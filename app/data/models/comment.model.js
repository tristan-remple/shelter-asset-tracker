module.exports = (db, { DataTypes }) => {
    db.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        archive: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        tableName: 'Comments',
        updatedAt: false
    }).addHook('beforeUpdate', (comment, options) => {
        if (comment.changed('comment')) {

            comment.archive = [...(comment.archive || []), {
                user: comment.userId,
                createdAt: comment.createdAt,
                updatedAt: new Date(),
                comment: comment.previous('comment')
            }];
        }
    });
};