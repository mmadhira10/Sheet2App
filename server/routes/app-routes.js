const express = require('express')
const router = express.Router()
const AppController = require('../controllers/app-controller')

router.post('/createApp', AppController.createApp)
router.post('/createTable', AppController.createTable)
router.post('/createView', AppController.createView)

router.get('/getApps', AppController.getApps);
router.get('/getTables', AppController.getTables);
router.get('/getViews', AppController.getViews);

router.post('/getReferencedTable', AppController.getReferencedTable);



module.exports = router
