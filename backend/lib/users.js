var $fh = require('fh-mbaas-api');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var querystring = require('querystring');
var https = require('https');

function usersRoute() {
  var users = new express.Router();
  users.use(cors());
  users.use(bodyParser());

  users.post('/register', function(req, res) {
    console.log(new Date(), 'In user route POST / req.body=', req.body);

    var name = req.body.name;
    var mobile = req.body.mobile;
    // random number as verification code
    var code = Math.round(Math.random() * (999999 - 100000) + 100000);
    console.log("code = " + code);

    if (req.body) {
      var options = {
        "act": "create",
        "type": "user",
        "fields": {
          "name": name,
          "mobile": mobile,
          "code": code,
          "verified": false
        }
      };

      $fh.db(options, function (err, data) {
        if (err) {
          console.error("Error " + err);
          res.json({"result": "error", "message":  err });
        } else {
          var user = data.fields;
          user.id = data.guid;


          // send SMS
          $fh.service({
            "guid": process.env.TWILIO_SERVICE_ID,
            "path": "/cloud/sms",
            "method": "POST",
            "params": {
              "to": mobile,
              "body": 'Verification code ' + code + ' /Triply'
              }
          }, function(err, body, res) {
            if (err) {
              // An error occurred 
              console.log('Twilio service call failed: ', err);
            } else {
              console.log('Twilio response Body: ', body);
            }
          });

          res.json({"result": "success", "user":  user });
        }
      });
    }
  });

  users.post('/verify', function(req, res) {
    console.log(new Date(), 'In user route POST / req.body=', req.body);

    if (req.body) {
      var options = {
          "act": "read",
          "type": "user",
          "guid": req.body.id
        }
      };

      $fh.db(options, function (err, data) {
        if (err) {
          console.error("Error " + err);
          res.json({"result": "error", "message":  err });
        } else {
          if (data.fields.code == req.body.code) {
            // update user
            options = {
              "act": "update",
              "type": "user",
              "guid": req.body.id,
              "fields": {
                "verified": true
              }
            };

            $fh.db(options, function (err, data) {
              if (err) {
                 // handle error
                 res.json({"result": "fail", "msg":  'Something went wrong' });
                 return;
              } else {
                // handle success
              }
            });


            res.json({"result": "success"});

          } else {
            res.json({"result": "fail", "msg":  'Invalid code' });
          }
        }
      });
  });

  return users;
}

module.exports = usersRoute;
