const { models, Sequelize } = require('../data');

exports.getSettings = async (req, res, next) => {
    try {
        const settings = await models.Setting.findAll();
        const unitTypes = await models.UnitType.findAll();

        if (!settings || !unitTypes) {
            return res.status(404).json({ message: 'Settings not found.' });
        };

        req.data = {
            settings: settings,
            unitTypes: unitTypes
        };

        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.updateSettings = async (req, res, next) => {
    try {
        const { depreciationRate, unitTypes, name, url, logoSrc } = req.body;

        if (!depreciationRate || !unitTypes || !name || !url || !logoSrc) {
            return res.status(400).json({ error: 'Missing expected settings.' })
        }

        const settingsToUpdate = {
            depreciationRate,
            name,
            url,
            logoSrc,
        };

        for (const setting of req.data.settings) {
            if (settingsToUpdate.hasOwnProperty(setting.name)) {
                const updated = await models.Setting.update(
                    { value: settingsToUpdate[setting.name] },
                    { where: { name: setting.name } }
                );
                setting.value = settingsToUpdate[setting.name];
            }
        }

        const currentUnitTypes = req.data.unitTypes.map(type => type.name);

        const addedUnitTypes = unitTypes.filter(unitType => !currentUnitTypes.includes(unitType));
        const removedUnitTypes = currentUnitTypes.filter(unitType => !unitTypes.includes(unitType));

        for (const unitType of addedUnitTypes) {
            await models.UnitType.create({ name: unitType });
            currentUnitTypes.push(unitType);
        }

        for (const unitType of removedUnitTypes) {
            await models.UnitType.destroy({ where: { name: unitType } });
            const index = currentUnitTypes.indexOf(unitType);
            if (index > -1) {
                currentUnitTypes.splice(index, 1);
            }
        }

        req.data.unitTypes = currentUnitTypes;

        next();

    } catch (err) {
        console.error(err);
        if (err.name = 'SequelizeForeignKeyConstraintError') {
            return res.status(405).json({ error: 'Dependency error.' })
        }
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.sendSettings = async (req, res, next) => {
    const settingsData = req.data.settings;
    const unitTypes = req.data.unitTypes;

    const settings = settingsData.map(setting => {
        return { name: setting.name, value: setting.value }
    });

    const settingsResponse = {
        settings: settings,
        unitTypes: unitTypes
    }

    return res.status(200).json(settingsResponse);
}