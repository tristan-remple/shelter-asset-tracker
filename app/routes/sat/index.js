const express = require('express');
const router = express.Router();
const { login, logout, reset } = require('../../controllers/sessionController');
const auth = require('../../middleware/auth');

/*SAT Main Routes*/
const facilitiesRouter = require('./facilities');
const itemsRouter = require('./items');
const templateRouter = require('./templates');
const unitsRouter = require('./units');
const usersRouter = require('./users');
const reportsRouter = require('./reports');

// Middleware for SAT routes
router.use('/facilities', auth, facilitiesRouter);
router.use('/items', auth, itemsRouter);
router.use('/templates', auth, templateRouter);
router.use('/units', auth, unitsRouter);
router.use('/users', auth, usersRouter);

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
