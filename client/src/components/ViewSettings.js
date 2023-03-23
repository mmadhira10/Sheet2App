import React, {useState} from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function ViewSettings(props) {
    //const {open} = props.open;
    const [open, setOpen] = useState(props.open);
    //console.log(open);
    const viewSet = {
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: "translate(-50%, -30%)",
        width: "50%",
        height: "87%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
      };

    function handleBack() {
        setOpen(false);
    }

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
      
    return(
        <Modal open = {open}>
            <Box sx = {viewSet}>
                <Grid container sx = {{paddingBottom: "10px"}} >
                    <Grid item xs = {8}>
                        <Typography variant = "h4" sx = {{paddingLeft: "5px"}} >View Settings </Typography> 
                    </Grid>
                    <Grid item xs = {4}>
                        <Button color = "error" onClick = {handleBack} variant = "contained" sx = {{position: "absolute", top: "1%", right: "1%"}}>Back</Button>
                    </Grid>
                </Grid>
                <Box sx = {{display: "grid", gridTemplateRows: "repeat(7, 1fr)", gridTemplateColumns: "repeat(12, 1fr)", rowGap: 2, p: "20px"}}>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}}>Creator: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <Typography sx = {{fontSize: "24px", paddingRight: "5px"}} variant = "body">John Doe </Typography>
                    </Box>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Name: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <TextField variant = "outlined" sx = {{margin: "5px"}} inputProps={{min: 0, style: { textAlign: 'right', background: "#FFFFFF"}}}  size = "small"></TextField>
                    </Box> 
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Table: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <Select fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}} inputProps={{min: 0, style: { textAlign: 'right', background: "#FFFFFF"}}}>
                            <MenuItem value = {"Gradebook"}>Gradebook</MenuItem>
                            <MenuItem value = {"Attendance"}>Attendance</MenuItem>
                        </Select> 
                    </Box>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Columns: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <TextField variant = "outlined" sx = {{margin: "5px"}} inputProps={{min: 0, style: { textAlign: 'right', background: "#FFFFFF"}}}  size = "small"></TextField>
                    </Box> 
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >View Type: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <Select fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}} inputProps={{min: 0, style: { textAlign: 'right', background: "#FFFFFF"}}}>
                            <MenuItem value = {"Table"}>Table</MenuItem>
                            <MenuItem value = {"Detail"}>Detail</MenuItem>
                        </Select> 
                    </Box> 
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Allowed Actions: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <Button sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "outlined" >Add</Button>
                        <Button sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "outlined" >Edit</Button>
                        <Button sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "outlined" >Delete</Button>
                    </Box>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Editable Columns: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <TextField variant = "outlined" sx = {{margin: "5px"}} inputProps={{min: 0, style: { textAlign: 'right', background: "#FFFFFF"}}}  size = "small"></TextField>
                    </Box>
                </Box>
                <Grid container rowSpacing = {2} columnSpacing = {2}>
                    <Grid item xs = {6} sx = {{display: "flex", justifyContent: "center"}}>
                        <Button fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "contained" >Set Roles</Button>
                    </Grid>
                    <Grid item xs = {6} sx = {{display: "flex", justifyContent: "center"}}>
                        <Button fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "contained" >Filter Options</Button>
                    </Grid>
                    <Grid item xs = {6} sx = {{display: "flex", justifyContent: "center"}}>
                        <Button fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} color = "error" variant = "contained" >Delete View</Button>
                    </Grid>
                    <Grid item xs = {6} sx = {{display: "flex", justifyContent: "center"}}>
                        <Button fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "contained" >Save</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
  )
}