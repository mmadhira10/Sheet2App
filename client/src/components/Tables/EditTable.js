import React, {useState} from 'react';
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
import EditColumn from "./EditColumn.js"

import api from "../../app-routes";



export default function EditTable(props) {
    const {table, setCurTable, tablesList} = props;
    // console.log(setCurTable)
    const [open, setOpen] = useState(props.open);
    const [openCol, setOpenCol] = useState(false);
    const [tableName, setTableName] = useState(table.name);
    //const [URL, setURL] = useState(table.URL);
    const [key, setKey] = useState(table.key);
    const [labelCol, setLabelCol] = useState("");


    //const [columnNames, setColumnNames] = useState([]);

    const tableSet = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: "translate(-50%, -50%)",
        width: "50%",
        height: "40%",
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
        else if(change == "keyText") {
            setKey(event.target.value);
        }
    }

    function handleKeyChange(event) {
        setKey(event.target.value);
    }

    // async function getColumns() {
    //     try {
    //         const response = await axios.post("http://127.0.0.1:4000/getColumnsFromURL", {url: URL});
    //         console.log(response.data);
    //         setColumnNames(response.data.columns);
    //         setOpenCol(true);
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    //     console.log(columnNames);
    //     console.log(openCol);
    // }

    function editColumns() {
        setOpenCol(true);
    }

    function closeEditCol() {
        setOpenCol(false);
    }

    async function saveColumnsAndTable() {
        let columns = table.columns;
        let columnsArray = [];
        // console.log(columns.length);
        for (let i = 0; i < columns.length; i++) {
            let name = columns[i].name;
            // console.log(name);
            let initValText = document.getElementById("initValue-" + name);
            let labelText = document.getElementById("label-" + name);
            let refText = document.getElementById("ref-" + name);
            let typeText = document.getElementById("type-" + name);

            //console.log(labelText == null);
            //console.log(labelText.value);
            let columnObj;

            //replace &quot; with js escaped double quote
            let initVal = initValText.value.replace(/&quot;/g, '\\"');
            console.log("initVal: " + initVal);

            if(refText.value == "") {
                columnObj = {
                    name: name,
                    initial_val: initVal,
                    label: labelText.checked,
                    type: typeText.value,
                };
            }
            else {
                columnObj = {
                    name: name,
                    initial_val: initVal,
                    label: labelText.checked,
                    reference: refText.value,
                    type: typeText.value,
                }; 
            }

            columnsArray.push(columnObj);
        }
        //let GID = URL.split('/')[6].substring(9);
        let newTable = {
            name: tableName,
            URL: table.URL,
            sheet_id: table.sheet_id,
            key: key,
            columns: columnsArray,
            _id: table._id
        };

        // console.log(newTable);
        try {
            const response = await api.post("/updateTable/", newTable);
            setCurTable(response.data.table);
            // console.log(response.data);

        }
        catch (error) {
            console.log(error);
        }
        setOpenCol(false);
        setOpen(false);
    }

    async function saveTable() {
        let newTable = {
            name: tableName,
            URL: table.URL,
            sheet_id: table.sheet_id,
            key: key,
            columns: table.columns,
            _id: table._id
        };

        try {
            const response = await api.post("/updateTable/", newTable);
            setCurTable(response.data.table);
            // console.log(response.data);


        }
        catch (error) {
            console.log(error);
        }

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
                    <TextField id = "urlText" value = {table.URL} label = "Read Only" variant = "outlined" sx = {{margin: "5px", marginTop: "10px"}}  size = "small" InputProps={{readOnly: true,}}></TextField>
                    </Box>
                </Box>
                <Grid container rowSpacing = {2} columnSpacing = {2} columns = {10}>
                    <Grid item xs = {2}/>
                    <Grid item xs = {2}>
                        <Button  onClick = {saveTable} fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "contained" >Save</Button>
                    </Grid>
                    <Grid item xs = {2}/>
                    <Grid item xs = {2} sx = {{display: "flex", justifyContent: "center"}}>
                        <Button  onClick = {editColumns} fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "contained" >Edit Columns</Button>
                    </Grid>
                    <Grid item xs = {2}/>
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
                                        {table.columns.map((column, key) => (
                                            <MenuItem key = {column.name} value = {column.name} >{column.name}</MenuItem>
                                        )) }
                                    </Select>
                                </Box>
                            </Box> 
                                <List>
                                    {
                                        table.columns.map((column, key) => (
                                            <EditColumn column = {column} key = {column.name} tablesList  = {tablesList} labelCol = {labelCol} setLabelCol = {setLabelCol}/>
                                        ))
                                    }
                                </List>
                        </Box>
                        <Box sx = {{display: "grid", width: "100%", gridTemplateColumns: "repeat(2, 1fr)"}}>
                            <Button  onClick = {closeEditCol} sx = {{justifySelf: "center", marginTop: "10px"}} variant = "contained" color = "error">Back</Button>
                            <Button  onClick = {saveColumnsAndTable} sx = {{justifySelf: "center", marginTop: "10px"}} variant = "contained">Save Columns</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Modal>
  )
}