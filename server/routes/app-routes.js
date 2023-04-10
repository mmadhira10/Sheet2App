const express = require('express')
const router = express.Router()
const AppController = require('../controllers/app-controller')
const { verifyUser } = require('../auth/verify.js')
const SheetsController = require('../controllers/sheets-controller')

//Create Routes
router.post('/createApp', verifyUser, AppController.createApp)
router.post('/createTable/:appId', verifyUser, AppController.createTable)
router.post('/createView/:appId', verifyUser, AppController.createView)

//Sheets API requests
router.post('/getDataFromURL', verifyUser, SheetsController.getDataFromURL)
router.post(
  '/getDataFromURLCol',
  verifyUser,
  SheetsController.getDataFromURLCol
)
router.post(
  '/getColumnsFromURL',
  verifyUser,
  SheetsController.getColumnsFromURL
)
// router.post('/generateTable', AppController.generateTable);

//Get Routes
router.get('/getApps', verifyUser, AppController.getApps)
router.get(
  '/isGlobalDevCreator/:email',
  verifyUser,
  AppController.isGlobalDevCreator
)
router.get('/getRoleApps/:email', verifyUser, AppController.getRoleApps)
router.get('/getCreatorApps/:email', verifyUser, AppController.getCreatorApps)
router.get('/getTables', verifyUser, AppController.getTables)
router.get('/getViews', verifyUser, AppController.getViews)

//Get Routes using App ID
router.get('/getTables/:appId', AppController.getTablesByAppId)
router.get('/getViews/:appId', verifyUser, AppController.getViewsByAppId)

//Update Routes
router.post('/updateApp/:appId', verifyUser, AppController.updateApp)
router.post('/updateTable', verifyUser, AppController.updateTable)
router.post('/updateView', verifyUser, AppController.updateView)

router.post('/getReferencedTable', verifyUser, AppController.getReferencedTable)

module.exports = router
