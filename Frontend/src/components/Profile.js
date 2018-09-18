import React, {Component} from 'react'; 
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import './bootstrap-social.css';

//Define a Login Component
class Profile extends Component{
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
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/"/>
        }
        return(
            <div>
                
                <nav class="navbar navbar-default">
                    <div class="container text-center">
                        <div id="navbar" class="navbar-collapse">
                            <ul class="nav navbar-nav">
                            <li><a href="#">Inbox</a></li>
                            <li><a href="#">My Trips</a></li>
                            <li><a href="#">Profile</a></li>
                            <li><a href="#">Account</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div class="center">
                    <div id="yourdiv">
                        <h1 class="display-5">Name<br></br>
                        <small>	Member since</small></h1>
                    </div>
                </div>
                <div class="container-fluid">    
                <div class="col-sm-6 col-sm-offset-4">
                <div class="login-form">
                    <h2><small>Profile Information</small></h2>  
                    <hr width="98%"></hr>         
                    <br></br>
                            <div class="form-group">
                                <input onChange = {this.firstnameChangeHandler} type="text" class="form-control" name="firstname" placeholder="First Name" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.lastnameChangeHandler} type="text" class="form-control" name="lastname" placeholder="Last Name or Initial" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.aboutmeChangeHandler} type="text" class="form-control input-lg" name="aboutme" placeholder="About me"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.cityChangeHandler} type="text" class="form-control" name="city" placeholder="City"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.countryChangeHandler} type="text" class="form-control" name="country" placeholder="Country"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.companyChangeHandler} type="text" class="form-control" name="company" placeholder="Company"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.schoolChangeHandler} type="text" class="form-control" name="school" placeholder="School"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.hometownChangeHandler} type="text" class="form-control" name="hometown" placeholder="Hometown"/>
                            </div>
                            <div class="form-group">
                            <select value={this.state.gender} style={{width:"100%"}}onChange={this.handleChange}>
                                <option value="" hidden>Gender</option>
                                <option name="male"> Male</option>
                                <option name="female">Female</option>
                                <option name="other">Other</option>
                            </select><br/>
                            <h4><small>This is never shared</small></h4>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.phoneChangeHandler} type="text" class="form-control" name="phone" placeholder="Phone Number"/>
                            </div>
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
export default Profile;