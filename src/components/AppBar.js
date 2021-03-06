import React, { useEffect } from "react";
import {
    AppBar as AppBarMUI,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Drawer,
    List,
    Link,
    ListItemIcon,
    ListItemText,
    ListItem,
    Divider,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import HomeIcon from "@material-ui/icons/Home";
import { Link as LinkRouter, useHistory } from "react-router-dom";
import { isAuthenticated } from "../API/auth";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    nav: {
        width: "100%",
    },
}));

export default function AppBar() {
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [DrawerState, setDrawerState] = React.useState(false);
    const [authenticated, setAuthenticated] = React.useState(isAuthenticated);

    history.listen(() => {
        setAuthenticated(isAuthenticated());
    });

    const toggleDrawer = () => {
        setDrawerState(!DrawerState);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <nav id="nav" className={classes.nav}>
            <AppBarMUI position="static" color="primary">
                <Toolbar>
                    {authenticated && (
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" className={classes.title}>
                        Slate
                    </Typography>
                    {authenticated && (
                        <>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={open}
                                onClose={handleClose}
                                disableScrollLock={true}
                            >
                                <Link
                                    component={LinkRouter}
                                    to="/profile"
                                    color="inherit"
                                >
                                    <MenuItem onClick={handleClose}>
                                        Profile
                                    </MenuItem>
                                </Link>
                                <Link
                                    component={LinkRouter}
                                    to="/account"
                                    color="inherit"
                                >
                                    <MenuItem onClick={handleClose}>
                                        My Account
                                    </MenuItem>
                                </Link>
                                <Link
                                    component={LinkRouter}
                                    to="/logout"
                                    color="inherit"
                                >
                                    <MenuItem onClick={handleClose}>
                                        Logout
                                    </MenuItem>
                                </Link>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </AppBarMUI>
            <Drawer
                anchor="left"
                open={DrawerState}
                onClose={toggleDrawer}
                variant="temporary"
                disableScrollLock={true}
            >
                <List>
                    <Link
                        component={LinkRouter}
                        to="/"
                        color="secondary"
                        onClick={toggleDrawer}
                    >
                        <ListItem button>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                    </Link>
                    <Divider />
                    <Link
                        component={LinkRouter}
                        to="/notes"
                        color="secondary"
                        onClick={toggleDrawer}
                    >
                        <ListItem button>
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Notes" />
                        </ListItem>
                    </Link>
                    <Link
                        component={LinkRouter}
                        to="/categories"
                        color="secondary"
                        onClick={toggleDrawer}
                    >
                        <ListItem button>
                            <ListItemIcon>
                                <BookmarksIcon />
                            </ListItemIcon>
                            <ListItemText primary="Categories" />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
        </nav>
    );
}
