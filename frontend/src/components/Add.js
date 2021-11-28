import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Done from '@material-ui/icons/Done';
import { Button, FormGroup, Typography } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';

import history from '../Redirection/history';
import DenseAppBar from '../Elements/TopAppBar';

const useStylesNoUser = makeStyles({
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

const useStyles = makeStyles((theme) => ({
  cbStyle: {
    color: blue[400],
  },
  done: {
    color: blue[900],
  },
  btn: {
    display: 'block',
  },
  cbBox: {
    float: 'right',
    backgroundColor: 'white',
    width: '30%',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
}));

const useStylesMobile = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    margin: 100,
    width: '80%',
  },
});

const useStylesNotMobile = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    width: 500,
    margin: 50,
    marginTop: 100,
  },
});

const Add = () => {
  const { accounts } = useMsal();
  const user = accounts[0];
  const isAuthenticated = useIsAuthenticated();
  const classes = useStyles();
  const mobileClass = useStylesMobile();
  const notMobileClass = useStylesNotMobile();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const noUser = useStylesNoUser();

  const responsiveStyle = isMobile ? mobileClass : notMobileClass;

  const location = useLocation();
  const todo = location.state?.todo;
  const [name, setName] = useState(todo ? todo.name : '');
  const [_id, set_id] = useState(todo ? todo._id : null);
  const [desc, setDesc] = useState(todo ? todo.desc : '');
  const [done, setDone] = useState(todo ? todo.done : false);
  const [error0, setError0] = useState(false);
  const [error1, setError1] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  const onChange = (text, id) => {
    console.log('Called');
    if (!text) {
      id ? setError1(true) : setError0(true);
      return;
    }
    console.log(text);
    id ? setName(text) : setDesc(text);
    id ? setError1(false) : setError0(false);
  };

  const handleSubmit = () => {
    setDisableBtn(true);
    console.log('Button click');
    if (error1 || !name) {
      setError1(true);
      setDisableBtn(false);
      return;
    }
    if (error0 || !desc) {
      setError0(true);
      setDisableBtn(false);
      return;
    }
    const todo = { name, desc, done, _id, userId: user.homeAccountId };
    axios({
      method: 'post',
      url: 'https://cocky-babbage-d0fe84.netlify.app/.netlify/functions/api/add',
      data: todo,
    })
      .then((res) => {
        console.log(res.data);
        if (res.code === 200) alert('Success');
        window.location.href = '/';
      })
      .catch(() => {
        console.log('Error - post');
        alert('Failed');
        setDisableBtn(false);
      });
  };

  if (isAuthenticated && user) {
    return (
      <div>
        <DenseAppBar name={todo ? 'Edit Todo' : 'Add Todo'} />
        <div>
          {console.log('user', user)}
          {console.log(name, done, desc)}
          <form className={responsiveStyle.root} noValidate autoComplete="off">
            <div className={responsiveStyle.text}>
              <FormGroup className={classes.cbBox}>
                <FormControlLabel
                  control={
                    <Checkbox
                      className={classes.cbStyle}
                      checked={done}
                      checkedIcon={<Done className={classes.done} />}
                      name="checkedH"
                      onChange={() => setDone(!done)}
                    />
                  }
                  label="done?"
                />
              </FormGroup>
              <TextField
                error={error1}
                id="outlined-error-helper-text"
                label="ToDo name"
                defaultValue={name}
                helperText={error1 ? 'Enter valid name' : null}
                variant="outlined"
                style={{
                  width: '65%',
                  marginBottom: 10,
                  backgroundColor: 'white',
                }}
                onChange={(event) => onChange(event.target.value, 1)}
              />
              <TextField
                error={error0}
                id="outlined-error-helper-text"
                label="ToDo Description"
                defaultValue={desc}
                helperText={error0 ? 'Enter valid desc' : null}
                variant="outlined"
                multiline={true}
                minRows={10}
                style={{ width: '100%', backgroundColor: 'white' }}
                onChange={(event) => onChange(event.target.value, 0)}
              />
            </div>
            <Button
              className={classes.btn}
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              disabled={disableBtn}
            >
              {todo ? 'Edit Todo' : 'Add Todo'}
            </Button>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div className={noUser.div}>
        <Typography
          style={{ textAlign: 'center', justifySelf: 'center', color: 'white' }}
        >
          Please signin to access ToDo app
        </Typography>
        <Button
          className={noUser.btn}
          variant="contained"
          color="inherit"
          onClick={() => history.replace('/')}
        >
          Signin
        </Button>
      </div>
    );
  }
};

export default Add;
