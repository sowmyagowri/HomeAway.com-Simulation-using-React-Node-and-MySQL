import React, {Component} from 'react';
import 'typeface-roboto'
import './OwnerPropertyListings.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Navbar} from "react-bootstrap";;

class OwnerPropertyListings extends Component {
    
    constructor(props){
        super(props);
        console.log("Parameters are: ");
        console.log(this.props.history);
        this.state = {
            email: "",
            isLoading : true,
            allListings:[{}],
        };
        
        this.generateContents = this.generateContents.bind(this);
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
        listedBy : cookie.load('cookie2'),
    }
        console.log("Calling Property Listings in Will Mount");
        console.log(data);
        axios.post('http://localhost:3001/homeaway/owner/propertylistings', data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log(response.data)
                this.setState({
                    allListings : response.data,
                    isLoading : false
                });
            }
        });
    }

    generateContents () {
        const {allListings} = this.state;
        const {isLoading} = this.state;
        if(!isLoading){
            return Object.keys(allListings).map((i) => {
                    return <div className="brdr bgc-fff pad-10 box-shad btm-mrg-20 myborder1 property-listing" key={allListings[i].ID}>
                    <div className="media">
                        <a className="pull-left" href="#" target="_parent">
                        <img alt="image" className="img-responsive" src="http://images.prd.mris.com/image/V2/1/Yu59d899Ocpyr_RnF0-8qNJX1oYibjwp9TiLy-bZvU9vRJ2iC1zSQgFwW-fTCs6tVkKrj99s7FFm5Ygwl88xIA.jpg"/></a>
                        <div className="clearfix visible-sm myborder1"> </div>
                        <div className="media-body fnt-smaller">
                                <input id = "myheading" value = {allListings[i].headline} type="text" readonly="readonly" />
                                <br></br><br></br>
                                <input id = "mydescription" value = {allListings[i].description} type="text" readonly="readonly" />
                                <br></br><br></br>
                                <input id = "myaddress" value = {allListings[i].streetAddress} type="text" readonly="readonly" />
                                <br></br>
                                <input id = "mycity" value = {allListings[i].city} type="text" readonly="readonly" />
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = " " />
                                <input id = "mystate" value = {allListings[i].state} type="text" readonly="readonly" />
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = " " />
                                <input id = "mycountry" value = {allListings[i].country} type="text" readonly="readonly" />
                                <br></br><br></br>
                                <input id = "type" value = {allListings[i].propertyType} type="text" readonly="readonly" />
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "bedroom" value = {allListings[i].bedrooms} type="text" readonly="readonly" />
                                <input id = "bedroom" type="text" readonly="readonly" placeholder = "BR"/>
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "bathroom" value = {allListings[i].bathrooms} type="text" readonly="readonly" />
                                <input id = "bathroom" type="text" readonly="readonly" placeholder = "BA"/>
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "sleep" type="text" readonly="readonly" placeholder = "Sleeps"/>
                                <input id = "sleep" value = {allListings[i].sleeps} type="text" readonly="readonly" />
                                <input id = "mysymbol" type="text" readonly="readonly" placeholder = "|" />
                                <input id = "sleep" type="text" readonly="readonly" placeholder = "MinStay"/>
                                <input id = "sleep" value = {allListings[i].minStay} type="text" readonly="readonly" />
                                <br></br><br></br>
                                <input id = "heading" value = {allListings[i].currency + ' ' + allListings[i].baseRate} type="text" readonly="readonly" />
                        </div>
                    </div>
                </div>
            });
            }
    }

    render(){
        
        let redirectVar = null;
        console.log(cookie.load('cookie1'))
        if(!cookie.load('cookie1')){
          redirectVar = <Redirect to = "/"/>
      }

  return(
    <div>
      {redirectVar}
      <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#" title = "HomeAway" className = "logo"><img src={require('./homeaway_logo.png')}/></a>
            </Navbar.Brand>
          </Navbar.Header>
        <div>
           <div className="btn btn-group">
             <button className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
             <div className="dropdown-menu">
                <a className="dropdown-item" href="/Profile">Profile</a>
                <a className="dropdown-item" href="/owner/propertypost">Post Property</a>
                <a className="dropdown-item" onClick = {this.logout}>Logout</a>
             </div>
           </div>
           <img src={require('./logo.png')} alt="Homeaway Logo"/>
        </div>
      </Navbar>
            <div className = "container-full">
                <div className="container-pad">
                    <div className="form-row ">
                        <div className="form-group col-sm-9" id = "property-listings" style ={{maxWidth : "900px"}}>
                            { this.generateContents() }
                        </div>
                    </div>
                </div>
          </div>
        </div>
        )
    }
}
export default OwnerPropertyListings;
