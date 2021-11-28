import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Add from '../components/Add';
import Home from '../components/HomeNew';

import bgImage from '../Assets/SkyRocket5.jpg';

const divStyle = {
  height: '100%',
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 700,
  // for scrollable case
  overflow: 'auto',
  backgroundAttachment: 'fixed',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

export default function Routes2() {
  return (
    <div style={divStyle}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/Add">
            <Add />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
