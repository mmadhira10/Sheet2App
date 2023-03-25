const App = require('../models/app-schema')
const View = require('../models/view-schema')
const Table = require('../models/table-schema')

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

const getApps = async (req, res) => {
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
        return res.status(200).json({
            success: true,
            table: savedTable
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
        return res.status(200).json({
            success: true,
            view: savedView
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
    getApps,
    createTable,
    updateTable,
    getTables,
    createView,
    getViews,
    getReferencedTable
}

