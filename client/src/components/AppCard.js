import React from 'react';
import { useContext } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { GlobalStoreContext } from '../store';
import { useNavigate } from 'react-router-dom';

export default function AppCard(props) {
    const { appInfo } = props;
    const { currentApp, setCurrentApp } = useContext(GlobalStoreContext);
    const navigate = useNavigate();

    function deleteApp() {

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
            sx = {{margin: "10px", display: "flex", border: "1px solid black"}}
            key = {appInfo._id}
            // onClick = {handleClick}
        >
            <Grid container>
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
                    <Button onClick = {deleteApp}>Delete</Button>
                </Grid>
                <Grid item xs ={2}>
                    <Button onClick = {editApp}>Edit</Button>
                </Grid>
                <Grid item xs ={2}>
                    <Button onClick = {runApp}>Run</Button>
                </Grid>
            </Grid>

        </ListItem>
    )
}