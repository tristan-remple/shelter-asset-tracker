module.exports = (sequelize) => {

    const { Facility, FacilityAuth, Item, Template, Unit, User } = sequelize.models;

    // Define associations here
    // FacilityAuth user/facility associations
    User.hasMany(FacilityAuth, { foreignKey: 'userId' });
    FacilityAuth.belongsTo(User, { foreignKey: 'userId' });
    Facility.hasMany(FacilityAuth, { foreignKey: 'facilityId' });
    FacilityAuth.belongsTo(Facility, { foreignKey: 'facilityId' });

    // Item associations
    Item.belongsTo(Unit, { foreignKey: 'unitId' });
    Item.belongsTo(Template, { foreignKey: 'templateId' });
    Item.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });
    Item.belongsTo(User, { foreignKey: 'inspectedBy', as: 'inspectedByUser' });

    // Unit associations
    Unit.belongsTo(Facility, { foreignKey: 'facilityId' });
};
