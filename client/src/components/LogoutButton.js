import AuthContext from '../auth';
import { GlobalStoreContext } from "../store";
import { useContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

export default function LogoutButton() {
    const { auth } = useContext(AuthContext);
    const { currentApp, setCurrentApp } = useContext(GlobalStoreContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [ click, setClick ] = useState(0);
    const navigate = useNavigate();


    const handleProfileMenuOpen = (event) => {
        setClick(1);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setClick(0);
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // setCurrentApp(null);
        handleMenuClose();
        auth.logoutUser();
    }

    const exitApp = () => {
        // setCurrentApp(null);
        navigate("/");
    }

    useEffect(() => {
        auth.loginUser();
    }, []);

    let role;
    let app;
    let button = 
    <Button 
                sx = {{marginLeft: "5px", marginRight: "5px"}} 
                variant = "outlined" 
                aria-haspopup="true" 
                aria-controls='primary-search-account-menu'
                onClick={handleProfileMenuOpen}
            >
                {auth.email}
                <ExpandMoreRoundedIcon />
            </Button>;
    
    if (click)
    {
        button = 
        <Button 
                sx = {{marginLeft: "10px", marginRight: "10px"}} 
                variant = "outlined" 
                aria-haspopup="true" 
                aria-controls='primary-search-account-menu'
                onClick={handleProfileMenuOpen}
            >
                {auth.email}
                <ExpandLessRoundedIcon />
            </Button>;
    }

    // if(currentApp) {
    //     role = 
    //     <MenuItem style={{ backgroundColor: 'transparent' }}>
    //         Developer@{currentApp.name}</MenuItem>;
    //     app = 
    //     <MenuItem onClick={exitApp}>
    //         Exit {currentApp.name}</MenuItem>;
    // }


    return(
        <Box>
            {
                button
            }
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                id='primary-search-account-menu'
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}>
                {/* {
                    role
                }
                {
                    app
                } */}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Box>
    );
}