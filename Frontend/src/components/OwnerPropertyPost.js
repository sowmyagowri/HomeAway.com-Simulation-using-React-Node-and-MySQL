import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import './OwnerPropertyPost.css';
import './bootstrap-social.css';
import {Navbar} from "react-bootstrap";
import DatePicker from 'react-date-picker';

//Define a OwnerPropertyPost Component
class OwnerPropertyPost extends Component{
  //call the constructor method
  constructor(props){
    super(props);
      this.state =  {
      name: cookie.load('cookie3'),
      startDate: new Date(),
      endDate: new Date(),
      sleeps : "",
      headline: "",
      streetAddress: "",
      city: "",
      state: "",
      country: "",
      zipcode: 0,
      description: "",
      propertytype: "",
      amenities : "",
      bedrooms: 0,
      bathrooms: 0,
      minStay : 0,
      currency: "",
      baseRate : 0,
      };
      this.logout = this.logout.bind(this);
      this.streetAddressChangeHandler = this.streetAddressChangeHandler.bind(this);
      this.cityChangeHandler = this.cityChangeHandler.bind(this);
      this.stateChangeHandler = this.stateChangeHandler.bind(this);
      this.countryChangeHandler = this.countryChangeHandler.bind(this);
      this.zipcodeChangeHandler = this.zipcodeChangeHandler.bind(this);
      this.amenitiesChangeHandler = this.amenitiesChangeHandler.bind(this);
      this.minStayChangeHandler = this.minStayChangeHandler.bind(this);
      this.baseRateChangeHandler = this.baseRateChangeHandler.bind(this);
      this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this);
      this.propertytypeChangeHandler = this.propertytypeChangeHandler.bind(this);
      this.bedroomsChangeHandler = this.bedroomsChangeHandler.bind(this);
      this.sleepsChangeHandler = this.sleepsChangeHandler.bind(this);
      this.bathroomsChangeHandler = this.bathroomsChangeHandler.bind(this);
      this.bookingChangeHandler = this.bookingChangeHandler.bind(this);
      this.startDateChangeHandler = this.startDateChangeHandler.bind(this);
      this.endDateChangeHandler = this.endDateChangeHandler.bind(this);
      this.currencyChangeHandler = this.currencyChangeHandler.bind(this);
      this.headlineChangeHandler = this.headlineChangeHandler.bind(this);
      this.addProperty = this.addProperty.bind(this);
}
streetAddressChangeHandler =  (e) =>{this.setState ({streetAddress : e.target.value})}

headlineChangeHandler =  (e) =>{this.setState ({headline : e.target.value})}

cityChangeHandler =  (e) =>{this.setState ({city : e.target.value})}

stateChangeHandler =  (e) =>{this.setState ({state : e.target.value})}

countryChangeHandler =  (e) =>{this.setState ({country : e.target.value})}

zipcodeChangeHandler =  (e) =>{this.setState ({zipcode : e.target.value})}

amenitiesChangeHandler =  (e) =>{this.setState ({amenities : e.target.value})}

minStayChangeHandler =  (e) =>{this.setState ({minStay : e.target.value})}

baseRateChangeHandler =  (e) =>{this.setState ({baseRate : e.target.value})}

descriptionChangeHandler =  (e) =>{this.setState ({description : e.target.value})}

propertytypeChangeHandler =  (e) =>{this.setState ({propertytype : e.target.value})}

bedroomsChangeHandler =  (e) =>{this.setState ({bedrooms : e.target.value})}

bathroomsChangeHandler = (e) => {this.setState ({bathrooms : e.target.value})}

sleepsChangeHandler =  (e) =>{this.setState ({sleeps : e.target.value})}

bookingChangeHandler =  (e) =>{this.setState ({booking : e.target.value})}

currencyChangeHandler =  (e) =>{this.setState ({currency : e.target.value})}

startDateChangeHandler = date => this.setState({ startDate: date })
endDateChangeHandler = date => this.setState({ endDate: date })

logout = () => {
  cookie.remove('ownercookie', {path: '/'})
  window.streetAddress = "/"
}

addProperty = (e) => {
  var data = {
    name: this.state.name,
    startDate: this.state.startDate,
    endDate: this.state.endDate,
    streetAddress: this.state.streetAddress,
    city: this.state.city,
    headline: this.state.headline,
    description: this.state.description,
    propertytype: this.state.propertytype,
    bedrooms: this.state.bedrooms,
    sleeps: this.state.sleeps,
    bathrooms: this.state.bathrooms,
    booking: this.state.booking,
    currency: this.state.currency
}
axios.post('http://localhost:3001/listyourproperty2', data)
  .then(response => {
    if(response.data) {
      console.log("Successful post property")
      window.streetAddress = '/ownerdashboard'
    } else {
      console.log("Post Property Error")
    }
  })
  .catch(function(error) {
    console.log("Post Property Server error")
})
}
render(){
    return(
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/" title = "HomeAway" className = "logo"><img src={require('./homeaway_logo.png')}/></a>
            </Navbar.Brand>
          </Navbar.Header>
          <div>
            <div className="btn btn-group">
              <button className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {this.state.email}</button>
                <div className="dropdown-menu">
                  <a className="dropdown-item" onClick = {this.logout}>Logout</a>
                </div>
            </div>
          </div>
        </Navbar>
        <div className="container" style = {{fontFamily: "Lato,Arial,Helvetica Neue,sans-serif", marginTop : "50px"}}>
          	<div className="row">
          		<div className="col-md-12">
          		     <div id="accordion">
                            <div className="card">
                              <div className="card-headline">
                                <a className="card-link"  data-toggle="collapse" href="#collapseOne">
                                  Property streetAddress
                                </a>
                              </div>
                              <div id="collapseOne" className="collapse show" data-parent="#accordion">
                                <div className="card-body">
                                  <div className="row">
                                    <div className="card-body">
                                      <h2>Verify the streetAddress of your rental</h2>
                                      <hr/>
                                      <div className="card-body border">
                                        <div className="form-row ">
                                          <div className="form-group col-md-9">
                                            <input id="streetAddress" name="streetAddress" onChange = {this.streetAddressChangeHandler} value = {this.state.streetAddress} placeholder="Enter a streetAddress" className="form-control" required="required" type="text"/>
                                          </div>
                                          <div className="form-group col-md-3">
                                            <input id="place" name="place" onChange = {this.cityChangeHandler} value = {this.state.city} placeholder="Enter City" className="form-control" required="required" type="text"/>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
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
//export Signup2 Component
export default OwnerPropertyPost;