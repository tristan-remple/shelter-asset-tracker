const { models } = require('../data');
const { calculateCurrentValue } = require('../utils/calc');

exports.getSummary = async (req, res, next) => {
    try {
        const data = await models.Facility.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                    model: models.Unit,
                    attributes: ['id', 'name'],
                    include: {
                        model: models.Item,
                        attributes: [
                            'id',
                            'name',
                            'templateId',
                            'initialValue',
                            'donated',
                            'vendor',
                            'depreciationRate',
                            'toDiscard',
                            'toInspect',
                            'createdAt',
                            'updatedAt'
                        ],
                        include: [{
                            model: models.Template,
                            attributes: ['id', 'name']
                        }, {
                            model: models.User,
                            attributes: ['id', 'name'],
                            as: 'addedByUser'
                        }, {
                            model: models.User,
                            attributes: ['id', 'name'],
                            as: 'inspectedByUser',
                            required: false
                        }]
                    }
                }
            ]
        });

        
        const overview = data.map(facility => {
            let totalValue = 0;
            const itemCount = {};

            facility.Units.forEach(unit => {
                unit.Items.forEach(item => {
                    totalValue += +calculateCurrentValue(item.initialValue, item.depreciationRate, item.createdAt);

                    if (!itemCount[item.templateId]) {
                        itemCount[item.templateId] = {
                            id: item.templateId,
                            name: item.Template.name,
                            count: 1
                        };
                    } else {
                        itemCount[item.templateId].count++;
                    }
                });
            });

            const units = facility.Units.map(unit => ({
                id: unit.id,
                name: unit.name,
                items: unit.Items.map(item => ({
                    id: item.id,
                    name: item.name,
                    templateId: item.templateId,
                    template: item.Template.name,
                    initialValue: item.initialValue,
                    currentValue: calculateCurrentValue(item.initialValue, item.depreciationRate, item.createdAt),
                    donated: item.donated,
                    vendor: item.vendor,
                    depreciationRate: item.depreciationRate,
                    toDiscard: item.toDiscard,
                    toInspect: item.toInspect,
                    addedBy: item.addedBy,
                    lastInspected: item.lastInspected,
                    inspectedBy: item.inspectedBy,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }))
            }));

            return {
                id: facility.id,
                facility: facility.name,
                totalValue,
                itemCount: Object.values(itemCount),
                units
            }
        });

        res.status(200).json(overview);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.'})
    }
};

exports.exportAll = async (req, res, next) => {

};

exports.exportFinancial = async (req, res, next) => {

};

exports.exportInventory = async (req, res, next) => {

};

exports.exportEOL = async (req, res, next) => {

};