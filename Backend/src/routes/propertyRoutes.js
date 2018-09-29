var express = require('express');
// App Instance
var app = express();
var pool = require('../models/UserDB.js');
var router = express.Router();


const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads');
  },
  filename: (req, file, callback) => {

    callback(null, file.originalname + '-' + Date.now());
  },
});
var upload = multer({ storage : storage })


// Add Property
router.route('/owner/listproperty').post(upload.array('uploadedPhoto',5), function (req, res) {

  console.log("req.files");
  console.log(req.files);

  let filenamearray =[];
  req.files.forEach(file => {filenamearray.push(file.filename);});
  console.log(filenamearray);

  var stringObj = JSON.stringify(filenamearray);
  console.log(stringObj);
  console.log("In Owner Property Post");

  console.log(req.files.length);
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
    image1:  (req.files.length >= 1) ?req.files[0].filename:"",
    image2:  (req.files.length >= 2) ?req.files[1].filename:"",
    image3:  (req.files.length >= 3) ?req.files[2].filename:"",
    image4:  (req.files.length >= 4) ?req.files[3].filename:"",
    image5:  (req.files.length >= 5) ?req.files[4].filename:"",
  }

  console.log(userData.image1);
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
  
  pool.query('SELECT * from `property` where (uid NOT IN (SELECT propertyID from `bookings` where ((? BETWEEN bookedFrom AND bookedTo) OR (? BETWEEN bookedFrom AND bookedTo)))) AND city = ? and startDate <= ? and endDate >= ? and sleeps >= ?', [req.body.startDate, req.body.endDate, req.body.city.toLowerCase(), req.body.startDate, req.body.endDate, req.body.noOfGuests], function (error,result) {
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

// Search Property by id
router.route('/property/:id').get(function (req, res) {
  console.log(req.params.id);
  pool.query('SELECT * from `property` where uid = ? ', [req.params.id], function (error,result) {
    if (error) {
      console.log(error);
      console.log("unable to search database");
      res.status(400).send("unable to search database");
    } else {
      console.log(JSON.stringify(result));
      res.status(200).send(JSON.stringify(result));
      console.log("Property Details Found");
    }
  });    
});

// List Property by owner
router.route('/owner/propertylistings').post(function (req, res) {
  console.log(req.body);
  pool.query('SELECT * from `property` where listedBy = ? ', [req.body.listedBy], function (error,result) {
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

// Book Property
router.route('/bookproperty').post(function (req, res) {

  console.log("In Property Booking");

  var userData = {
    bookedBy: req.body.bookedBy,
    bookedFrom: req.body.bookedFrom,
    bookedTo: req.body.bookedTo,
    propertyID: req.body.propertyid,
    NoOfGuests : req.body.NoOfGuests,
    price: req.body.pricePaid,
  }

  console.log(userData);
  pool.query('INSERT INTO bookings SET ?',userData, function (error,result) {
    if (error) {
      console.log(error);
      console.log("unable to insert into bookings database");
      res.status(400).send("unable to insert into bookings database");
    } else {
      console.log(result);
      console.log("Booking Added");
      res.status(200).send("Booking Added");
    }
  });    
});

module.exports = router;