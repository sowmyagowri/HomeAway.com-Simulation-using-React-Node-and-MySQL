//index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import OwnerLogin from './components/OwnerLogin';
import OwnerPropertyPost from './components/OwnerPropertyPost';
import Signup1 from './components/Signup1';
import Signup2 from './components/Signup2';
import TravellerDashboard from './components/TravellerDashboard';

import './index.css';

ReactDOM.render(
  <div className="container-fluid">
    <div>
      <Router>
      <div>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/signup1' component={Signup1} />
        <Route path='/signup2' component={Signup2} />
        <Route path='/travellerDashboard' component={TravellerDashboard} />
        <Route path='/owner/login' component={OwnerLogin} />
        <Route path='/owner/propertypost' component={OwnerPropertyPost} />
      </div>
      </Router>
    </div>
  </div>
,
  document.getElementById('root')
);
