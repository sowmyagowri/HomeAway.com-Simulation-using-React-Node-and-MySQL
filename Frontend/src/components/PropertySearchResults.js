import React, {Component} from 'react';
import 'typeface-roboto'
import './PropertySearchResults.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Navbar} from "react-bootstrap";
import Helmet from 'react-helmet';
import moment from 'moment';
import { Link } from 'react-router-dom';

var longitude, lattitude, locationTitle;

class PropertySearchResults extends Component {
    
    constructor(props){
        super(props);
        console.log("Parameters are: ");
        console.log(this.props.history);
        this.state = {
            email: "",
            isTravelerLoggedIn: false,
            detailsFetched:false,
            isLoading : true,
            searchData:[{}],
        };
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.fromDateChangeHandler = this.fromDateChangeHandler.bind(this);
        this.toDateChangeHandler = this.toDateChangeHandler.bind(this);
        this.noOfGuestsChangeHandler = this.noOfGuestsChangeHandler.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.searchPlace = this.searchPlace.bind(this);
        this.generateContents = this.generateContents.bind(this);
        this.calculateRate = this.calculateRate.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout = () => {
        cookie.remove('cookie1', {path: '/'})
        cookie.remove('cookie2', {path: '/'})
        cookie.remove('cookie3', {path: '/'})
        console.log("All cookies removed!")
        window.location = "/"
    }
    
  componentWillMount(){
    this.setState ({ 
        location : this.props.location.state?this.props.location.state.location:"",
        fromdate : this.props.location.state?this.props.location.state.fromDate:"",
        todate : this.props.location.state?this.props.location.state.toDate:"",
        noOfGuests: this.props.location.state?this.props.location.state.noOfGuests:""
    })

        const data = { 
            city : this.props.location.state?this.props.location.state.location:"",
            startDate : this.props.location.state?this.props.location.state.fromDate:"",
            endDate : this.props.location.state?this.props.location.state.toDate:"",
            noOfGuests: this.props.location.state?this.props.location.state.noOfGuests:""
        }
        console.log("Calling Property Search in Will mount");
        console.log(data);
        axios.post('http://localhost:3001/homeaway/property/search', data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log(response.data)
                this.setState({
                    searchData : response.data,
                    isLoading : false,
                });
            }
        })
    }

    calculateRate = (rate) => {
        var start = moment(this.state.fromdate, "YYYY-MM-DD");
        var end = moment(this.state.todate, "YYYY-MM-DD");

        //Difference in number of days
        var difference = (moment.duration(end.diff(start)).asDays());
        return (difference * rate);
    }

    generateContents () {
        const {searchData} = this.state;
        const {isLoading} = this.state;
        if(!isLoading){
            return Object.keys(searchData).map((i) => {
                    return <div className="brdr bgc-fff pad-10 box-shad btm-mrg-20 property-listing" key={searchData[i].ID}>
                    <div className="media">
                        <a className="pull-left" href="#" target="_parent">
                        <img alt="image" className="img-responsive" src="http://images.prd.mris.com/image/V2/1/Yu59d899Ocpyr_RnF0-8qNJX1oYibjwp9TiLy-bZvU9vRJ2iC1zSQgFwW-fTCs6tVkKrj99s7FFm5Ygwl88xIA.jpg"/></a>
                        <div className="clearfix visible-sm"> </div>
                        <div className="media-body fnt-smaller">
                                <input id = "heading" value = {searchData[i].headline} type="text" readonly="readonly" />
                                <br></br><br></br>
                                <input id = "type" value = {searchData[i].propertyType} type="text" readonly="readonly" />
                                <input id = "symbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "bedroom" value = {searchData[i].bedrooms} type="text" readonly="readonly" />
                                <input id = "bedroom" type="text" readonly="readonly" placeholder = "BR"/>
                                <input id = "symbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "bathroom" value = {searchData[i].bathrooms} type="text" readonly="readonly" />
                                <input id = "bathroom" type="text" readonly="readonly" placeholder = "BA"/>
                                <input id = "symbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "sleep" type="text" readonly="readonly" placeholder = "Sleeps"/>
                                <input id = "sleep" value = {searchData[i].sleeps} type="text" readonly="readonly" />
                                <br></br><br></br>
                                <input id = "heading" value = {searchData[i].currency + ' ' + this.calculateRate(searchData[i].baseRate)} type="text" readonly="readonly" />

                                <Link class="view" to={`/property/${searchData[i].uid}/${this.state.location}/${this.state.fromdate}/${this.state.todate}/${this.state.noOfGuests}`} target="_blank">Dummy Link</Link>
                        </div>
                    </div>
        
                </div>
            });
            }
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
        fromdate : e.target.value
      })
  }
  
  //To date change handler to update state variable with the text entered by the user
  toDateChangeHandler = (e) => {
    this.setState({
        todate : e.target.value
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
        if(!this.state.fromdate){
          formIsValid = false;
          alert("From Date is a Required field");
          console.log("From Date cannot be empty");
        } else {
          var CurrentDate = new Date();
          CurrentDate.setHours(0,0,0,0);
          var GivenfromDate = new Date(this.state.fromdate.replace(/-/g, '\/'));
          if(GivenfromDate < CurrentDate){
            alert('From date should be greater than the current date.');
            formIsValid = false;
          }
        }
    
        //To Date
        if(!this.state.todate){
            formIsValid = false;
            alert("To Date is a Required field");
            console.log("To Date cannot be empty");
         } else {
          var CurrentDate = new Date();
          CurrentDate.setHours(0,0,0,0);
          var GiventoDate = new Date(this.state.todate.replace(/-/g, '\/'));
    
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
            const data = {
            city : this.state.location,
            startDate : this.state.fromdate,
            endDate : this.state.todate,
            noOfGuests : this.state.noOfGuests
            }
        
            //set the with credentials to true
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/homeaway/property/search', data)
                .then(response => {
                    console.log("Status Code : ",response.status);
                    if(response.status === 200){
                        console.log(response.data)
                        this.setState({
                            searchData : response.data,
                            isLoading : false,
                       });
                    }
            })
        }
    }

    render(){
        if(this.state.place === "San Diego"){
            lattitude = 32.736349,
            longitude = -117.177871,
            locationTitle = this.state.place
       }
       if(this.state.place === "sunnyvale"){
        lattitude = 37.3688,
        longitude = -122.0363,
        locationTitle = this.state.place
   }
       if(this.state.place === "Los Angeles") {
           lattitude = 34.024212,
           longitude = -118.496475,
           locationTitle = this.state.place
       }
       if(this.state.place === "New York") {
           lattitude = 40.730610,
           longitude = -73.935242,
           locationTitle = this.state.place
       }
       if(this.state.place === "San Franscisco") {
           lattitude = 37.773972,
           longitude = -122.431297,
           locationTitle = this.state.place
       }
        if(cookie.load('cookie1')){
            this.state.isTravelerLoggedIn = true
        }

        if (this.state.searchData.length == 0) {
            this.state.detailsFetched = false 
        }
        else {
            this.state.detailsFetched = true 
        }

        console.log(lattitude, longitude)

    
        return(
          <div>
            <Helmet>
              <style>{'body { background-color: white; }'}</style>
            </Helmet>
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
                      <input defaultValue = {this.state.location} type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" name="location" id="location" placeholder="Where do you want to go?" onChange = {this.locationChangeHandler}/>
                        <span className="glyphicon glyphicon-search form-control-feedback"></span>
                      </div>
                  </div>
                  <div className="col-md-offset-3">
                    <input defaultValue = {this.state.fromdate} onChange = {this.fromDateChangeHandler} type="date" name="fromdate"/>  
                  </div>
                  <div className="col-md-offset-3">
                    <input defaultValue = {this.state.todate} onChange = {this.toDateChangeHandler} type="date" name="todate"/>  
                  </div>
                  <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                      <div className="form-group">
                      <input name="noOfGuests" defaultValue = {this.state.noOfGuests} type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" placeholder="No of guests?" onChange = {this.noOfGuestsChangeHandler}/>
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
            {this.state.detailsFetched 
              ?
              (
                <div className = "container-full">
                    <div className="container-pad">
                        <div className="form-row ">
                            <div className="form-group col-sm-9" id = "property-listings" style ={{maxWidth : "900px"}}>
                                <div className ="Content">
                                    { this.generateContents() }
                                </div>
                            </div>
                            <div className = "form-group col-sm-5" style = {{marginLeft: "20px", width : "800px"}}>
                                <div className = "card-body border">
                                    <Map
                                        id="myMap"
                                        options={{
                                        center: { lat: 32.736349, lng: -117.177871},
                                        zoom: 8
                                        }}
                                        onMapLoad={map => {
                                        var marker = new window.google.maps.Marker({
                                            position: { lat: 32.736349, lng:  -117.177871},
                                            map: map,
                                            title: locationTitle
                                        });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              )
              :
              (
                <div className = "container-full">
                    <div className="container-pad">
                        <h1> There are no listings matching your criteria </h1>
                    </div>
                </div>
              )
            }
        </div>
        )
    }
}

class Map extends Component {
    constructor(props) {
      super(props);
      this.onScriptLoad = this.onScriptLoad.bind(this)
    }
  
    onScriptLoad() {
      const map = new window.google.maps.Map(
        document.getElementById(this.props.id),
        this.props.options);
      this.props.onMapLoad(map)
    }
  
    componentDidMount() {
      if (!window.google) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = `https://maps.google.com/maps/api/js?key=AIzaSyCpk67Ig02fwUNe7in4kt0H23kahGTbLm8`;
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
        // Below is important. 
        //We cannot access google.maps until it's finished loading
        s.addEventListener('load', e => {
          this.onScriptLoad()
        })
      } else {
        this.onScriptLoad()
      }
    }
  
    render() {
      return (
        <div style = {{width : "600px", height :"700px"}} id={this.props.id} />
      );
    }
  }

export default PropertySearchResults;
