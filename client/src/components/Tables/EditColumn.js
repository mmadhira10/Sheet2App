import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';

//<TextField defaultValue = {column.reference} id = {"ref-" + column.name}/>
export default function EditColumn(props) {
    const {column, tablesList, labelCol, setLabelCol} = props;
    const [label, setLabel] = useState(column.label);
    // return (
    //     <ListItem sx = {{border: "2px solid black", margin: "5px" }}>
    //         <Typography>{props.name}</Typography>
    //     </ListItem>
    // )
    let refVal = column.reference;
    let typeVal = column.type;
    if(refVal == undefined) {
        refVal = ""; 
    }
    useEffect(() => {
        if(label && labelCol == "") {
            setLabelCol("label-" + column.name);
        }
    }, []);

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
            setLabelCol("label-" + column.name);
            setLabel(true);
        }
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
                    
                    <Checkbox id = {"label-"+column.name} disabled = {disabled} checked = {label} onChange = {handleChange} sx={{ '& .MuiSvgIcon-root': { fontSize: 48 } }}/>
                </Grid>
                <Grid item xs = {2}>
                    <Typography variant = "body">Reference:</Typography>
                    <Select inputProps = {{id: "ref-" + column.name }} defaultValue = {refVal} fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
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
                    <Select inputProps = {{id: "type-" + column.name }} defaultValue = {typeVal} fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
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