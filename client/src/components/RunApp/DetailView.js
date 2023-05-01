import React, { useState } from 'react';
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
    width: '50%',
    height: '50%',
    bgcolor: 'white',
    border: '2px solid #000',
    overflowY: 'scroll'
}

const values = [["First Name", "Sameer"], ["Last Name", "Khan"], ["HW1", "1"], ["HW2", "90"], ["HW3", "95"]];


export default function DetailView(props) {
    const { open, setOpen } = props;

    function handleBack() {
        setOpen(false);
    }

    return(
        <Modal open={open} onClose={handleBack}>
            <Box sx={appSet}>
                <Box sx={{paddingBottom: 1}}>
                    <Typography sx = {{borderBottom: "2px solid black", width: "100%"}} variant = "h2" align="center">Year: Record #1</Typography>
                </Box>
                <TableContainer sx = {{maxWidth: "100%", maxHeight: "100%", }} component={Paper}>
                <Table>
                    {
                        values.map((cell, key) => (
                            <TableRow>
                                <TableCell variant="head" sx={{fontWeight:"bold"}}>{cell[0]}</TableCell>
                                <TableCell>{cell[1]}</TableCell>
                                <TableCell><Button variant="contained"><EditIcon/></Button></TableCell>
                            </TableRow>
                        ))
                    }
                </Table>
            </TableContainer>
            </Box>
        </Modal>
    )
}
