import React, { useEffect, useState, useContext, useRef, Fragment } from 'react'
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
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import CreateRoundedIcon from '@mui/icons-material/CreateRounded'

import { GlobalStoreContext } from '../../store'
import AuthContext from '../../auth'
import api from '../../app-routes'

const addSet = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '300px',
    bgcolor: 'white',
    border: '2px solid #000'
  }

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
    const [openAdd, setOpenAdd] = useState(false)
  const [openDetail, setOpenDetail] = useState(false) // opens the detail modal
  const [detailIndex, setDetailIndex] = useState(-1); 
  const [detailIndexMap, setDetailIndexMap] = useState([])
  const [detailFilter, setDetailFilter] = useState(false) // the edit filter
  const [detailRecord, setDetailRecord] = useState([])

  //represents the current detail view (could be the matched detail or the reference detail)
  const [detail, setDetail] = useState(matchedDetail);
  const [detailTable, setDetailTable] = useState(table);

  const [refCols, setRefCols] = useState(new Map()) // stores reference columns
  //const refCols = new Map(); // stores reference columns
    const count = useRef(0);



  const [isLoading, setIsLoading] = useState(false);

  const [editIndices, setEditIndices] = useState([]);

  //used for key integrity checks
  const [keyColumn, setKeyColumn] = useState([]); 
  const [keyColIndex, setKeyColIndex] = useState();


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

  function indexToIndexMap(displayRows, allRows, allColumns)
  {
    let keyValues = [];
    let tableKeyIndex = allColumns.indexOf(table.key);

    setKeyColIndex(tableKeyIndex);
    for(let i = 0; i < allRows.length; i++ )
    {
      keyValues.push(allRows[i][tableKeyIndex]);
    }

    setKeyColumn(keyValues);

    let indexToIndexPairs = []
    for(let i = 0; i < displayRows.length; i++ )
    {
        //need to add 1 to the index because the first row is the column names
      let currIndex = keyValues.indexOf(displayRows[i][tableKeyIndex]) + 1;
      indexToIndexPairs.push(currIndex);
    }
    setDetailIndexMap(indexToIndexPairs);
  }


  async function deleteRecordFromSheet(index, table) {
    let body = {
      url: table.URL,
      index: index,
    }
    try {
      const response = await api.post('/deleteRecord', body)
      console.log(response)
      getDataUrl()
    } catch (error) {
      console.log(error)
    }
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
    setDetailRecord(detailRows)

    filterReferenceEditCols(refRowIndex,refTable, refTable.refDetail)
  }

  function isURLorEditable() {
    let urlCol = []
    let newEditIndices = []; //the indices of the columns that are editable
    for (let i = 0; i < table.columns.length; i++) {
      if (table.columns[i].type == 'URL') {
        urlCol.push(table.columns[i].name)
        console.log('URL column found')
        console.log(table.columns[i].name)
      }

      //find which columns are editable for the detail view of this table
      if(matchedDetail) {
        if(matchedDetail.editable_columns.includes(table.columns[i].name)) {
          newEditIndices.push(i);
        }
      }
    }
    console.log(newEditIndices);
    setEditIndices(newEditIndices);
    console.log(urlCol.length)
    let newURL = []
    if (urlCol.length > 0) {
    setURLs(newURL)
  }
}

  useEffect(() => {
    setColNames(view.columns);
    if (!openDetail){
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        getDataUrl();
        isURLorEditable();

      }, 1000)
    }
  }, [view, openDetail, openAdd])

  let del, delCol, add, addModal

  if (view.allowed_actions.includes('Add')) {
    add = (
      <Box sx={{ paddingTop: 5 }} align='center'>
        <Button
          variant='contained'
          sx={{ width: '75%' }}
          onClick={() => {
            setOpenAdd(true)
          }}
        >
          Add Record
        </Button>
      </Box>
    )
    
    if(openAdd && editIndices.length > 0) {
        addModal = (
          <Modal open = {openAdd}>
            <Box sx = {addSet}>
              <Box overflow="auto" height="200px" borderBottom="1px solid black" paddingBottom="5%">
                <Grid container rowGap = {2} overflow = "auto" alignItems="center" marginTop="5%">
                  {editIndices.map((colInd) => (
                    <Fragment key = {table.columns[colInd].name}>
                      <Grid item xs = {6} align = "center">
                        {table.columns[colInd].name}
                      </Grid>
                      <Grid item xs = {6}>
                          <TextField id = {"add-item-" + colInd} align = "center"></TextField>
                      </Grid>
                    </Fragment>
                  ))}
                </Grid>
              </Box>
                <Grid container marginTop="5%">
                  <Grid item xs={6} align="center">
                    <Button variant="contained" color="error" onClick={closeAddModal} style={{maxWidth: '300px', maxHeight: '200px', minWidth: '200px', minHeight: '30px'}} >Back</Button>
                  </Grid>
                  <Grid item xs={6} align="center">
                    <Button variant="contained" onClick={addRecord} style={{maxWidth: '300px', maxHeight: '200px', minWidth: '200px', minHeight: '30px'}} >Add Record</Button>
                  </Grid> 
                </Grid>
            </Box>
          </Modal>
        )
      }
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

  function closeAddModal() {
    setOpenAdd(false);
  }

  function isValidURL(URL) {
    let URLregex = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator  

    return URLregex.test(URL);
  }

  function isBoolean(boolean) {
    let isBool = false;
    if(boolean.toUpperCase() == "FALSE" || boolean.toUpperCase() == "TRUE") {
      isBool = true;
    }
    return isBool;
  }

  function typeCorrectAdd(newRec) {
    //only check the entered values because we auto assigned the rest
    for(let i = 0; i < editIndices.length; i++) {
      let colIndex = editIndices[i];
      let val = newRec[colIndex];
      if(val == "") {
        if(table.columns[colIndex].name == table.key && table.columns[colIndex].initial_val == "") {
          //setErrMsg("Key column cannot be empty")
        }
        else{
          continue;
        }
      }
      if(table.columns[colIndex].type == "URL") {
        if(isValidURL(val) == false) {
          //setErrMsg("Invalid URL");
          return false;
        }
      }
      else if(table.columns[colIndex].type == "Boolean") {
        if(isBoolean(val) == false) {
          console.log(i);
          console.log(table.columns[i].name);
          //setErrMsg("Invalid Boolean");
          return false;
        }
      }
      else if(table.columns[colIndex].type == "Number") {
        if(isNaN(val) == true) {
          console.log("is a number");
          //setErrMsg("Invalid Number");
          return false;
        }
      }

    }
    return true;
  }

  function isKeyUnique(newRec) {
    if(keyColumn.includes(newRec[]))
  }
  async function addRecord() {
      let newRec = [];
      for (let i = 0; i < table.columns.length; i++) {
          if (editIndices.includes(i)) {
              //user can enter a value for this column
              let addItem = document.getElementById("add-item-" + i);
              let val = addItem.value;
              if (val == "" && table.columns[i].initial_val != "") {
                  if (table.columns[i].initial_val == "ADDED_BY()") {
                      newRec.push(auth.email);

                  }
                  else {
                      newRec.push(table.columns[i].initial_val);
                  }
              }
              else {
                  newRec.push(val);
              }
          }
          else {
              //use initial value or leave blank
              let init_val = table.columns[i].initial_val;
              if (init_val != "") {
                  if (init_val == "=ADDED_BY()") {
                      newRec.push(auth.email);
                  }
                  else {
                      newRec.push(init_val);
                  }
              }
              else {
                  newRec.push("");
              }
          }

      }

      //check type correctness
      let isCorrect = typeCorrectAdd(newRec);
      if (isCorrect == false) {
          console.log("type error for add record");
      }
      else if (keyColumn.includes(newRec[keyColIndex])){
          console.log("key is not unique for add record");
      }
      else {
          try {
              const response = await api.post('/addRecord', { url: table.URL, data: newRec })
              setOpenAdd(false);
          } catch (error) {
              console.log(error);
          }
      }
  }

  return (
    <div>
      {
        isLoading ? (
          <Modal open={isLoading}>
            <LinearProgress />
          </Modal>
        ) : null
      }
      {det}
      {addModal}
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
                {del}
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
