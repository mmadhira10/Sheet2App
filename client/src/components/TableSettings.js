import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'

export default function TableSettings(props) {

    const [open, setOpen] = useState(props.open);
    const [tableName, setTableName] = useState("");
    const [URL, setURL] = useState("");
    const [key, setKey] = useState("");
    const [colName, setColName] = useState("");
    const [initVal, setInitVal] = useState("");
    const [label, setLabel] = useState("");
    const [ref, setRef] = useState("");
    const [type, setType] = useState("");

    const [columnNames, setColumnNames] = useState([]);
    console.log(columnNames);
    
    const tableSet = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: "translate(-50%, -50%)",
        width: "50%",
        height: "50%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
      };

      const columnSet = {
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: "translate(-50%, -30%)",
        width: "40%",
        height: "60%",
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
        else if(change == "keyText") {
            setKey(event.target.value);
        }
    }

    async function getColumns() {
        try {
            const response = await axios.get("http://127.0.0.1:4000/getColumnsFromURL");
            console.log(response.data);
            setColumnNames(response.data.apps);
        }
        catch (error) {
            console.log(error);
        }
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
                <Box sx = {{display: "grid", gridTemplateRows: "repeat(3, 1fr)", gridTemplateColumns: "repeat(12, 1fr)", rowGap: 2, p: "20px"}}>
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
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Key: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <TextField value = {key} id = "keyText" onChange = {handleChange} variant = "outlined" sx = {{margin: "5px"}} size = "small"></TextField>
                    </Box> 
                </Box>
                <Grid container rowSpacing = {2} columnSpacing = {2}>
                    <Grid item xs = {4}/>
                    <Grid item xs = {4} sx = {{display: "flex", justifyContent: "center"}}>
                        <Button  fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "contained" >Import Columns</Button>
                    </Grid>
                    <Grid item xs = {4}/>
                </Grid>
            </Box>
        </Modal>
  )
}