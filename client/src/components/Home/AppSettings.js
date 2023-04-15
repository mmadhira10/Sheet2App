import React, { useState, useContext } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import AuthContext from '../../auth'

import api from '../../app-routes'

const appSet = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -30%)',
  width: '50%',
  height: '40%',
  bgcolor: 'white',
  border: '2px solid #000',
}

const leftItem = {
  display: 'flex',
  borderLeft: '1px solid black',
  borderTop: '1px solid black',
  borderBottom: '1px solid black',
  alignItems: 'center',
}

const rightItem = {
  display: 'flex',
  justifyContent: 'end',
  borderRight: '1px solid black',
  borderTop: '1px solid black',
  borderBottom: '1px solid black',
  alignItems: 'center',
}

export default function AppSettings(props) {
  const [open, setOpen] = useState(props.open)
  const [name, setName] = useState('')
  const [roleMem, setRoleMem] = useState('')
  const { apps, setApps, creatingApp, setCreatingApp } = props

  const { auth } = useContext(AuthContext)

  function handleBack() {
    setOpen(false)
  }

  function handleChange(event) {
    let change = event.target.id
    if (change == 'appName') {
      setName(event.target.value)
      // console.log(name)
    } else if (change == 'roleMem') {
      setRoleMem(event.target.value)
      // console.log(roleMem)
    }
  }

  async function createApp() {
    let newApp = {
      creator: auth.email,
      name: name,
      role_membership_sheet: roleMem,
      published: false,
    }

    try {
      const response = await api.post('/createApp/', newApp)
      setApps((apps) => [...apps, response.data.app])
      setCreatingApp(!creatingApp);
      // console.log(response.data)
    } catch (error) {
      console.log(error)
    }

    handleBack()
  }

  return (
    <Modal open={open}>
      <Box sx={appSet}>
        <Grid container sx={{ paddingBottom: '10px' }}>
          <Grid item xs={8}>
            <Typography variant='h4' sx={{ paddingLeft: '5px' }}>
              App Settings{' '}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button
              color='error'
              onClick={handleBack}
              variant='contained'
              sx={{ position: 'absolute', top: '1%', right: '1%' }}
            >
              Back
            </Button>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'grid',
            gridTemplateRows: 'repeat(2, 1fr)',
            gridTemplateColumns: 'repeat(12, 1fr)',
            rowGap: 2,
            p: '20px',
          }}
        >
          <Box sx={leftItem} gridColumn='span 8'>
            <Typography
              variant='body'
              fontWeight='bold'
              sx={{ fontSize: '24px', paddingLeft: '5px' }}
            >
              Name:{' '}
            </Typography>
          </Box>
          <Box sx={rightItem} gridColumn='span 4'>
            <TextField
              id='appName'
              onChange={handleChange}
              variant='outlined'
              sx={{ margin: '5px' }}
              size='small'
            ></TextField>
          </Box>
          <Box sx={leftItem} gridColumn='span 8'>
            <Typography
              variant='body'
              fontWeight='bold'
              sx={{ fontSize: '24px', paddingLeft: '5px' }}
            >
              Role Membership Sheet:{' '}
            </Typography>
          </Box>
          <Box sx={rightItem} gridColumn='span 4'>
            <TextField
              id='roleMem'
              onChange={handleChange}
              variant='outlined'
              sx={{ margin: '5px' }}
              size='small'
            ></TextField>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'block',
            width: '40%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Button
            onClick={createApp}
            fullWidth
            sx={{ marginLeft: '5px', marginRight: '5px' }}
            variant='contained'
          >
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
