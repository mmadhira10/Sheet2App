import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';


export default function columnSet(props) {
    const {column} = props;
    // return (
    //     <ListItem sx = {{border: "2px solid black", margin: "5px" }}>
    //         <Typography>{props.name}</Typography>
    //     </ListItem>
    // )

    return (
        <ListItem>
            <Grid container columnSpacing = {2} columns = {10} sx = {{border: "2px solid black", p: "5px", margin: "2px"}}>
                <Grid item xs = {2} sx = {{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Typography variant = "body" sx = {{fontWeight: "bold"}}>{column.name}</Typography>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body">Initial Value:</Typography>
                    <TextField defaultValue = {column.initial_val} id = {"initValue-" + column.name}/>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body">Label:</Typography>
                    <TextField defaultValue = {column.label} id = {"label-" + column.name}/>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body">Reference:</Typography>
                    <TextField defaultValue = {column.reference} id = {"ref-" + column.name}/>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body">Type:</Typography>
                    <TextField defaultValue = {column.type} id = {"type-" + column.name}/>
                </Grid>
            </Grid>
        </ListItem>
    )
}