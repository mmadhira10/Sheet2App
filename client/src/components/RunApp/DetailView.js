import React, { useState, useEffect } from 'react';
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
    const { open, setOpen, detail, detailRecord, setDetailRecord, filter} = props;
    const [ edit, setEdit ] = useState(false);
    
    function handleBack() {
        setOpen(false);
        setDetailRecord([]);
        setEdit(false)
    }

    function handleFilter() {
        let val = []
        for(let i = 0; i < detailRecord.length; i++) {
            if (detail.columns.includes(detailRecord[i][0]))
            {
                val.push(detailRecord[i]);
            }
        }
        setRows(val);
    }

    function handleSubmit() {
        setEdit(false);
        setOpen(false);
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
                            <TableRow>
                                {/* {
                                    filter && editCondition && detail.editable_columns.includes(cell[0]) ? (
                                        <TableCell sx={{textalign:"center"}}><Button variant="contained" ><EditIcon/></Button></TableCell>
                                    ) : filter && editCondition ? (
                                        <TableCell></TableCell>
                                    ) : null
                                } */}
                                <TableCell variant="head" sx={{fontWeight:"bold", align: "center"}}>{cell[0]}</TableCell>
                                {
                                    edit && detail.editable_columns.includes(cell[0]) ? (
                                        <TableCell sx={{align:"center"}}>
                                            <TextField  
                                                label={cell[0]} 
                                                defaultValue={cell[1]}
                                                multiline 
                                                variant="standard"
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
