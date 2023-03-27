import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import AppCard from "./AppCard.js";
import ViewSettings from "./ViewSettings.js";
import ViewCard from "./ViewCard.js";
import NavBar from "./NavBar";

const newView = {
    name: "",
    table: "",
    columns: [],
    viewType:"Table",
    allowedActions: [],
    roles: [],
    filter: "",
    userFilter: "",
    editFilter: "",
    editColumns:[],
    _id: "testingNew"
};

const testInfo = {
    name: "Test View",
    table: "Gradebook",
    columns: ["Homework 1", "Homework 2"],
    viewType: "Table",
    allowedActions: ["Add", "Delete"],
    roles: [],
    filter: "Math Class",
    userFilter: "",
    editFilter: "",
    editColumns:"",
    _id: "testing2"
};

const testInfo2 = {
    name: "Test View 2",
    table: "Attendance",
    columns: ["Semester 1", "Semester 2"],
    viewType: "Table",
    allowedActions: ["Add"],
    roles: [],
    filter: "English Class",
    userFilter: "Student",
    editFilter: "",
    editColumns:"",
    _id: "testing3"
};

const testArray = [testInfo, testInfo2];

export default function ViewsPage() {
    const [openView, setOpenView] = useState(false);
    const [count, setCount] = useState(1);

    function getViews() {

    }
    
    function createView() {
        setOpenView(true); // open view settings module
        if(count == 1) {
          setCount(2);
        }
        else {
          setCount(1);
        }
        console.log(openView);
    }

    useEffect(() => {
        getViews()
    }, []);


    return(
       <Box sx = {{position: "absolute", display: "block", width: "100%", height: "100%"}}>
            <NavBar/>
            <Box sx = {{position: "absolute", display: "block", height: "10%", left: "5%"}}>
                <Typography variant = "h2">Views</Typography>
            </Box>
            <Box sx = {{overflow: "auto", position: "absolute", display: "block", top:"20%", left: "5%", width: "80%", border: "2px solid black", height: "60%"}}>
                <List sx = {{margin: "10px"}}>
                    {testArray.map((info) => (
                        <ViewCard settings = {info} key ={info._id}/>
                    ))}
                </List>
            </Box>
            <Button onClick = {createView} variant = "contained"sx = {{position: "absolute", top: "85%", left: "40%"}}>Create New View</Button>
            <ViewSettings open = {openView} key = {count} settings = {newView} opType = "create"/>
       </Box> 
    )

}