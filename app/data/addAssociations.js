/*
    Define associations between Sequelize models.
 */
module.exports = (sequelize) => {
    const { facility, facilityauth, icon, comment, item, template, unit, unittype, user } = sequelize.models;

    // User to Facility
    user.hasMany(facility, { foreignKey: 'managerid', onDelete: 'RESTRICT' });
    facility.belongsTo(user, { foreignKey: 'managerid', onDelete: 'SET NULL' });

    // User to FacilityAuth
    user.hasMany(facilityauth, { foreignKey: 'userid', onDelete: 'CASCADE' });
    facilityauth.belongsTo(user, { foreignKey: 'userid', onDelete: 'CASCADE' });

    // Facility to FacilityAuth
    facility.hasMany(facilityauth, { foreignKey: 'facilityid', onDelete: 'CASCADE' });
    facilityauth.belongsTo(facility, { foreignKey: 'facilityid', onDelete: 'CASCADE' });

    // Facility to Unit
    facility.hasMany(unit, { foreignKey: 'facilityid', onDelete: 'RESTRICT' });
    unit.belongsTo(facility, { foreignKey: 'facilityid', onDelete: 'CASCADE' });

    // Unit to Item
    unit.hasMany(item, { foreignKey: 'unitid', onDelete: 'RESTRICT' });
    item.belongsTo(unit, { foreignKey: 'unitid', onDelete: 'CASCADE' });

    // Template to Item
    template.hasMany(item, { foreignKey: 'templateid', onDelete: 'RESTRICT' });
    item.belongsTo(template, { foreignKey: 'templateid', onDelete: 'SET NULL' });

    // User to Item (addedBy)
    user.hasMany(item, { foreignKey: 'addedby', as: 'addedbyuser', onDelete: 'SET NULL' });
    item.belongsTo(user, { foreignKey: 'addedby', as: 'addedbyuser', onDelete: 'SET NULL' });

    // User to Comment
    user.hasMany(comment, { foreignKey: 'userid', onDelete: 'SET NULL' });
    comment.belongsTo(user, { foreignKey: 'userid', onDelete: 'SET NULL' });

    // Item to Comment
    item.hasMany(comment, { foreignKey: 'itemid', onDelete: 'CASCADE' });
    comment.belongsTo(item, { foreignKey: 'itemid', onDelete: 'CASCADE' });

    // Icon to Template
    icon.hasMany(template, { foreignKey: 'iconid', onDelete: 'SET NULL' });
    template.belongsTo(icon, { foreignKey: 'iconid', onDelete: 'SET NULL' });

    //UnitType to Unit
    unittype.hasMany(unit, { foreignKey: 'type', onDelete: 'SET NULL' });
    unit.belongsTo(unittype, { foreignKey: 'type', onDelete: 'SET NULL' });
};
