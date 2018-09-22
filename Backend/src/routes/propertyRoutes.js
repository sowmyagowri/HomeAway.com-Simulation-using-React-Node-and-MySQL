var express = require('express');
var router = express.Router();
var pool = require('../models/UserDB.js');

// Add Property
router.route('/owner/listproperty').post(function (req, res) {
  console.log("In Owner Property Post");
  console.log(req.body.listedBy);
  var userData = {
    listedBy: req.body.listedBy,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    streetAddress: req.body.streetAddress,
    city: req.body.city.toLowerCase(),
    state: req.body.state.toLowerCase(),
    country: req.body.country.toLowerCase(),
    zipcode: req.body.zipcode,
    headline: req.body.headline,
    description: req.body.description,
    propertyType: req.body.propertyType,
    bedrooms: req.body.bedrooms,
    sleeps: req.body.sleeps,
    bathrooms: req.body.bathrooms,
    baseRate: req.body.baseRate,
    currency: req.body.currency,
    minStay: req.body.minStay,
    amenities: req.body.amenities,
  }

  pool.query('INSERT INTO property SET ?',userData, function (error) {
    if (error) {
      console.log(error);
      console.log("unable to insert into database");
      res.status(400).send("unable to insert into database");
    } else {
      res.status(200).send("Property Added");
      console.log("Property Added");
    }
  });    
});

// Search Property
router.route('/property/search').post(function (req, res) {
  console.log("In Property Search");
  var sqlquery = "SELECT * from `property` where city = this.req.location.toLowerCase() and startDate = this.req.startDate and endDate = this.req.endDate and sleeps >= this.req.guests";
  pool.query(sqlquery,function (error,result) {
    if (error) {
      console.log(error);
      console.log("unable to search database");
      res.status(400).send("unable to search database");
    } else {
      res.status(200).send(JSON.stringify(result));
      console.log("Property Found");
    }
  });    
});

module.exports = router;