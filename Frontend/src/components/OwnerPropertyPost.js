import React, {Component} from 'react'; 
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import './bootstrap-social.css';
import './PropertyPost.css';
import {Navbar} from "react-bootstrap";

//Define a Login Component
class OwnerPropertyPost extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = { gender: "male" };

        //Bind the handlers to this class
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    //email change handler to update state variable with the text entered by the user
    emailChangeHandler = (e) => {
        console.log("Inside email change handler");
        this.setState({
            email : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }

    genderChangeHandler = (e) => {
        this.setState({ gender: e.target.value });
    }
    
    handleValidation(){
        let formIsValid = true;

        //Email
        if(!this.state.email){
           formIsValid = false;
           alert("Login ID is a Required field");
           console.log("Login ID cannot be empty");
        }

        //Password
        if(!this.state.password){
            formIsValid = false;
            alert("Password is a Required field");
            console.log("Password cannot be empty");
         }
        
       return formIsValid;
   }
    //submit Login handler to send a request to the node backend
    submitLogin(event) {
        console.log("Inside submit login");
        var headers = new Headers();
        //prevent page from refresh
        event.preventDefault();
        if(this.handleValidation()){
            console.log("Login Form submitted");
            const data = {
            email : this.state.email,
            password : this.state.password
            }
        
            //set the with credentials to true
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/homeaway/login',data)
                .then(response => {
                    console.log("Status Code : ",response.status);
                    if(response.status === 200){
                        this.setState({
                            authFlag : true
                        })
                    }else{
                        this.setState({
                            authFlag : false
                        })
                    }
                });
        }
    }

    render(){
        //redirect based on successful login
        //let redirectVar = null;
        //if(!cookie.load('cookie')){
        //    redirectVar = <Redirect to= "/"/>
        //}
        return(
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/home" title = "HomeAway" className = "logo"><img src={require('./homeaway_logo.png')}/></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                </Navbar>
                <div class="container-fluid">    
                <div class="col-sm-6 col-sm-offset-4">
                <div class="login-form">
                    <h2><small>Property Information</small></h2>  
                    <hr width="98%"></hr>         
                    <br></br>
                            <div class="form-group">
                                <input onChange = {this.countryChangeHandler} type="text" class="form-control" name="country" placeholder="Country" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.addressChangeHandler} type="text" class="form-control" name="address" placeholder="Street Address" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.cityChangeHandler} type="text" class="form-control" name="city" placeholder="City"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.stateChangeHandler} type="text" class="form-control" name="state" placeholder="State"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.zipcodeChangeHandler} type="text" class="form-control" name="zipcode" placeholder="Zip Code"/>
                            </div>
                            <h2><small>Describe your Property</small></h2>  
                            <hr width="98%"></hr>         
                            <div class="form-group">
                                <input onChange = {this.headlineChangeHandler} type="text" class="form-control" name="headline" placeholder="Headline"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.descriptionChangeHandler} type="text" class="form-control" name="description" placeholder="Description"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.priceChangeHandler} min = "0" type="text" class="form-control" name="price" placeholder="Price"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.bedroomChangeHandler} type="number" min ="1" class="form-control" name="bedroom" placeholder="Bedrooms"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.bathroomChangeHandler} type="number" min ="1" class="form-control" name="bathroom" placeholder="Bathrooms"/>
                            </div>
                            <h2><small>Available</small></h2> 
                           <label for="from">From</label>
                                <input onChange = {this.availablefromChangeHandler} type="date" name="fromdate"/>
                            <label for="to">To</label>
                            <input onChange = {this.availabletoChangeHandler} type="date" name="todate"/>
                        </div>
                    </div>
                </div>
                <br></br>
                <div class="col-md-10 text-center"> 
                <button onClick = {this.saveChanges} class="btn-primary btn-lg" >Save Changes</button>
                </div>
        </div>
        )
    }
}
//export Login Component
export default OwnerPropertyPost;