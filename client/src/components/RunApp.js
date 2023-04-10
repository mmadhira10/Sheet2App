import React, { useEffect, useContext, useState} from 'react';
import { GlobalStoreContext } from "../store";
import { Link } from "react-router-dom";
import { 
    Box, 
    AppBar, 
    Typography,
    Toolbar,
    Button,
} from '@mui/material';
import api from "../app-routes";
import LogoutButton from "./LogoutButton";


const titleStyle = {
    position: "absolute",
    top: "0%",
    width: "100%",
    height: "25%",
};

export default function RunApp() {
    const { currentApp, setCurrentApp } = useContext(GlobalStoreContext);
    const [ views, setViews ] = useState([]);

    useEffect(() => {
        getViews();
    }, []);

    async function getViews() {
        try {
            const response = await api.get("/getViews/" + currentApp._id);
            setViews(response.data.views);
        }
        catch (error) {
            console.log(error);
        }
    }

    // function exitApp() {
    //     setCurrentApp(null);
    // }

    return(
        <div>
            <AppBar sx = {{position:"static", height: "10%", bgcolor: "#F5F5F5", borderBottom: "2px solid black"}}>
                <Toolbar sx = {{justifyContent: "end"}}>
                    {
                        views.map((view) => ( 
                            <Button sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "outlined">{view.name}</Button>
                        ))
                    }
                    <Box sx={{flexGrow: 3}}></Box>
                    {/* <Link to="/"><Button sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "outlined" onClick={exitApp}>Exit the {currentApp.name} App</Button></Link> */}
                    <LogoutButton/>
                </Toolbar>
            </AppBar>
            <Box>
                <Typography align="center" variant="h1" sx={{fontWeight: 'bold', fontStyle:'italic'}}>Welcome to {currentApp.name}!</Typography>
            </Box>
        </div>
    )

}

