const { models, Sequelize } = require('../data');

exports.getSettings = async (req, res, next) => {
    try {
        const settings = await models.Setting.findAll();
        const unitTypes = await models.UnitType.findAll();

        if (!settings || !unitTypes) {
            return res.status(404).json({ message: 'Settings not found.'});
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
        const { depreciationRate, unitTypes, name, url, logoSrc } =  req.body;
        const settings = req.data.settings;
        const currentUnitTypes = req.data.unitTypes.map(type => type.name);

        if (!depreciationRate || !unitTypes || !name || !url || !logoSrc) {
            return res.status(400).json({ error: 'Bad request.'})
        }

        const settingsMap = {
            depreciationRate,
            name,
            url,
            logoSrc
        }

        for (const setting of settings) {
            if (settingsMap.hasOwnProperty(setting.name)) {
                setting.value = settingsMap[setting.name];
                await setting.save();
            }
        }

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
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.sendSettings = async (req, res, next) => {
    const settings = req.data.settings;
    const unitTypes = req.data.unitTypes;

    const settingsResponse = {};

    settings.forEach(setting => {
        switch (setting.name) {
            case 'depreciationRate':
                settingsResponse.depreciationRate = setting.value;
                break;
            case 'name':
                settingsResponse.name = setting.value;
                break;
            case 'url':
                settingsResponse.url = setting.value;
                break;
            case 'logoSrc':
                settingsResponse.logoSrc = setting.value;
                break;
            default:
                break;
        }
    });

    settingsResponse.unitTypes = unitTypes;

    return res.status(200).json(settingsResponse);
}