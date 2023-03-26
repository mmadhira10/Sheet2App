import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import TableCard from "./TableCard.js";
import TableSettings from "./TableSettings";


export default function TablesPage() {
    const [openTable, setOpenTable] = useState(false);
    const [count, setCount] = useState(1);

    function getTables() {

    }
    
    function createTable() {
        setOpenTable(true); // 
        if(count == 1) {
          setCount(2);
        }
        else {
          setCount(1);
        }
        console.log(openTable);
    }

    useEffect(() => {
        getTables()
    }, []);


    return(
       <Box sx = {{position: "absolute", display: "block", width: "100%", height: "100%"}}>
            <Box sx = {{position: "absolute", display: "block", height: "10%", left: "5%"}}>
                <Typography variant = "h2">Tables</Typography>
            </Box>
            <Box sx = {{overflow: "auto", position: "absolute", display: "block", top:"10%", left: "5%", width: "80%", border: "2px solid black", height: "60%"}}>
                <List sx = {{margin: "10px"}}>
                    <TableCard/>
                </List>
            </Box>
            <Button onClick = {createTable} variant = "contained"sx = {{position: "absolute", top: "75%", left: "40%"}}>Add Table</Button>
            <TableSettings open = {openTable} key = {count}/>
       </Box> 
    )

}