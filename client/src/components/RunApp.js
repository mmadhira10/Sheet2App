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
import TableView from "./TableView";

import AuthContext from "../auth";


const titleStyle = {
    position: "absolute",
    top: "0%",
    width: "100%",
    height: "25%",
};

export default function RunApp() {
    const { currentApp, setCurrentApp } = useContext(GlobalStoreContext);
    const [ views, setViews ] = useState([]);
    const [ tables, setTables ] = useState([]);
    const [ currView, setCurrView ] = useState(null);
    const [ index, setIndex ] = useState(-1);
    const { auth } = useContext(AuthContext)

    useEffect(() => {
        getViews();
        getTables();
        console.log(auth);
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

    async function getTables() {
        try {
            const response = await api.get("/getTables/" + currentApp._id);
            setTables(response.data.tables);
        } 
        catch(error)
        {
            console.log(error);
        }
    }

    let display = 
        <Typography 
        align="center" 
        variant="h1" 
        sx={{fontWeight: 'bold', fontStyle:'italic'}}
        >Welcome to {currentApp.name}, Developer {auth.name}!</Typography>

    if ( index > -1 ){
        let currentView = views[index];
        let tableIndex = 0;
        for (let i = 0; i < tables.length; i ++)
        {
            if (currentView.table == tables[i]._id) {
                tableIndex = i;
            }
        }
        console.log(currentView);
        display = <TableView view={currentView} table={tables[tableIndex]} />
    }

    return(
        <div>
            <AppBar sx = {{position:"static", height: "10%", bgcolor: "#F5F5F5", borderBottom: "2px solid black"}}>
                <Toolbar sx = {{justifyContent: "end"}}>
                    <Button 
                        sx={{marginLeft: "5px", marginRight: "5px"}} 
                        variant="outlined"
                        onClick={() => setIndex(-1)}
                    >HOME</Button>
                    {
                        views.map((view, index) => ( 
                            <Button 
                                sx={{marginLeft: "5px", marginRight: "5px"}} 
                                variant="outlined"
                                onClick={() => setIndex(index)}
                            >{view.name}</Button>
                        ))
                    }
                    <Box sx={{flexGrow: 3}}></Box>
                    <Link to="/"><Button sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "outlined" >Exit {currentApp.name} App</Button></Link>
                    <LogoutButton/>
                </Toolbar>
            </AppBar>
            <Box sx={{paddingTop: 5}}>
                {
                    display
                }
            </Box>
        </div>
    )

}

