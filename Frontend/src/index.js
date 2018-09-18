//index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import {Header} from "./components/Header";
import ListTodo from './components/ListTodo';
import UpdateTodo from './components/UpdateTodo';
import Login from './components/Login';
import OwnerLogin from './components/OwnerLogin';
import OwnerPropertyPost from './components/OwnerPropertyPost';
import Signup1 from './components/Signup1';
import Signup2 from './components/Signup2';
import Profile from './components/Profile';

import './index.css';

ReactDOM.render(
  <div className="container-fluid">
    <Header/>
   <div>
      <Router>
      <div>
        <Route exact path='/' component={ListTodo} />
        <Route path='/update/:id' component={UpdateTodo} />
        <Route path='/login' component={Login} />
        <Route path='/signup1' component={Signup1} />
        <Route path='/signup2' component={Signup2} />
        <Route path='/traveler/profile' component={Profile} />
        <Route path='/owner/login' component={OwnerLogin} />
        <Route path='/owner/propertypost' component={OwnerPropertyPost} />
      </div>
      </Router>
    </div>
  </div>
,
  document.getElementById('root')
);
