import React, { useEffect, useState, useContext, useRef } from 'react'
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
import LinearProgress from '@mui/material/LinearProgress';
import DeleteModal from './DeleteModal';

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import CreateRoundedIcon from '@mui/icons-material/CreateRounded'

import { GlobalStoreContext } from '../../store'
import AuthContext from '../../auth'
import api from '../../app-routes'

// const columns = ["First Name", "Last Name", "ID", "HW1", "HW2"];
// const rows = [["Sameer", "Khan", "1", "90", "95"], ["Moh", "How", "2", "100", "99"], ["Sid", "Sham", "3", "95", "96"],
// ["Mihir", "Mad", "4", "100", "100"] ];

export default function TableView(props) {
    const [ colNames, setColNames ] = useState([]) // column names displayed
  const [tableRows, setTableRows] = useState([]) // rows displayed;
    const [ filteredRowsAllColumns, setFilteredRowsAllColumns ] = useState([]) // all the rows for the table
  const [allColNames, setAllColNames] = useState([]) // stores all column headers
    const [URLs, setURLs] = useState([]) // all the urls displayed
    // const { filter, setFilter } = setState([])
    const { view, table, allTables, matchedDetail, allDetail } = props;
    const { auth } = useContext(AuthContext);
    const [open, setOpen] = useState(false)
  const [openDetail, setOpenDetail] = useState(false) // opens the detail modal
  const [detailIndex, setDetailIndex] = useState(-1); 
  const [detailIndexMap, setDetailIndexMap] = useState([])
  const [detailFilter, setDetailFilter] = useState(false) // the edit filter
  const [detailRecord, setDetailRecord] = useState([]);

  const [openDelete, setOpenDelete] = useState(false); // opens the detail modal
  const [deleteIndex, setDeleteIndex] = useState(-1);

  //represents the current detail view (could be the matched detail or the reference detail)
  const [detail, setDetail] = useState(matchedDetail);
  const [detailTable, setDetailTable] = useState(table);

  const [refCols, setRefCols] = useState(new Map()) // stores reference columns
  //const refCols = new Map(); // stores reference columns
    const count = useRef(0);



  const [isLoading, setIsLoading] = useState(false);

    //get data by rows
    //first row is column headings
    //can shift array to remove column headings array and then array.map each column
    async function getDataUrl() {
        try {
            let newRefColMap = new Map();
            //const refCols = new Map();
            console.log("getDataUrl");

            //only add a refTable if there exists a detail view for that reference table
            let refTables = [];
            for (let i = 0;i<table.columns.length;i++) { 
                //for each column check if it's a reference colum
                let curCol = table.columns[i];
                if (Object.hasOwn(curCol,"reference") && curCol.reference !== "") {
                    //if it is a reference column, find the table it references and push it to the refTables array


                    let curRefTable = {};

                    //find the table that the reference column references

                    curRefTable.refTableModel = allTables.find(t => t._id === curCol.reference);
                    

                    //find the detail view that matches the reference table (same table id as ref table id)
                    let refDetail = allDetail.find(d => d.table === curRefTable.refTableModel._id);

                    if (refDetail) {
                        //if there is a detail view that matches the reference table, add it to the ref table object
                        curRefTable.refDetail = refDetail;
                        newRefColMap.set(curCol.name,curRefTable); //add the ref Column index and the ref Table object to the map

                        refTables.push(curRefTable);
                    }
                }
            }
            
            //for reference table, get the data from the url
            for (let i = 0; i<refTables.length;i++) {
                let curRefTable = refTables[i];
                //for each reference table, get the data from the url
                let refData = await api.post('/getDataFromURL', {url: refTables[i].refTableModel.URL});
                // get the key column by getting the index of the key column name in the first row of the data (the column name row)
                let keyColumnIndex = refData.data.data[0].indexOf(refTables[i].refTableModel.key);
                //get the label column by getting the index of the label column name in the first row of the data (the column name row)
                let labelColumnIndex = refTables[i].refTableModel.columns.findIndex(c => c.label == true);

                curRefTable.refData = refData.data.data;
                curRefTable.keyIndex = keyColumnIndex;
                curRefTable.labelIndex = labelColumnIndex;

                //create a map of every value in key column and the row it's in
                let refKeyMap = new Map();
                for (let i = 1; i<curRefTable.refData.length;i++) {
                    refKeyMap.set(curRefTable.refData[i][keyColumnIndex], i);
                }

                curRefTable.refKeyToRowMap = refKeyMap;

                //find a detail view that matches the reference table (same table id as ref table id)
                curRefTable.refDetail = allDetail.find(d => d.table === curRefTable.refTableModel._id);
                curRefTable.viewRowToRefRow = [];
            }

            

            const response = await api.post('/getDataFromURL', {url: table.URL});
            // console.log(response.data);
            let indicesCol = []
            // row of column names
            let tableCol = response.data.data[0];
            let allRows = response.data.data.toSpliced(0,1) //get all rows except column names
            let rowRes = filterOptions(allRows, tableCol);
            indexToIndexMap(rowRes, allRows, tableCol);

            setAllColNames(tableCol)
            setFilteredRowsAllColumns(rowRes)
            view.columns.forEach((name) => {
                //references
                indicesCol.push(response.data.data[0].indexOf(name)); //get the indices of the columns that will be included
            })

            

            let viewRows = [];
            rowRes.forEach((arr) => { 
                //for each column index, I need to check if they are a reference column
                //need to get the label index of the reference table
                let val = indicesCol.map((i) => {
                    let valAtIndex = arr[i];
                    let curColName = tableCol[i];
                    if (newRefColMap.has(curColName)) {
                        let curRefTable = newRefColMap.get(curColName);
                        let refKeyToRowMap = curRefTable.refKeyToRowMap;
                        let labelIndex = curRefTable.labelIndex;
                        let refRow = refKeyToRowMap.get(valAtIndex);
                        valAtIndex = curRefTable.refData[refRow][labelIndex];
                        curRefTable.viewRowToRefRow.push(refRow);
                    }
                    return valAtIndex;
                }
                ); //val is an array of a row of data
                
                viewRows.push(val);
            })
            setRefCols(newRefColMap);
            //rowRes.shift();
            console.log(tableCol);
            // console.log(rowRes)
            //rowRes = filterOptions(rowRes, tableCol);
            setTableRows(viewRows);
    } catch (error) {
      console.log(error)
    }
  }

  function handleDelete(key) {
    setOpenDelete(true);
    setDeleteIndex(detailIndexMap[key]);
  }

  function indexToIndexMap(displayRows, allRows, allColumns)
  {
    let keyValues = [];
    let tableKeyIndex = allColumns.indexOf(table.key);

    for(let i = 0; i < allRows.length; i++ )
    {
      keyValues.push(allRows[i][tableKeyIndex]);
    }

    let indexToIndexPairs = []
    for(let i = 0; i < displayRows.length; i++ )
    {
        //need to add 1 to the index because the first row is the column names
      let currIndex = keyValues.indexOf(displayRows[i][tableKeyIndex]) + 1;
      indexToIndexPairs.push(currIndex);
    }
    setDetailIndexMap(indexToIndexPairs);
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
      getDataUrl()
    } catch (error) {
      console.log(error)
    }
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
        updatedArray.push('')
      }
    }
    console.log(updatedArray)
    return updatedArray
  }

  // gets rid of records that don't match the filter (aren't true)
  function filterOptions(r, c) {
    let filter = view.filter;
    let userFilter = view.user_filter;
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


  // checks if the row is editable based on the edit filter value
  function filterEditCols(rowIndex) {
    if (detail.edit_filter == '') {
      setDetailFilter(true)
    } else {
      let index = 0

      //find the index of the edit filter column
      while (
        index < allColNames.length &&
        detail.edit_filter != allColNames[index]
      ) {
        index++
      }

      if (filteredRowsAllColumns[rowIndex][index].toLowerCase() == 'false') {
        setDetailFilter(false)
      } else {
        setDetailFilter(true)
      }
    }
  }

  function filterReferenceEditCols(rowIndex,refTable, refDetail) {
    if (refDetail.edit_filter == '') {
        setDetailFilter(true)
      } else {
        

        //find the index of the edit filter column in the refdata
        
        let editFilterIndex = refTable.refData[0].indexOf(refDetail.edit_filter)
  
        if (refTable.refData[rowIndex][editFilterIndex].toLowerCase() == 'false') {
          setDetailFilter(false)
        } else {
          setDetailFilter(true)
        }
      }
  }
  
  function handleOpenDetailModal(row) {
    setOpenDetail(true)
    setDetail(matchedDetail);
    setDetailIndex(detailIndexMap[row]);
    setDetailTable(table);


    let detailRows = []
    for (let i = 0; i < allColNames.length; i++) {
      detailRows.push([allColNames[i], filteredRowsAllColumns[row][i]])
    }
    setDetailRecord(detailRows)

    filterEditCols(row)
  }

  function handleOpenReferenceDetailModal(val, row, refTable) {
    setDetail(refTable.refDetail);
    setOpenDetail(true)
    


    let refColumns = refTable.refData[0];
    let refRowIndex = refTable.viewRowToRefRow[row];

    setDetailIndex(refRowIndex);
    setDetailTable(refTable.refTableModel)

    let detailRows = []
    for (let i = 0; i < refTable.refData[0].length; i++) {
      detailRows.push([refColumns[i], refTable.refData[refRowIndex][i]])
    }
    setDetailRecord(detailRows);

    filterReferenceEditCols(refRowIndex,refTable, refTable.refDetail)
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
    setColNames(view.columns);
    if (!openDetail && !openDelete){
      setIsLoading(true);
      getDataUrl();
      setTimeout(() => {
        setIsLoading(false);
        isURL();
      }, 2000)
    }
  }, [view, openDetail, openDelete]);

  let add

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

  // if (view.allowed_actions.includes('Delete')) {
  //   del = (
  //     <TableCell sx={{ width: '50px' }} align='center'>
  //       <Button variant='contained' onClick={}>
  //         <DeleteRoundedIcon />
  //       </Button>
  //     </TableCell>
  //   )
  //   delCol = (
  //     <TableCell align='center' style={{ fontWeight: 'bold' }}>
  //       Delete
  //     </TableCell>
  //   )
  // }

  let det;

  if (detail) {
    det = (
      <DetailView
        open={openDetail}
        setOpen={setOpenDetail}
        detailIndex={detailIndex}
        setDetailIndex={setDetailIndex}
        detail={detail}
        detailRecord={detailRecord}
        setDetailRecord={setDetailRecord}
        filter={detailFilter}
        table={detailTable}
      />
    )
  }

  let cellVal;

  function tableCellValue(val,col, row) {
    let curColName = colNames[col];
    if (refCols.has(curColName)) {
        let refTable = refCols.get(curColName);
        let linkStyle = {
            backgroundColor : "transparent",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline", 
            display: "inline",
            margin: 0,
            padding: 0,
          }
        return <button type = "button" style={linkStyle} onClick={() => handleOpenReferenceDetailModal(val,row,refTable)}>{val}</button>
    }
    else if (URLs.includes(col)) {
        return <a href={val} target='_blank'>
        {val}
      </a>
    }
    else {
        return val
    }
  }

  return (
    <div>
      <DeleteModal open={openDelete} setOpen={setOpenDelete} table={table} deleteIndex={deleteIndex} setDeleteIndex={setDeleteIndex}/>
      <Modal open={isLoading}>
        <LinearProgress />
      </Modal>
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
              {
                view.allowed_actions.includes('Delete') ? (
                  <TableCell align='center' style={{ fontWeight: 'bold' }}>
                    Delete
                  </TableCell>
                ) : null
              }
              <TableCell align='center' style={{ fontWeight: 'bold' }}>
                Detail Views
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row, rowIndex) => (
              <TableRow key = {rowIndex}>
                {row.map((value, col) => (
                  <TableCell align='center' key = {col}>
                    {/* {URLs.includes(key) ? (
                      <a href={value} target='_blank'>
                        {value}
                      </a>
                    ) : (
                      value
                    )} */}
                    {tableCellValue(value,col, rowIndex)}
                  </TableCell>
                ))}
                {
                  view.allowed_actions.includes('Delete') ? (
                    <TableCell sx={{ width: '50px' }} align='center'>
                      <Button variant='contained' onClick={() => handleDelete(rowIndex)}>
                        <DeleteRoundedIcon />
                      </Button>
                    </TableCell>
                  ) : null
                }
                <TableCell sx={{ width: '150px' }} align='center'>
                  <Button
                    onClick={() => handleOpenDetailModal(rowIndex)}
                    variant='contained'
                    disabled={!matchedDetail}
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
