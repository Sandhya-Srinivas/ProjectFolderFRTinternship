import axios from 'axios';

import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { Delete, Done } from '@material-ui/icons';
import Checkbox from '@material-ui/core/Checkbox';
import { Button, FormGroup, Grid, IconButton } from '@material-ui/core';

import {
  useStylesCommon,
  useStylesNotMobile,
  useStylesMobile,
} from './StylesToDo';

const ToDo = (acc) => {
  const user = acc.user;
  const history = useHistory();
  const mobileClass = useStylesMobile();
  const notMobileClass = useStylesNotMobile();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const responsiveStyle = isMobile ? mobileClass : notMobileClass;
  const commonStyle = useStylesCommon();

  const [result, setResult] = useState(false);
  const todoArr = useRef([]);
  const [render, setRender] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const getTodoList = () => {
    // fetch(`http://localhost:5000/json/${user.homeAccountId}`)
    fetch(
      // `https://todowebappbackendfrtintern.azurewebsites.net/json/${user.homeAccountId}`
      `https://cocky-babbage-d0fe84.netlify.app/.netlify/functions/api/json/${user.homeAccountId}`
    )
      .then(async (res) => {
        try {
          let todoObj = await res.json();
          try {
            todoArr.current = todoObj['data'];
            console.log(todoObj['data'], typeof todoObj);
            todoArr.current.forEach((todo) => {
              todo.ischanged = false;
              todo.isdeleted = false;
            });
          } catch (err) {
            console.log(err);
          }
          setResult(true);
          console.log(todoArr.current, typeof todoArr);
        } catch (err) {
          console.log('data error: ', err);
        }
      })
      .catch((err) => {
        console.log('fetch error', err);
        alert('New user or Failed to connect to server ');
      });
  };

  useEffect(getTodoList, []);

  const handleCheck = (todo) => {
    todo.done = !todo.done;
    todo.ischanged = true;
    setRender(!render);
  };

  const handleSubmit = async () => {
    setDisableBtn(true);
    console.log('Button click');
    axios({
      method: 'post',
      url: 'https://cocky-babbage-d0fe84.netlify.app/.netlify/functions/api/submit',
      data: todoArr,
    })
      .then((res) => {
        console.log(res.data.data);
        alert('Success');
        window.location.href = '/';
      })
      .catch(() => {
        console.log('Error - post');
        alert('Post error');
        setDisableBtn(false);
      });
  };

  const handleDelete = (todo) => {
    todo.isdeleted = !todo.isdeleted;
    setRender(!render);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid container className={responsiveStyle.root}>
        {result &&
          todoArr.current.map((todo) => (
            <Grid
              item
              key={todo._id}
              className={responsiveStyle.gridItem}
              onClick={() => {
                if (!todo.isdeleted)
                  history.replace({ pathname: '/Add', state: { todo: todo } });
              }}
            >
              <Card className={responsiveStyle.card} variant="outlined">
                <CardContent>
                  <FormGroup
                    style={{ float: 'right', flexDirection: 'row' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      className={
                        !todo.isdeleted ? commonStyle.cbStyle : commonStyle.grey
                      }
                      checkedIcon={
                        <Done
                          className={
                            !todo.isdeleted
                              ? commonStyle.done
                              : commonStyle.grey
                          }
                        />
                      }
                      name="checkedH"
                      checked={todo.done}
                      disabled={todo.isdeleted}
                      onChange={() => {
                        handleCheck(todo);
                      }}
                    />
                    <IconButton
                      color="inherit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(todo);
                      }}
                    >
                      <Delete
                        className={
                          !todo.isdeleted ? commonStyle.done : commonStyle.grey
                        }
                      />
                    </IconButton>
                  </FormGroup>
                  <Typography
                    variant="h5"
                    style={
                      !todo.isdeleted ? { color: 'black' } : { color: 'grey' }
                    }
                  >
                    {todo.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={
                      !todo.isdeleted
                        ? {
                            color: 'black',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }
                        : {
                            color: 'grey',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }
                    }
                  >
                    {todo.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
      <Button
        className={commonStyle.btn}
        variant="contained"
        color="primary"
        onClick={() => {
          handleSubmit();
          history.replace('/');
        }}
        disabled={disableBtn}
      >
        Save changes
      </Button>
    </div>
  );
};

export default ToDo;
