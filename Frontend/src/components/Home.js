import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Nav, Navbar, NavItem, NavDropdown, MenuItem} from "react-bootstrap";
import Background from './homepage_background.png';
import DatePicker from 'react-date-picker';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
          email: "",
          isTravelerLoggedIn: false,
          backgroundImage: `url(${Background})`,
          location: "",
          guests: "",
          fromDate: new Date(),
          toDate: new Date()
        };
        this.logout = this.logout.bind(this);
    }

    logout = () => {
      cookie.remove('cookie1', {path: '/'})
      console.log("cookie removed!")
      window.location = "/home"
    }

    onChangeArrive = date => this.setState({ fromDate: date })
    onChangeDepart = date => this.setState({ toDate: date })

    render(){
      let redirectVar = null;
       if(cookie.load('cookie1')){
          this.state.isTravelerLoggedIn = true
        } else {
          redirectVar = <Redirect to = "/"/>
        }
        return(
          <div style={{height:"800px", backgroundImage: this.state.backgroundImage}}>
          {redirectVar}
            <Navbar inverse collapseOnSelect style = {{backgroundColor: "transparent", background: "transparent", borderColor: "transparent"}}>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/home" title = "HomeAway" className = "logo"><img src="homeaway_logo_white.png"/></a>
              </Navbar.Brand>
            </Navbar.Header>
            <div>
            {!this.state.isTravelerLoggedIn?
                <div className="btn btn-group">
                  <button className="dropdown-toggle white" style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Login</button>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="/login">Traveler Login</a>
                    <a className="dropdown-item" href="/owner/login">Owner Login</a>
                  </div>
                </div>
                :
                <div className="btn btn-group">
                  <button className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="/travellerDashboard">DashBoard</a>
                    <a className="dropdown-item" onClick= {this.logout}>Logout</a>
                  </div>
                </div>
             }
              <button className="btn btn-group" style = {{color: "#fff", fontFamily: "Lato,Arial,Helvetica Neue,sans-serif", height: "40px", backgroundColor:"#fff", width: "200px", borderRadius: 25, borderColor: "#ffffff"}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
              <a href="/listyourproperty">List your Property</a>
              </button>
              <img src="P3O5JjfH_400x400.png"/>
            </div>
            </Navbar>
            <div className = "container">
              <div className="jumbotron jumbotron-fluid" style = {{background: "none"}}>
                <div className="container" style = {{marginTop :"10%"}}>
                  <h1 style ={{color: "white", fontFamily: "Lato,Arial,Helvetica Neue,sans-serif"}}>Your vacation starts here. . .</h1>
                  <div className="row">
                      <div className="col-md-4 col-md-offset-3">
                          <div className="form-group">
                      		<input type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"
}} className="form-control" name="search" id="search" placeholder="Where do you want to go?" onChange = {this.locationToSearch}/>
                        		<span className="glyphicon glyphicon-search form-control-feedback"></span>
                      	  </div>
                      </div>
                      <div className="col-md-offset-3">
                          <div className="form-group" style = {{backgroundColor: "#fff", height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                          <DatePicker
                              className = "center"
                              onChange={this.onChangeArrive}
                              value={this.state.fromDate}
                            />
                      	  </div>
                      </div>
                      <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                          <div className="form-group" style = {{backgroundColor: "#fff", height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                          <DatePicker
                              onChange={this.onChangeDepart}
                              value={this.state.toDate}
                            />
                      	  </div>
                      </div>
                      <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                          <div className="form-group">
                      		<input type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"
}} className="form-control" placeholder="No of guests?" onChange = {this.noOfGuests}/>
                        		<span className="glyphicon glyphicon-search form-control-feedback"></span>
                      	  </div>
                      </div>
                      <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                      <div className="form-group">
                      <button className="btn btn-primary" onClick = {this.searchPlace} style = {{ height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "120px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                      Search
                      </button>
                      </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
        </div>
        )
    }
}
//export Home Component
export default Home;
