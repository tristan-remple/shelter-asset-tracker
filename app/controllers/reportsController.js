const { models } = require('../data');
const { calculateCurrentValue } = require('../util/calc');

const getFinancial = async (facility) => {

    const depreciationRate = await models.Setting.findOne({
        attributes: ['value'],
        where: { name: 'depreciationRate' }
    });

    const queryOptions = {
        attributes: [
            'id',
            'name',
            'vendor',
            'invoice',
            'donated',
            'initialValue',
            'eol',
            'createdAt',
            'updatedAt'
        ],
        include: [
            {
                model: models.Unit,
                attributes: ['id', 'name'],
                include: {
                    model: models.Facility,
                    attributes: ['id', 'name']
                }
            },
            {
                model: models.Template,
                attributes: ['name']
            }
        ]
    };

    if (facility) {
        queryOptions.include[0].where = { id: facility }
    };

    const items = await models.Item.findAll(queryOptions);

    const report = items.map(item => {
        const currentValue = calculateCurrentValue(item.initialValue, item.createdAt, depreciationRate);

        return {
            id: item.id,
            name: item.name,
            facilityId: item.Unit.Facility.id,
            facilityName: item.Unit.Facility.name,
            unitId: item.Unit.id,
            unitName: item.Unit.name,
            templateName: item.Template.name,
            vendor: item.vendor,
            invoice: item.invoice,
            donated: item.donated,
            currentValue: currentValue,
            eol: item.eol,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        };
    });

    return report;
}

const getInventory = async (facility) => {

    const depreciationRate = await models.Setting.findOne({
        attributes: ['value'],
        where: { name: 'depreciationRate' }
    });

    const queryOptions = {
        attributes: [
            'id',
            'name',
            'vendor',
            'invoice',
            'status',
            'donated',
            'initialValue',
            'eol',
            'createdAt',
            'updatedAt'
        ],
        include: [
            {
                model: models.Unit,
                attributes: ['id', 'name'],
                include: {
                    model: models.Facility,
                    attributes: ['id', 'name']
                }
            },
            {
                model: models.User,
                as: 'addedByUser',
                attributes: ['name']
            },
            {
                model: models.Comment,
                attributes: [
                    'userId',
                    'createdAt',
                    'comment'
                ],
                include: {
                    model: models.User,
                    attributes: ['name']
                },
                required: false,
                order: [['createdAt', 'DESC']],
                limit: 1
            }
        ]
    };

    if (facility) {
        queryOptions.include[0].where = { id: facility };
    }

    const items = await models.Item.findAll(queryOptions);

    const report = items.map(item => {
        const currentValue = calculateCurrentValue(item.initialValue, item.createdAt, depreciationRate);
        const lastComment = item.Comments[0] || {};

        return {
            id: item.id,
            name: item.name,
            facilityId: item.Unit.Facility.id,
            facilityName: item.Unit.Facility.name,
            unitId: item.Unit.id,
            unitName: item.Unit.name,
            vendor: item.vendor,
            invoice: item.invoice,
            addedBy: item.addedByUser.name,
            status: item.status,
            inspectedBy: lastComment.User ? lastComment.User.name : null,
            lastComment: lastComment.createdAt ? lastComment.createdAt : null,
            comment: lastComment.comment ? lastComment.comment : null,
            eol: item.eol,
            currentValue: currentValue,
            donated: item.donated,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt

        };
    });

    return report;

};

const getEol = async (facility, startDate, endDate) => {

    const depreciationRate = await models.Setting.findOne({
        attributes: ['value'],
        where: { name: 'depreciationRate' }
    });

    const queryOptions = {
        attributes: [
            'id',
            'name',
            'vendor',
            'invoice',
            'initialValue',
            'eol',
            'status',
            'createdAt',
            'updatedAt'
        ],
        include: [
            {
                model: models.Unit,
                attributes: ['id', 'name'],
                include: {
                    model: models.Facility,
                    attributes: ['id', 'name']
                }
            }
        ]
    };

    if (facility) {
        queryOptions.include[0].where = { id: facility };
    }

    const items = await models.Item.findAll(queryOptions);

    const eolItems = items.filter(item => {
        const itemEol = new Date(item.eol);
        return itemEol >= startDate && itemEol <= endDate;
    });

    const report = eolItems.map(item => {
        const currentValue = calculateCurrentValue(item.initialValue, item.createdAt, depreciationRate);
        return {
            id: item.id,
            name: item.name,
            facilityId: item.Unit.Facility.id,
            facilityName: item.Unit.Facility.name,
            unitId: item.Unit.id,
            unitName: item.Unit.name,
            vendor: item.vendor,
            invoice: item.invoice,
            initalValue: item.initialValue,
            currentValue: currentValue,
            eol: item.eol,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }
    });

    return report;
}

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
                            as: 'addedByUser',
                            paranoid: false
                        }, {
                            model: models.Comment,
                            attributes: [
                                'id',
                                'comment',
                                'createdAt'
                            ],
                            include: {
                                model: models.User,
                                attributes: ['id', 'name'],
                                paranoid: false
                            }
                        }]
                    }
                }
            ]
        });

        const depreciationRate = await models.Setting.findOne({
            attributes: ['value'],
            where: { name: 'depreciationRate' }
        });

        const overview = data.map(facility => {
            let totalValue = 0;
            const itemCount = {};

            facility.Units.forEach(unit => {
                unit.Items.forEach(item => {
                    totalValue += +calculateCurrentValue(item.initialValue, item.createdAt, depreciationRate);

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
                    commentRecord: item.Comments ? item.Comments.map(comment => ({
                        id: comment.id,
                        inspectedBy: {
                            id: comment.User.id,
                            name: comment.User.name
                        },
                        comment: comment.comment,
                        createdAt: comment.createdAt
                    })) : [],
                    value: {
                        initialValue: item.initialValue,
                        donated: item.donated,
                        currentValue: calculateCurrentValue(item.initialValue, item.createdAt, depreciationRate),
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
        return res.status(500).json({ error: 'Server error.' })
    }
};

exports.exportAll = async (req, res, next) => {
    try {
        const { facility, startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Invalid date.' });
        };

        const eolStart = new Date(startDate);
        const eolEnd = new Date(endDate);

        if (isNaN(eolStart.getTime()) || isNaN(eolEnd.getTime())) {
            return res.status(400).json({ error: 'Invalid date.' });
        };

        const financialReport = await getFinancial(facility);
        const inventoryReport = await getInventory(facility);
        const eolReport = await getEol(facility, eolStart, eolEnd);

        const reports = {
            financial: financialReport,
            inventory: inventoryReport,
            eol: eolReport
        };

        return res.status(200).json(reports);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error generating report' });
    }
};

exports.exportFinancial = async (req, res, next) => {
    try {
        const { facility } = req.body;
        const financialReport = await getFinancial(facility);

        return res.status(200).json(financialReport);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error generating report' });
    };
};

exports.exportInventory = async (req, res, next) => {

    try {
        const { facility } = req.body;
        const inventoryReport = await getInventory(facility);

        return res.status(200).json(inventoryReport);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error generating report' });
    }

};

exports.exportEOL = async (req, res, next) => {

    try {
        const { facility, startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Invalid date.' });
        };

        const eolStart = new Date(startDate);
        const eolEnd = new Date(endDate);

        if (isNaN(eolStart.getTime()) || isNaN(eolEnd.getTime())) {
            return res.status(400).json({ error: 'Invalid date.' });
        }

        const eolReport = await getEol(facility, eolStart, eolEnd);

        return res.status(200).json(eolReport);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error generating report' });
    }
};