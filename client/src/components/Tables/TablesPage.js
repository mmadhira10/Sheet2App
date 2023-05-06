import React, { useState, useEffect, useContext } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import TableCard from "./TableCard.js";
import TableSettings from "./TableSettings";
import { GlobalStoreContext } from "../../store";
import NavBar from "../NavBar"
import { useNavigate } from "react-router-dom";

import api from "../../app-routes";

const testTable = {
    name: "Testing",
    URL: "blah",
    sheet_id: "123",
    key: "Student",
    columns: [{name: "Student", initial_val: "Bob", label: "dumb", reference: "", type: "Text" },
                {name: "Grade", initial_val: "0", label: "Final", reference: "", type: "Number"},
                {name: "HW1", initial_val: "0", label: "Final", reference: "", type: "Number"},
                {name: "HW2", initial_val: "0", label: "Final", reference: "", type: "Number"},
                {name: "HW3", initial_val: "0", label: "Final", reference: "", type: "Number"},
                {name: "isDumb", initial_val: "true", label: "Final", reference: "", type: "Boolean"}],
    _id: "yuhhhalso"
}

const testTable2 = {
    name: "Testing2",
    URL: "https://docs.google.com/spreadsheets/d/1JseYB5pK_9fOsKml24mJRx6b6Djvwfk8opl4lTTFfuk/edit#gid=0",
    sheet_id: "1234",
    key: "TA",
    columns: [{name: "TA", initial_val: "Bob", label: "dumb", reference: "", type: "Text" },
                {name: "Grade", initial_val: "0", label: "Final", reference: "", type: "Number"},
                {name: "review1", initial_val: "0", label: "Final", reference: "", type: "Number"},
                {name: "review2", initial_val: "0", label: "Final", reference: "", type: "Number"},
                {name: "review3", initial_val: "0", label: "Final", reference: "", type: "Number"},
                {name: "isSmart", initial_val: "true", label: "Final", reference: "", type: "Boolean"}],
    _id: "yuhhhhh"
}

const testing = [testTable, testTable2];

export default function TablesPage() {
    const [openTable, setOpenTable] = useState(false);
    const [count, setCount] = useState(1);
    const { currentApp, setCurrentApp } = useContext(GlobalStoreContext);
    const [tables, setTables] = useState([]);
    const navigate = useNavigate();

    //function to get all tables for current app
    async function getTables() {
        try {
            const response = await api.get('/getTables/' + currentApp._id);
            // console.log(response.data);
            setTables(response.data.tables);
        }
        catch (error) {
            console.log(error);
        }
     }
    
    function createTable() {
        setOpenTable(true); // 
        if(count == 1) {
          setCount(2);
        }
        else {
          setCount(1);
        }
        // console.log(openTable);
    }

    useEffect(() => {
        if(currentApp == null)
        {
            navigate("/");
        }
        getTables();
    }, [currentApp]);


    return(
       <Box sx = {{position: "absolute", display: "block", width: "100%", height: "100%"}}>
            <NavBar/>
            <Box sx = {{position: "absolute", display: "block", height: "10%", left: "5%", top: "10%"}}>
                <Typography variant = "h2">Tables</Typography>
            </Box>
            <Box sx = {{overflow: "auto", position: "absolute", display: "block", top:"20%", left: "5%", width: "80%", border: "2px solid black", height: "60%"}}>
                <List sx = {{margin: "10px"}}>
                    {
                        tables.map((table, key) => (
                            <TableCard table = {table} key = {table._id} tablesList = {tables}/>
                        ))
                    }
                </List>
            </Box>
            <Button onClick = {createTable} variant = "contained"sx = {{position: "absolute", top: "85%", left: "40%"}}>Add Table</Button>
            <TableSettings open = {openTable} key = {count} tablesList = {tables}/>
       </Box> 
    )

}

