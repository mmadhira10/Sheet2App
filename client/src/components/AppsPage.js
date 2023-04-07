import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import AppCard from "./AppCard.js";
import ViewSettings from "./ViewSettings.js";
import AppSettings from "./AppSettings.js";
import ViewCard from "./ViewCard.js";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import LogoutButton from "./LogoutButton";

import api from "../app-routes";


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
    height: "25%",
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
    height: "50%",

}

export default function AppsPage() {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(1);
    const [apps, setApps] = useState([]);

    //function to get all apps from database
    async function getMyApps() {
        try {
            // console.log("getting apps");
            const response = await api.get("/getApps/");
            // console.log(response.data);
            setApps(response.data.apps);
        }
        catch (error) {
            console.log(error);
        }
     }  

    useEffect(() => {
        getMyApps();
    }, [apps]);

    function createApp() {
        setOpen(true); 
        if(count == 1) {
          setCount(2);
        }
        else {
          setCount(1);
        }
    }

    //map through array of apps and create an AppCard for each one

    return(
        <div>
            <AppSettings open = {open} key = {count} apps= {apps} setApps = {setApps}/>
            <Box sx = {titleStyle}>
                <AppBar sx = {{position:"static", height: "60%", bgcolor: "#F5F5F5", borderBottom: "2px solid black"}}>
                    <Toolbar>
                        <Typography align = "center" variant = "h1" color="black">Sheet 2 App</Typography>
                        <Box sx={{ flexGrow: 8 }}></Box>
                        <LogoutButton />
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx = {myAppsStyle}>
                <Typography variant = "h2">My Apps</Typography>
            </Box>
            <Box sx = {appsList}>
                <List >
                    {apps.map((app) => (
                        <AppCard appInfo = {app} key ={app._id}/>
                    ))}
                </List>
            </Box>
            <Button onClick = {createApp} sx = {{position: "absolute", top: "85%", width: "80%"}}>Create New App</Button>
        </div>
    )
}

