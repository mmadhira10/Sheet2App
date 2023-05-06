import React, { useState, useEffect, useContext } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import api from '../../app-routes';

const appSet = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    width: '30%',
    height: '30%',
    bgcolor: 'white',
    border: '2px solid #000',
}

export default function DeleteModal(props) {
    const {open, setOpen, table, deleteIndex, setDeleteIndex, updateCache} = props;

    function handleBack()
    {
        setOpen(false);
        setDeleteIndex(-1);
    }

    async function deleteRecord() {
        let body = {
          url: table.URL,
          index: deleteIndex,
        }
        try {
          const response = await api.post('/deleteRecord', body);
          await updateCache(table.URL);
          handleBack();
        } catch (error) {
        //   console.log(error)
        }
      }

    return (
        <Modal open={open}>
            <Box sx={appSet}>
                <Box sx={{paddingTop: "5%"}}>
                    <Typography variant="h4" fontWeight="bold" align="center" >Would you like to delete this record?</Typography>
                </Box>
                <Grid container sx={{paddingTop: "10%"}}>
                    <Grid item xs={6} align="center">
                        <Button variant='contained' style={{maxWidth: '200px', maxHeight: '200px', minWidth: '100px', minHeight: '30px'}} onClick={handleBack}>
                            No
                        </Button>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Button variant='contained' style={{maxWidth: '200px', maxHeight: '200px', minWidth: '100px', minHeight: '30px'}} color='error' onClick={deleteRecord}>
                            Yes
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}