import React, {useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { GlobalStoreContext } from "../store";
import axios from 'axios';
import NavBar from "./NavBar.js";

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

export default function EditApp() {
    const { currentApp, setCurrentApp } = useContext(GlobalStoreContext);

    const [name, setName] = useState(currentApp.name);
    const [roleMem, setRoleMem] = useState(currentApp.role_membership_sheet);
    const [publish, setPublish] = useState(currentApp.published);


    function handleChange(event) {
        let change = event.target.id;
        if(change == "appNameSet") {
            setName(event.target.value);
        }
        else if(change == "roleMemSet") {
            setRoleMem(event.target.value);
        }
    }

    async function saveApp() {
        let app = {
            creator: "John Doe",
            name: name,
            role_membership_sheet: roleMem,
            published: publish
          }

        try {
            const response = await axios.post("http://127.0.0.1:4000/updateApp/", app);
            console.log(response.data);

        }
        catch (error) {
            console.log(error);
        }
    }

    async function handlePublish() {
        let app = {
            creator: currentApp.creator,
            name: name,
            role_membership_sheet: roleMem,
            published: true
          }

        try {
            const response = await axios.post("http://127.0.0.1:4000/updateApp/" + currentApp._id, app);
            console.log(response.data);
            setPublish(true);

        }
        catch (error) {
            console.log(error);
        }
        
    }

    return(
        <Box sx = {{position: "absolute", display: "block", width: "100%", height: "100%"}}>
            <NavBar/>
            <Box sx = {{position: "absolute", display: "block", height: "10%", left: "5%", top: "10%"}}>
                <Typography variant = "h2">App Settings</Typography>
            </Box>
            <Box sx = {{width: "50%", height: "40%", position: "absolute", top: "20%", display: "grid", gridTemplateRows: "repeat(4, 1fr)", gridTemplateColumns: "repeat(12, 1fr)", rowGap: 2, p: "20px"}}>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}}>Creator: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <Typography variant = "body" sx = {{fontSize: "24px", paddingRight: "5px"}} >{currentApp.creator} </Typography>
                    </Box>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}}>Name: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <TextField value = {name} id = "appNameSet" onChange = {handleChange} variant = "outlined" sx = {{margin: "5px"}} size = "small"></TextField>
                    </Box>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Role Membership Sheet: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <TextField id = "roleMemSet" value = {roleMem}  variant = "outlined" sx = {{margin: "5px"}}  size = "small"></TextField>
                    </Box>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}}>Publish Status: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <Typography variant = "body" sx = {{fontSize: "24px", paddingRight: "5px", fontStyle: "italic"}} >{(publish ? "Published" : "Unpublished")} </Typography>
                    </Box>
            </Box>
            <Box  sx = {{position: "absolute", top: "65%", display: "grid", width: "50%", p:"20px",gridTemplateColumns: "repeat(10, 1fr)" }} >
                <Box gridColumn = "span 2"></Box>
                <Box gridColumn = "span 2">
                    <Button onClick = {saveApp} variant = "contained">Save</Button>
                </Box>
                <Box gridColumn = "span 2"></Box>
                <Box gridColumn = "span 2">
                    <Button onClick = {handlePublish} variant = "contained" disabled = {publish}>Publish</Button>
                </Box>
                <Box gridColumn = "span 2"></Box>
            </Box>

        </Box>
    )
}