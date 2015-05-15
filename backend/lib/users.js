var $fh = require('fh-mbaas-api');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

function tripsRoute() {
  var trips = new express.Router();
  trips.use(cors());
  trips.use(bodyParser());


  trips.get('/', function(req, res) {
    var options = {
      "act": "list",
      "type": "user",
      "eq": {
          "verified": true
        }
    };

    $fh.db(options, function (err, data) {
      if (err) {
        console.error("Error " + err);
      } else {
        console.log(JSON.stringify(data));

        if (data.count == 0) {
          res.json([]);
        } else {
          var list = [];
          for (var i = 0; i < data.list.length; i++) {
            list[i] = data.list[i].fields;
          }

          res.json(list);
        }
      }
    });
  });

  trips.post('/', function(req, res) {
    console.log(new Date(), 'In user route POST / req.body=', req.body);

    if (req.body) {
      var options = {
        "act": "create",
        "type": "user",
        "fields": {
          "name": req.body.name,
          "mobile": req.body.mobile,
          "verified": false
        }
      };

      $fh.db(options, function (err, data) {
        if (err) {
          console.error("Error " + err);
          res.json({"result": "error", "message":  err });
        } else {
          res.json({"result": "success", "user":  data.fields });
        }
      });
    }
  });

  return trips;
}

module.exports = tripsRoute;
