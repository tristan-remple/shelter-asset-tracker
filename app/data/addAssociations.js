/*
    Define associations between Sequelize models.
 */
module.exports = (sequelize) => {

    const { Facility, FacilityAuth, Icon, Inspection, Item, Template, Unit, User } = sequelize.models;

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
    
    User.hasMany(Inspection, { foreignKey: 'userId' });
    Inspection.belongsTo(User, { foreignKey: 'userId' });
    
    Item.hasMany(Inspection, { foreignKey: 'itemId' });
    Inspection.belongsTo(Item, { foreignKey: 'itemId' });

    Icon.hasMany(Template, { foreignKey: 'icon' });
    Template.belongsTo(Icon, { foreignKey: 'icon' });
};
