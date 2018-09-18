import React, {Component} from 'react';

import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import './Login.css';
import './bootstrap-social.css';

//Define a Login Component
class OwnerLogin extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email : "",
            password : "",
            authFlag : false
        }
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
            axios.post('http://localhost:3001/homeaway/owner/login',data)
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
        let redirectVar = null;
        if(cookie.load('cookie')){
            redirectVar = <Redirect to= "/home"/>
        }
        return(
            <div>
                {redirectVar}
                <div class="container">
                <p></p>
                </div>
                <div class="container">
                <p></p>
                </div>
                <div class="container">
                <p></p>
                </div>
                <div class="container">
                <p></p>
                </div>
                <div class="container">
                <p></p>
                </div>
                <div class="container">
                <p></p>
                </div>
                <div class="col-md-6" >
                <img src="../../banner.png" width="700" height="500" class="img-rounded" alt="Cinque Terre"></img>
                </div>
                <div class="row">
                <div class="col-md-6 col-sm-6" style={{padding:" right 5px"}}>
                <div class="login-form">
                    <h2><small>Owner Login</small></h2>  
                    <hr width="98%"></hr>         
                    <br></br>
                            <div class="form-group">
                                <input onChange = {this.emailChangeHandler} type="text" class="form-control" name="email" placeholder="Email Address" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password" required/>
                            </div>
                            <button id="opener_guid" type="button">Forgot Password?</button>
                            <br></br>
                            <br></br>
                            <div>
                            <button onClick = {this.submitLogin} class="btn btn-warning" >Log In</button>
                            </div>
                            <br></br>
                            <input type="checkbox" name="signedin" value="signedin"/> Keep me signed in<br></br>
                            <div class="mydiv">
                            </div>
                            <br></br>
                            <h4 align="center"><small>	Want to list your property? <a class="bg-default" href="#">Learn More</a></small></h4>
                            <br></br>
                    </div>
                </div>
                </div>
                <br></br>
                <div class="center" id= "yourdiv">
                <font size="1">Use of this Web site constitutes acceptance of the HomeAway.com Terms and Conditions and Privacy Policy.
                    <br></br>
                    ©2018 HomeAway. All rights reserved.</font>
                </div>
           
            </div>
        )
    }
}
//export Login Component
export default OwnerLogin;