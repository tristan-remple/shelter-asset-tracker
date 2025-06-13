module.exports = (db, { DataTypes }) => {
    db.define('item', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        unitid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        templateid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        donated: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        vendor: {
            type: DataTypes.STRING,
            allowNull: true
        },
        invoice: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        initialvalue: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        eol: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM({
                values: [
                    'ok',
                    'inspect',
                    'discard'
                ]
            })
        },
        addedby: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'addedby'
        },
        startdate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'items'
    });
};