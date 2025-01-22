const { models } = require('../data');
const { calculateCurrentValue } = require('../util/calc');

// Retrieves data for financial report
const getFinancial = async (facility) => {
    try {

        const depreciationRate = await models.setting.findOne({
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
                'initialvalue',
                'eol',
                'createdAt',
                'updatedAt'
            ],
            include: [
                {
                    model: models.unit,
                    attributes: ['id', 'name'],
                    include: {
                        model: models.facility,
                        attributes: ['id', 'name']
                    }
                },
                {
                    model: models.template,
                    attributes: ['name']
                }
            ]
        };

        if (facility) {
            queryOptions.include[0].where = { id: facility }
        };

        const items = await models.item.findAll(queryOptions);

        const report = items.map(item => {
            const currentValue = calculateCurrentValue(item.initialvalue, item.createdAt, depreciationRate);

            return {
                id: item.id,
                name: item.name,
                facilityId: item.unit.facility.id,
                facilityName: item.unit.facility.name,
                unitId: item.unit.id,
                unitName: item.unit.name,
                templateName: item.template.name,
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

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' })
    };
};

// Retrieves data for inventory report
const getInventory = async (facility) => {
    try {

        const depreciationRate = await models.setting.findOne({
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
                'initialvalue',
                'eol',
                'createdAt',
                'updatedAt'
            ],
            include: [
                {
                    model: models.unit,
                    attributes: ['id', 'name'],
                    include: {
                        model: models.facility,
                        attributes: ['id', 'name']
                    }
                },
                {
                    model: models.user,
                    as: 'addedbyuser',
                    attributes: ['name']
                },
                {
                    model: models.comment,
                    attributes: [
                        'userId',
                        'createdAt',
                        'comment'
                    ],
                    include: {
                        model: models.user,
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
        };

        const items = await models.item.findAll(queryOptions);

        const report = items.map(item => {
            const currentValue = calculateCurrentValue(item.initialvalue, item.createdAt, depreciationRate);
            const lastComment = item.comments[0] || {};

            return {
                id: item.id,
                name: item.name,
                facilityId: item.unit.facility.id,
                facilityName: item.unit.facility.name,
                unitId: item.unit.id,
                unitName: item.unit.name,
                vendor: item.vendor,
                invoice: item.invoice,
                addedBy: item.addedbyuser.name,
                status: item.status,
                inspectedBy: lastComment.user ? lastComment.user.name : null,
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
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Retrieves data for EoL report
const getEol = async (facility, startDate, endDate) => {
    try {
        const depreciationRate = await models.setting.findOne({
            attributes: ['value'],
            where: { name: 'depreciationRate' }
        });

        const queryOptions = {
            attributes: [
                'id',
                'name',
                'vendor',
                'invoice',
                'initialvalue',
                'eol',
                'status',
                'createdAt',
                'updatedAt'
            ],
            include: [
                {
                    model: models.unit,
                    attributes: ['id', 'name'],
                    include: {
                        model: models.facility,
                        attributes: ['id', 'name']
                    }
                }
            ]
        };

        if (facility) {
            queryOptions.include[0].where = { id: facility };
        };

        const items = await models.item.findAll(queryOptions);

        const eolItems = items.filter(item => {
            const itemEol = new Date(item.eol);
            return itemEol >= startDate && itemEol <= endDate;
        });

        const report = eolItems.map(item => {
            const currentValue = calculateCurrentValue(item.initialvalue, item.createdAt, depreciationRate);
            return {
                id: item.id,
                name: item.name,
                facilityId: item.unit.facility.id,
                facilityName: item.unit.facility.name,
                unitId: item.unit.id,
                unitName: item.unit.name,
                vendor: item.vendor,
                invoice: item.invoice,
                initalValue: item.initialvalue,
                currentValue: currentValue,
                eol: item.eol,
                status: item.status,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            };
        });

        return report;

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Retrieves data for dashboard summary
exports.getSummary = async (req, res, next) => {
    try {
        const data = await models.facility.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                    model: models.unit,
                    attributes: ['id', 'name'],
                    include: {
                        model: models.item,
                        attributes: [
                            'id',
                            'name',
                            'initialvalue',
                            'donated',
                            'vendor',
                            'eol',
                            'status',
                            'createdat',
                            'updatedat'
                        ],
                        include: [{
                            model: models.template,
                            attributes: ['id', 'name'],
                            include: {
                                model: models.icon,
                                attributes: [
                                    'id',
                                    'src',
                                    'name',
                                    'alt'
                                ],
                                as: 'iconAssociation'
                            }
                        }, {
                            model: models.user,
                            attributes: ['id', 'name'],
                            as: 'addedbyuser',
                            paranoid: false
                        }, {
                            model: models.comment,
                            attributes: [
                                'id',
                                'comment',
                                'createdat'
                            ],
                            include: {
                                model: models.user,
                                attributes: ['id', 'name'],
                                paranoid: false
                            }
                        }]
                    }
                }
            ]
        });

        const depreciationRate = await models.setting.findOne({
            attributes: ['value'],
            where: { name: 'depreciationRate' }
        });

        const overview = data.map(facility => {
            let totalValue = 0;
            const itemCount = {};

            facility.units.forEach(unit => {
                unit.items.forEach(item => {
                    totalValue += +calculateCurrentValue(item.initialvalue, item.createdat, depreciationRate);

                    if (!itemCount[item.template.id]) {
                        itemCount[item.template.id] = {
                            id: item.template.id,
                            name: item.template.name,
                            icon: {
                                id: item.template.iconAssociation.id,
                                src: item.template.iconAssociation.src,
                                name: item.template.iconAssociation.name,
                                alt: item.template.iconAssociation.alt
                            },
                            count: 1
                        };
                    } else {
                        itemCount[item.template.id].count++;
                    };
                });
            });

            const units = facility.units.map(unit => ({
                id: unit.id,
                name: unit.name,
                items: unit.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    invoice: item.invoice,
                    vendor: item.vendor,
                    template: {
                        id: item.template.id,
                        name: item.template.name,
                        icon: {
                            id: item.template.iconAssociation.id,
                            src: item.template.iconAssociation.src,
                            name: item.template.iconAssociation.name,
                            alt: item.template.iconAssociation.alt
                        }
                    },
                    eol: item.eol,
                    status: item.status,
                    addedBy: {
                        id: item.addedbyuser.id,
                        name: item.addedbyuser.name
                    },
                    commentRecord: item.comments ? item.comments.map(comment => ({
                        id: comment.id,
                        inspectedBy: {
                            id: comment.user.id,
                            name: comment.user.name
                        },
                        comment: comment.comment,
                        createdAt: comment.createdat
                    })) : [],
                    value: {
                        initialValue: item.initialvalue,
                        donated: item.donated,
                        currentValue: calculateCurrentValue(item.initialvalue, item.createdat, depreciationRate),
                    },
                    createdAt: item.createdat,
                    updatedAt: item.updatedat
                }))
            }));

            return {
                id: facility.id,
                facility: facility.name,
                totalValue: totalValue,
                itemCount: Object.values(itemCount),
                units: units
            };
        });

        return res.status(200).json(overview);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
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
    };

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
        };

        const eolReport = await getEol(facility, eolStart, eolEnd);

        return res.status(200).json(eolReport);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error generating report' });
    }
};