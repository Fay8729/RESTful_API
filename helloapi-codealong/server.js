var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle');

//configure app for bodyParser()
//lets us grab data from the body of POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//set up port for server tp listen on
var port = process.env.PORT || 3000;

//connect to OB
mongoose.connect('mongodb://127.0.0.1:27017/test');

//API Routes
var router = express.Router();

//Routes will all be prefixed with/API
app.use('/api', router);

//middleware
//middleware can be cery useful for doing validations.
//we can log things from here or stop request from contining
//in the event that the request is not safe
//middleware to use for all requests
router.use(function(req, res, next) {
  console.log('FYI...There is some processing currently going down...');
  next();
});

//test route
router.get('/', function(req, res) {
  res.json({
    message: 'welcome to our API'
  });
});

router.route('/vehicles')
  .post(function(req, res) {
    var vehicle = new Vehicle(); //new instance of a vehicle
    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.color = req.body.color;

    vehicle.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({
        message: 'Vehicle wae successfully manufactured'
      });
    });
  })

.get(function(req, res) {
  Vehicle.find(function(err, vehicles) {
    if (err) {
      res.send(err);
    }
    res.json(vehicles);
  });
});

router.route('/vehicle/:vehicle_id')
  .get(function(req, res) {
    Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/make/:make')
  .get(function(req, res) {
    Vehicle.find({
      make: req.params.make
    }, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/color/:color')
  .get(function(req, res) {
    Vehicle.find({
      color: req.params.color
    }, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

//fire up server
app.listen(port);

//print friendly message to console
console.log('server listening on port' + port);

//fire up server
