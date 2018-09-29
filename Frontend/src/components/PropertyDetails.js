import React, {Component} from 'react';
import 'typeface-roboto'
import axios from 'axios';
import cookie from 'react-cookies';
import moment from 'moment';
import {Navbar} from "react-bootstrap";
import {Redirect} from 'react-router';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Helmet from 'react-helmet';
import Tabs from 'react-web-tabs/lib/Tabs';
import Tab from 'react-web-tabs/lib/Tab';
import TabPanel from 'react-web-tabs/lib/TabPanel';
import TabList from 'react-web-tabs/lib/TabList';
import SweetAlert from 'react-bootstrap-sweetalert';

var locationlon, locationlat, locationTitle;

class PropertyDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
          isTravelerLoggedIn: false,
          propertyid: this.props.match.params.id,
          location : this.props.match.params.location,
          fromdate : this.props.match.params.fromdate,
          todate : this.props.match.params.todate,
          noOfGuests:this.props.match.params.noOfGuests,
          guests :"",
          nightlyrate : "",
          bookingFromDate :"",
          bookingToDate :"",
          isLoading : true,
          requestedDays : 0,
          price : 0,
          rows: [{}],
          adate : false,
          ddate : false,
          pguests : false,
          alert: null,
          booked : false
        };
        this.logout = this.logout.bind(this);
        this.fromDateChangeHandler = this.fromDateChangeHandler.bind(this);
        this.toDateChangeHandler = this.toDateChangeHandler.bind(this);
        this.noOfGuestsChangeHandler = this.noOfGuestsChangeHandler.bind(this);
        this.submitBooking = this.submitBooking.bind(this)
        this.hideAlert = this.hideAlert.bind(this)
    }
    
    componentDidMount () {
        console.log("In Property Details");
        var propertyID = this.state.propertyid;

        var url = "http://localhost:3001/homeaway/property/" + propertyID;
        axios.get(url)
        .then(response => {
            console.log("Status Code : ", response.status);
            if(response.status === 200){
                console.log(response.data)
                this.setState({rows : response.data})
            }
            console.log(this.state.rows.headline);
        });
    }
    
    fromDateChangeHandler = (e) => { 
        e.preventDefault();
        this.setState({bookingFromDate : e.target.value,
            adate: true
        })
    }

    toDateChangeHandler = (e) => {
        e.preventDefault();
        this.setState({bookingToDate : e.target.value,
             ddate: true
        })
    }

    noOfGuestsChangeHandler = (e) => {
        this.setState ({
            guests : e.target.value,
            pguests : true
        })
    }

    handleValidation(){
        let formIsValid = true;
    
        //From Date
        if(this.state.bookingFromDate < this.state.fromdate || this.state.bookingFromDate > this.state.todate){
            alert('Arrive date should be between the searched dates');
            formIsValid = false;
        }
    
        //To Date
        if(this.state.bookingToDate < this.state.fromdate || this.state.bookingToDate > this.state.todate){
            alert('Depart date should be between the searched dates');
            formIsValid = false;
        }

        if(this.state.bookingFromDate >= this.state.bookingToDate){
            alert('Arrival date should be before departure date');
            formIsValid = false;
        }
    
         //Numberof guests
        if(this.state.guests > this.state.noOfGuests){
            alert("Number of guests should be less than or same as the searched criteria");
            formIsValid = false;
        }
       return formIsValid;
    }

    logout = () => {
      cookie.remove('travelercookie', {path: '/'})
      console.log("cookie removed")
      window.location = "/"
    }

    shouldComponentUpdate(nextState) {
        if (nextState.bookingFromDate !== this.state.bookingFromDate) {
            return true; }
        if (nextState.bookingToDate !== this.state.bookingToDate) {
            return true; }
        else {
            return false }
    }

    shouldComponentUpdate(prevState){
        if (prevState.bookingFromDate !== this.state.bookingFromDate){
            return true;
        }
        if (prevState.bookingToDate !== this.state.bookingToDate){
            return true;
        } else {
            return false
        }
    }

    submitBooking = () => {
        if(this.handleValidation()){
            const getAlert = () => (
                <SweetAlert 
                success 
                title = "Congratulations!!"
                onConfirm={() => this.addBooking()}> 
                You successfully booked this property!!!
                </SweetAlert>
            );
     
            if (this.state.adate && this.state.ddate && this.state.pguests && this.state.isTravelerLoggedIn) {
                this.setState({
                    alert: getAlert(),
                    //booked: true
                })
            } else {
                if (!this.state.isTravelerLoggedIn){
                    window.alert("You must be logged in to book this property!!!")}
                else{
                    window.alert("Please enter all the fields")
                }
            }
        }
    }

    addBooking(){
    
        var price = this.state.price
        price = price.toString();

        var data = {
            propertyid: this.state.propertyid,
            bookedBy: cookie.load('cookie2'),
            bookedFrom : this.state.bookingFromDate,
            bookedTo : this.state.bookingToDate,
            NoOfGuests : this.state.guests,
            pricePaid : price
            }
            axios.post('http://localhost:3001/homeaway/bookproperty', data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("booked property")
                    window.close();
                }
            });
    }

    hideAlert() {
        console.log('Hiding alert...');
        this.setState({
          alert: null
        });
      }
    
    render(){

        let redirectVar = null;
       if(cookie.load('cookie1')){
          this.state.isTravelerLoggedIn = true
        } else {
          redirectVar = <Redirect to = "/"/>
        } 
    
        //if (this.state.booked) {
        //    this.addBooking()
       // }

        const {rows} = this.state;

        var start = moment(this.state.bookingFromDate, "YYYY-MM-DD");
        var end = moment(this.state.bookingToDate, "YYYY-MM-DD");
        //Difference in number of days
        var difference = (moment.duration(end.diff(start)).asDays());
        var price = difference * rows[0].baseRate;

        this.state.price = price;

        if(this.state.location === "Sunnyvale"){
            locationlat = 32.736349,
            locationlon = -117.177871,
            locationTitle = this.state.city
        }
        if(this.state.location === "san diego"){
            locationlat = 37.3688,
            locationlon = -122.0363,
            locationTitle = this.state.city
        }
        if(this.state.location === "los angeles") {
            locationlat = 34.024212,
            locationlon = -118.496475,
            locationTitle = this.state.city
        }
        if(this.state.location === "new york") {
            locationlat = 40.730610,
            locationlon = -73.935242,
            locationTitle = this.state.city
        }
        if(this.state.location === "san franscisco") {
            locationlat = 37.773972,
            locationlon = -122.431297,
            locationTitle = this.state.city
        }

        return(
          <div>
           {redirectVar}
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
                      <input type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" name="search" id="search" placeholder="Where do you want to go?" defaultValue = {this.state.location} readOnly/>
                        <span className="glyphicon glyphicon-search form-control-feedback"></span>
                      </div>
                  </div>
                  <div className="col-md-offset-3">
                      <div className="form-group card" style = {{ height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                      <input
                            type = "date"
                            style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control"
                            value={this.state.fromdate}
                            readOnly
                      />
                      </div>
                  </div>
                  <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                      <div className="form-group card" style = {{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}> 
                      <input
                          style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control"
                          type = "date"
                          readOnly
                          value={this.state.todate} />
                      </div>
                  </div>
                  <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                      <div className="form-group">
                      <input type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" value= {this.state.noOfGuests} readOnly/>
                        <span className="glyphicon glyphicon-search form-control-feedback"></span>
                      </div> 
                  </div>
                  </div>
            </div>
            </Navbar>
            <div className = "container-full">
                <div className="container-pad">
                    <div className="form-row ">
                        <div className="form-group col-sm-8 FixedHeightContainer border" id = "property-listings" style ={{maxWidth : "1000px"}}>
                            <div style = {{background: "#D6EBF2"}}  className ="Content">
                            <Carousel>
                                <div>
                                    <img src={require('./house1.jpeg')}/>
                                </div>
                                <div>
                                    <img src={require('./house2.jpeg')}/>
                                </div>
                                <div>
                                    <img src={require('./house3.jpeg')}/>
                                </div>
                            </Carousel>

                            <div>
                            <Tabs
                                defaultTab="one"
                                onChange={(tabId) => { console.log(tabId) }}>
                                <TabList>
                                <div className="topnav">
                                    <div className = "row">
                                    <div className = "col-md-2">
                                        <Tab tabFor="one" style = {{borderRight :"none", borderLeft :"none", padding : "0 0 0 0"}}><a>Overview</a></Tab>
                                    </div>
                                    <div className = "col-md-2">
                                        <Tab tabFor="two" style = {{borderRight :"none", borderLeft :"none", padding : "0 0 0 0"}}><a>Amenities</a></Tab>
                                    </div>
                                    <div className = "col-md-2">
                                        <Tab tabFor="three" style = {{borderRight :"none", borderLeft :"none", padding : "0 0 0 0"}}><a>Map</a></Tab>
                                    </div>
                                    <div className = "col-md-2">
                                        <Tab tabFor="four" style = {{borderRight :"none", borderLeft :"none", padding : "0 0 0 0"}}><a>Availability</a></Tab>
                                    </div>
                                    </div>
                                </div>
                                </TabList>
                                <TabPanel tabId="one">
                                    <div className = "container" style = {{marginTop : "20px"}}>
                                        <h4 className="media-heading"><img style={{height: "35px"}} src={require('./maps-icon.png')}/>{rows[0].headline}</h4>
                                        <div className = "row" style = {{marginTop :"20px"}}>
                                        <h2><img style={{height: "35px"}} src={require('./pindrop.svg')}/>{rows[0].city}, {rows[0].state}, {rows[0].country}</h2>
                                        </div>
                                        <div className = "row" style = {{marginTop :"20px"}}>
                                        <ul className="list-inline">
                                            <li className = "list-inline-item">{rows[0].propertyType}</li>
                                            <li className = "list-inline-item dot"> </li>
                                            <li className = "list-inline-item"> {rows[0].bedrooms} BR</li>
                                            <li className = "list-inline-item dot"> </li>
                                            <li className = "list-inline-item"> {rows[0].bathrooms} BA</li>
                                            <li className = "list-inline-item dot"></li>
                                            <li className = "list-inline-item"> Sleeps  {rows[0].sleeps}</li>
                                        </ul>
                                        </div>
                                        <div className = "row" style = {{marginTop :"10px"}}>
                                        <p className = "para-font">{rows[0].description}></p>
                                        </div> 
                                    </div>
                                </TabPanel>
                                <TabPanel tabId = "two">
                                <div className = "container" style = {{marginTop : "20px"}}>
                                        <hr/> 
                                        <div className = "row" style = {{marginTop :"20px"}}>
                                        <p className = "para-font">{rows[0].amenities}></p>
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel tabId = "three">
                                <div className = "form-group col-sm-5">
                                <Map
                                id="myMap"
                                options={{
                                    center: { lat: locationlat, lng:  locationlon},
                                zoom: 8
                                }}
                                onMapLoad={map => {
                                var marker = new window.google.maps.Marker({
                                    position: { lat: locationlat, lng:  locationlon},
                                    map: map,
                                    title: locationTitle
                                });
                                }}
                            /> </div>
                                </TabPanel>
                            </Tabs>
                            </div>
                            </div>
                        </div>
                        <div className = "form-group col-md-3 border" style = {{height: "510px"}} >
                            <div className = "card-body " style = {{background: "#b4ecb4", width : "385px"}}>
                                <div className="row">
                                    <div className="col-xs-1">
                                        <h2>$ {rows[0].baseRate}</h2></div>
                                    <div className="col-sm-2" style = {{marginTop : "10px"}}><h6><strong>avg/night</strong></h6>
                                    </div>
                                </div>
                                <div className = "container" style = {{marginTop : "30px"}}>
                                <div className="row">
                                    <div className="col-md-offset-3">
                                        <div className="form-group" style = {{fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <h5>Arrive</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-offset-6">
                                        <div className="form-group card" style = {{fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                        <input onChange={this.fromDateChangeHandler} style = {{height: "40px", width: "150px"}} value={this.state.bookingFromDate} type="date" name="fromdate"/>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-offset-3">
                                        <div className="form-group " style = {{fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <h5>Depart</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-offset-6">
                                        <div className="form-group card" style = {{ fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                     <input onChange={this.toDateChangeHandler} style = {{height: "40px", width : "150px"}} value={this.state.bookingToDate} type="date" name="todate"/>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-offset-3">
                                        <div className="form-group " style = {{fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <h5>No of Guests</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-8">
                                        <div className="form-group card" style = {{height: "40px", marginLeft : "-9px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <input type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control"
                                            value={this.state.guests} onChange = {this.noOfGuestsChangeHandler} min="1"/>
                                            <span className="glyphicon glyphicon-search form-control-feedback"></span>
                                         </div>
                                    </div>
                                </div>
                                    {(this.state.adate  && this.state.ddate && this.state.pguests ?
                                            <div className = "row">
                                                <div className="col-md-offset-3">
                                                    <div className="form-group " style = {{fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                                        <h5>Price for {difference} nights is ${this.state.price}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                    :
                                    null
                                    )}
                                    <div className="form-group" style ={{marginLeft : "50px", marginTop : "40px"}}>
                                        <button className="btn btn-primary" onClick = {this.submitBooking} style = {{ height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "200px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                                            Book Now
                                        </button>
                                        {this.state.alert}
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
        <div style = {{width : "800px", height :"700px"}} id={this.props.id} />
      );
    }
  }
  
export default PropertyDetails;
