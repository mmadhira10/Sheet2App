import React, {useState} from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TableSettings from "./TableSettings";
import EditTable from "./EditTable.js";

export default function TableCard(props) {

    const {table, tablesList} = props;

    const [openEdit, setOpenEdit] = useState(false);
    const [count, setCount] = useState(1);

    const [curTable, setCurTable] = useState(table);


    
    

    function editTable() {
        setOpenEdit(true);
        if(count == 1) {
            setCount(2);
        }
        else {
            setCount(1);
        }
    }

    return(
        <ListItem sx = {{display: "block", border: "1px solid black", width: "100%", marginBottom: "10px", boxShadow: 3 }} >
            <EditTable open = {openEdit} table = {curTable} key = {count} setCurTable = {setCurTable} tablesList = {tablesList}/>
            <Grid container>
                <Grid item xs = {10}>
                    <Typography variant = "body" sx = {{fontSize: "30px", fontWeight: "bold"}}>{curTable.name}</Typography>
                </Grid>
                <Grid item xs = {2} sx = {{display: "flex", justifyContent: "end"}}>
                    <Button variant = "contained" onClick = {editTable}>Edit</Button>
                </Grid>
            </Grid> 
        </ListItem>
    )
}