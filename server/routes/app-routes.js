const express = require('express')
const router = express.Router()
const AppController = require('../controllers/app-controller')

router.post('/createApp', AppController.createApp)

module.exports = router
