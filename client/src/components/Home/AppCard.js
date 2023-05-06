import React from 'react';
import { useContext } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { GlobalStoreContext } from '../../store';
import { useNavigate } from 'react-router-dom';

export default function AppCard(props) {
    const { appInfo, isCreator, isDev, isEndUser, isGlobalDev, handleModalOpen } = props;
    const { currentApp, setCurrentApp } = useContext(GlobalStoreContext);
    const navigate = useNavigate();

    let devFunctions;

    if(!isGlobalDev) {
        devFunctions = true;
    }
    else {
        devFunctions = !(isCreator || isDev);
    }
    // console.log(isEndUser);
    function deleteApp() {
        handleModalOpen(appInfo._id)
    }

    function editApp(e) {

        setCurrentApp(appInfo);
        navigate("/tables");
        console.log(currentApp);    
    }

    function handleClick() {
        

    }

    function runApp() 
    {
        setCurrentApp(appInfo);
        navigate("/runApp");
    }

    return(
        <ListItem 
            sx = {{margin: "10px", display: "flex", border: "1px solid black", boxShadow: 3, width: "90%"}}
            key = {appInfo._id}
            // onClick = {handleClick}
        >
            <Grid container >
                <Grid item xs = {10}>
                    <Typography variant = "body" sx = {{fontSize: "30px", fontWeight: "bold"}}>{appInfo.name}</Typography>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body" sx = {{fontSize: "15px", fontStyle: "italic"}}>{appInfo.published ? "" : "Unpublished"}</Typography>
                </Grid>
                <Grid item xs = {6}>
                    <Typography variant = "body" sx = {{fontSize: "15px", fontWeight: "bold"}}>Creator: </Typography>
                    <Typography variant = "body" sx = {{fontSize: "15px"}}>{appInfo.creator}</Typography>
                </Grid>
                <Grid item xs ={2}>
                    <Button variant="contained" disabled = {devFunctions} onClick = {deleteApp}>Delete</Button>
                </Grid>
                <Grid item xs ={2}>
                    <Button variant="contained" disabled = {devFunctions} onClick = {editApp}>Edit</Button>
                </Grid>
                <Grid item xs ={2}>
                    <Button variant="contained" disabled = {!(isEndUser)} onClick = {runApp}>Run</Button>
                </Grid>
            </Grid>

        </ListItem>
    )
}