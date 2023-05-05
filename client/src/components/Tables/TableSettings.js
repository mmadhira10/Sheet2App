import React, {useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ColumnSet from "./ColumnSet.js"
import { GlobalStoreContext } from '../../store';

import api from "../../app-routes";



export default function TableSettings(props) {

    const {tablesList} = props;

    const [open, setOpen] = useState(props.open);
    const [openCol, setOpenCol] = useState(false);
    const [tableName, setTableName] = useState("");
    const [URL, setURL] = useState("");
    const [key, setKey] = useState("");
    const [labelCol, setLabelCol] = useState("");

    const { currentApp, setCurrentApp } = useContext(GlobalStoreContext);


    const [columnNames, setColumnNames] = useState([]);

    const tableSet = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: "translate(-50%, -50%)",
        width: "50%",
        height: "35%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
      };

      const columnSet = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: "translate(-50%, -50%)",
        width: "50%",
        height: "55%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
      };


    const leftItem = {
        display: "flex",
        borderLeft: "1px solid black",
        borderTop: "1px solid black",
        borderBottom: "1px solid black",
        alignItems: "center",
    };

    const rightItem = {
        display: "flex",
        justifyContent: "end",
        borderRight: "1px solid black",
        borderTop: "1px solid black",
        borderBottom: "1px solid black",
        alignItems: "center",
    }


    //functions for opening and closing this modal and nested ones
    function handleBack() {
        setOpen(false);
    }


    function handleChange(event) {
        let change = event.target.id;
        if(change == "nameText") {
            setTableName(event.target.value);
        }
        else if(change == "urlText") {
            setURL(event.target.value);
        }
    }

    function handleKeyChange(event) {
        setKey(event.target.value);
    }

    async function getColumns() {
        try {
            const response = await api.post("/getColumnsFromURL/", {url: URL});
            // console.log(response.data);
            setColumnNames(response.data.columns);
            setOpenCol(true);
        }
        catch (error) {
            console.log(error);
        }
        // console.log(columnNames);
        // console.log(openCol);
    }

    async function saveColumnsAndTable() {
        let columnsArray = [];
        // console.log(columnNames.length);
        for (let i = 0; i < columnNames.length; i++) {
            let name = columnNames[i];
            // console.log(name);
            let initValText = document.getElementById("initValue-" + name);
            let labelText = document.getElementById("label-" + name);
            let refText = document.getElementById("ref-" + name);
            let typeText = document.getElementById("type-"+name);

            //console.log(labelText == null);
            // console.log(labelText.value);

            //replace &quot; with js escaped double quote
            let initVal = initValText.value.replace(/&quot;/g, '\\"');

            let columnObj = {
                name: name,
                initial_val: initVal,
                label: labelText.checked,
                type: typeText.value
            };



            if (refText.value !== "") {
                columnObj.reference = refText.value;    
            }

            columnsArray.push(columnObj);
        }
        let sheet_id = URL.split('/')[6].substring(9);
        let newTable = {
            name: tableName,
            URL: URL,
            sheet_id: sheet_id,
            key: key,
            columns: columnsArray
        };

        

        try {
            // console.log(newTable);
            const response = await api.post("/createTable/" + currentApp._id, newTable);
            setCurrentApp(response.data.app);
            // console.log(response.data);
        }
        catch (error) {
            console.log(error);
        }
    
        setOpenCol(false);
        setOpen(false);
    }

      
    return(
        <Modal open = {open}>
            <Box sx = {tableSet}>
                <Grid container sx = {{paddingBottom: "10px"}} >
                    <Grid item xs = {8}>
                        <Typography variant = "h4" sx = {{paddingLeft: "5px"}} >Table Settings </Typography> 
                    </Grid>
                    <Grid item xs = {4}>
                        <Button color = "error" onClick = {handleBack} variant = "contained" sx = {{position: "absolute", top: "1%", right: "1%"}}>Back</Button>
                    </Grid>
                </Grid>
                <Box sx = {{display: "grid", gridTemplateRows: "repeat(2, 1fr)", gridTemplateColumns: "repeat(12, 1fr)", rowGap: 2, p: "20px"}}>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Name: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <TextField id = "nameText" value = {tableName} onChange = {handleChange} variant = "outlined" sx = {{margin: "5px"}}  size = "small"></TextField>
                    </Box> 
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >URL: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <TextField id = "urlText" value = {URL} onChange = {handleChange} variant = "outlined" sx = {{margin: "5px"}}  size = "small"></TextField>
                    </Box>
                </Box>
                <Grid container rowSpacing = {2} columnSpacing = {2}>
                    <Grid item xs = {3}/>
                    <Grid item xs = {6} sx = {{display: "flex", justifyContent: "center"}}>
                        <Button  onClick = {getColumns} fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "contained" >Import Columns</Button>
                    </Grid>
                    <Grid item xs = {3}/>
                </Grid>
                <Modal open = {openCol}>
                    <Box sx = {columnSet}>
                        <Box sx = {{display: "block", width: "100%", height: "80%", overflow: "auto", margin: "auto", borderBottom: "2px solid black"}}>
                        <Box sx = {{display: "grid", gridTemplateRows: "repeat(1, 1fr)", gridTemplateColumns: "repeat(12, 1fr)", rowGap: 2, p: "20px"}}>
                            <Box sx = {leftItem} gridColumn = "span 8">
                                <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Key: </Typography>
                            </Box>
                            <Box sx = {rightItem} gridColumn = "span 4">
                                <Select value = {key} onChange={handleKeyChange} fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}} >
                                    {columnNames.map((column, key) => (
                                        <MenuItem key = {column} value = {column} >{column}</MenuItem>
                                    )) }
                                </Select>
                            </Box>
                        </Box>
                            <List>
                                {
                                    columnNames.map((column, key) => (
                                        <ColumnSet column = {column} key = {column} tablesList = {tablesList} labelCol={labelCol} setLabelCol={setLabelCol}/>
                                    ))
                                }
                            </List>
                        </Box>
                        <Box sx = {{display: "grid", width: "100%"}}>
                            <Button onClick = {saveColumnsAndTable} sx = {{justifySelf: "center", marginTop: "10px"}} variant = "contained">Save Columns</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Modal>
  )
}