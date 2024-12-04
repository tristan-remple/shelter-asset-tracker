/*
    Define associations between Sequelize models.
 */
module.exports = (sequelize) => {
    const { Facility, FacilityAuth, Icon, Comment, Item, Template, Unit, UnitType, User } = sequelize.models;

    // User to Facility
    User.hasMany(Facility, { foreignKey: 'managerId', onDelete: 'RESTRICT' });
    Facility.belongsTo(User, { foreignKey: 'managerId', onDelete: 'SET NULL' });

    // User to FacilityAuth
    User.hasMany(FacilityAuth, { foreignKey: 'userId', onDelete: 'CASCADE' });
    FacilityAuth.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // Facility to FacilityAuth
    Facility.hasMany(FacilityAuth, { foreignKey: 'facilityId', onDelete: 'CASCADE' });
    FacilityAuth.belongsTo(Facility, { foreignKey: 'facilityId', onDelete: 'CASCADE' });

    // Facility to Unit
    Facility.hasMany(Unit, { foreignKey: 'facilityId', onDelete: 'RESTRICT' });
    Unit.belongsTo(Facility, { foreignKey: 'facilityId', onDelete: 'CASCADE' });

    // Unit to Item
    Unit.hasMany(Item, { foreignKey: 'unitId', onDelete: 'RESTRICT' });
    Item.belongsTo(Unit, { foreignKey: 'unitId', onDelete: 'CASCADE' });

    // Template to Item
    Template.hasMany(Item, { foreignKey: 'templateId', onDelete: 'RESTRICT' });
    Item.belongsTo(Template, { foreignKey: 'templateId', onDelete: 'SET NULL' });

    // User to Item (addedBy)
    User.hasMany(Item, { foreignKey: 'addedBy', as: 'addedByUser', onDelete: 'SET NULL' });
    Item.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser', onDelete: 'SET NULL' });

    // User to Comment
    User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'SET NULL' });
    Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'SET NULL' });

    // Item to Comment
    Item.hasMany(Comment, { foreignKey: 'itemId', onDelete: 'CASCADE' });
    Comment.belongsTo(Item, { foreignKey: 'itemId', onDelete: 'CASCADE' });

    // Icon to Template
    Icon.hasMany(Template, { foreignKey: 'icon', onDelete: 'SET NULL' });
    Template.belongsTo(Icon, { foreignKey: 'icon', onDelete: 'SET NULL' });

    //UnitType to Unit
    UnitType.hasMany(Unit, { foreignKey: 'type', onDelete: 'SET NULL' });
    Unit.belongsTo(UnitType, { foreignKey: 'type', onDelete: 'SET NULL' });
};
