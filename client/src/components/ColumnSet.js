import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


export default function columnSet(props) {
    const {column, tablesList} = props;
    // return (
    //     <ListItem sx = {{border: "2px solid black", margin: "5px" }}>
    //         <Typography>{props.name}</Typography>
    //     </ListItem>
    // )

    return (
        <ListItem>
            <Grid container columnSpacing = {2} columns = {10} sx = {{border: "2px solid black", p: "5px", margin: "2px"}}>
                <Grid item xs = {2} sx = {{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Typography variant = "body" sx = {{fontWeight: "bold"}}>{column}</Typography>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body">Initial Value:</Typography>
                    <TextField id = {"initValue-" + column}/>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body">Label:</Typography>
                    <TextField id = {"label-" + column}/>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body">Reference:</Typography>
                    <Select inputProps = {{id: "ref-" + column }} defaultValue = "" fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
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
                    <TextField id = {"type-" + column}/>
                </Grid>
            </Grid>
        </ListItem>
    )
}