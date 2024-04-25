/*
    Define associations between Sequelize models.
 */
module.exports = (sequelize) => {

    const { Comment, Facility, FacilityAuth, Item, Template, Unit, User } = sequelize.models;

    User.hasMany(Facility, { foreignKey: 'managerId' });
    Facility.belongsTo(User, { foreignKey: 'managerId' });
    
    User.hasMany(FacilityAuth, { foreignKey: 'userId' });
    FacilityAuth.belongsTo(User, { foreignKey: 'userId' });
    
    Facility.hasMany(FacilityAuth, { foreignKey: 'facilityId' });
    FacilityAuth.belongsTo(Facility, { foreignKey: 'facilityId' });
    
    Facility.hasMany(Unit, { foreignKey: 'facilityId' });
    Unit.belongsTo(Facility, { foreignKey: 'facilityId' });
    
    Unit.hasMany(Item, { foreignKey: 'unitId' });
    Item.belongsTo(Unit, { foreignKey: 'unitId' });
    
    Template.hasMany(Item, { foreignKey: 'templateId' });
    Item.belongsTo(Template, { foreignKey: 'templateId' });
    
    User.hasMany(Item, { foreignKey: 'addedBy', as: 'addedByUser' });
    Item.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });
    
    User.hasMany(Item, { foreignKey: 'inspectedBy', as: 'inspectedByUser' });
    Item.belongsTo(User, { foreignKey: 'inspectedBy', as: 'inspectedByUser' });
    
    User.hasMany(Comment, { foreignKey: 'userId' });
    Comment.belongsTo(User, { foreignKey: 'userId' });
    
    Item.hasMany(Comment, { foreignKey: 'itemId' });
    Comment.belongsTo(Item, { foreignKey: 'itemId' });
};
