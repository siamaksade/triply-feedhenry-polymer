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
          var postdata = querystring.stringify({
            'to' : mobile,
            'body': 'Verification code ' + code + ' /Triply'
          });

          var postoptions = {
              host : 'redhat-demos-t-unp82efa0c6qwegq1bihk8j4-dev.ac.gen.ric.feedhenry.com',
              port : 443,
              path : '/cloud/sms',
              method : 'POST',
              headers: {'Content-Type' : 'application/json', 'Content-Length': postdata.length}
          };

          var req = https.request(postoptions, function(res) {
            console.log("Twillo status code = " + res.statusCode);
          });

          req.on('error', function(e) {
            console.log('Problem with Twillo request: ' + e.message);
          });

          req.write(postdata);
          req.end();


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
