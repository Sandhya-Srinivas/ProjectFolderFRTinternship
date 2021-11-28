import React from "react";
import {Router} from "react-router-dom";

import Routes from "../Redirection/Routes"
import history from '../Redirection/history'


function App(){

  return(
    <Router history={history}>
      <Routes />
    </Router>
  )

}

export default App;
