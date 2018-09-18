var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var database = require('../models/database.js');

//Schema
//var user = require('../models/User');

// Validate login user details
router.route('/login').post(function (req, res) {
  console.log("Inside Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  var password = req.body.password;
  
  database.connection.getConnection(function(err, connection) {
    if (err) {
      appData["error"] = 1;
      appData["data"] = "Internal Server Error";
      res.status(500).json(appData);
  } else {
    // execute query
    connection.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows, fields) => {
      if (err) {
        res.status(400).send("user does not exist");
      } else {
          if (rows.length > 0) {
            if (rows[0].password == password) {
              res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
              req.session.user = user;
              res.writeHead(200,{
                  'Content-Type' : 'text/plain'
              })
              res.end("Successful Login");
            }
        }
      }
    })
  }
  })
  connection.release();
});

// Validate login user details
router.route('/owner/login').post(function (req, res) {
  console.log("Inside Owner Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  var password = req.body.password;
  
  database.connection.getConnection(function(err, connection) {
    if (err) {
      appData["error"] = 1;
      appData["data"] = "Internal Server Error";
      res.status(500).json(appData);
  } else {
    // execute query
    connection.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows, fields) => {
      if (err) {
        res.status(400).send("user does not exist");
      } else {
          if (rows.length > 0) {
            if (rows[0].password == password && isOwner == 'Y') {
              res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
              req.session.user = user;
              res.writeHead(200,{
                  'Content-Type' : 'text/plain'
              })
              res.end("Successful Login");
            }
        }
      }
    })
  }
  })
  connection.release();
});

// Add users
router.route('/signup').post(function (req, res) {
  console.log("In Signup Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var userData = {
    "firstname": req.body.firstname,
    "lastname": req.body.lastname,
    "email": email,
    "password": req.body.password,
    "created": today
  }
  database.connection.getConnection(function(err, connection) {
    if (err) {
        appData["error"] = 1;
        appData["data"] = "Internal Server Error";
        res.status(500).json(appData);
    } else { 
      // execute query
      connection.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows, fields) => {
        if (err){
          res.status(400).send("unable to read the database");
        } else {
          if (rows.length > 0) {
            res.status(400).send("User already exists");
          }
          else {
            connection.query('INSERT INTO users SET ?',userData, function (error, results, fields) {
              if (err) {
                res.status(400).send("unable to insert into database");
              } else {
              res.json('User Added');
              }
            });
            }
        }
      })
    }
  })
  connection.release();
});


// fetch user profile details
router.route('/profile').get(function (req, res) {
  console.log("Inside Profile Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  let query = "SELECT * FROM users WHERE id = '" + trimemail + "' ";

  // execute query
  connection.query(query, (err, result) => {
    console.log(result);
      res.json(result);
  });
});

module.exports = router;