import React, {Component} from 'react';
import 'typeface-roboto'
import './PropertySearchResults.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Nav, Navbar, NavItem, NavDropdown, MenuItem} from "react-bootstrap";
import DatePicker from 'react-date-picker';

class PropertySearchResults extends Component {
    
    constructor(props){
        super(props);
        console.log("Parameters are: ");
        console.log(this.props.history);
        this.state = {
            email: "",
            location: this.props.location.state.location,
            noOfGuests: this.props.location.state.noOfGuests,
            arrivalDate: this.props.location.state.fromDate,
            leaveDate: this.props.location.state.toDate,
            isTravelerLoggedIn: false,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
        };
        this.logout = this.logout.bind(this);
        // binding this to event-handler functions
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
    }

    logout = () => {
        cookie.remove('cookie1', {path: '/'})
        cookie.remove('cookie2', {path: '/'})
        cookie.remove('cookie3', {path: '/'})
        console.log("All cookies removed!")
        window.location = "/"
    }

    onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
   }
  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }

    onChangeFrom = date => this.setState({ fromDate: date })
    onChangeTo = date => this.setState({ toDate: date })

    componentDidMount(){
        this.refs.searchlocation.value = this.state.location;
        this.refs.arrivalDate.value = this.state.arrivalDate;
        this.refs.leaveDate.value = this.state.leaveDate;
        this.refs.noOfGuests.value = this.state.noOfGuests;
        const data = { 
            location : this.state.location,
            startDate : this.state.arrivalDate,
            endDate : this.state.leaveDate,
            guests: this.state.noOfGuests
        }
        axios.get('http://localhost:3001/homeaway/property/search', data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log(response.data)
                this.setState({
                    searchData : response.data
                });
                console.log(this.state.searchData);
            }
        });
    }

    render(){
    {/*  let redirectVar = null;
       if(cookie.load('travelercookie')){
          this.state.isTravelerLoggedIn = true
          this.state.email = cookie.load('travelercookie')
        } else {
          redirectVar = <Redirect to = "/home"/>
        } */}

        const style = {
            width: '50vw',
            height: '75vh',
            'marginLeft': 'auto',
            'marginRight': 'auto'
        }
        return(
          <div>
              <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/" title = "HomeAway" className = "logo"><img src={require('./homeaway_logo.png')}/></a>
                    </Navbar.Brand>
                </Navbar.Header>
                <div>
                <img src={require('./us_flag.png')}/>
                <button className="btn" style = {{fontColor : "#0067db", backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button">Trip Boards</button>
            {!this.state.isTravelerLoggedIn?
                <div className="btn btn-group">
                  <button className="dropdown-toggle" style = {{fontColor : "#0067db",marginLeft : "10px",backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Login</button>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="/login">Traveler Login</a>
                    <a className="dropdown-item" href="/ownerlogin">Owner Login</a>
                  </div>
                </div>
                :
                <div className="btn btn-group">
                  <button className="dropdown-toggle"  style = {{fontColor : "#0067db", marginLeft : "10px",backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {this.state.email}</button>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="/Profile">Profile</a>
                    <a className="dropdown-item" href="/DashBoard">DashBoard</a>
                    <a className="dropdown-item" onClick= {this.logout}>Logout</a>
                  </div>
                </div>
             }
             <img src="inbox.png"/>
             <button className="btn" style = {{marginLeft : "10px",backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button">Help</button>
              <button className="btn btn-primary" style = {{color: "white", fontFamily: "Lato,Arial,Helvetica Neue,sans-serif", height: "40px", backgroundColor:"#fff", width: "200px", borderRadius: 25, borderColor: "#D3D3D3"}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
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
                      <div className="form-group card" style = {{ height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                      <input ref = "arrivalDate" className = "center" onChange = {this.fromDateChangeHandler} value={this.state.arrivalDate} type="date" name="fromdate"/> 
                      </div>
                  </div>
                  <div className="col-md-offset-3">
                      <div className="form-group card" style = {{ height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                      <input ref = "leaveDate" className = "center" onChange = {this.toDateChangeHandler} value={this.state.departDate} type="date" name="todate"/> 
                      </div>
                  </div>
                  <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                      <div className="form-group">
                      <input ref = "noOfGuests" type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"
}} className="form-control" placeholder="No of guests?" onChange = {this.noOfGuestsChangeHandler}/>
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
                              <a href="#" target="_parent"></a>

                              <h4 className="media-heading">
                                <a href="#" target="_parent">$1,975,000 <small className="pull-right">609 W Gravers Ln</small></a></h4>

                              <ul className="list-inline mrg-0 btm-mrg-10 clr-535353">
                                  <li>4,820 SqFt</li>

                                  <li style= {{listStyle: "none"}}>|</li>

                                  <li>5 Beds</li>

                                  <li style= {{listStyle: "none"}}>|</li>

                                  <li>5 Baths</li>
                              </ul>

                              <p className="hidden-xs">Situated between fairmount
                              park and the prestigious philadelphia cricket
                              club, this beautiful 2+ acre property is truly
                              ...</p><span className="fnt-smaller fnt-lighter fnt-arial">Courtesy of HS Fox & Roach-Chestnut Hill
                              Evergreen</span>
                          </div>
                      </div>
                  </div>

                  <div className="brdr bgc-fff pad-10 box-shad btm-mrg-20 property-listing">
                      <div className="media">
                          <a className="pull-left" href="#" target="_parent">
                          <img alt="image" className="img-responsive" src="http://images.prd.mris.com/image/V2/1/zMjCkcFeFDXDAP8xDhbD9ZmrVL7oGkBvSnh2bDBZ6UB5UHXa3_g8c6XYhRY_OxgGaMBMehiTWXDSLzBMaIzRhA.jpg"/></a>

                          <div className="clearfix visible-sm"></div>

                          <div className="media-body fnt-smaller">
                              <a href="#" target="_parent"></a>

                              <h4 className="media-heading">
                                <a href="#" target="_parent">$1,975,000 <small className="pull-right">218 Lynnebrook Ln</small></a></h4>

                              <ul className="list-inline mrg-0 btm-mrg-10 clr-535353">
                                  <li>6,959 SqFt</li>

                                  <li style= {{listStyle: "none"}}>|</li>

                                  <li>6 Beds</li>

                                  <li style= {{listStyle: "none"}}>|</li>

                                  <li>5 Baths</li>
                              </ul>

                              <p className="hidden-xs">Impressively positioned
                              overlooking 3.5 captivating acres, designated
                              as "significant" by the chestnut hill
                              historical s...</p><span className="fnt-smaller fnt-lighter fnt-arial">Courtesy of HS Fox & Roach-Blue Bell</span>
                          </div>
                      </div>
                  </div>

                  <div className="brdr bgc-fff pad-10 box-shad btm-mrg-20 property-listing">
                      <div className="media">
                          <a className="pull-left" href="#" target="_parent">
                          <img alt="image" className="img-responsive" src="http://images.prd.mris.com/image/V2/1/iwn7qH9r9OPnqTaTTxxb8PBzQHk2EiHU2PBBntt041AZsVsGY-SeUexTMLgRcYSJukrKOwHaYnTVXAsk6RdSmA.jpg"/></a>

                          <div className="clearfix visible-sm"></div>

                          <div className="media-body fnt-smaller">
                              <a href="#" target="_parent"></a>

                              <h4 className="media-heading">
                                <a href="#" target="_parent">$1,599,999 <small className="pull-right">209 Chestnut Hill ve</small></a></h4>

                              <ul className="list-inline mrg-0 btm-mrg-10 clr-535353">
                                  <li>16,581 SqFt</li>

                                  <li style= {{listStyle: "none"}}>|</li>

                                  <li>8 Beds</li>

                                  <li style= {{listStyle: "none"}}>|</li>

                                  <li>4 Baths</li>
                              </ul>

                              <p className="hidden-xs">Built in 1909 by
                              pittsburgh steel magnate henry a. laughlin,
                              greylock is a classNameic chestnut hill stone
                              mansion once cons...</p><span className="fnt-smaller fnt-lighter fnt-arial">Courtesy of ng and Foster-Devon</span>
                          </div>
                      </div>
                  </div>
                  <div className="brdr bgc-fff pad-10 box-shad btm-mrg-20 property-listing">
                      <div className="media">
                          <a className="pull-left" href="#" target="_parent">
                          <img alt="image" className="img-responsive" src="http://images.prd.mris.com/image/V2/1/7IZk2HTN0AcHnIb7VCvisTUc3kTbn0UyHQlVAlwkNLM3_8UNN8pcgy9u6KVNoRGGH_kdUlpYehdbqzctRNUebg.jpg"/></a>

                              <div className="clearfix visible-sm"></div>

                              <div className="media-body fnt-smaller">
                                  <a href="#" target="_parent"></a>

                                  <h4 className="media-heading">
                                    <a href="#" target="_parent">$1,595,000 <small className="pull-right">704 Saint Georges St</small></a></h4>

                                  <ul className="list-inline mrg-0 btm-mrg-10 clr-535353">
                                      <li>0 SqFt</li>

                                      <li style= {{listStyle: "none"}}>|</li>

                                      <li>4 Beds</li>

                                      <li style= {{listStyle: "none"}}>|</li>

                                      <li>5 Baths</li>
                                  </ul>

                                  <p className="hidden-xs">Blake development is proud
                                  to offer the second of two distinctly unique
                                  homes located on one of the most desirable
                                  stree...</p><span className="fnt-smaller fnt-lighter fnt-arial">Courtesy of HS Fox & Roach-Chestnut Hill
                                  Evergreen</span>
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
export default PropertySearchResults;
