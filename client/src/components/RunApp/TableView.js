import React, { useEffect, useState, useContext } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import DetailView from './DetailView'

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import CreateRoundedIcon from '@mui/icons-material/CreateRounded'

import { GlobalStoreContext } from '../../store'
import AuthContext from '../../auth'
import api from '../../app-routes'

// const columns = ["First Name", "Last Name", "ID", "HW1", "HW2"];
// const rows = [["Sameer", "Khan", "1", "90", "95"], ["Moh", "How", "2", "100", "99"], ["Sid", "Sham", "3", "95", "96"],
// ["Mihir", "Mad", "4", "100", "100"] ];

export default function TableView(props) {
  const [colNames, setColNames] = useState([])
  const [rows, setRows] = useState([])
  const [URLs, setURLs] = useState([])
  // const { filter, setFilter } = setState([])
  const { view, table, detail } = props
  const { auth } = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  const [allColNames, setAllColNames] = useState([]) // stores all column headers
  const [tableRows, setTableRows] = useState([])
  const [openDetail, setOpenDetail] = useState(false)
  const [detailFilter, setDetailFilter] = useState(false)
  const [detailRecord, setDetailRecord] = useState([])

  //get data by rows
  //first row is column headings
  //can shift array to remove column headings array and then array.map each column
  async function getDataUrl() {
    try {
      const response = await api.post('/getDataFromURL', { url: table.URL })
      // console.log(response.data);
      let indicesCol = []
      let tableCol = response.data.data[0]
      let rowRes = response.data.data.toSpliced(0, 1) //get all rows except column names
      rowRes = filterOptions(rowRes, tableCol)
      setAllColNames(tableCol)
      setRows(rowRes)
      view.columns.forEach((name) => {
        indicesCol.push(response.data.data[0].indexOf(name))
      })

      let viewRows = []
      rowRes.forEach((arr) => {
        let val = indicesCol.map((i) => arr[i])
        viewRows.push(val)
      })
      // rowRes.shift();
      // console.log(tableCol);
      // console.log(tableRows);
      // console.log(rowRes)
      // rowRes = filterOptions(rowRes, tableCol);

      setTableRows(viewRows)
    } catch (error) {
      console.log(error)
    }
  }

  async function addRecordToSheet(row, table) {
    let updatedRecordArr = updateAddRecordArray(row)
    console.log(row, table)
    let body = {
      url: table.URL,
      data: updatedRecordArr,
    }
    console.log(body)
    try {
      const response = await api.post('/addRecord/', body)
      console.log(response)
    } catch (error) {}
  }

  function updateAddRecordArray(row) {
    let counter = 0
    let updatedArray = []
    for (let index = 0; index < allColNames.length; index++) {
      const tableColName = allColNames[index]
      let found = false
      for (let j = 0; j < colNames.length; j++) {
        const viewColName = colNames[j]
        if (viewColName === tableColName) {
          found = true
          updatedArray.push(row[counter])
          counter++
        }
      }
      if (found === false) {
        updatedArray.push(null)
      }
    }
    console.log(updatedArray)
    return updatedArray
  }

  async function deleteRecordFromSheet() {}

  function filterOptions(r, c) {
    let filter = view.filter
    let userFilter = view.user_filter
    if (filter != '') {
      let newArr = []
      let filterIndex = c.indexOf(filter)
      console.log('filter index is: ' + filterIndex)
      r.forEach(function (item) {
        if (item[filterIndex].toUpperCase() == 'TRUE') {
          newArr.push(item)
        }
      })
      r = newArr
    }

    if (userFilter != '') {
      let newArr = []
      let filterIndex = c.indexOf(userFilter)
      r.forEach(function (item) {
        if (item[filterIndex] == auth.email) {
          newArr.push(item)
        }
      })
      r = newArr
    }

    return r
  }

  function filterEditCols(rowIndex) {
    if (detail.edit_filter == '') {
      setDetailFilter(true)
    } else {
      let index = 0

      while (
        index < allColNames.length &&
        detail.edit_filter != allColNames[index]
      ) {
        index++
      }

      if (rows[rowIndex][index].toLowerCase() == 'false') {
        setDetailFilter(false)
      } else {
        setDetailFilter(true)
      }
    }
  }

  function handleOpenDetailModal(key) {
    setOpenDetail(true)

    let detailRows = []
    for (let i = 0; i < allColNames.length; i++) {
      detailRows.push([allColNames[i], rows[key][i]])
    }
    setDetailRecord(detailRows)

    filterEditCols(key)
  }

  function isURL() {
    let urlCol = []
    for (let i = 0; i < table.columns.length; i++) {
      if (table.columns[i].type == 'URL') {
        urlCol.push(table.columns[i].name)
        console.log('URL column found')
        console.log(table.columns[i].name)
      }
    }
    console.log(urlCol.length)
    let newURL = []
    if (urlCol.length > 0) {
      for (let i = 0; i < view.columns.length; i++) {
        if (urlCol.includes(view.columns[i])) {
          newURL.push(i)
          //console.log("URL column found");
        }
      }
    }
    setURLs(newURL)
  }

  useEffect(() => {
    //get the view data
    //getTables
    // console.log(table.URL);
    setColNames(view.columns)
    getDataUrl()
    isURL()
  }, [view])

  let del, delCol, add

  if (view.allowed_actions.includes('Add')) {
    add = (
      <Box sx={{ paddingTop: 5 }} align='center'>
        <Button
          variant='contained'
          sx={{ width: '75%' }}
          onClick={() => {
            setOpen(true)
          }}
        >
          Add Record
        </Button>
      </Box>
    )
  }

  if (view.allowed_actions.includes('Delete')) {
    del = (
      <TableCell sx={{ width: '50px' }} align='center'>
        <Button variant='contained'>
          <DeleteRoundedIcon />
        </Button>
      </TableCell>
    )
    delCol = (
      <TableCell align='center' style={{ fontWeight: 'bold' }}>
        Delete
      </TableCell>
    )
  }

  let det

  if (detail) {
    det = (
      <DetailView
        open={openDetail}
        setOpen={setOpenDetail}
        detail={detail}
        detailRecord={detailRecord}
        setDetailRecord={setDetailRecord}
        filter={detailFilter}
      />
    )
  }

  return (
    <div>
      {det}
      <Box sx={{ paddingBottom: 5 }}>
        <Typography
          sx={{ borderBottom: '2px solid black', width: '100%' }}
          variant='h2'
          align='center'
        >
          {view.name}
        </Typography>
      </Box>
      <TableContainer sx={{ maxWidth: '100%' }} component={Paper}>
        <Table sx={{}} aria-label='simple table'>
          <TableHead>
            <TableRow>
              {colNames.map((column, key) => (
                <TableCell
                  key={column}
                  align='center'
                  style={{ fontWeight: 'bold' }}
                >
                  {column}
                </TableCell>
              ))}
              {delCol}
              <TableCell align='center' style={{ fontWeight: 'bold' }}>
                Detail Views
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row, key) => (
              <TableRow>
                {row.map((value, key) => (
                  <TableCell align='center'>
                    {URLs.includes(key) ? (
                      <a href={value} target='_blank'>
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </TableCell>
                ))}
                {del}
                <TableCell sx={{ width: '150px' }} align='center'>
                  <Button
                    onClick={() => handleOpenDetailModal(key)}
                    variant='contained'
                    disabled={!detail}
                  >
                    Detail View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {add}
    </div>
  )
}
