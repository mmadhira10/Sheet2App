import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/EditRounded';
import TableCell from '@mui/material/TableCell';
import {
    Box,
    Modal,
    Typography,
    TableContainer,
    Paper,
    Button,
} from '@mui/material';

const appSet = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    width: '800px',
    height: '400px',
    bgcolor: 'white',
    border: '2px solid #000'
}

// const values = [["First Name", "Sameer"], ["Last Name", "Khan"], ["HW1", "1"], ["HW2", "90"], ["HW3", "95"], ["hw4", "45"], ["h25", "56"]];


export default function DetailView(props) {
    const [rows, setRows] = useState([]);
    const { open, setOpen, detail, detailRecord, setDetailRecord} = props;
    
    function handleBack() {
        setOpen(false);
        setDetailRecord([]);
    }

    function handleFilter() {
        let val = []
        for(let i = 0; i < detailRecord.length; i++) {
            if (detail.columns.includes(detailRecord[i][0]))
            {
                val.push(detailRecord[i])
            }
        }
        setRows(val);
    }

    useEffect(() => {
        handleFilter();
    },[detailRecord])

    let edit =detail.allowed_actions.includes("Edit");
    // if (detail.allowed_actions.includes("Edit"))
    // {
    //     edit = 
    //     <TableCell sx={{textalign:"center"}}><Button variant="contained"><EditIcon/></Button></TableCell>
    // }

    // function editButton(col) {
    //     if( detail.allowed_actions.includes("Edit") 
    //     && detail.columns.includes(col))
    //     {
    //         return(
    //             <TableCell sx={{textalign:"center"}}><Button variant="contained"><EditIcon/></Button></TableCell>
    //         );
    //     }
    //     else if(detail.allowed_actions.includes("Edit"))
    //     {
    //         return (
    //             <TableCell></TableCell>
    //         );
    //     }
    // }

    return(
        <Modal open={open} onClose={handleBack}>
            <Box sx={appSet}>
                <Box>
                    <Typography sx = {{borderBottom: "2px solid black", width: "100%"}} variant = "h2" align="center">{detail.name}</Typography>
                </Box>
                <TableContainer sx = {{maxWidth: "100%", maxHeight: "80.5%", overflowY: 'scroll', overflow: "auto"}} component={Paper}>
                <Table>
                    {
                        rows.map((cell, key) => (
                            <TableRow>
                                {
                                    edit && detail.editable_columns.includes(cell[0]) ? (
                                        <TableCell sx={{textalign:"center"}}><Button variant="contained"><EditIcon/></Button></TableCell>
                                    ) : edit ? (
                                        <TableCell></TableCell>
                                    ) : null
                                }
                                <TableCell variant="head" sx={{fontWeight:"bold", align: "center"}}>{cell[0]}</TableCell>
                                <TableCell sx={{align:"center"}}>{cell[1]}</TableCell>
                            </TableRow>
                        ))
                    }
                </Table>
                </TableContainer>
            </Box>
        </Modal>
    )
}
