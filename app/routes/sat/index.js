const express = require('express');
const router = express.Router();
const { login, logout, reset } = require('../../controllers/sessionController');

/*SAT Main Routes*/
const authorizeRouter = require('./authorize');
const facilitiesRouter = require('./facilities');
const iconsRouter = require('./icons');
const itemsRouter = require('./items');
const templateRouter = require('./templates');
const unitsRouter = require('./units');
const usersRouter = require('./users');
const reportsRouter = require('./reports');

// Middleware for SAT routes

router.use('/facilities', facilitiesRouter);
router.use('/icons', iconsRouter);
router.use('/items', itemsRouter);
router.use('/templates', templateRouter);
router.use('/units', unitsRouter);
router.use('/users/authorize', authorizeRouter);
router.use('/users', usersRouter);

/*SAT Session Routes*/
router.post('/login', login);
router.post('/logout', logout);
router.put('/reset/:id', reset);

/*Report Routes*/
router.use('/reports', reportsRouter);

/*SAT API Index*/
router.get('/', (req, res) => {
  res.send('Shelter Asset Tracker API');
});

module.exports = router;
