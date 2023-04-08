const App = require('../models/app-schema')
const View = require('../models/view-schema')
const Table = require('../models/table-schema')

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const sheets = google.sheets({
    version: 'v4',
    auth: process.env.GOOGLE_API_KEY
})

const createApp = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    const finishedBody = {
        ...body,
        published: false
    }

    const newApp = new App(finishedBody);
    if (!newApp) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    try {
        const savedApp = await newApp.save();
        console.log(savedApp);
        return res.status(200).json({
            success: true,
            app: savedApp
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}

const updateApp = async (req, res) => {
    const appId = req.params.appId;
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    try {
        const updatedApp = await App.findOneAndUpdate({_id:appId}, body, {new:true});
        return res.status(200).json({
            success: true,
            app: updatedApp
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}


const getApps = async (req, res) => {
    // console.log(req.session);
    try {  
        const apps = await App.find();
        return res.status(200).json({
            success: true,
            apps: apps
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}

const createTable = async (req, res) => {
    const appId = req.params.appId;
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    const newTable = new Table(body);
    if (!newTable) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    try {
        const savedTable = await newTable.save();
        const updatedApp = await App.findOneAndUpdate({_id:appId}, {$push: {tables: savedTable._id}}, {new:true});
        return res.status(200).json({
            success: true,
            table: savedTable,
            app: updatedApp
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}



const getTables = async (req, res) => {
    try {
        const tables = await Table.find();
        return res.status(200).json({
            success: true,
            tables: tables
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}

const getTablesByAppId = async (req, res) => {
    const appId = req.params.appId;
    if (!appId) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    try {
        const foundApp = await App.findOne({_id:appId}).populate('tables');
        return res.status(200).json({
            success: true,
            tables: foundApp.tables
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}



const updateTable = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    try {
        const updatedTable = await Table.findOneAndUpdate({_id:body._id}, body, {new:true});
        return res.status(200).json({
            success: true,
            table: updatedTable
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}

const createView = async (req, res) => {
    const appId = req.params.appId;
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    const newView = new View(body);
    if (!newView) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    try {
        const savedView = await newView.save();
        const updatedApp = await App.findOneAndUpdate({_id:appId}, {$push: {views: savedView._id}}, {new:true});
        return res.status(200).json({
            success: true,
            view: savedView,
            app: updatedApp
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}

const getViews = async (req, res) => {
    try {
        const views = await View.find();
        return res.status(200).json({
            success: true,
            views: views
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}

const getViewsByAppId = async (req, res) => {
    const appId = req.params.appId;
    console.log(appId)
    if (!appId) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    try {
        const foundApp = await App.findOne({_id:appId}).populate('views');
        return res.status(200).json({
            success: true,
            views: foundApp.views
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}


const updateView = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    try {
        console.log("updateview")
        console.log(body)
        const updatedView = await View.findOneAndUpdate({_id:body._id}, body, {new:true});
        return res.status(200).json({
            success: true,
            view: updatedView
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })

    }
}



//
const getReferencedTable = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    //currently returns one table because the columsn only had one wth a reference, not sure if multiple references are possible
    try {
        let refTable = await Table.findOne({_id:body._id}).populate({
            path: 'columns',
            populate: {
                path: 'reference',
            }
        });
        return res.status(200).json({
            success: true,
            table: refTable
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}



module.exports = {
    createApp,
    updateApp,
    getApps,
    createTable,
    updateTable,
    getTables,
    createView,
    updateView,
    getViews,
    getReferencedTable,
    getTablesByAppId,
    getViewsByAppId
}

