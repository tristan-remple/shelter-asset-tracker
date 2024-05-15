const { models } = require('../data');
const { calculateCurrentValue } = require('../util/calc');

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
                            'eol',
                            'status',
                            'createdAt',
                            'updatedAt'
                        ],
                        include: [{
                            model: models.Template,
                            attributes: ['id', 'name'],
                            include: {
                                model: models.Icon,
                                attributes: [
                                    'id',
                                    'src',
                                    'name',
                                    'alt'
                                ]
                            }
                        }, {
                            model: models.User,
                            attributes: ['id', 'name'],
                            as: 'addedByUser'
                        }, {
                            model: models.Inspection,
                            attributes: [
                                'id', 
                                'comment',
                                'createdAt'
                            ],
                            include: {
                                model: models.User,
                                attributes: ['id', 'name']
                            }
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
                    totalValue += +calculateCurrentValue(item.initialValue, item.createdAt);

                    if (!itemCount[item.templateId]) {
                        itemCount[item.templateId] = {
                            id: item.templateId,
                            name: item.Template.name,
                            icon: {
                                id: item.Template.Icon.id,
                                src: item.Template.Icon.src,
                                name: item.Template.Icon.name,
                                alt: item.Template.Icon.alt
                            },
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
                    invoice: item.invoice,
                    vendor: item.vendor,
                    template: {
                        id: item.Template.id,
                        name: item.Template.name,
                        icon: {
                            id: item.Template.Icon.id,
                            src: item.Template.Icon.src,
                            name: item.Template.Icon.name,
                            alt: item.Template.Icon.alt
                        }
                    },
                    eol: item.eol,
                    status: item.status,
                    addedBy: {
                        id: item.addedByUser.id,
                        name: item.addedByUser.name
                    },
                    inspectionRecord: item.Inspections ? item.Inspections.map(inspection => ({
                        id: inspection.id,
                        inspectedBy: {
                            id: inspection.User.id,
                            name: inspection.User.name
                        },
                        comment: inspection.comment,
                        createdAt: inspection.createdAt
                    })) : [],
                    value: {
                        initialValue: item.initialValue,
                        donated: item.donated,
                        currentValue: calculateCurrentValue(item.initialValue, item.createdAt),
                    },
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }))
            }));

            return {
                id: facility.id,
                facility: facility.name,
                totalValue: totalValue,
                itemCount: Object.values(itemCount),
                units: units
            }
        });

        return res.status(200).json(overview);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.'})
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