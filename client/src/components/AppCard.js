import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export default function AppCard(props) {
    const { appInfo } = props;

    function deleteApp() {

    }

    function editApp() {

    }

    function runApp() {

    }

    return(
        <ListItem 
            sx = {{margin: "10px", display: "flex", border: "1px solid black"}}
            key = {appInfo._id}
        >
            <Grid container>
                <Grid item xs = {10}>
                    <Typography variant = "body" sx = {{fontSize: "30px", fontWeight: "bold"}}>{appInfo.name}</Typography>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body" sx = {{fontSize: "15px", fontStyle: "italic"}}>{appInfo.isPublished ? "" : "Unpublished"}</Typography>
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