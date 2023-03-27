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
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    try {
        const updatedApp = await App.findOneAndUpdate({_id:body._id}, body, {new:true});
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

const getDataFromSheetID = async (spid,sid, dim) => {
    const SPREADSHEET_ID = spid;
    const SHEET_ID = sid;
    // TODO: replace above values with real IDs.

    const spsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
        });

    console.log(sid);
    
    const sheetName = spsheet.data.sheets.filter(sheet => sheet.properties.sheetId == SHEET_ID)[0].properties.title;

    
    const sheet = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: sheetName,
        majorDimension: dim
        });
    
    
  
    return sheet.data.values;
  }


const getDataFromURL = async (req, res) => {
    const url = req.body.url;
    if (!url) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    spid = url.split('/')[5];
    sid = url.split('/')[6].substring(9);

    //console.log(sid);
    

    try {
        const data = await getDataFromSheetID(spid,sid, 'ROWS');
        console.log(data)
        return res.status(200).json({
            success: true,
            data: data
        })
    }
    catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}

const getDataFromURLCol = async (req, res) => {
    const url = req.body.url;
    if (!url) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    spid = url.split('/')[5];
    sid = url.split('/')[6].substring(9);

    //console.log(sid);
    

    try {
        const data = await getDataFromSheetID(spid,sid, 'COLUMNS');
        console.log(data)
        return res.status(200).json({
            success: true,
            data: data
        })
    }
    catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}

const getColumnsFromURL = async (req, res) => {
    const url = req.body.url;
    if (!url) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    spid = url.split('/')[5];
    sid = url.split('/')[6].substring(9);

    try {
        const data = await getDataFromSheetID(spid,sid, 'ROWS');
        const columns = data[0];
        return res.status(200).json({
            success: true,
            columns: columns
        })
    }
    catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}

    

const getDataFromURLAndSheetName = async (req, res) => {
    const url = req.body.url;
    const sname = req.body.sname;
    if (!url) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    spid = url.split('/')[5];
    console.log(spid);
    console.log(sname)


    try {
        const spdata = await sheets.spreadsheets.values.get({
            spreadsheetId: spid,
            range: sname,
          });
        //console.log(res.data);
        const data = spdata.data.values;

        console.log(data)
        
        return res.status(200).json({
            success: true,
            data: data
        })
    }
    catch (error) {
        //console.log("error here")
        return res.status(400).json({
            errorMessage: error
        })
    }
}










// const generateTable = async (req, res) => {
//     const url = req.body.url;
//     if (!url) {
//         return res.status(400).json({
//             errorMessage: 'Improperly formatted request',
//         })
//     }

//     const res = await sheets.spreadsheets.values.get({
//         spreadsheetId: url,
//         range: ''


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
    const appid = req.params.appid;
    if (!appid) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    try {
        const foundApp = await App.findOne({appid:appid}).populate('views');
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
        const updatedView = View.findOneAndUpdate({_id:body._id}, body, {new:true});
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
    getDataFromURL,
    getDataFromURLCol,
    getDataFromURLAndSheetName,
    getColumnsFromURL,
    getTablesByAppId,
    getViewsByAppId
}

