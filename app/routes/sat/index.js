const express = require('express');
const router = express.Router();

/*SAT Routes*/
const commentsRouter = require('./comments');
const facilitiesRouter = require('./facilities');
const itemsRouter = require('./items');
const templateRouter = require('./templates');
const unitsRouter = require('./units');
const usersRouter = require('./users');

router.use('/comments', commentsRouter);
router.use('/facilities', facilitiesRouter);
router.use('/items', itemsRouter);
router.use('/templates', templateRouter);
router.use('/units', unitsRouter);
router.use('/users', usersRouter);

/*SAT API Index*/
router.get('/', (req, res) => {
  res.send('Shelter Asset Tracker API');
});

module.exports = router;
