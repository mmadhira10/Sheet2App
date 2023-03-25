import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import AppCard from "./AppCard.js";
import ViewSettings from "./ViewSettings.js";

export default function ViewsPage {

    function getMyViews() {

    }   

    useEffect(() => {
        getViews()
    }, []);

    const testInfo = {
        creator: "John Doe",
        name: "Test View",
        table: "Gradebook"
        columns: ["Homework 1", "Homework 2"],
        viewType: "Table",
        allowedActions: ["Add", "Delete"],
        filter: "Math Class"
        _id: "testing2"
    };

    return(
       <Box sx = {{position: "absolute", display: "block", width: "100%", height: "100%"}}>
            <Box sx = {{position: "absolute", display: "block", height: "20%"}}>
                <Typography variant = "h2">Views</Typography>
            </Box>
            <Box sx = {{position: "absolute", display: "block" top:"20%", width: "80%", border: "2px solid black"}}>
                <List>
                    
                </List>
            </Box>
       </Box> 
    )

}