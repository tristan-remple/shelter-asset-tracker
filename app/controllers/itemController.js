const { models } = require('../data');
const { verifyToken } = require('../utils/token');
const { calculateCurrentValue } = require('../utils/calc');

exports.getAllItems = async (req, res, next) => {
  try {
      const items = await models.Item.findAll();
      res.json(items);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
};

exports.getItemById = async (req, res, next) => {
  try {
      const itemId = req.params.id;
      console.log(itemId)
      const item = await models.Item.findOne({
          attributes: [
              'id',
              'name',
              'invoice',
              'vendor',
              'initialValue',
              'depreciationRate',
              'toDiscard',
              'toInspect',
              'addedBy',
              'createdAt',
              'updatedAt',
              'deletedAt'
          ],
          where: { id: itemId },
          include: [{
                  model: models.Unit,
                  attributes: ['id', 'name'],
                  include: {
                      model: models.Facility,
                      attributes: ['id', 'name']
                  }
              },
              {
                  model: models.User,
                  attributes: ['id', 'name'],
                  as: 'addedByUser'
              },
              {
                  model: models.Template,
                  attributes: ['id', 'name']
              },
              {
                  model: models.Inspection,
                  attributes: [
                      'id',
                      'userId',
                      'itemId',
                      'comment',
                      'createdAt'
                  ],
                  include: {
                      model: models.User,
                      attributes: ['id', 'name']
                  },
                  order: [['createdAt', 'DESC']]
              }
          ]
      })

      console.log(item)
      console.log(item.Inspection)

      if (!item) {
          return res.status(404).json({ message: 'Item not found.' });
      }

      const currentValue = calculateCurrentValue(item.initialValue, item.depreciationRate, item.createdAt);

      const itemProfile = {
          id: item.id,
          name: item.name,
          invoice: item.invoice,
          vendor: item.vendor,
          unit: {
              id: item.Unit.id,
              name: item.Unit.name,
              facility: {
                  id: item.Unit.Facility.id,
                  name: item.Unit.Facility.name
              }
          },
          template: {
              id: item.Template.id,
              name: item.Template.name,
              icon: item.Template.icon
          },
          addedBy: {
              id: item.addedByUser.id,
              name: item.addedByUser.name,
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
        //   addedBy: {
        //       id: item.addedByUser.id,
        //       name: item.addedByUser.name,
        //   },
          inspected: item.inspectedByUser ? {
              id: item.inspectedByUser.id,
              name: item.inspectedByUser.name,
              date: item.lastInspected
          } : null,
          value: {
              initialValue: item.initialValue,
              donated: item.donated,
              depreciationRate: item.depreciationRate,
              currentValue: currentValue,
          },
          toInspect: item.toInspect,
          toDiscard: item.toDiscard,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
      };

      res.status(200).json(itemProfile);

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error.' });
  }
};

exports.updateItem = async (req, res, next) => {
  try {
      const itemId = req.params.id;
      const { unitId, name, invoice, vendor, initialValue, depreciationRate, toDiscard, toInspect } = req.body;

      const token = req.cookies.authentication;
      const decoded = await verifyToken(token);
      const userId = decoded.id;

      const item = await models.Item.findByPk(itemId);

      if (!item) {
          return res.status(404).json({ error: 'Item not found.' });
      }

      if (item.toInspect != toInspect && toInspect == false){
         item.set({
            inspectedBy: userId,
            lastInspected: new Date()
        });
      }

      item.set({
          unitId: unitId,
          name: name,
          invoice: invoice,
          vendor: vendor,
          initialValue: initialValue,
          depreciationRate: depreciationRate,
          toDiscard: toDiscard,
          toInspect: toInspect
      });

      const updateResponse = {
          id: item.id,
          name: item.name,
          invoice: item.invoice,
          vendor: item.vendor,
          initialValue: item.initialValue,
          depreciationRate: item.depreciationRate,
          toAssess: item.toAssess,
          toDiscard: item.toDiscard,
          currentValue: calculateCurrentValue(item.initialValue, item.depreciationRate, item.createdAt),
          success: true
      }

      await item.save();

      res.status(200).json(updateResponse);

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error.' });
  }
};

exports.createNewItem = async (req, res, next) => {
  try {
      const { name, invoice, vendor, unitId, templateId, donated, initialValue, depreciationRate, addedBy } = req.body;

      const newItem = await models.Item.create({
          name: name,
          invoice: invoice,
          vendor: vendor,
          unitId: unitId,
          templateId: templateId,
          donated: donated,
          initialValue: initialValue,
          depreciationRate: depreciationRate,
          addedBy: addedBy,
          inspectedBy: addedBy,
          lastInspected: new Date(),
          toInspect: false,
          toDiscard: false
      });

      const createResponse = {
          itemId: newItem.id,
          name: newItem.name,
          invoice: invoice,
          vendor: vendor,
          unit: newItem.unitId,
          templateId: newItem.templateId,
          donated: newItem.donated,
          initialValue: newItem.initialValue,
          depreciationRate: newItem.depreciationRate,
          inspectedBy: newItem.inspectedBy,
          lastInspected: newItem.lastInspected,
          addedBy: newItem.addedBy,
          success: true
      };

      res.status(201).json(createResponse);

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error.' });
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
      const itemId = req.params.id;
      const { name } = req.body;

      const item = await models.Item.findByPk(itemId);

      if (!item || item.name !== name) {
          return res.status(400).json({ error: 'Item not found.' });
      }

      const deletedItem = await item.destroy();

      const deleteResponse = {
          itemId: deletedItem.id,
          name: deletedItem.name,
          deleted: deletedItem.deletedAt,
          success: true
      }

      res.status(200).json(deleteResponse);

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error.' });
  }
};