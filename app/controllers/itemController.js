const { models } = require('../data');

const calculateCurrentValue = (initialValue, depreciationRate, createdAt) => {
  const currentDate = new Date();
  const quartersElapsed = (currentDate.getFullYear() - createdAt.getFullYear()) * 4 + Math.floor((currentDate.getMonth() - createdAt.getMonth()) / 3);
  return (initialValue * Math.pow((1 - depreciationRate), quartersElapsed)).toFixed(2);
};

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
              'initialValue',
              'depreciationRate',
              'toDiscard',
              'toInspect',
              'addedBy',
              'inspectedBy',
              'lastInspected',
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
                  model: models.User,
                  attributes: ['id', 'name'],
                  as: 'inspectedByUser',
                  required: false
              },
              {
                  model: models.Template,
                  attributes: ['id', 'name']
              },
              {
                  model: models.Comment,
                  attributes: [
                      'id',
                      'userId',
                      'comment',
                      'archive',
                      'createdAt',
                      'updatedAt'
                  ],
                  required: false,
                  include: {
                      model: models.User,
                      attributes: ['id', 'name']
                  }
              }
          ]
      })

      if (!item) {
          return res.status(404).json({ message: 'Item not found.' });
      }

      const currentValue = calculateCurrentValue(item.initialValue, item.depreciationRate, item.createdAt);

      const itemProfile = {
          id: item.id,
          name: item.name,
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
          comments: item.Comments.map(comment => ({
              id: comment.id,
              userId: comment.userId,
              userName: comment.User.name,
              comment: comment.comment,
              archive: comment.archive,
              createdAt: comment.createdAt,
              updatedAt: comment.updatedAt
          })),
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
      const { unitId, name, initialValue, depreciationRate, toDiscard, toInspect } = req.body;

      const item = await models.Item.findByPk(itemId);

      if (!item) {
          return res.status(404).json({ error: 'Item not found.' });
      }

      item.set({
          unitId: unitId,
          name: name,
          initialValue: initialValue,
          depreciationRate: depreciationRate,
          toDiscard: toDiscard,
          toInspect: toInspect
      });

      const updateResponse = {
          id: item.id,
          name: item.name,
          initialValue: item.initialValue,
          depreciationRate: item.depreciationRate,
          toAssess: item.toAssess,
          toDiscard: item.toDiscard,
          currentValue: calculateCurrentValue(item.initialValue, item.depreciationRate, item.createdAt),
          inspectedBy: item.inspectedBy,
          lastInspected: item.lastInspected,
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
      const { name, unitId, templateId, donated, initialValue, depreciationRate, addedBy } = req.body;

      const newItem = await models.Item.create({
          name: name,
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