import React, { useState } from 'react';

import { NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

import { useMsal } from '@azure/msal-react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    color: blue,
    position: 'fixed',
    width: '100%',
    zIndex: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  signOutBtn: {
    position: 'absolute',
    right: 10,
    top: -10,
    bottom: -10,
  },
}));

export default function DenseAppBar(prop) {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const { instance } = useMsal();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar variant="dense">
          {isMobile ? (
            <div>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                aria-controls="menubar"
                aria-haspopup="true"
                onClick={handleMenuClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menubar"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {prop.name !== 'Todo List' && (
                  <MenuItem>
                    <NavLink to="/">Todo list</NavLink>
                  </MenuItem>
                )}
                {prop.name !== 'Add Todo' && prop.name !== 'Edit Todo' && (
                  <MenuItem>
                    <NavLink to="/Add">Add</NavLink>
                  </MenuItem>
                )}
              </Menu>
              <Button
                className={classes.signOutBtn}
                color="inherit"
                onClick={() => {
                  instance.logoutRedirect({
                    postLogoutRedirectUri: '/',
                  });
                }}
              >
                SignOut
              </Button>
            </div>
          ) : (
            <div style={{ position: 'absolute', right: 10 }}>
              {prop.name !== 'Todo List' && (
                <NavLink to="/">
                  <Button variant="contained" color="inherit">
                    Todo List
                  </Button>
                </NavLink>
              )}
              {prop.name !== 'Add Todo' && prop.name !== 'Edit Todo' && (
                <NavLink to="/Add">
                  <Button variant="contained" color="inherit">
                    Add Todo
                  </Button>
                </NavLink>
              )}
              <Button
                color="inherit"
                onClick={() => {
                  instance.logoutRedirect({
                    postLogoutRedirectUri: '/',
                  });
                }}
              >
                SignOut
              </Button>
            </div>
          )}
          <Typography variant="h6" color="inherit">
            {prop.name}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
