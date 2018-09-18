import React from "react";

export const Header = (props) => {
  return (
    <nav className="navbar navbar-light navbar-static-top">
      <div class="container-fluid">
        <div class="navbar-header">
        <a href="http://disputebills.com"><img width="150" height="150" src="../../homeaway_logo.png" alt="HomeAway" /></a>
        </div>
        <ul class="nav navbar-nav navbar-right">
          <li><a  style= {{float:"right"}} href="#"><img width="50" height="30" src="../../US_Flag.png" /></a></li>
          <li><a  style= {{float:"right"}} href="http://localhost:3000/tripboards">Trip Boards</a></li>
          <li><a  style= {{float:"right"}} href="#">Help</a></li>
          <li><button class="button button3">List Your Property</button></li>
          <li><a  style= {{float:"right"}} href="#"><img width="50" height="50" src="../../logo1.jpg" /></a></li>
        </ul>
      </div>
    </nav>
  );
}