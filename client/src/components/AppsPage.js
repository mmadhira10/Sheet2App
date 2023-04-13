import React, { useState, useEffect, useContext } from 'react'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import AppCard from './AppCard.js'
import ViewSettings from './ViewSettings.js'
import AppSettings from './AppSettings.js'
import ViewCard from './ViewCard.js'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import LogoutButton from './LogoutButton'

import api from '../app-routes'
import AuthContext from '../auth'

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

  const [creatingApp, setCreatingApp] = useState(false);

  const { auth } = useContext(AuthContext)

  // async function getCreatorApps() {
  //   try {
  //     const response = await api.get('/getCreatorApps/' + auth.email)
  //     setCreatorApps(response.data.apps);
  //     setCreatorID(response.data.appsID);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  //function to get all apps from database
  async function getMyApps() {
    let cApps;
    let dApps;
    let euApps;

    try {
      const response = await api.get('/getRoleApps/' + auth.email)
      setEndUserApps(response.data.apps);
      setEndUserID(response.data.appsID);
      // console.log(response.data.apps);
      // console.log(response.data.appsID);
      euApps = response.data.apps;
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await api.get('/getDevApps/' + auth.email)
      setDevApps(response.data.apps)
      setDevID(response.data.appsID);
      dApps = response.data.apps;
      // console.log("My Dev Apps");
      // console.log(response.data);
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await api.get('/getCreatorApps/' + auth.email)
      setCreatorApps(response.data.apps);
      setCreatorID(response.data.appsID);
      // console.log("My Creator Apps");
      // console.log(response.data);
      cApps = response.data.apps;
    } catch (error) {
      console.log(error)
    }
    let allApps = cApps.concat(dApps, euApps);
    // console.log("all apps:");
    // console.log(allApps);
    let myApps = [];
    let myAppsID = [];

    for(let i = 0; i < allApps.length; i++) {
      let currApp = allApps[i];
      if(!(myAppsID.includes(currApp._id))) {
        myApps.push(currApp);
        myAppsID.push(currApp._id);
      }
    }

    // console.log("array of unique apps");
    // console.log(myApps);
    //console.log(myApps);
    setApps(myApps);
  }

  // async function getDevApps() {
  //   try {
  //     const response = await api.get('/getDevApps/' + auth.email)
  //     setDevApps(response.data.apps)
  //     setDevID(response.data.appsID);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  async function getGlobalDev() {
    try {
      const response = await api.get('/isGlobalDevCreator/' + auth.email);
      setIsGlobalDev(response.data.isCreator);
      // console.log(response.data.isCreator);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // console.log('getMyApps')
    getMyApps()
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

  //map through array of apps and create an AppCard for each one

  return (
    <div>
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
              isGlobalDev = {isGlobalDev}/>
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
