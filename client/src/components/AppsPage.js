import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import AppCard from "./AppCard.js";
import ViewSettings from "./ViewSettings.js";
import AppSettings from "./AppSettings.js";

export default function AppsPage() {
    const [openSettings, setSettings] = useState(true);
    const [count, setCount] = useState(1);

    function getMyApps() {
    //     axios.get("/getApps", {

    //       })
    //       .then(function (response) {
    //         console.log(response);
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //       });
     }

    useEffect(() => {
        getMyApps();
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
        height: "50%",

    }

    function createView() {
      setSettings(true); // open view settings module
      if(count == 1) {
        setCount(2);
      }
      else {
        setCount(1);
      }
      console.log(openSettings)
    }


    return(
        <div>
            <ViewSettings open = {openSettings} key = {count}/>
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
            <Button onClick = {createView} sx = {{position: "absolute", top: "85%", width: "80%"}}>Create New App</Button>
        </div>
    )
}

