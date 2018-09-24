import React, {Component} from 'react';
import 'typeface-roboto'
import './PropertySearchResults.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Navbar} from "react-bootstrap";

class PropertyDetails extends Component {
    
    constructor(props){
        super(props);
        console.log("Parameters are: ");
        console.log(this.props.match.params);
        this.state = {
            email: "",
           };
        this.searchPlace = this.searchPlace.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout = () => {
        cookie.remove('cookie1', {path: '/'})
        cookie.remove('cookie2', {path: '/'})
        cookie.remove('cookie3', {path: '/'})
        console.log("All cookies removed!")
        window.location = "/"
    }
    
  componentDidMount(){
        this.refs.searchlocation.value = this.state.location;
        this.refs.arrivalDate.value = this.state.arrivalDate;
        this.refs.leaveDate.value = this.state.leaveDate;
        this.refs.noOfGuests.value = this.state.noOfGuests;
        const data = { 
            city : this.state.location,
            startDate : this.state.arrivalDate,
            endDate : this.state.leaveDate,
            noOfGuests: this.state.noOfGuests
        }
        console.log("Calling Property Search");
        axios.post('http://localhost:3001/homeaway/property/search', data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log(response.data)
                this.setState({
                    searchData : response.data
                });
                console.log(this.state.searchData[0].propertyType);
                this.refs.heading1.value = this.state.searchData[0].headline;
                this.refs.type1.value = this.state.searchData[0].propertyType;
                this.refs.bedrooms1.value = this.state.searchData[0].bedrooms;
                this.refs.bathrooms1.value = this.state.searchData[0].bathrooms;
                this.refs.sleeps1.value = this.state.searchData[0].sleeps;
                this.refs.address1.value = this.state.searchData[0].streetAddress;
                this.refs.city1.value = this.state.searchData[0].city;
                this.refs.state1.value = this.state.searchData[0].state;
            }
        });
    }

    //search searchLocation change handler to update state variable with the text entered by the user
    locationChangeHandler = (e) => {
    this.setState({
        location : e.target.value
    })
  }

  //From date change handler to update state variable with the text entered by the user
  fromDateChangeHandler = (e) => {
      this.setState({
        arrivalDate : e.target.value
      })
  }
  
  //To date change handler to update state variable with the text entered by the user
  toDateChangeHandler = (e) => {
    this.setState({
        leaveDate : e.target.value
    })
  }

  //Number of guests change handler to update state variable with the text entered by the user
  noOfGuestsChangeHandler = (e) => {
    this.setState({
        noOfGuests : e.target.value
    })
  }

    handleValidation(){
        let formIsValid = true;
    
        //Location
        if(!this.state.location){
            formIsValid = false;
            alert("Search Location is a Required field");
            console.log("Search Location cannot be empty");
        }
    
        //From Date
        if(!this.state.arrivalDate){
          formIsValid = false;
          alert("From Date is a Required field");
          console.log("From Date cannot be empty");
        } else {
          var CurrentDate = new Date();
          CurrentDate.setHours(0,0,0,0);
          var GivenfromDate = new Date(this.state.arrivalDate.replace(/-/g, '\/'));
          if(GivenfromDate < CurrentDate){
            alert('From date should be greater than the current date.');
            formIsValid = false;
          }
        }
    
        //To Date
        if(!this.state.leaveDate){
            formIsValid = false;
            alert("To Date is a Required field");
            console.log("To Date cannot be empty");
         } else {
          var CurrentDate = new Date();
          CurrentDate.setHours(0,0,0,0);
          var GiventoDate = new Date(this.state.leaveDate.replace(/-/g, '\/'));
    
          if(GiventoDate < CurrentDate){
            alert('To date should be greater than the current date.');
            formIsValid = false;
          } else {
            if (GiventoDate <= GivenfromDate){
              alert('To date should be greater than from date.');
              formIsValid = false;
            }
          }
        }
    
         //Numberof guests
        if(!this.state.noOfGuests){
          formIsValid = false;
          alert("Number of guests is a Required field");
          console.log("No. of Guests cannot be empty");
        }
       return formIsValid;
    }

    //search location handler to send a request to the node backend
    searchPlace(event) {
        console.log("Inside search property");
        //prevent page from refresh
        event.preventDefault();
        if(this.handleValidation()){
            console.log("Login Form submitted");
            const data = {
            city : this.state.location,
            startDate : this.state.startDate,
            endDate : this.state.endDate,
            sleeps : this.state.noOfGuests
            }
        
            //set the with credentials to true
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/homeaway/property/search', data)
                .then(response => {
                    console.log("Status Code : ",response.status);
                    if(response.status === 200){
                        this.setState({
                            authFlag : true
                        })
                    } else {
                        this.setState({
                            authFlag : false
                        })
                    }
                });
        }
    }

    render(){
        
        let redirectVar = null;
        if(cookie.load('cookie1')){
            this.state.isTravelerLoggedIn = true
        }
        const style = {
            width: '50vw',
            height: '75vh',
            'marginLeft': 'auto',
            'marginRight': 'auto'
        }

        return(
          <div>
              {redirectVar}
                <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                    <a href="/" title = "HomeAway" className = "logo"><img src={require('./homeaway_logo.png')} alt="Homeaway Logo"/></a>
                    </Navbar.Brand>
                </Navbar.Header>
                <div>
                    <img src={require('./us_flag.png')}/>
                    <button id="blue" className="btn" style = {{fontColor : "black", backgroundColor:"white", background:"white", borderColor:"white"}} type="button"><a href="#">Trip Boards</a></button>
                    {!this.state.isTravelerLoggedIn 
                    ?
                    (
                        <div className="btn btn-group">
                        <button id="blue" className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><a href="#">Login</a></button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="/traveller/login">Traveller Login</a>
                            <a className="dropdown-item" href="/owner/login">Owner Login</a>
                        </div>
                        </div>
                        )
                        :
                        (
                        <div className="btn btn-group">
                        <button id="blue" className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="/Profile">Profile</a>
                            <a className="dropdown-item" href="/MyTrips">My Trips</a>
                            <a className="dropdown-item" href="#" onClick= {this.logout}>Logout</a>
                        </div>
                        </div>
                        )
                    }
                    <button className="btn btn-group" style = {{color: "#fff", fontFamily: "Lato,Arial,Helvetica Neue,sans-serif", height: "40px", backgroundColor:"#fff", width: "200px", borderRadius: 25, borderColor: "#ffffff"}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                    <a href="/owner/login">List your Property</a>
                    </button>
                    <img src={require('./logo.png')} alt="Homeaway Logo"/>
                </div>
            <div className="container" style = {{marginTop :"1%"}}>
              <div className="row">
                  <div className="col-md-4 col-md-offset-3">
                      <div className="form-group">
                      <input ref = "searchlocation" type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" name="search" id="search" placeholder="Where do you want to go?" onChange = {this.locationChangeHandler}/>
                        <span className="glyphicon glyphicon-search form-control-feedback"></span>
                      </div>
                  </div>
                  <div className="col-md-offset-3">
                    <input ref = "arrivalDate" onChange = {this.fromDateChangeHandler} value={this.state.arrivalDate} type="date" name="fromdate"/>  
                  </div>
                  <div className="col-md-offset-3">
                    <input ref = "leaveDate" onChange = {this.toDateChangeHandler} value={this.state.departDate}  type="date" name="todate"/>  
                  </div>
                  <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                      <div className="form-group">
                      <input name="noOfGuests" ref = "noOfGuests" type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" placeholder="No of guests?" onChange = {this.noOfGuestsChangeHandler}/>
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
            </Navbar>
            <div className = "container-full">
            <div className="container-pad">
            <div className="form-row ">
            <div className="form-group col-sm-9" id = "property-listings" style ={{maxWidth : "900px"}}>
                  <div className="brdr bgc-fff pad-10 box-shad btm-mrg-20 property-listing">
                      <div className="media">
                          <a className="pull-left" href="#" target="_parent">
                          <img alt="image" className="img-responsive" src="http://images.prd.mris.com/image/V2/1/Yu59d899Ocpyr_RnF0-8qNJX1oYibjwp9TiLy-bZvU9vRJ2iC1zSQgFwW-fTCs6tVkKrj99s7FFm5Ygwl88xIA.jpg"/></a>
                          <div className="clearfix visible-sm"></div>
                            <div className="media-body fnt-smaller">
                                <input id = "heading" ref = "heading1" type="text" readonly="readonly" />
                                <br></br><br></br><br></br>
                                <input id = "type" ref = "type1" type="text" readonly="readonly" />
                                <input id = "symbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "bedroom" ref = "bedrooms1" type="text" readonly="readonly" />
                                <input id = "bedroom" type="text" readonly="readonly" placeholder = "BR"/>
                                <input id = "symbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "bathroom" ref = "bathrooms1" type="text" readonly="readonly" />
                                <input id = "bathroom" type="text" readonly="readonly" placeholder = "BR"/>
                                <input id = "symbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "sleep" type="text" readonly="readonly" placeholder = "Sleeps"/>
                                <input id = "sleep" ref = "sleeps1" type="text" readonly="readonly" />
                                <br></br><br></br><br></br>
                                <input id = "address" ref = "address1" type="text" readonly="readonly" />
                                <br></br>
                                <input id = "city" ref = "city1" type="text" readonly="readonly" />
                                <input id = "state" ref = "state1" type="text" readonly="readonly" />
                                <br></br>
                                <a class = "view" href="/property/details" target="_blank">Dummy Link</a>
                            </div>
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
export default PropertyDetails;
