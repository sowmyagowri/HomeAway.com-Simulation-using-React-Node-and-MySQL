var express = require('express');
var router = express.Router();
var pool = require('../models/UserDB.js');


const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads');
  },
  filename: (req, file, callback) => {

    const newFilename = `test${path.extname(file.originalname)}`;
    callback(null, file.originalname + '-' + Date.now());
  },
});
var upload = multer({ storage : storage }).array('userPhoto',5);


// Add Property
router.route('/owner/listproperty').post(function (req, res) {
  upload(req,res,function(err) {
      console.log(req.files);
    if(err) {
        return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
  console.log(req.body);
  console.log("In Owner Property Post");
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
  pool.query('INSERT INTO property SET ?',userData, function (error,result) {
    if (error) {
      console.log(error);
      console.log("unable to insert into database");
      res.status(400).send("unable to insert into database");
    } else {
      console.log(result);
      console.log("Property Added");
      res.status(200).send("Property Added");
    }
  });    
});

// Search Property
router.route('/property/search').post(function (req, res) {
  console.log(req.body);
  pool.query('SELECT * from `property` where city = ? and startDate <= ?  and endDate >= ? and sleeps >= ?', [req.body.city.toLowerCase(), req.body.startDate, req.body.endDate, req.body.noOfGuests], function (error,result) {
    if (error) {
      console.log(error);
      console.log("unable to search database");
      res.status(400).send("unable to search database");
    } else {
      console.log(JSON.stringify(result));
      res.status(200).send(JSON.stringify(result));
      console.log("Property Found");
    }
  });    
});

router.route('/property/imageupload', (req, res) => {
  upload(req,res,function(err) {
      console.log(req.body);
      console.log(req.files);
    if(err) {
        return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});

module.exports = router;