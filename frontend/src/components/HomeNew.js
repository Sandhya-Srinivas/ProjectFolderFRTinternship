import React from 'react';
import { useMsal } from '@azure/msal-react';
import { useIsAuthenticated } from '@azure/msal-react';
import Button from 'react-bootstrap/Button';
import { blue } from '@material-ui/core/colors';
import { makeStyles, ThemeProvider, Typography } from '@material-ui/core';

import ToDo from './ToDo';
import DenseAppBar from '../Elements/TopAppBar';
import { theme } from '../Elements/ThemeChange';
import { loginRequest } from '../authConfig';

const useStyles = makeStyles({
  btn: {
    background: '#fff',
    color: blue[700],
  },
  div: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: blue[700],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const MainContent = () => {
  const isAuthenticated = useIsAuthenticated();

  const classes = useStyles();

  const { instance, accounts } = useMsal();

  return (
    <div className="App">
      {isAuthenticated ? (
        <div>
          <ThemeProvider theme={theme}>
            <DenseAppBar name="Todo List" />
            <ToDo user={accounts[0]} />
          </ThemeProvider>
        </div>
      ) : (
        <div className={classes.div}>
          <Typography
            style={{
              textAlign: 'center',
              justifySelf: 'center',
              color: 'white',
            }}
          >
            Please signin to access ToDo app
          </Typography>
          <Button
            className={classes.btn}
            variant="contained"
            color="inherit"
            onClick={() => {
              instance.loginRedirect(loginRequest).catch((e) => {
                console.log(e);
              });
            }}
          >
            Signin
          </Button>
        </div>
      )}
    </div>
  );
};

export default MainContent;
