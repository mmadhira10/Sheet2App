const express = require('express')
const router = express.Router()
const AppController = require('../controllers/app-controller')
const SheetsController = require('../controllers/sheets-controller')


//Create Routes
router.post('/createApp', AppController.createApp)
router.post('/createTable/:appId', AppController.createTable)
router.post('/createView/:appId', AppController.createView)


//Sheets API requests
router.post('/getDataFromURL', SheetsController.getDataFromURL);
router.post('/getDataFromURLCol', SheetsController.getDataFromURLCol);
router.post('/getColumnsFromURL', SheetsController.getColumnsFromURL);
// router.post('/generateTable', AppController.generateTable);


//Get Routes
router.get('/getApps', AppController.getApps);
router.get('/getTables', AppController.getTables);
router.get('/getViews', AppController.getViews);

//Get Routes using App ID
router.get('/getTables/:appId', AppController.getTablesByAppId);
router.get('/getViews/:appId', AppController.getViewsByAppId);

//Update Routes
router.post('/updateApp/:appId', AppController.updateApp);
router.post('/updateTable', AppController.updateTable);
router.post('/updateView', AppController.updateView);

router.post('/getReferencedTable', AppController.getReferencedTable);



module.exports = router
