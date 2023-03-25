import React, {useState} from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function ViewSettings(props) {
    
    const {settings, opType} = props;
    const [open, setOpen] = useState(props.open);
    const [openFilter, setOpenFilter] = useState(false);
    const [openRoles, setOpenRoles] = useState(false);
    const [viewName, setName] = useState(settings.name);
    const [table, setTable] = useState(settings.table);
    const [columns, setColumns] = useState(settings.columns);
    const [viewType, setViewType] = useState(settings.viewType);
    const [allowAct, setAllowAct] = useState(settings.allowedActions);
    const [editColumns, setEditColumns] = useState(settings.editColumns);
    const [filter, setFilter] = useState(settings.filter);
    const [userFilter, setUserFilter] = useState(settings.userFilter);
    const [editFilter, setEditFilter] = useState(settings.editFilter);
    const [roles, setRoles] = useState(settings.roles);
    console.log(viewName);
    const viewSet = {
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: "translate(-50%, -30%)",
        width: "50%",
        height: "77%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
      };

    const filterSet = {
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: "translate(-50%, -30%)",
        width: "40%",
        height: "40%",
        bgcolor: 'white',
        border: '2px solid #000',
      };

    const rolesSet = {
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: "translate(-50%, -30%)",
        width: "40%",
        height: "20%",
        bgcolor: 'white',
        border: '2px solid #000',
      };

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

    const MenuProps = {
        PaperProps: {
            style: {
              maxHeight: 240,
            },
          },
        };


    //functions for opening and closing this modal and nested ones
    function handleBack() {
        setOpen(false);
    }

    function handleFilter() {
        setOpenFilter(true);
    }

    function handleCloseFilter() {
        setOpenFilter(false);
    }

    function handleRoles() {
        setOpenRoles(true);
    }

    function handleCloseRoles() {
        setOpenRoles(false);
    }

    function handleChange(event) {
        let change = event.target.id;
        if(change == "nameText") {
            setName(event.target.value)
        }
        else if(change == "columnText") {
            setColumns(event.target.value);
        }
        else if(change == "editColumnText") {
            setEditColumns(event.target.value);
        }
    }

    function handleTableDropDown(event: SelectChangeEvent) {
        //console.log(event.target.id);
        console.log(event.target.value);
        setTable(event.target.value);
    }

    function handleTypeDropDown(event: SelectChangeEvent) {
        //console.log(event.target.id);
        console.log(event.target.value);
        setViewType(event.target.value);
    }

    function handleRolesDropDown(event: SelectChangeEvent) {
        //console.log(event.target.id);
        console.log(event.target.value);
        setRoles(event.target.value);
    }

    function handleAllowDropDown(event) {
        console.log(event.target.value);
        setAllowAct(event.target.value);
    }

    function saveView() {
        if(opType == "create") {
            createView();
        }
        else {
            editView();
        }
        handleBack();
    }

    function createView() {
    //     let allowArray = [];
    //     if(addRec == 1) {allowArray.push("add")};
    //     if(editRec == 1) {allowArray.push("edit")};
    //     if(delRec == 1) {allowArray.push("delete")};

    //     axios.post("/createView", {
    //         name: viewName,
    //         table: table,
    //         columns: columns,
    //         viewType: viewType,
    //         allowedActions: allowArray,
    //         roles: roles
    //       })
    //       .then(function (response) {
    //         console.log(response);
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //       });
    }

    function editView() {};

      
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
                <Box sx = {{display: "grid", gridTemplateRows: "repeat(6, 1fr)", gridTemplateColumns: "repeat(12, 1fr)", rowGap: 2, p: "20px"}}>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Name: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <TextField id = "nameText" value = {viewName} onChange = {handleChange} variant = "outlined" sx = {{margin: "5px"}}  size = "small"></TextField>
                    </Box> 
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Table: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <Select onChange = {handleTableDropDown} value = {table} fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
                            <MenuItem value = {"Gradebook"}>Gradebook</MenuItem>
                            <MenuItem value = {"Attendance"}>Attendance</MenuItem>
                        </Select> 
                    </Box>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Columns: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <TextField value = {columns} id = "columnText" onChange = {handleChange} variant = "outlined" sx = {{margin: "5px"}} size = "small"></TextField>
                    </Box> 
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >View Type: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <Select onChange = {handleTypeDropDown} value = {viewType} fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
                            <MenuItem value = {"Table"}>Table</MenuItem>
                            <MenuItem value = {"Detail"}>Detail</MenuItem>
                        </Select> 
                    </Box> 
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Allowed Actions: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <Select MenuProps = {MenuProps} multiple onChange = {handleAllowDropDown} value = {allowAct} fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
                            <MenuItem value = {"Add"}>Add</MenuItem>
                            <MenuItem value = {"Edit"}>Edit</MenuItem>
                            <MenuItem value = {"Delete"}>Delete</MenuItem>
                        </Select>
                    </Box>
                    <Box sx = {leftItem} gridColumn = "span 8">
                        <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Editable Columns: </Typography>
                    </Box>
                    <Box sx = {rightItem} gridColumn = "span 4">
                        <TextField value = {editColumns} id = "editColumnText" onChange = {handleChange} variant = "outlined" sx = {{margin: "5px"}} inputProps={{min: 0, style: { textAlign: 'right', background: "#FFFFFF"}}}  size = "small"></TextField>
                    </Box>
                </Box>
                <Grid container rowSpacing = {2} columnSpacing = {2}>
                    <Grid item xs = {6} sx = {{display: "flex", justifyContent: "center"}}>
                        <Button onClick = {handleRoles} fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "contained" >Set Roles</Button>
                    </Grid>
                    <Grid item xs = {6} sx = {{display: "flex", justifyContent: "center"}}>
                        <Button onClick = {handleFilter} fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "contained" >Filter Options</Button>
                    </Grid>
                    <Grid item xs = {6} sx = {{display: "flex", justifyContent: "center"}}>
                        <Button fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} color = "error" variant = "contained" >Delete View</Button>
                    </Grid>
                    <Grid item xs = {6} sx = {{display: "flex", justifyContent: "center"}}>
                        <Button onClick = {saveView} fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}} variant = "contained" >Save</Button>
                    </Grid>
                </Grid>
                <Modal open = {openFilter}>
                    <Box sx = {filterSet}>
                        <Box sx = {{display: "grid", gridTemplateRows: "repeat(3, 1fr)", gridTemplateColumns: "repeat(12, 1fr)", rowGap: 2, p: "10px"}}>
                            <Box sx = {leftItem} gridColumn = "span 8">
                                <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Filter: </Typography>
                            </Box>
                            <Box sx = {rightItem} gridColumn = "span 4">
                                <TextField  value = {filter}  variant = "outlined" sx = {{margin: "5px"}} size = "small"></TextField>
                            </Box>
                            <Box sx = {leftItem} gridColumn = "span 8">
                                <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Edit Filter: </Typography>
                            </Box>
                            <Box sx = {rightItem} gridColumn = "span 4">
                                <TextField value = {editFilter} variant = "outlined" sx = {{margin: "5px"}} size = "small"></TextField>
                            </Box>
                            <Box sx = {leftItem} gridColumn = "span 8">
                                <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >User Filter: </Typography>
                            </Box>
                            <Box sx = {rightItem} gridColumn = "span 4">
                                <TextField  value = {userFilter} variant = "outlined" sx = {{margin: "5px"}} size = "small"></TextField>
                            </Box>
                        </Box>
                        <Grid container rowSpacing = {2} columnSpacing = {2} sx = {{paddingTop: "20px"}}>
                            <Grid item xs = {3}></Grid>
                            <Grid item xs = {6} sx = {{display: "flex", justifyContent: "center"}}>
                                <Button onClick = {handleCloseFilter} fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}}variant = "contained" >Done</Button>
                            </Grid>
                            <Grid item xs = {3}></Grid>
                        </Grid>
                    </Box>
                </Modal>
                <Modal open = {openRoles}>
                    <Box sx = {rolesSet}>
                        <Box sx = {{display: "grid", gridTemplateRows: "repeat(1, 1fr)", gridTemplateColumns: "repeat(12, 1fr)", rowGap: 2, p: "10px"}}>
                            <Box sx = {leftItem} gridColumn = "span 8">
                                <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Roles: </Typography>
                            </Box>
                            <Box sx = {rightItem} gridColumn = "span 4">
                                <Select MenuProps = {MenuProps} multiple onChange = {handleRolesDropDown} value = {roles} fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
                                    <MenuItem value = {"Table"}>Table</MenuItem>
                                    <MenuItem value = {"Detail"}>Detail</MenuItem>
                                </Select> 
                            </Box>
                        </Box>
                        <Grid container rowSpacing = {2} columnSpacing = {2} sx = {{paddingTop: "20px"}}>
                            <Grid item xs = {3}></Grid>
                            <Grid item xs = {6} sx = {{display: "flex", justifyContent: "center"}}>
                                <Button onClick = {handleCloseRoles} fullWidth sx = {{marginLeft: "5px", marginRight: "5px"}}variant = "contained" >Done</Button>
                            </Grid>
                            <Grid item xs = {3}></Grid>
                        </Grid>
                    </Box>
                </Modal>
            </Box>
        </Modal>
  )
}