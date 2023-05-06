import React, { useState, useEffect, useContext } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
// import AppCard from "./AppCard.js";
import ViewSettings from "./ViewSettings.js";
import ViewCard from "./ViewCard.js";
import NavBar from "../NavBar.js";
import { GlobalStoreContext } from "../../store";
import { useNavigate } from "react-router-dom";

import api from "../../app-routes";


const newView = {
    name: "",
    table: "",
    columns: [],
    view_type:"Table",
    allowed_actions: [],
    roles: [],
    filter: "",
    user_filter: "",
    edit_filter: "",
    editable_columns:[]
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
    const [views, setViews] = useState([]);
    const {currentApp, setCurrentApp} = useContext(GlobalStoreContext);
    const navigate = useNavigate();

    async function getViews() {
        try {
            // console.log("getting views")
            const response = await api.get("/getViews/" + currentApp._id);
            // console.log(response.data);
            setViews(response.data.views);
        }
        catch (error) {
            console.log(error);
        }
    }
    
    function createView() {
        setOpenView(true); // open view settings module
        if(count == 1) {
          setCount(2);
        }
        else {
          setCount(1);
        }
        // console.log(openView);
    }

    useEffect(() => {
        if(currentApp == null)
        {
            navigate("/");
        }
        getViews()
    }, [currentApp]);


    return(
       <Box sx = {{position: "absolute", display: "block", width: "100%", height: "100%"}}>
            <NavBar/>
            <Box sx = {{position: "absolute", display: "block", height: "10%", left: "5%"}}>
                <Typography variant = "h2">Views</Typography>
            </Box>
            <Box sx = {{overflow: "auto", position: "absolute", display: "block", top:"20%", left: "5%", width: "80%", border: "2px solid black", height: "60%"}}>
                <List sx = {{margin: "10px"}}>
                    {views.map((view) => (
                        <ViewCard settings = {view} key ={view._id}/>
                    ))}
                </List>
            </Box>
            <Button onClick = {createView} variant = "contained"sx = {{position: "absolute", top: "85%", left: "40%"}}>Create New View</Button>
            <ViewSettings open = {openView} key = {count} settings = {newView} opType = "create"/>
       </Box> 
    )

}