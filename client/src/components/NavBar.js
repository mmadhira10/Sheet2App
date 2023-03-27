import React, { useState, useEffect, useContext } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link } from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate()
    
    function handleViews() {

    }

    function handleTables() {

    }

    function handleApp() {

    }

    function exitApp() {

    }

    return (
        <AppBar sx = {{position:"static", height: "10%", bgcolor: "#F5F5F5", borderBottom: "2px solid black"}}>
            <Toolbar sx = {{justifyContent: "end"}}>
            <Link to="/tables"> <Button sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "outlined">Tables</Button></Link>
            <Link to="/views"> <Button sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "outlined" >Views</Button> </Link>
            <Link to= "/editApp"> <Button sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "outlined" >App Settings</Button> </Link>
            <Link to="/apps"> <Button sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "outlined" >Exit App</Button> </Link>
            </Toolbar>
        </AppBar>
    )
}