import React, {Component} from 'react';
import 'typeface-roboto'
import './OwnerPropertyListings.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Navbar} from "react-bootstrap";;

class TravellerTripListings extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            email: "",
            isLoading : true,
            allTrips:[{}],
        };
        
        this.renderTrips = this.renderTrips.bind(this);
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
    
    const data = { 
        bookedBy : cookie.load('cookie2'),
    }
        console.log("Calling Property Listings in Will Mount");
        console.log(data);
        axios.post('http://localhost:3001/homeaway/traveller/triplistings', data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log(response.data)
                this.setState({
                    allTrips : response.data,
                    isLoading : false
                });
            }
        });
    }

    renderTrips () {
        const {allTrips} = this.state;
        const {isLoading} = this.state;
        if(!isLoading){
            return Object.keys(allTrips).map((i) => {
                    return <div className="brdr bgc-fff pad-10 box-shad btm-mrg-20 myborder1 property-listing" key={allTrips[i].ID}>
                    <div className="media">
                        <a className="pull-left" href="#" target="_parent">
                        <img alt="Thumbnail View of Property" className="img-responsive" src="http://images.prd.mris.com/image/V2/1/Yu59d899Ocpyr_RnF0-8qNJX1oYibjwp9TiLy-bZvU9vRJ2iC1zSQgFwW-fTCs6tVkKrj99s7FFm5Ygwl88xIA.jpg"/></a>
                        <div className="clearfix visible-sm myborder1"> </div>
                        <div className="media-body fnt-smaller">
                                <input id = "myheading" value = {allTrips[i].headline} type="text" readonly="readonly" />
                                <br></br><br></br>
                                <input id = "mydescription" value = {allTrips[i].description} type="text" readonly="readonly" />
                                <br></br><br></br>
                                <input id = "myaddress" value = {allTrips[i].streetAddress} type="text" readonly="readonly" />
                                <br></br>
                                <input id = "mycity" value = {allTrips[i].city} type="text" readonly="readonly" />
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = " " />
                                <input id = "mystate" value = {allTrips[i].state} type="text" readonly="readonly" />
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = " " />
                                <input id = "mycountry" value = {allTrips[i].country} type="text" readonly="readonly" />
                                <br></br><br></br>
                                <input id = "type" value = {allTrips[i].propertyType} type="text" readonly="readonly" />
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "mybedroom" value = {allTrips[i].bedrooms} type="text" readonly="readonly" />
                                <input id = "mybedroom" type="text" readonly="readonly" placeholder = "BR"/>
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "mybathroom" value = {allTrips[i].bathrooms} type="text" readonly="readonly" />
                                <input id = "mybathroom" type="text" readonly="readonly" placeholder = "BA"/>
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "mysleep" type="text" readonly="readonly" placeholder = "Sleeps"/>
                                <input id = "mybedroom" value = {allTrips[i].sleeps} type="text" readonly="readonly" />
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "mysleep" type="text" readonly="readonly" placeholder = "MinStay"/>
                                <input id = "mysleep" value = {allTrips[i].minStay} type="text" readonly="readonly" />
                                <br></br><br></br>
                                <input id = "myheading" value = {allTrips[i].currency + ' ' + allTrips[i].baseRate} type="text" readonly="readonly" />
                        </div>
                    </div>
                </div>
            });
            }
    }

    render(){
        
        let redirectVar = null;
        console.log(cookie.load('cookie1') === 'travellercookie')
        if(!cookie.load('cookie1')){
          redirectVar = <Redirect to = "/"/>
      }

  return(
    <div>
      {redirectVar}
      <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
            <a href="/" title = "HomeAway" className = "logo"><img alt="Homeaway Logo" src={require('./homeaway_logo.png')}/></a>
            </Navbar.Brand>
          </Navbar.Header>
        <div>
           <div className="btn btn-group">
             <button className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
             <div className="dropdown-menu">
                <a className="dropdown-item" href="/Profile">Profile</a>
                <a className="dropdown-item" href="/">Book My Trip</a>
                <a className="dropdown-item" onClick = {this.logout}>Logout</a>
             </div>
           </div>
           <img src={require('./logo.png')} alt="Homeaway Logo"/>
        </div>
      </Navbar>
            <div className = "container-full">
                <div className="container-pad">
                    <div className="form-row myformrow">
                        <div className="form-group col-sm-9" id = "property-listings" style ={{maxWidth : "900px"}}>
                            { this.renderTrips() }
                        </div>
                    </div>
                </div>
          </div>
        </div>
        )
    }
}
export default TravellerTripListings;
