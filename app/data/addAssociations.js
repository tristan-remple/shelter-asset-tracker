module.exports = (sequelize) => {

    const { Facility, FacilityAuth, Item, Template, Unit, User } = sequelize.models;

    // Define associations here
    User.hasMany(FacilityAuth, { foreignKey: 'userId' });
    Facility.hasMany(FacilityAuth, { foreignKey: 'facilityId' });
    Facility.hasMany(Unit, {foreignKey: 'facilityId'});
    Facility.belongsTo(User, { foreignKey: 'managerId' });
    FacilityAuth.belongsTo(User, { foreignKey: 'userId' });
    FacilityAuth.belongsTo(Facility, { foreignKey: 'facilityId' });
    Item.belongsTo(Unit, { foreignKey: 'unitId' });
    Item.belongsTo(Template, { foreignKey: 'templateId' });
    Item.belongsTo(User, { foreignKey: 'addedBy'});
    Item.belongsTo(User, { foreignKey: 'inspectedBy'});
    Unit.belongsTo(Facility, { foreignKey: 'facilityId'});
    Unit.hasMany(Item, { foreignKey: 'unitId'});
    Template.hasMany(Item, { foreignKey: 'templateId'});
};
