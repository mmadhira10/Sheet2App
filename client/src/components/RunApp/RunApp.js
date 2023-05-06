import React, { useEffect, useContext, useState} from 'react';
import { GlobalStoreContext } from "../../store";
import { Link, useNavigate } from "react-router-dom";
import { 
    Box, 
    AppBar, 
    Typography,
    Toolbar,
    Button,
} from '@mui/material';
import api from "../../app-routes";
import LogoutButton from "./../LogoutButton";
import TableView from "./TableView";
import DeleteModal from "./DeleteModal";

import AuthContext from "../../auth";


const titleStyle = {
    position: "absolute",
    top: "0%",
    width: "100%",
    height: "25%",
};

export default function RunApp() {
    const { currentApp, setCurrentApp, clearCache } = useContext(GlobalStoreContext);
    const [ views, setViews ] = useState([]);
    const [ detailViews, setDetailViews ] = useState([]);
    const [ tables, setTables ] = useState([]);
    const [ currView, setCurrView ] = useState(null);
    const [ index, setIndex ] = useState(-1);
    const { auth } = useContext(AuthContext)

    const navigate = useNavigate();


    useEffect(() => {
        getViews();
        getTables();
        getRoles();
        // console.log(auth);
    }, []);

    async function getRoles() {
        try {
            const response = await api.post("/userRoles/", {url: currentApp.role_membership_sheet});
            console.log(response.data.roles);
            return response.data.roles
        }
        catch(error)
        {
            console.log(error);
        }
    }

    async function getViews() {
        try {
            const response = await api.get("/getViews/" + currentApp._id);
            let v = response.data.views; 
            try{
                const roles = await getRoles();
                let role_views = [];
                let detail_views = [];
                for( let i = 0; i < v.length; i ++)
                {
                    let inBothLists = v[i].roles.filter(element => roles.includes(element));
                    if (inBothLists.length != 0)
                    {
                        if (v[i].view_type == "Table")
                        {
                            role_views.push(v[i]);
                        }

                        if (v[i].view_type == "Detail")
                        {
                            detail_views.push(v[i]);
                        }
                    }
                }
                setViews(role_views);
                setDetailViews(detail_views);
            }
            catch(error)
            {
                console.log(error)
            }
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

    function handleExitApp() {
        setCurrentApp(null);
        clearCache();
        navigate("/");
    }

    let display = 
        <Typography 
        align="center" 
        variant="h1" 
        sx={{fontWeight: 'bold', fontStyle:'italic'}}
        >Welcome to {currentApp.name} {auth.name}!</Typography>

    if ( index > -1 ) {
        let currentView = views[index];
        let tableIndex = 0;
        for (let i = 0; i < tables.length; i ++)
        {
            if (currentView.table == tables[i]._id) {
                tableIndex = i;
            }
        }
        let i = 0;
        while (i < detailViews.length && detailViews[i].table != tables[tableIndex]._id)
        {
            i++;
        }


        //if there isn't a matching detail view, it will be undefined
        let matchedDetail = detailViews.find(dView => dView.table == tables[tableIndex]._id)

        // console.log(currentView);
        display = <TableView view={currentView} table={tables[tableIndex]} matchedDetail={matchedDetail} allTables = {tables} allDetail = {detailViews} />
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
                                key = {index}
                            >{view.name}</Button>
                        ))
                    }
                    <Box sx={{flexGrow: 3}}></Box>
                    <Button sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "outlined" onClick={handleExitApp}>Exit App</Button>
                    <LogoutButton/>
                </Toolbar>
            </AppBar>
            <Box sx={{paddingTop: 2}}>
                {
                    display
                }
            </Box>
        </div>
    )

}

