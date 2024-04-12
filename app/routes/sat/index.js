const express = require('express');
const router = express.Router();
const { login, logout } = require('../../controllers/sessionController');
const { createNewUser } = require('../../controllers/userController')
const auth = require('../../middleware/auth');
const register = require('../../middleware/register');

/*SAT Routes*/
const commentsRouter = require('./comments');
const facilitiesRouter = require('./facilities');
const itemsRouter = require('./items');
const templateRouter = require('./templates');
const unitsRouter = require('./units');
const usersRouter = require('./users');

router.use('/comments', auth, commentsRouter);
router.use('/facilities', auth, facilitiesRouter);
router.use('/items', auth, itemsRouter);
router.use('/templates', auth, templateRouter);
router.use('/units', auth, unitsRouter);
router.use('/users', auth, usersRouter);

/*SAT Session Routes*/
router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register, createNewUser); 

/*SAT API Index*/
router.get('/', (req, res) => {
  res.send('Shelter Asset Tracker API');
});

module.exports = router;
