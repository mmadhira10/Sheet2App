import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import AppCard from "./AppCard.js";

export default function AppsPage() {
    function getMyApps() {

    }

    useEffect(() => {
        getMyApps()
    }, []);

    //const Apps;
    
    const testInfo = {
        creator: "John Doe",
        name: "Test App",
        isPublished: false,
        _id: "testing"
    };

    const titleStyle = {
        position: "absolute",
        top: "0%",
        width: "100%",
        height: "25%"
    };

    const myAppsStyle = {
        position: "absolute",
        top: "25%",
        width: "80%",
        height: "10%"
    }

    const appsList = {
        position: "absolute",
        top: "35%",
        width: "80%",
        height: "50%"
    }


    return(
        <div>
            <Box sx = {titleStyle}>
                <Typography align = "center" variant = "h1">Sheet 2 App</Typography>
            </Box>
            <Box sx = {myAppsStyle}>
                <Typography variant = "h2">My Apps</Typography>
            </Box>
            <Box sx = {appsList}>
                <List>
                    <AppCard
                    key = {"123456"}
                    appInfo = {testInfo}
                    />
                </List>
            </Box>
            <Button sx = {{position: "absolute", top: "85%", width: "80%"}}>Create New App</Button>
        </div>
    )
}

