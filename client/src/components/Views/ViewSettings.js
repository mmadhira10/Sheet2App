import React, {useState, useContext, useEffect} from 'react';
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
import { GlobalStoreContext } from "../../store";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import api from "../../app-routes";

export default function ViewSettings(props) {
    const { currentApp, setCurrentApp } = useContext(GlobalStoreContext);

    const {settings, opType, setCurView} = props;
    const [open, setOpen] = useState(props.open);
    const [openFilter, setOpenFilter] = useState(false);
    const [openRoles, setOpenRoles] = useState(false);
    const [viewName, setName] = useState(settings.name);
    const [tableOpts, setTableOpts] = useState([]);
    const [table, setTable] = useState(""); //this is the table name

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);



    useEffect(() => {
        getTables()
    }, []);

    useEffect(() => {
        if (opType === "edit" && tableOpts.length > 0) {
            // console.log("tableopts: ");
            // console.log(tableOpts);
            //find the matching table" from the array and then get its name
            let currTableName = tableOpts.find(table => table._id === settings.table).name
            // console.log(currTableName);
            setTable(currTableName);

            let newTable = tableOpts.find(element => element.name == currTableName);
            setColumnOpts(newTable.columns);

        };
    }, [tableOpts]);

    useEffect(() => {
        getRoles();
    }, [])


    async function getRoles() {
        try {
            const response = await api.post("/getColumnsFromURL/", {url: currentApp.role_membership_sheet});
            // console.log(response.data);
            let roleArr = response.data.columns.slice(1);
            setRoleOpts(roleArr);
        }
        catch (error) {
            // console.log(error);
        }
    }
    // console.log("Current App:")
    // console.log(currentApp);

    
    

    
    const [columns, setColumns] = useState(settings.columns);
    const [viewType, setViewType] = useState(settings.view_type);
    const [allowAct, setAllowAct] = useState(settings.allowed_actions);
    const [editColumns, setEditColumns] = useState(settings.editable_columns);
    const [filter, setFilter] = useState(settings.filter);
    const [userFilter, setUserFilter] = useState(settings.user_filter);
    const [editFilter, setEditFilter] = useState(settings.edit_filter);
    const [roles, setRoles] = useState(settings.roles);

    const [columnOpts, setColumnOpts] = useState([]);
    const [roleOpts, setRoleOpts] = useState([]);

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

    //get tables and columns from table and rolemembership sheet
    async function getTables() {
        try {
            const response = await api.get("/getTables/" + currentApp._id, {withCredentials: true});
            // console.log("Tables")
            // console.log(response.data);
            setTableOpts(response.data.tables);
        }
        catch (error) {
            // console.log(error);
        }
     }

    

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
        setName(event.target.value)
    }

    function handleTableDropDown(event) {
        //console.log(event.target.id);
        //console.log(event.target.value);
        setTable(event.target.value);

        //When the table changes, we need to load in the columns from that table for the other dropdown
        let table_name = event.target.value;
        let newTable = tableOpts.find(element => element.name == table_name);
        setColumnOpts(newTable.columns);

        setColumns([]);
        setEditColumns([]);
        setFilter("");
        setUserFilter("");
        setEditFilter("");
    }

    function handleColDropDown(event) {
        //console.log(event.target.id);
        // console.log(event.target.value);
        setColumns(event.target.value);
        setEditColumns([]);
    }

    function handleEditColDropDown(event) {
        //console.log(event.target.id);
        // console.log(event.target.value);
        setEditColumns(event.target.value);
    }

    function handleTypeDropDown(event) {
        //console.log(event.target.id);
        // console.log(event.target.value);
        setViewType(event.target.value);
        setAllowAct([]);
        setFilter("");
        setUserFilter("");
        setEditFilter("");
    }

    function handleRolesDropDown(event) {
        //console.log(event.target.id);
        // console.log(event.target.value);
        setRoles(event.target.value);
    }

    function handleAllowDropDown(event) {
        // console.log(event.target.value);
        setAllowAct(event.target.value);
    }

    function handleFilterDropDown(event) {
        // console.log(event.target.value);
        setFilter(event.target.value);
    }

    function handleUserFilterDropDown(event) {
        // console.log(event.target.value);
        setUserFilter(event.target.value);
    }

    function handleEditFilterDropDown(event) {
        // console.log(event.target.value);
        setEditFilter(event.target.value);
    }

    function handleDeleteView() {

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

    async function createView() {
        let allowArray = [];
        let tableId = tableOpts.find(foundTable => foundTable.name === table)._id;
        try {
            const response = await api.post("/createView/" + currentApp._id, {
                name: viewName,
                table: tableId,
                columns: columns,
                view_type: viewType,
                allowed_actions: allowAct,
                roles: roles,
                editable_columns: editColumns,
                filter: filter,
                user_filter: userFilter,
                edit_filter: editFilter
            });
            // console.log(response);
            setCurrentApp(response.data.app);
        }
        catch (error) {
            console.log(error);
        }
    }

    function editView() {
        let allowArray = [];
        // console.log("editview");
        let tableId = tableOpts.find(foundTable => foundTable.name === table)._id;
        let body = {
            _id: settings._id,
            name: viewName,
            table: tableId,
            columns: columns,
            view_type: viewType,
            allowed_actions: allowAct,
            roles: roles,
            editable_columns: editColumns,
            filter: filter,
            user_filter: userFilter,
            edit_filter: editFilter
          }
        // console.log(body);
        api.post("/updateView", body)
          .then(function (response) {
            setCurView(response.data.view);
            // console.log(response);
          })
          .catch(function (error) {
            // console.log(error);
          });
    };

    let actions;
    let viewFilter;

    if (viewType == "Table")
    {
        actions = 
        <>
            <Box sx = {leftItem} gridColumn = "span 8">
                    <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Allowed Actions: </Typography>
                </Box>
                <Box sx = {rightItem} gridColumn = "span 4">
                    <Select MenuProps = {MenuProps} multiple onChange = {handleAllowDropDown} value = {allowAct} fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
                        <MenuItem value = {"Add"}>Add</MenuItem>
                        <MenuItem value = {"Delete"}>Delete</MenuItem>
                    </Select>
                </Box>
        </>

        viewFilter =
        <>
            <Box sx = {leftItem} gridColumn = "span 8">
                <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Filter: </Typography>
            </Box>
            <Box sx = {rightItem} gridColumn = "span 4">
                <Select onChange={handleFilterDropDown} value={filter} fullWidth size="small" variant="outlined" sx={{ margin: "5px" }}>
                    <MenuItem value = {""}>None</MenuItem>
                {
                    columnOpts.map((column, key) => (
                        <MenuItem key={column.name} value={column.name}>{column.name}</MenuItem>
                    ))
                }
                </Select>                             
            </Box>
            <Box sx = {leftItem} gridColumn = "span 8">
                <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >User Filter: </Typography>
            </Box>
            <Box sx = {rightItem} gridColumn = "span 4">
                <Select onChange={handleUserFilterDropDown} value={userFilter} fullWidth size="small" variant="outlined" sx={{ margin: "5px" }}
                >
                    <MenuItem value = {""}>None</MenuItem>
                {
                    columnOpts.map((column, key) => (
                        <MenuItem key={column.name} value={column.name}>{column.name}</MenuItem>
                    ))
                }
                </Select>                             
            </Box>
        </>
    }
    else if (viewType == "Detail")
    {
        actions = 
        <>
            <Box sx = {leftItem} gridColumn = "span 8">
                    <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Allowed Actions: </Typography>
                </Box>
                <Box sx = {rightItem} gridColumn = "span 4">
                    <Select MenuProps = {MenuProps} multiple onChange = {handleAllowDropDown} value = {allowAct} fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}>
                        <MenuItem value = {"Edit"}>Edit</MenuItem>
                    </Select>
                </Box>
        </>

        viewFilter = 
        <>
            <Box sx = {leftItem} gridColumn = "span 8">
                <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Edit Filter: </Typography>
            </Box>
            <Box sx = {rightItem} gridColumn = "span 4">
                <Select onChange={handleEditFilterDropDown} value={editFilter} fullWidth size="small" variant="outlined" sx={{ margin: "5px" }}
                >
                    <MenuItem value = {""}>None</MenuItem>
                {
                    columnOpts.map((column, key) => (
                        <MenuItem key={column.name} value={column.name}>{column.name}</MenuItem>
                    ))
                }
                </Select>                             
            </Box>
        </>
    }

    let editCols;

    if (allowAct == "Edit")
    {
        editCols = 
        <>
            <Box sx = {leftItem} gridColumn = "span 8">
                <Typography variant = "body" fontWeight = "bold" sx = {{fontSize: "24px", paddingLeft: "5px"}} >Editable Columns: </Typography>
            </Box>
            <Box sx = {rightItem} gridColumn = "span 4">
                <Select onChange = {handleEditColDropDown} value = {editColumns} fullWidth size = "small" variant = "outlined" sx = {{margin: "5px"}}
                    multiple>
                    {
                        columns.map((column, key) => (
                            <MenuItem key = {column} value = {column}>{column}</MenuItem>
                        ))
                    }
                </Select> 
            </Box>
        </>
    }

    const handleDialogOpen = () => {
        setOpenDeleteDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleDelete = async () => {
        // Add your delete logic here
        try {
            await api.delete(`/deleteView/${settings._id}`);
            handleDialogClose();
            handleBack();
        } catch (error) {
            // console.log(error);
        }
    };

    return (
        <div>
             <Dialog open={openDeleteDialog} onClose={handleDialogClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this view?
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Modal open={open}>
               
                <Box sx={viewSet}>
                    <Grid container sx={{ paddingBottom: "10px" }} >
                        <Grid item xs={8}>
                            <Typography variant="h4" sx={{ paddingLeft: "5px" }} >View Settings </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button color="error" onClick={handleBack} variant="contained" sx={{ position: "absolute", top: "1%", right: "1%" }}>Back</Button>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: "grid", gridTemplateRows: "repeat(6, 1fr)", gridTemplateColumns: "repeat(12, 1fr)", rowGap: 2, p: "20px" }}>
                        <Box sx={leftItem} gridColumn="span 8">
                            <Typography variant="body" fontWeight="bold" sx={{ fontSize: "24px", paddingLeft: "5px" }} >Name: </Typography>
                        </Box>
                        <Box sx={rightItem} gridColumn="span 4">
                            <TextField id="nameText" value={viewName} onChange={handleChange} variant="outlined" sx={{ margin: "5px" }} size="small"></TextField>
                        </Box>
                        <Box sx={leftItem} gridColumn="span 8">
                            <Typography variant="body" fontWeight="bold" sx={{ fontSize: "24px", paddingLeft: "5px" }} >Table: </Typography>
                        </Box>
                        <Box sx={rightItem} gridColumn="span 4">
                            <Select onChange={handleTableDropDown} value={table} fullWidth size="small" variant="outlined" sx={{ margin: "5px" }}>
                                {
                                    tableOpts.map((table, key) => (
                                        <MenuItem key={table.name} value={table.name}>{table.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </Box>
                        <Box sx={leftItem} gridColumn="span 8">
                            <Typography variant="body" fontWeight="bold" sx={{ fontSize: "24px", paddingLeft: "5px" }} >Columns: </Typography>
                        </Box>
                        <Box sx={rightItem} gridColumn="span 4">
                            <Select onChange={handleColDropDown} value={columns} fullWidth size="small" variant="outlined" sx={{ margin: "5px" }}
                                multiple>
                                {
                                    columnOpts.map((column, key) => (
                                        <MenuItem key={column.name} value={column.name}>{column.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </Box>
                        <Box sx={leftItem} gridColumn="span 8">
                            <Typography variant="body" fontWeight="bold" sx={{ fontSize: "24px", paddingLeft: "5px" }} >View Type: </Typography>
                        </Box>
                        <Box sx={rightItem} gridColumn="span 4">
                            <Select onChange={handleTypeDropDown} value={viewType} fullWidth size="small" variant="outlined" sx={{ margin: "5px" }}>
                                <MenuItem value={"Table"}>Table</MenuItem>
                                <MenuItem value={"Detail"}>Detail</MenuItem>
                            </Select>
                        </Box>
                        {
                            actions
                        }
                        {
                            editCols
                        }
                    </Box>
                    <Grid container rowSpacing={2} columnSpacing={2}>
                        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
                            <Button onClick={handleRoles} fullWidth sx={{ marginLeft: "5px", marginRight: "5px" }} variant="contained" >Set Roles</Button>
                        </Grid>
                        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
                            <Button onClick={handleFilter} fullWidth sx={{ marginLeft: "5px", marginRight: "5px" }} variant="contained" >Filter Options</Button>
                        </Grid>
                        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
                            <Button onClick={handleDialogOpen} fullWidth sx={{ marginLeft: "5px", marginRight: "5px" }} color="error" variant="contained" >Delete View</Button>
                        </Grid>
                        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
                            <Button onClick={saveView} fullWidth sx={{ marginLeft: "5px", marginRight: "5px" }} variant="contained" >Save</Button>
                        </Grid>
                    </Grid>
                    <Modal open={openFilter}>
                        <Box sx={filterSet}>
                            <Box sx={{ display: "grid", gridTemplateRows: "repeat(3, 1fr)", gridTemplateColumns: "repeat(12, 1fr)", rowGap: 2, p: "10px" }}>
                                {
                                    viewFilter
                                }
                            </Box>
                            <Grid container rowSpacing={2} columnSpacing={2} sx={{ paddingTop: "20px" }}>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
                                    <Button onClick={handleCloseFilter} fullWidth sx={{ marginLeft: "5px", marginRight: "5px" }} variant="contained" >Done</Button>
                                </Grid>
                                <Grid item xs={3}></Grid>
                            </Grid>
                        </Box>
                    </Modal>
                    <Modal open={openRoles}>
                        <Box sx={rolesSet}>
                            <Box sx={{ display: "grid", gridTemplateRows: "repeat(1, 1fr)", gridTemplateColumns: "repeat(12, 1fr)", rowGap: 2, p: "10px" }}>
                                <Box sx={leftItem} gridColumn="span 8">
                                    <Typography variant="body" fontWeight="bold" sx={{ fontSize: "24px", paddingLeft: "5px" }} >Roles: </Typography>
                                </Box>
                                <Box sx={rightItem} gridColumn="span 4">
                                    <Select MenuProps={MenuProps} multiple onChange={handleRolesDropDown} value={roles} fullWidth size="small" variant="outlined" sx={{ margin: "5px" }}>
                                        {
                                            roleOpts.map((role, key) => (
                                                <MenuItem key={role} value={role}>{role}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </Box>
                            </Box>
                            <Grid container rowSpacing={2} columnSpacing={2} sx={{ paddingTop: "20px" }}>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
                                    <Button onClick={handleCloseRoles} fullWidth sx={{ marginLeft: "5px", marginRight: "5px" }} variant="contained" >Done</Button>
                                </Grid>
                                <Grid item xs={3}></Grid>
                            </Grid>
                        </Box>
                    </Modal>
                </Box>
            </Modal>
        </div>
    )
}