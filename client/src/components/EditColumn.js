import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

//<TextField defaultValue = {column.reference} id = {"ref-" + column.name}/>
export default function columnSet(props) {
    const {column, tablesList} = props;
    // return (
    //     <ListItem sx = {{border: "2px solid black", margin: "5px" }}>
    //         <Typography>{props.name}</Typography>
    //     </ListItem>
    // )
    let refVal = column.reference;
    if(refVal == undefined) {
        refVal = ""; 
    }
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
                    <Select inputProps = {{id: "ref-" + column.name }} defaultValue = {refVal} fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
                        <MenuItem key = "blank" value = "">None</MenuItem>
                        {
                        tablesList.map((table) => (
                            <MenuItem key = {table.name} value = {table._id}>{table.name}</MenuItem>
                        ))
                        }
                    </Select>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body">Type:</Typography>
                    <TextField defaultValue = {column.type} id = {"type-" + column.name}/>
                </Grid>
            </Grid>
        </ListItem>
    )
}