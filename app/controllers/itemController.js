const { models, Sequelize } = require('../data');
const { calculateCurrentValue, getEoL } = require('../util/calc');

// Retrieves all items
exports.getAllItems = async (req, res, next) => {
    try {
        const items = await models.item.findAll();
        return res.json(items);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    };
};

// Retrieves a specific item by its ID
exports.getItemById = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const item = await models.item.findOne({
            attributes: [
                'id',
                'name',
                'invoice',
                'vendor',
                'donated',
                'initialvalue',
                'eol',
                'status',
                'addedby',
                'startdate',
                'createdat',
                'updatedat'
            ],
            where: { id: itemId },
            include: [{
                model: models.unit,
                attributes: ['id', 'name'],
                include: {
                    model: models.facility,
                    attributes: ['id', 'name']
                }
            },
            {
                model: models.user,
                attributes: ['id', 'name'],
                as: 'addedbyuser',
                paranoid: false
            },
            {
                model: models.template,
                attributes: ['id', 'name'],
                paranoid: false
            },
            {
                model: models.comment,
                attributes: [
                    'id',
                    'comment',
                    'createdat'
                ],
                include: [{
                    model: models.user,
                    attributes: ['id', 'name'],
                    paranoid: false,
                },
                {
                    model: models.attachment,
                    attributes: [
                        'id', 
                        'src', 
                        'createdat'
                    ]
                }
            ],
                order: [['createdat', 'DESC']]
            }
            ]
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        req.data = item;
        req.facility = item.unit.facility.id;
        next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Sends a single item's data in a detailed format
exports.sendItem = async (req, res, next) => {
    const item = req.data;
    const depreciationRate = await models.setting.findOne({
        attributes: ['value'],
        where: { name: 'depreciationRate' }
    });
    const currentValue = calculateCurrentValue(item.initialvalue, item.startdate, depreciationRate);
    const itemProfile = {
        id: item.id,
        name: item.name,
        invoice: item.invoice,
        vendor: item.vendor,
        unit: {
            id: item.unit.id,
            name: item.unit.name,
            facility: {
                id: item.unit.facility.id,
                name: item.unit.facility.name
            }
        },
        template: {
            id: item.template.id,
            name: item.template.name
        },
        addedBy: {
            id: item.addedbyuser.id,
            name: item.addedbyuser.name,
        },
        commentRecord: item.comments ? item.comments.map(comment => ({
            id: comment,
            inspectedBy: {
                id: comment.user.id,
                name: comment.user.name
            },
            comment: comment.comment,
            createdAt: comment.createdat,
            attachments: comment.attachments
        })) : [],
        value: {
            initialValue: item.initialvalue,
            donated: item.donated,
            currentValue: currentValue,
        },
        eol: item.eol,
        status: item.status,
        startDate: item.startdate,
        createdAt: item.createdat,
        updatedAt: item.updatedat
    };

    return res.status(200).json(itemProfile);
};

// Creates a new item
exports.createNewItem = async (req, res, next) => {
    try {
        const { name, invoice, vendor, unitId, templateId, donated, initialValue, usefulLifeOffset, addedBy } = req.body;
        if (!name || !invoice || !vendor || !unitId || !templateId || donated === undefined || !initialValue || !usefulLifeOffset || !addedBy) {
            return res.status(400).json({ error: 'Bad request.' });
        };

        const newItem = await models.item.create({
            name: name,
            invoice: invoice,
            vendor: vendor,
            unitid: unitId,
            templateid: templateId,
            donated: donated,
            initialvalue: initialValue,
            eol: getEoL(usefulLifeOffset),
            addedby: addedBy,
            status: 'ok'
        });

        await newItem.set({ startdate: newItem.createdat });
        await newItem.save();

        const createResponse = {
            itemId: newItem.id,
            name: newItem.name,
            invoice: newItem.invoice,
            vendor: newItem.vendor,
            unit: newItem.unitid,
            templateId: newItem.templateid,
            donated: newItem.donated,
            initialValue: newItem.initialvalue,
            addedBy: newItem.addedby,
            eol: newItem.eol,
            success: true
        };

        return res.status(201).json(createResponse);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Updates an item's details, including comments and EOL calculation
exports.updateItem = async (req, res, next) => {
    try {
        const item = req.data;
        const { name, invoice, vendor, initialValue, usefulLifeOffset, status, comment, newUnit, filename, date, startDate, createdAt } = req.body;

        if (comment !== '') {
            const newComment = await models.comment.create({
                comment: comment,
                itemid: item.id,
                userid: req.userId
            });

            if (filename) {
                await models.attachment.create({
                        src: `${date}-${filename}`,
                        commentid: newComment.id
                });
            };
        };

        await item.set({
            name: name,
            invoice: invoice,
            vendor: vendor,
            initialvalue: initialValue,
            eol: getEoL(usefulLifeOffset, item.eol),
            status: status,
            unitid: newUnit,
            startdate: startDate,
            createdat: new Date(createdAt)
        });

        const depreciationRate = await models.setting.findOne({
            attributes: ['value'],
            where: { name: 'depreciationRate' }
        });

        await item.save();
        const updateResponse = {
            id: item.id,
            name: item.name,
            invoice: item.invoice,
            vendor: item.vendor,
            donates: item.donated,
            initialValue: item.initialvalue,
            eol: item.eol,
            status: item.status,
            currentValue: calculateCurrentValue(item.initialvalue, item.startdate, depreciationRate),
            startDate: item.startDate,
            success: true
        };

        return res.status(200).json(updateResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
};

// Verifies the facility associated with a unit
exports.checkFacility = async (req, res, next) => {
    const facility = await models.unit.findOne({
        where: { id: req.body.unitId },
        include: {
            model: models.facility,
            attributes: ['id']
        }
    });

    req.facility = facility.facility.id;
    next();
};

// Deletes an item
exports.deleteItem = async (req, res, next) => {
    try {
        const item = req.data;
        const deletedItem = await item.destroy();

        const deleteResponse = {
            itemid: deletedItem.id,
            name: deletedItem.name,
            deleted: deletedItem.deletedat,
            success: true
        };

        return res.status(200).json(deleteResponse);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error.' });
    };
};

// Retrieves deleted items
exports.getDeleted = async (req, res, next) => {
    try {
        const deletedItems = await models.item.findAll({
            where: Sequelize.where(Sequelize.col('item.deletedat'), 'IS NOT', null),
            include: [{
                model: models.unit,
                attributes: ['name'],
                include: {
                    model: models.facility,
                    attributes: ['name']
                }}, {
                    model: models.template,
                    attributes: ['name']
            }],
            paranoid: false
        });

        return res.status(200).json(deletedItems);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};

exports.emptyDeleted = async (req, res, next) => {
    try {
        const deletedItems = await models.item.findAll({
            where: Sequelize.where(Sequelize.col('item.deletedat'), 'IS NOT', null),
            paranoid: false
        });

        if (deletedItems.length === 0) {
            return res.status(404).json({ message: 'No deleted items found.' });
        }

        await models.item.destroy({
            where: {
                id: deletedItems.map(item => item.id)
            }
        });

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

// Restores a previously deleted item
exports.restoreDeleted = async (req, res, next) => {
    try {
        const itemId = req.params.id;

        const deletedItem = await models.item.findOne({
            where: { id: itemId },
            include: [{
                model: models.unit,
                attributes: ['name'],
                include: {
                    model: models.facility,
                    attributes: ['name']
                }
            }, {
                model: models.template,
                attributes: ['name'],
                paranoid: false
            }],
            paranoid: false
        });

        if (!deletedItem || !deletedItem.deletedat) {
            return res.status(404).json({ error: 'Deleted item not found.' });
        };

        await deletedItem.restore();

        const restoreResponse = {
            item: deletedItem,
            success: true
        };

        return res.status(200).json(restoreResponse);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error.' });
    };
};