import React, { useState, useEffect, useContext } from 'react'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import AppCard from './AppCard.js'
// import ViewSettings from './ViewSettings.js'
import AppSettings from './AppSettings.js'
// import ViewCard from './ViewCard.js'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import LogoutButton from '../LogoutButton'
import LinearProgress from '@mui/material/LinearProgress';
import Modal from '@mui/material/Modal';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import api from '../../app-routes'
import AuthContext from '../../auth'

const testInfo = {
  creator: 'John Doe',
  name: 'Test App',
  isPublished: false,
  _id: 'testing',
}

const titleStyle = {
  position: 'absolute',
  top: '0%',
  width: '100%',
  height: '25%',
}

const myAppsStyle = {
  position: 'absolute',
  top: '20%',
  width: '80%',
  height: '10%',
}

const appsList = {
  position: 'absolute',
  top: '35%',
  width: '80%',
  height: '50%',
  overflow: "auto"
}

export default function AppsPage() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(1)
  const [apps, setApps] = useState([])
  const [creatorApps, setCreatorApps] = useState([])
  const [devApps, setDevApps] = useState([]);
  const [endUserApps, setEndUserApps] = useState([]);
  const [creatorID, setCreatorID] = useState([])
  const [devID, setDevID] = useState([]);
  const [endUserID, setEndUserID] = useState([]);
  const [isGlobalDev, setIsGlobalDev] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [creatingApp, setCreatingApp] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [appToBeDeleted, setAppToBeDeleted] = useState(null);

  const { auth } = useContext(AuthContext)
  
  

  async function getGlobalDev() {
    try {
      const response = await api.get('/isGlobalDevCreator/' + auth.email);
      setIsGlobalDev(response.data.isCreator);
      // console.log(response.data.isCreator);
    } catch (error) {
      console.log(error);
    }
  }

  async function getMyApps() {
    try {
      const response = await api.get('/getMyApps/' + auth.email)
      setApps(response.data.apps);
      setCreatorID(response.data.cAppsID);
      setDevID(response.data.dAppsID);
      setEndUserID(response.data.euAppsID);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    // console.log('getMyApps')
    getMyApps()
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
  }, [creatingApp]) // everytime we create a new app, repeat

  useEffect(() => {
    getGlobalDev();
    // console.log("line 158: " + isGlobalDev);
  }, []) // call once


  function createApp() {
    setOpen(true)
    if (count == 1) {
      setCount(2)
    } else {
      setCount(1)
    }
  }

  const handleModalOpen = (appId) => {
    setOpenDeleteModal(true);
    setAppToBeDeleted(appId);
  };

  const handleModalClose = () => {
    setOpenDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete('/deleteApp/' + appToBeDeleted);
      // console.log(response);
      setApps(apps.filter((app) => app._id !== appToBeDeleted));
      setCreatorID(creatorID.filter((id) => id !== appToBeDeleted));
      setDevID(devID.filter((id) => id !== appToBeDeleted));
      setEndUserID(endUserID.filter((id) => id !== appToBeDeleted));
      setOpenDeleteModal(false);
      setAppToBeDeleted(null);
    } catch (error) {
      console.log(error);
    }
  };
  



  //map through array of apps and create an AppCard for each one
  return (
    <div>
      <Modal open={isLoading}>
        <LinearProgress />
      </Modal>

      <Dialog open={openDeleteModal} onClose={handleModalClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <AppSettings open={open} key={count} apps={apps} setApps={setApps} creatingApp={creatingApp} setCreatingApp={setCreatingApp}/>
      <Box sx={titleStyle}>
        <AppBar
          sx={{
            position: 'static',
            height: '60%',
            bgcolor: '#F5F5F5',
            borderBottom: '2px solid black',
          }}
        >
          <Toolbar>
            <Typography align='center' variant='h1' color='black'>
              Sheet 2 App
            </Typography>
            <Box sx={{ flexGrow: 8 }}></Box>
            <LogoutButton />
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={myAppsStyle}>
        <Typography variant='h2'>My Apps</Typography>
      </Box>
      <Box sx={appsList}>
        <List>
          {apps.map((app, key) => (
            <AppCard appInfo={app} key={app._id}
              isCreator = {creatorID.includes(app._id)}
              isDev = {devID.includes(app._id)}
              isEndUser = {endUserID.includes(app._id)}
              isGlobalDev = {isGlobalDev}
              handleModalOpen = {handleModalOpen}
              />
          ))}
        </List>
      </Box>
      <Button
        onClick={createApp}
        variant="contained"
        disabled = {!isGlobalDev}
        sx={{ position: 'absolute', top: '85%', width: '80%' }}
      >
        Create New App
      </Button>
    </div>
  )
}
