const express = require('express');
const ToughtController = require('../controllers/ToughtController');
const { checkAuth } = require('../helpers/auth');
const router = express.Router();
//Helper
const auth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth, ToughtController.createTought)
router.post('/add', checkAuth, ToughtController.createToughtSave)
router.get('/dashboard', checkAuth, ToughtController.dashboard)
router.get('/', ToughtController.showToughts)


module.exports = router