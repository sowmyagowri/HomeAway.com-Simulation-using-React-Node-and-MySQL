var express = require('express');
var router = express.Router();
var pool = require('../models/UserDB.js');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

// Validate traveller login user details
router.route('/traveller/login').post(function (req, res) {
  console.log("Inside traveller Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  var password = req.body.password;
  
  pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows) => {
    if (err) {
      console.log(err);
      res.status(400).send("user does not exist");
    } else {
      if (rows.length > 0) {
        decryptedString = decrypt(rows[0].password);
        if (password == decryptedString) {
          res.cookie('cookie1',"travellercookie",{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie3',rows[0].firstname,{maxAge: 900000, httpOnly: false, path : '/'});
          req.session.user = rows[0].email;
          res.status(200).send("Login Successful")
        } 
      }
    }
  })
});

// Validate owner login user details
router.route('/owner/login').post(function (req, res) {
  console.log("Inside Owner Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  var password = req.body.password;
  
  pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows) => {
    if (err) {
      console.log(err);
      res.status(400).send("user does not exist");
    } else {
      if (rows.length > 0) {
        decryptedString = decrypt(rows[0].password);
        if (password == decryptedString && rows[0].isOwner == 'Y') {
          res.cookie('cookie1',"ownercookie",{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie3',rows[0].firstname,{maxAge: 900000, httpOnly: false, path : '/'});
          req.session.user = rows[0].email;
          console.log("Owner found in DB");
          res.status(200).send("Login Successful")
        }
        else{
          res.status(400).send("Login not successful") 
        }
      }
      }
    })
});


// Add traveller users
router.route('/traveller/signup').post(function (req, res) {
  console.log("In traveller Signup Post");
  console.log(req.body);
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var today = new Date();
  var year = today.getFullYear();
  
  var encryptedString = encrypt(req.body.password);

  var userData = {
    "firstname": req.body.firstname,
    "lastname": req.body.lastname,
    "email": trimemail,
    "password": encryptedString,
    "created": year,
    "isOwner": 'N'
  }

  pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows) => {
    if (err){
        console.log(err);
        console.log("unable to read the database");
        res.status(400).send("unable to read the database");
    } else {
      if (rows.length > 0) {
        console.log("User already exists");
        res.status(400).send("User already exists");
      } else {
        pool.query('INSERT INTO users SET ?',userData, function (err,rows) {
        if (err) {
          console.log("unable to insert into database");
          res.status(400).send("unable to insert into database");
        } else {
          console.log("User Added");
          res.cookie('cookie1',"travellercookie",{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie3',req.body.firstname,{maxAge: 900000, httpOnly: false, path : '/'});
          res.status(200).send("User Added");
        }});
      }
    }
  })
});

// Add owner users
router.route('/owner/signup').post(function (req, res) {
  console.log("In owner Signup Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var year = new Date();
  
  var encryptedString = encrypt(req.body.password);

  var userData = {
    "firstname": req.body.firstname,
    "lastname": req.body.lastname,
    "email": trimemail,
    "password": encryptedString,
    "created": year,
    "isOwner": 'Y'
  }

  pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows) => {
    if (err){
        console.log(err);
        console.log("unable to read the database");
        res.status(400).send("unable to read the database");
    } else {
      if (rows.length > 0) {
        if (rows[0].isOwner == 'Y') {
          console.log("Owner already exists");
          res.status(400).send("Owner already exists");
        } else{
          var sqlquery = "UPDATE users SET isOwner = 'Y' where email = ?";
          pool.query(sqlquery, [trimemail], (err) =>  {
            if (err) {
              console.log(err);
              console.log("unable to update user to owner");
              res.status(400).send("unable to update user to owner");
            }
            else{
              console.log("Owner profile added to traveller login");
              res.cookie('cookie1',"ownercookie",{maxAge: 900000, httpOnly: false, path : '/'});
              res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
              res.cookie('cookie3',req.body.firstname,{maxAge: 900000, httpOnly: false, path : '/'});
              res.status(200).send("Owner profile added to traveller login");
            }
          })
        }
      } else {
        pool.query('INSERT INTO users SET ?',userData, function (err) {
        if (err) {
          console.log("unable to insert into database");
          res.status(400).send("unable to insert into database");
        } else {
          console.log("User Added");
          res.cookie('cookie1',"ownercookie",{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie3',rows[0].firstname,{maxAge: 900000, httpOnly: false, path : '/'});
          res.status(200).send("Owner Added");
        }});
      }
    }
  })
});

// fetch user profile details
router.route('/profile').post(function (req, res) {
  console.log("Inside Profile fetch");
  var input_email = req.body.email;
  console.log(input_email);
  pool.query('SELECT * FROM users WHERE email = ?', [input_email], (err, result) => {
    if (err){
      console.log(err);
      res.status(400).send("User not found");
    }else {
      res.status(200).send(JSON.stringify(result));
    }
  })
});

// save user profile details
router.route('/profilesave').post(function (req, res) {
  console.log("In profile save Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  
  var userData = {
    "firstname": req.body.firstname,
    "lastname": req.body.lastname,
    "aboutMe" : req.body.aboutMe,
    "city" : req.body.city,
    "state" : req.body.state,
    "country" : req.body.country,
    "company" : req.body.company,
    "school" : req.body.school,
    "hometown" : req.body.hometown,
    "gender" : req.body.gender,
    "phone" : req.body.phone
  }

  console.log(userData);
  pool.query('UPDATE users SET ? WHERE email = ?', [userData, trimemail], function (err) {
    if (err) {
      console.log(err);
      console.log("unable to update database");
      res.status(400).send("unable to update database");
    } else {
      pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, result) => {
        if (err){
          console.log(err);
          res.status(400).send("User not found");
        }else {
          res.status(200).send(JSON.stringify(result));
        }
      })
    }
  })
});

module.exports = router;