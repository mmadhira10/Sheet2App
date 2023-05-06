const App = require('../models/app-schema')
const View = require('../models/view-schema')
const Table = require('../models/table-schema')

const fs = require('fs').promises
const path = require('path')
const process = require('process')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')
const { getDataFromSheetID } = require('./sheets-controller')

const sheets = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_API_KEY,
})

const createApp = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  const finishedBody = {
    ...body,
    published: false,
  }

  const newApp = new App(finishedBody)
  if (!newApp) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }

  try {
    const savedApp = await newApp.save()
    //console.log(savedApp)
    return res.status(200).json({
      success: true,
      app: savedApp,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const updateApp = async (req, res) => {
  const appId = req.params.appId
  const body = req.body
  if (!body) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const updatedApp = await App.findOneAndUpdate({ _id: appId }, body, {
      new: true,
    })
    return res.status(200).json({
      success: true,
      app: updatedApp,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getApps = async (req, res) => {
  console.log('72')
  try {
    const apps = await App.find()
    // console.log(apps)
    return res.status(200).json({
      success: true,
      apps: apps,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const deleteApp = async (req, res) => {
  const appId = req.params.appId
  if (!appId) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const app = await App.findById(appId);
    const delViews = await View.deleteMany({ _id: { $in: app.views } });
    const delTables = await Table.deleteMany({ _id: { $in: app.tables } });
    const appDeletedCount = await App.deleteOne({ _id: appId });
    return res.status(200).json({
      success: true,
      delViews: delViews,
      delTables: delTables,
      appDeletedCount: appDeletedCount,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const isGlobalDevCreator = async (req, res) => {
  let isCreator = false;
  //const email = req.user.email;
  const email = req.params.email;
  //console.log("GLOBAL DEV: " + email);
  if (!email) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const url = process.env.GLOBAL_DEV_LIST_URL;
    //console.log(url);
    if (!url) {
      return res.status(400).json({
        errorMessage: 'Improperly formatted request',
      })
    }
    spid = url.split('/')[5]
    sid = url.split('/')[6].substring(9)
    const data = await getDataFromSheetID(spid, sid, 'COLUMNS')
    //console.log('getDataFromSheetID for GLOBAL DEV output: ', data)
    let column = data[0];
    for (let i = 0; i < column.length; i++) {
      const element = column[i]
      //console.log(element);
      if (element === email) {
        isCreator = true;
      }
    }
    return res.status(200).json({
      success: true,
      isCreator: isCreator,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getMyApps = async(req, res) => {
  const email = req.params.email
  if (!email) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const apps = await App.find() // gets all apps in db
    //console.log(apps);
    let creatorAppsID = [];
    let devAppsID = [];
    let endUserAppsID = [];
    let myApps = [];
    for (let index = 0; index < apps.length; index++) {
      let added = false;
      const app = apps[index]
      if (app.creator === email) {
        myApps.push(app);
        creatorAppsID.push(app._id);
        added = true;
      }
      const url = app.role_membership_sheet;
      if (!url) {
        return res.status(400).json({
          errorMessage: 'Improperly formatted request',
        })
      }
      spid = url.split('/')[5];
      sid = url.split('/')[6].substring(9);
      const data = await getDataFromSheetID(spid, sid, 'COLUMNS');
      //console.log('getDataFromSheetID output: ', data);
      // if data is just a 2d array
      let devFound = isDev(data, email);
      let endUserFound = isEndUser(data, email);
      if (devFound == true) {
        if(added == false) {
          myApps.push(app);
          added = true;
        }
        devAppsID.push(app._id);
      }
      if (endUserFound == true) {
        if(app.published == true) {
          //end users only see the app if its published
          if(added == false) {
            myApps.push(app);
          }
          endUserAppsID.push(app._id);
        }
      }
    }

    return res.status(200).json({
      success: true,
      apps: myApps,
      cAppsID: creatorAppsID,
      dAppsID: devAppsID,
      euAppsID: endUserAppsID
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getCreatorApps = async (req, res) => {
  const email = req.params.email
  //console.log(email)
  if (!email) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const apps = await App.find() // gets all apps in db
    //console.log(apps);
    let creatorApps = [];
    let creatorAppsID = [];
    for (let index = 0; index < apps.length; index++) {
      const app = apps[index]
      if (app.creator === email) {
        creatorApps.push(app);
        creatorAppsID.push(app._id);
      }
    }
    return res.status(200).json({
      success: true,
      apps: creatorApps,
      appsID: creatorAppsID
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getRoleApps = async (req, res) => {
  //console.log("this is get role apps v");
  const email = req.params.email
  //console.log(email)
  if (!email) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const apps = await App.find() // gets all apps in db
    let filteredApps = [];
    let filteredAppsID = [];
    for (let index = 0; index < apps.length; index++) {
      const app = apps[index]
      const url = app.role_membership_sheet
      if (!url) {
        return res.status(400).json({
          errorMessage: 'Improperly formatted request',
        })
      }
      spid = url.split('/')[5]
      sid = url.split('/')[6].substring(9)

      const data = await getDataFromSheetID(spid, sid, 'COLUMNS')
      //console.log('getDataFromSheetID output: ', data)
      // if data is just a 2d array
      let found = isEndUser(data, email);
      if (found == true) {
        //console.log('found email: ', found)
        //user is an end user of this app
        if(app.published == true) {
          //end user can only see the app if it is published
          filteredApps.push(app);
          filteredAppsID.push(app._id);
        }
      }
    }
    //console.log('all filtered apps', filteredApps)
    return res.status(200).json({
      success: true,
      apps: filteredApps,
      appsID: filteredAppsID,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getDevApps = async (req, res) => {
  const email = req.params.email
  //console.log(email)
  if (!email) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const apps = await App.find() // gets all apps in db
    let filteredApps = [];
    let filteredAppsID = [];
    for (let index = 0; index < apps.length; index++) {
      const app = apps[index];
      const url = app.role_membership_sheet;
      if (!url) {
        return res.status(400).json({
          errorMessage: 'Improperly formatted request',
        })
      }
      spid = url.split('/')[5];
      sid = url.split('/')[6].substring(9);
      const data = await getDataFromSheetID(spid, sid, 'COLUMNS');
      //console.log('getDataFromSheetID output: ', data);
      // if data is just a 2d array
      let found = isDev(data, email);
      if (found == true) {
        //console.log('found email: ', found)
        filteredApps.push(app);
        filteredAppsID.push(app._id);
      }
    }
    //console.log('all filtered apps', filteredApps)
    return res.status(200).json({
      success: true,
      apps: filteredApps,
      appsID: filteredAppsID
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getRoleType = async (roleSheet, email) => {
  let roleType = ''
  for (let i = 0; i < roleSheet.length; i++) {
    const column = roleSheet[i]
    for (let j = 0; j < column.length; j++) {
      const arrEmail = column[j]
      if (arrEmail === email) {
        roleType = column[0]
        return roleType
      }
    }
  }
  return null
}

const isEndUser = (roleSheet, email) => {
  let endUser = false;
  //start i at 1 to skip the first column (dev column)
  for (let i = 1; i < roleSheet.length; i++) {
    const column = roleSheet[i]
    for (let j = 0; j < column.length; j++) {
      const arrEmail = column[j]
      if (arrEmail === email) {
        // console.log('is end user');
        // console.log(column);
        endUser = true;
        return endUser;
      }
    }
  }
  return endUser;

}

const isDev = (roleSheet, email) => {
  let dev = false;
  const devColumn = roleSheet[0]; //developers column
  for(let i = 0; i < devColumn.length; i++) {
    let devEmail = devColumn[i];
    if (devEmail == email) {
      // console.log("is dev");
      // console.log(devColumn);
      dev = true;
      return dev;
    }
  }
  return dev;
}

const createTable = async (req, res) => {
  const appId = req.params.appId
  const body = req.body
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
    const savedTable = await newTable.save()
    const updatedApp = await App.findOneAndUpdate(
      { _id: appId },
      { $push: { tables: savedTable._id } },
      { new: true }
    )
    return res.status(200).json({
      success: true,
      table: savedTable,
      app: updatedApp,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getTables = async (req, res) => {
  try {
    const tables = await Table.find()
    return res.status(200).json({
      success: true,
      tables: tables,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getTablesByAppId = async (req, res) => {
  const appId = req.params.appId
  // console.log(req);
  if (!appId) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const foundApp = await App.findOne({ _id: appId }).populate('tables')
    return res.status(200).json({
      success: true,
      tables: foundApp.tables,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const updateTable = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const updatedTable = await Table.findOneAndUpdate({ _id: body._id }, body, {
      new: true,
    })
    return res.status(200).json({
      success: true,
      table: updatedTable,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const createView = async (req, res) => {
  const appId = req.params.appId
  const body = req.body
  if (!body) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  const newView = new View(body)
  if (!newView) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }

  try {
    const savedView = await newView.save()
    const updatedApp = await App.findOneAndUpdate(
      { _id: appId },
      { $push: { views: savedView._id } },
      { new: true }
    )
    return res.status(200).json({
      success: true,
      view: savedView,
      app: updatedApp,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getViews = async (req, res) => {
  try {
    const views = await View.find()
    return res.status(200).json({
      success: true,
      views: views,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getViewsByAppId = async (req, res) => {
  const appId = req.params.appId
  if (!appId) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const foundApp = await App.findOne({ _id: appId }).populate('views')
    return res.status(200).json({
      success: true,
      views: foundApp.views,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const updateView = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const updatedView = await View.findOneAndUpdate({ _id: body._id }, body, {
      new: true,
    })
    return res.status(200).json({
      success: true,
      view: updatedView,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const deleteView = async (req, res) => {
  const viewId = req.params.viewId
  if (!viewId) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  try {
    const deletedView = await View.findOneAndDelete({ _id: viewId })
    return res.status(200).json({
      success: true,
      view: deletedView,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}


const getReferencedTable = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }

  //currently returns one table because the columsn only had one wth a reference, not sure if multiple references are possible
  try {
    let refTable = await Table.findOne({ _id: body._id }).populate({
      path: 'columns',
      populate: {
        path: 'reference',
      },
    })
    return res.status(200).json({
      success: true,
      table: refTable,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getUserRoles = async (req, res) => {
  const user = req.user.emails[0].value;
  const url = req.body.url;

  if (!url) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }  
  
  spid = url.split('/')[5];
  sid = url.split('/')[6].substring(9);

  try {
    const roles = await getDataFromSheetID(spid, sid, 'COLUMNS');
    let user_roles = [];

    for (let i = 1; i < roles.length; i++ )
    {
        let curr_row = roles[i];
        if( curr_row.includes(user) )
        {
          user_roles.push(roles[i][0]);
        }
    }
    return res.status(200).json({
      roles: user_roles
    });
  }
  catch(error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

module.exports = {
  createApp,
  updateApp,
  getApps,
  deleteApp,
  createTable,
  updateTable,
  getTables,
  createView,
  updateView,
  getViews,
  deleteView,
  getReferencedTable,
  getTablesByAppId,
  getViewsByAppId,
  getRoleApps,
  getCreatorApps,
  getDevApps,
  isGlobalDevCreator,
  getUserRoles,
  getMyApps
}
