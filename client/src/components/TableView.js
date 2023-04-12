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

import { GlobalStoreContext } from "../store";

import api from "../app-routes";

const columns = ["First Name", "Last Name", "ID", "HW1", "HW2"];
const rows = [["Sameer", "Khan", "1", "90", "95"], ["Moh", "How", "2", "100", "99"], ["Sid", "Sham", "3", "95", "96"], 
["Mihir", "Mad", "4", "100", "100"] ];


export default function TableView(props) {
    const [ colNames, setColNames ] = useState([]);
    const [ rows, setRows ] = useState([])
    const { view, table } = props;

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

            setRows(rowRes);
        }
        catch(error)
        {
            console.log(error)
        }
    }


    useEffect(() => {
        //get the view data
        //getTables
        // console.log(table.URL);
        setColNames(view.columns);
        getDataUrl();
    }, [view]);


    return(
        <div>
            <Box sx={{paddingBottom: 5}}>
                <Typography sx = {{borderBottom: "2px solid black", width: "100%"}} variant = "h2">{view.name}</Typography>
            </Box>
        <TableContainer sx = {{maxWidth: "100%"}} component={Paper}>
          <Table sx={{ }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                {colNames.map((column) => (
                    <TableCell key = {column} align = "center" key = {column}>{column}</TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow >
                        {row.map((value) => (
                            <TableCell align = "center">{value}</TableCell>
                        ))}
                        <TableCell sx = {{width: "150px"}} align = "center">
                            <Button variant = "contained">Detail View</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>    
    )


    

}