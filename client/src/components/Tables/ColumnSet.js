import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';


export default function ColumnSet(props) {
    const {column, tablesList, labelCol, setLabelCol} = props;
    const [label, setLabel] = useState(false);
    // return (
    //     <ListItem sx = {{border: "2px solid black", margin: "5px" }}>
    //         <Typography>{props.name}</Typography>
    //     </ListItem>
    // )

    let disabled = false;

    if(labelCol != "" && label != true) {
        disabled = true;
    }

    function handleChange() {
        if(label) {
            setLabelCol("");
            setLabel(false);
        }
        else{
            setLabelCol("label-" + column);
            setLabel(true);
        }
    }

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
                    <Checkbox id = {"label-"+column} disabled = {disabled} checked = {label} onChange = {handleChange} sx={{ '& .MuiSvgIcon-root': { fontSize: 48 } }}/>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body">Reference:</Typography>
                    <Select inputProps = {{id: "ref-" + column }} defaultValue = "" fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
                        <MenuItem key = "blank" value = "">None</MenuItem>
                        {
                        tablesList.map((table, key) => (
                            <MenuItem key = {table.name} value = {table._id}>{table.name}</MenuItem>
                        ))
                        }
                    </Select>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body">Type:</Typography>
                    <Select inputProps = {{id: "type-" + column }} defaultValue = "" fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
                        <MenuItem key = "boolean" value = "Boolean">Boolean</MenuItem>
                        <MenuItem key = "text" value = "Text">Text</MenuItem>
                        <MenuItem key = "number" value = "Number">Number</MenuItem>
                        <MenuItem key = "url" value = "URL">URL</MenuItem>
                    </Select>
                </Grid>
            </Grid>
        </ListItem>
    )
}