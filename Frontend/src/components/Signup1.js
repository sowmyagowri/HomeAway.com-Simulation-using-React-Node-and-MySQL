import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import './Login.css';
import './bootstrap-social.css';

//Define a Signup1 Component
class Signup1 extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
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
                <div class="center">
                    <div id="yourdiv">
                        <h1 class="display-5">Sign Up for HomeAway<br></br>
                        <small>	Already have an account? <a class="bg-default" href="/login">Log in</a></small>	</h1>
                    </div>
                </div>
                <div class="container">    
                    <div class="col-sm-6 col-sm-offset-4">
                        <div class="login-form" style={{display: "inline-block"}}>
                            <br></br>
                            <a href="/signup2"><button class="btn btn-warning">Sign Up with Email</button></a>
                            
                            <br></br>
                            <div class="mydiv">
                                <span class="myspan">or</span>
                            </div>
                            <br></br>
                            <button class="mybtn facebook_button">Log in with Facebook</button>
                            <br></br>
                            <br></br>
                            <div class="center" id= "yourdiv">
                            <font size="1">We don't post anything without your permission.
                            <br></br>
                            By creating an account you are accepting our Terms and Conditions and Privacy Policy.
                            <br></br>
                            </font>
                            </div>
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
//export Signup1 Component
export default Signup1;