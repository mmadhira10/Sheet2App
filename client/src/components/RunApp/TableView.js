import React, { useEffect, useState, useContext } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';

import { GlobalStoreContext } from "../../store";
import AuthContext from "../../auth";

import api from "../../app-routes";

const columns = ["First Name", "Last Name", "ID", "HW1", "HW2"];
const rows = [["Sameer", "Khan", "1", "90", "95"], ["Moh", "How", "2", "100", "99"], ["Sid", "Sham", "3", "95", "96"], 
["Mihir", "Mad", "4", "100", "100"] ];


export default function TableView(props) {
    const [ colNames, setColNames ] = useState([]);
    const [ rows, setRows ] = useState([])
    // const { filter, setFilter } = setState([])
    const { view, table, allTables} = props;
    const { auth } = useContext(AuthContext);

    let count = 0;
    //get data by rows
    //first row is column headings
    //can shift array to remove column headings array and then array.map each column
    async function getDataUrl() {
        try {
            const refCols = new Map();
            console.log("getDataUrl");
            let refTables = [];
            for (let i = 0;i<table.columns.length;i++) { 
                //for each column check if it's a reference colum
                let curCol = table.columns[i];
                if (Object.hasOwn(curCol,"reference") && curCol.reference !== "") {
                    //if it is a reference column, find the table it references and push it to the refTables array
                    let curRefTable = {};
                    curRefTable.refTableModel = allTables.find(t => t._id === curCol.reference);
                    refCols.set(i,curRefTable); //add the ref Column index and the ref Table object to the map
                    refTables.push(curRefTable);
                    
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
            }

            

            const response = await api.post('/getDataFromURL', {url: table.URL});
            // console.log(response.data);
            let indicesCol = []
            let tableCol = response.data.data[0];
            let rowRes = response.data.data.toSpliced(0,1) //get all rows except column names
            rowRes = filterOptions(rowRes, tableCol);
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
                    if (refCols.has(i)) {
                        let curRefTable = refCols.get(i);
                        let refKeyToRowMap = curRefTable.refKeyToRowMap;
                        let labelIndex = curRefTable.labelIndex;
                        let row = refKeyToRowMap.get(valAtIndex);
                        valAtIndex = curRefTable.refData[row][labelIndex];
                    }
                    return valAtIndex;
                }
                ); //val is an array of a row of data
                
                viewRows.push(val);
            })
            //rowRes.shift();
            console.log(tableCol);
            // console.log(rowRes)
            //rowRes = filterOptions(rowRes, tableCol);

            setRows(viewRows);
        }
        catch(error)
        {
            console.log(error)
        }
    }

    function filterOptions(rows, columns) {
        let filter = view.filter;
        let userFilter = view.user_filter;
        if (filter != "")
        {
            let newArr = []
            let filterIndex = columns.indexOf(filter);
            console.log("filter index is: " + filterIndex);
            rows.forEach(function(row) {
                if (row[filterIndex].toUpperCase() == "TRUE")
                {
                    newArr.push(row);
                }
            })
            rows = newArr;
        }

        if (userFilter != "")
        {
            let newArr = []
            let filterIndex = columns.indexOf(userFilter);
            rows.forEach(function(row) {
                if (row[filterIndex] == auth.email)
                {
                    newArr.push(row);
                }
            })
            rows = newArr;
        }

        return rows;
    }

    useEffect(() => {
        console.log(count);
        count++;
        //get the view data
        //getTables
        // console.log(table.URL);
        setColNames(view.columns);
        getDataUrl();



    }, [view]);


    let del, delCol, add;
    
    if (view.allowed_actions.includes("Add"))
    {
        add =
        <Box sx={{paddingTop: 5}} align="center">
            <Button variant = "contained" sx={{ width: '75%'}}>Add Record</Button>
        </Box>
    }

    if (view.allowed_actions.includes("Delete"))
    {
        del = 
        <TableCell sx = {{width: "50px"}} align = "center">
            <Button variant = "contained"><DeleteRoundedIcon/></Button>
        </TableCell>
        delCol = <TableCell></TableCell>
    }

    // console.log(view);
    return(
        <div>
            <Box sx={{paddingBottom: 5}}>
                <Typography sx = {{borderBottom: "2px solid black", width: "100%"}} variant = "h2" align="center">{view.name}</Typography>
            </Box>
        <TableContainer sx = {{maxWidth: "100%"}} component={Paper}>
          <Table sx={{ }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                {colNames.map((column, key) => (
                    <TableCell key = {column} align = "center" key={column} style={{fontWeight: 'bold'}}>{column}</TableCell>
                ))}
                {
                    delCol
                }
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, key) => (
                    <TableRow >
                        {row.map((value, key) => (
                            <TableCell align = "center">{value}</TableCell>
                        ))}
                        {
                            del
                        }
                        <TableCell sx = {{width: "150px"}} align = "center">
                            <Button variant = "contained">Detail View</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {
            add
        }
      </div>    
    )


    

}