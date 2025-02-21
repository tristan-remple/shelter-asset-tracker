const express = require('express');
const router = express.Router();
const { login, logout, reset } = require('../../controllers/sessionController');

/*SAT Main Routes*/
const attachmentsRouter = require('./attachment');
const authorizeRouter = require('./authorize');
const facilitiesRouter = require('./facilities');
const itemsRouter = require('./items');
const templateRouter = require('./templates');
const unitsRouter = require('./units');
const usersRouter = require('./users');
const reportsRouter = require('./reports');
const settingsRouter = require('./settings');

// Middleware for SAT CRUD routes

router.use('/facilities', facilitiesRouter);
router.use('/attachments', attachmentsRouter);
router.use('/items', itemsRouter);
router.use('/templates', templateRouter);
router.use('/units', unitsRouter);
router.use('/authorize', authorizeRouter);
router.use('/users', usersRouter);

/*SAT Session Routes*/
router.post('/login', login);
router.post('/logout', logout);

/*Report Routes*/
router.use('/reports', reportsRouter);
/*Settings*/
router.use('/settings', settingsRouter);

/*SAT API Index*/
router.get('/', (req, res) => {
  res.send('Shelter Asset Tracker API');
});

module.exports = router;
