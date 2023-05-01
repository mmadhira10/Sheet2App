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
import DetailView from "./DetailView.js";


export default function TableView(props) {
    const [ columns, setColumns ] = useState([]);
    const [ rows, setRows ] = useState([]);
    const [ colNames, setColNames ] = useState([]);
    const [ tableRows, setTableRows ] = useState([]);
    const [ open, setOpen ] = useState(false); // to open the detail view
    const [ detailRecord, setDetailRecord ] = useState([]);
    // const { filter, setFilter } = setState([])
    const { view, table, detail } = props;
    const { auth } = useContext(AuthContext);

    //get data by rows
    //first row is column headings
    //can shift array to remove column headings array and then array.map each column
    async function getDataUrl() {
        try {
            const response = await api.post('/getDataFromURL', {url: table.URL});
            // console.log(response.data);
            let indicesCol = []
            let tableCol = response.data.data[0];
            let rowRes = response.data.data.toSpliced(0,1) //get all rows except column names

            rowRes = filterOptions(rowRes, tableCol);

            console.log(rowRes);
            console.log(tableCol);
            setRows(rowRes);
            setColumns(tableCol);

            view.columns.forEach((name) => {
                indicesCol.push(response.data.data[0].indexOf(name));
            });

            let viewRows = [];
            rowRes.forEach((arr) => {
                let val = indicesCol.map(i => arr[i]);
                viewRows.push(val);
            })
            // rowRes.shift();
            // console.log(tableCol);
            // console.log(tableRows);
            // console.log(rowRes)
            // rowRes = filterOptions(rowRes, tableCol);

            setTableRows(viewRows);
        }
        catch(error)
        {
            console.log(error)
        }
    }

    function filterOptions(r, c) {
        let filter = view.filter;
        let userFilter = view.user_filter;
        if (filter != "")
        {
            let newArr = []
            let filterIndex = c.indexOf(filter);
            console.log("filter index is: " + filterIndex);
            r.forEach(function(item) {
                if (item[filterIndex].toUpperCase() == "TRUE")
                {
                    newArr.push(item);
                }
            })
            r = newArr;
        }

        if (userFilter != "")
        {
            let newArr = []
            let filterIndex = c.indexOf(userFilter);
            r.forEach(function(item) {
                if (item[filterIndex] == auth.email)
                {
                    newArr.push(item);
                }
            })
            r = newArr;
        }

        return r;
    }

    function handleOpenModal(key) {
        setOpen(true);
        
        let detailRows = []
        for (let i = 0; i < columns.length; i++ )
        {
            detailRows.push([columns[i], rows[key][i]]);
        }
        setDetailRecord(detailRows);
    }

    useEffect(() => {
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
        delCol = 
        <TableCell align = "center" style={{fontWeight: 'bold'}}>Delete</TableCell>

    }

    let det;

    if (detail)
    {
        det = 
        <DetailView open={open} setOpen={setOpen} detail={detail} detailRecord={detailRecord} setDetailRecord={setDetailRecord} />

    }
    // console.log(detailRecord);
    return(
        <div>
            {
                det
            }
            <Box sx={{paddingBottom: 5}}>
                <Typography sx = {{borderBottom: "2px solid black", width: "100%"}} variant = "h2" align="center">{view.name}</Typography>
            </Box>
            <TableContainer sx = {{maxWidth: "100%"}} component={Paper}>
                <Table sx={{ }} aria-label='simple table'>
                    <TableHead>
                        <TableRow>
                            {colNames.map((column, key) => (
                                <TableCell key = {column} align = "center" style={{fontWeight: 'bold'}}>{column}</TableCell>
                            ))}
                            {
                                delCol
                            }
                            <TableCell align = "center" style={{fontWeight: 'bold'}}>Detail Views</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableRows.map((row, key) => (
                            <TableRow>
                                {row.map((value, key) => (
                                    <TableCell align = "center">{value}</TableCell>
                                ))}
                                {
                                    del
                                }
                                <TableCell sx = {{width: "150px"}} align = "center">
                                    <Button onClick={() => handleOpenModal(key)} variant = "contained" disabled={!detail}>Detail View</Button>
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