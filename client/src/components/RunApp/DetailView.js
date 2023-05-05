import React, { useState, useEffect, useContext } from 'react';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/EditRounded';
import CheckIcon from '@mui/icons-material/CheckRounded';
import TableCell from '@mui/material/TableCell';
import {
    Box,
    Modal,
    Typography,
    TableContainer,
    Paper,
    Button,
    TextField,
    Grid
} from '@mui/material';

import AuthContext from '../../auth'
import api from '../../app-routes'

const appSet = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    width: '800px',
    height: '620px',
    bgcolor: 'white',
    border: '2px solid #000'
}

// const values = [["First Name", "Sameer"], ["Last Name", "Khan"], ["HW1", "1"], ["HW2", "90"], ["HW3", "95"], ["hw4", "45"], ["h25", "56"]];


export default function DetailView(props) {
    const [ rows, setRows ] = useState([]);
    const [ editCols, setEditCols] = useState([])
    const { open, setOpen, detail, detailRecord, setDetailRecord, filter, table} = props;
    const [ edit, setEdit ] = useState(false);
    const [usedCols, setUsedCols] = useState([]);
    const [allRecVals, setAllRecVals] = useState(detailRecord);
    const [errMsg, setErrMsg] = useState("");
    const { auth } = useContext(AuthContext);
    
    function handleBack() {
        setOpen(false);
        setDetailRecord([]);
        setEdit(false)
    }

    function handleFilter() {
        let val = [];
        let used = []; //array of column indices that are displayed in the detail view
        for(let i = 0; i < detailRecord.length; i++) {
            if (detail.columns.includes(detailRecord[i][0]))
            {
                val.push(detailRecord[i]);
                used.push(i);

            }
        }
        setRows(val);
        setUsedCols(used);
    }

    function handleSubmit() {
        setEdit(false);
        setOpen(false);
        editRecord();
    }

    function isValidURL(URL) {
        let URLregex = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator  

        return URLregex.test(URL);
    }

    function isBoolean(boolean) {
        let isBool = false;
        if(boolean.toUpperCase() == "FALSE" || boolean.toUpperCase() == "TRUE") {
            isBool = true;
        }
        return isBool;
    }

    function typeCorrect(newRec) {
        for(let i = 0; i < newRec.length; i++) {
            if(newRec[i] == "") {
                if(table.columns[i].name == table.key && table.columns[i].initial_val == "") {
                    setErrMsg("Key column cannot be empty")
                }
                else{
                    continue;
                }
            }
            if(table.columns[i].type == "URL") {
                if(isValidURL(newRec[i]) == false) {
                    setErrMsg("Invalid URL");
                    return false;
                }
            }
            else if(table.columns[i].type == "Boolean") {
                if(isBoolean(newRec[i]) == false) {
                    console.log(i);
                    console.log(table.columns[i].name);
                    setErrMsg("Invalid Boolean");
                    return false;
                }
            }
            else if(table.columns[i].type == "Number") {
                if(isNaN(newRec[i]) == true) {
                    console.log("is a number");
                    setErrMsg("Invalid Number");
                    return false;
                }
            }
            
        }
        return true;
    }


    async function editRecord() {
        let newRec = []; //array of all column values-> 1 row
        let initCols = [];
        for(let i = 0; i < detailRecord.length; i++) {
            let index = usedCols.indexOf(i);
            if(index > -1) {
                let item = document.getElementById("item-" + index);
                let val = item.value;
                if(val == "" && table.columns[i].initial_val != "") {
                    initCols.push(i);
                }
                newRec.push(val);
            }
            else {
                let val = detailRecord[i][1];
                if(val == "" && table.columns[i].initial_val != "") {
                    initCols.push(i);
                }
                newRec.push(detailRecord[i][1]);
            }
        }
        console.log(newRec);
        let isCorrect = typeCorrect(newRec);
        if(isCorrect == false) {
            //display error message
            console.log(errMsg);
        }
        else{
            for(let i = 0; i < initCols.length; i++) {
                let index = initCols[i];
                if(table.columns[index].initial_val == "=ADDED_BY()") {
                    newRec[index] = auth.email;
                }
                else {
                    newRec[index] = table.columns[index].initial_val;
                }
            }
        }
    }

    useEffect(() => {
        handleFilter();
    },[detailRecord])

    let editCondition = detail.allowed_actions.includes("Edit");

    return(
        <Modal open={open} onClose={handleBack}>
            <Box sx={appSet}>
                <Box >
                    <Typography sx = {{borderBottom: "2px solid black", width: "100%"}} variant = "h2" align="center">{detail.name}</Typography>
                </Box>
                <TableContainer sx = {{maxWidth: "100%", maxHeight: "80.5%", overflowY: 'scroll', overflow: "auto"}} component={Paper}>
                <Table>
                    {
                        rows.map((cell, key) => (
                            <TableRow key = {key}>
                                
                                <TableCell variant="head" sx={{fontWeight:"bold", align: "center"}}>{cell[0]}</TableCell>
                                {
                                    edit && detail.editable_columns.includes(cell[0]) ? (
                                        <TableCell sx={{align:"center"}}>
                                            <TextField  
                                                label={cell[0]} 
                                                defaultValue={cell[1]}
                                                multiline 
                                                variant="standard"
                                                id = {"item-" + key}
                                            />
                                        </TableCell>
                                    ) : (
                                        <TableCell sx={{align:"center"}}>{cell[1]}</TableCell>
                                    )
                                }
                            </TableRow>
                        ))
                    }
                </Table>
                </TableContainer>
                {
                    editCondition && filter ? (
                        <Grid container sx={{paddingTop: "5px"}}>
                            <Grid item xs={6} align="center">
                                <Button variant="contained" style={{maxWidth: '500px', maxHeight: '200px', minWidth: '250px', minHeight: '30px'}} disabled={edit} onClick={() => setEdit(true)}><EditIcon/></Button>
                            </Grid>
                            <Grid item xs={6} align="center">
                                <Button variant="contained" style={{maxWidth: '500px', maxHeight: '200px', minWidth: '250px', minHeight: '30px'}} disabled={!edit} onClick={handleSubmit}><CheckIcon/></Button>
                            </Grid>
                        </Grid>
                    ) : null
                }
                
            </Box>
        </Modal>
    )
}
