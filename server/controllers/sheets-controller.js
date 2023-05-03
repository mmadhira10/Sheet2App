const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')

const sheets = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_API_KEY,
})

async function authSheets() {
  //Function for authentication object
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  //Create client instance for auth
  const authClient = await auth.getClient()

  //Instance of the Sheets API
  const sheets = google.sheets({ version: 'v4', auth: authClient })

  return {
    auth,
    authClient,
    sheets,
  }
}

const getDataFromSheetID = async (spid, sid, dim) => {
  const { sheets } = await authSheets()

  const SPREADSHEET_ID = spid
  const SHEET_ID = sid
  // TODO: replace above values with real IDs.

  const sheetData = await sheets.spreadsheets.values.batchGetByDataFilter({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      majorDimension: dim,
      dataFilters: [
        {
          gridRange: {
            sheetId: SHEET_ID,
          },
        },
      ],
    },
  })
  return sheetData.data.valueRanges[0].valueRange.values
}

const getDataFromURL = async (req, res) => {
  const url = req.body.url
  if (!url) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  spid = url.split('/')[5]
  sid = url.split('/')[6].substring(9)

  //console.log(sid);

  try {
    const data = await getDataFromSheetID(spid, sid, 'ROWS')
    return res.status(200).json({
      success: true,
      data: data,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getDataFromURLCol = async (req, res) => {
  const url = req.body.url
  if (!url) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  spid = url.split('/')[5]
  sid = url.split('/')[6].substring(9)

  //console.log(sid);

  try {
    const data = await getDataFromSheetID(spid, sid, 'COLUMNS')
    return res.status(200).json({
      success: true,
      data: data,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const getColumnsFromURL = async (req, res) => {
  const url = req.body.url
  if (!url) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }

  spid = url.split('/')[5]
  sid = url.split('/')[6].substring(9)

  try {
    const data = await getDataFromSheetID(spid, sid, 'ROWS')
    const columns = data[0]
    return res.status(200).json({
      success: true,
      columns: columns,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const addRecord = async (req, res) => {
  const url = req.body.url
  const data = req.body.data
  if (!url) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  spid = url.split('/')[5]
  sid = url.split('/')[6].substring(9)

  try {
    const { sheets } = await authSheets()

    const SPREADSHEET_ID = spid
    const SHEET_ID = sid

    const sheetData = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        majorDimension: dim,
        values: [data],
      },
    })
    return res.status(200).json({
      success: true,
      sheetData: sheetData,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const deleteRecord = async (req, res) => {
  const url = req.body.url
  const index = req.body.index
  if (!url) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  spid = url.split('/')[5]
  sid = url.split('/')[6].substring(9)

  try {
    const { sheets } = await authSheets()

    const SPREADSHEET_ID = spid
    const SHEET_ID = sid

    const result = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: SPREADSHEET_ID, // replace with your sheet ID
                dimension: 'ROWS',
                startIndex: index,
                endIndex: index + 1,
              },
            },
          },
        ],
      },
    })
    return res.status(200).json({
      success: true,
      result: result,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

module.exports = {
  getDataFromURL,
  getColumnsFromURL,
  getDataFromURLCol,
  getDataFromSheetID,
  addRecord,
  deleteRecord,
}
