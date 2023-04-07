const express = require('express')
const router = express.Router()
const AppController = require('../controllers/app-controller')
const { verifyUser } = require("../auth/verify.js");

//Create Routes
router.post('/createApp', verifyUser, AppController.createApp)
router.post('/createTable/:appId', verifyUser, AppController.createTable)
router.post('/createView/:appId', verifyUser, AppController.createView)


//Sheets API requests
router.post('/getDataFromURL', verifyUser, AppController.getDataFromURL);
router.post('/getDataFromURLCol', verifyUser, AppController.getDataFromURLCol);
router.post('/getDataFromURLAndSheetName', verifyUser, AppController.getDataFromURLAndSheetName);
router.post('/getColumnsFromURL', verifyUser, AppController.getColumnsFromURL);
// router.post('/generateTable', AppController.generateTable);


//Get Routes
router.get('/getApps', verifyUser, AppController.getApps);
router.get('/getTables', verifyUser, AppController.getTables);
router.get('/getViews', verifyUser, AppController.getViews);

//Get Routes using App ID
router.get('/getTables/:appId', AppController.getTablesByAppId);
router.get('/getViews/:appId', verifyUser, AppController.getViewsByAppId);

//Update Routes
router.post('/updateApp/:appId', verifyUser, AppController.updateApp);
router.post('/updateTable', verifyUser, AppController.updateTable);
router.post('/updateView', verifyUser, AppController.updateView);

router.post('/getReferencedTable', verifyUser, AppController.getReferencedTable);



module.exports = router
