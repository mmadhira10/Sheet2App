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

import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";

import api from "../app-routes";

const columns = ["First Name", "Last Name", "ID", "HW1", "HW2"];
const rows = [["Sameer", "Khan", "1", "90", "95"], ["Moh", "How", "2", "100", "99"], ["Sid", "Sham", "3", "95", "96"], 
["Mihir", "Mad", "4", "100", "100"] ];


export default function TableView(props) {
    const [ colNames, setColNames ] = useState([]);
    const [ rows, setRows ] = useState([])
    // const { filter, setFilter } = setState([])
    const { view, table } = props;
    const { auth } = useContext(AuthContext);

    //get data by rows
    //first row is column headings
    //can shift array to remove column headings array and then array.map each column
    async function getDataUrl() {
        try {
            const response = await api.post('/getDataFromURL', {url: table.URL});
            console.log(response.data);
            let indicesCol = []

            view.columns.forEach((name) => {
                indicesCol.push(response.data.data[0].indexOf(name));
            })

            let rowRes = [];

            response.data.data.forEach((arr) => {
                let val = indicesCol.map(i => arr[i]);
                rowRes.push(val);
            })
            rowRes.shift();
            console.log(rowRes)
            rowRes = filterOptions(rowRes);

            setRows(rowRes);
        }
        catch(error)
        {
            console.log(error)
        }
    }

    function filterOptions(rows) {
        let filter = view.filter;
        let userFilter = view.user_filter;
        if (filter != "")
        {
            let newArr = []
            let filterIndex = view.columns.indexOf(filter);
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
            let filterIndex = view.columns.indexOf(userFilter);
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
        //get the view data
        //getTables
        // console.log(table.URL);
        setColNames(view.columns);
        getDataUrl();
    }, [view]);


    let del, delCol, add, edit, editCol;
    
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

    if (view.allowed_actions.includes("Edit")){
        edit = 
        <TableCell sx = {{width: "50px"}} align = "center">
            <Button variant = "contained"><CreateRoundedIcon/></Button>
        </TableCell>
        editCol = <TableCell></TableCell>
    }
    console.log(view);
    return(
        <div>
            <Box sx={{paddingBottom: 5}}>
                <Typography sx = {{borderBottom: "2px solid black", width: "100%"}} variant = "h2" align="center">{view.name}</Typography>
            </Box>
        <TableContainer sx = {{maxWidth: "100%"}} component={Paper}>
          <Table sx={{ }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                {colNames.map((column) => (
                    <TableCell key = {column} align = "center" key={column} style={{fontWeight: 'bold'}}>{column}</TableCell>
                ))}
                {
                    delCol
                }
                {
                    editCol
                }
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow >
                        {row.map((value) => (
                            <TableCell align = "center">{value}</TableCell>
                        ))}
                        {
                            del
                        }
                        {
                            edit
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