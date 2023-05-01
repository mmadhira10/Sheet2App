import React, {useState} from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ViewSettings from "./ViewSettings.js";

export default function ViewCard(props) {

    const {settings} = props;

    const [openEdit, setOpenEdit] = useState(false);
    const [count, setCount] = useState(1);

    const [curView, setCurView] = useState(settings);
    
    function editView() {
        // console.log(settings);
        setOpenEdit(true);
        if(count == 1) {
            setCount(2);
        }
        else {
            setCount(1);
        }
    }

    return(
        <ListItem sx = {{display: "block", border: "1px solid black", width: "100%", marginBottom: "10px", boxShadow: 3 }}>
            <ViewSettings open = {openEdit} key = {count} settings = {settings} opType = "edit" setCurView={setCurView}/>
            <Grid container>
                <Grid item xs = {10}>
                    <Typography variant = "body" sx = {{fontSize: "30px", fontWeight: "bold"}}>{curView.name}   </Typography>
                    <Typography variant = "body" sx = {{fontSize: "16px", fontStyle: "italic"}}>{curView.view_type}</Typography>
                </Grid>
                <Grid item xs = {2} sx = {{display: "flex", justifyContent: "end"}}>
                    <Button variant = "contained" onClick = {editView}>Edit</Button>
                </Grid>
            </Grid> 
        </ListItem>
    )
}