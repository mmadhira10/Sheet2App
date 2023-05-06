const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')

// const sheets = google.sheets({
//   version: 'v4',
//   auth: process.env.GOOGLE_API_KEY,
// })

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
  const body = req.body
  if (!body) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  const url = body.url
  const newRec = body.data;
  if (!url) {
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  let SPREADSHEET_ID = url.split('/')[5]
  let SHEET_ID = url.split('/')[6].substring(9)

  

  try {
    const { sheets } = await authSheets()


    const spsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      });

    const sheetName = spsheet.data.sheets.filter(sheet => sheet.properties.sheetId == SHEET_ID)[0].properties.title;

    const updateResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [newRec],
      },
    })

    // const updateResponse = await sheets.spreadsheets.values.batchUpdateByDataFilter({
    //   spreadsheetId: SPREADSHEET_ID,
    //   resource: {
    //     data: [
    //       {
    //         dataFilter: {
    //           gridRange: {
    //             sheetId: SHEET_ID,
    //           },
    //         },
    //         values: [newRec],
    //       }
    //     ],
    //   }
    // })

    return res.status(200).json({
      success: true,
      updateResponse: updateResponse,
    })
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const deleteRecord = async (req, res) => {
  const body = req.body
  if (!body) {
    console.log("first error");
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }
  const url = body.url;
  const index = body.index;
  if (!url) {
    console.log("second error");
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

    const result = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: SHEET_ID, // replace with your sheet ID
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
    // console.log(error);
    return res.status(400).json({
      errorMessage: error,
    })
  }
}

const editRecord = async (req, res) => {
  const body = req.body
  if (!body) {
    console.log(body)
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }

  const url = body.url;
  const index = body.index;
  const record = body.record;
  const types = body.types;

  if (!url) {
    console.log(body);
    return res.status(400).json({
      errorMessage: 'Improperly formatted request',
    })
  }

  let spid = url.split('/')[5]
  let sid = url.split('/')[6].substring(9)
  try {
    const { sheets } = await authSheets()

    const SPREADSHEET_ID = spid;
    const SHEET_ID = sid;
    const result = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            updateCells: {
              start: {
                sheetId: SHEET_ID,
                rowIndex: index,
                columnIndex: 0
              },
              rows: [
                {
                  values: record.map((value, key) => {
                    if (value == '') {
                      return { userEnteredValue: { stringValue: value } };
                    } if (value.startsWith('=')) {
                      return { userEnteredValue: { formulaValue: value } };
                    } else if (types[key] == "Boolean") {
                      return { userEnteredValue: { boolValue: Boolean(value)}};
                    } else if (types[key] == "Number") {
                      return { userEnteredValue: { numberValue: Number(value) } };
                    } else {
                      return { userEnteredValue: { stringValue: value } };
                    }                  
                  }),
                },
              ],
              fields: 'userEnteredValue',
            },
          },
        ],
      },
    })
    return res.status(200).json({
      success: true,
      result: result,
    })
  } catch (error)
  {
    console.log(error)
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
  editRecord
}
