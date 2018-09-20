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

// Validate login user details
router.route('/login').post(function (req, res) {
  console.log("Inside Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  var password = req.body.password;
  
  pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows, fields) => {
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
            req.session.user = user;
            res.status(200).send("Login Successful")
          }
      }
    }
  })
});

// Validate login user details
router.route('/owner/login').post(function (req, res) {
  console.log("Inside Owner Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  var password = req.body.password;
  
  pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send("user does not exist");
    } else {
        if (rows.length > 0) {
          if (rows[0].password == password && isOwner == 'Y') {
              res.cookie('cookie',req.body.email,{maxAge: 900000, httpOnly: false, path : '/'});
              req.session.user = user;
              res.status(200).send("Login Successful");

          }
        }
      }
    })
});


// Add users
router.route('/signup').post(function (req, res) {
  console.log("In Signup Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var year = new Date();
  
  var encryptedString = encrypt(req.body.password);

  var userData = {
    "firstname": req.body.firstname,
    "lastname": req.body.lastname,
    "email": trimemail,
    "password": encryptedString,
    "created": year
  }

  pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows, fields) => {
    if (err){
        console.log(err);
        console.log("unable to read the database");
        res.status(400).send("unable to read the database");
    } else {
      if (rows.length > 0) {
        console.log("User already exists");
        res.status(400).send("User already exists");
      } else {
        pool.query('INSERT INTO users SET ?',userData, function (err) {
        if (err) {
          console.log("unable to insert into database");
          res.status(400).send("unable to insert into database");
        } else {
          res.status(200).send("User Added");
          console.log("User Added");
          res.cookie('cookie1',"travellercookie",{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie3',rows[0].firstname,{maxAge: 900000, httpOnly: false, path : '/'});
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