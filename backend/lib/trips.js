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
      "type": "trip"
    };

    $fh.db(options, function (err, data) {
      if (err) {
        console.error("Error " + err);
      } else {
        console.log(data.count + " items found");

        if (data.count == 0) {
          res.json([]);
        } else {
          var list = [];
          for (var i = 0; i < data.list.length; i++) {
            list[i] = data.list[i].fields;
          }

          //  {
          //    date: '2015-06-01',
          //    from: 'Stockholm',
          //    to: 'London',
          //    userId: 1,
          //    userName: 'Sarah'
          //  }
          res.json(list.reverse());
        }
      }
    });

  });

  trips.post('/', function(req, res) {
    console.log(new Date(), 'In trip route POST / req.body=', req.body);

    if (req.body) {
      var options = {
        "act": "create",
        "type": "trip",
        "fields": {
          "from": req.body.from,
          "to": req.body.to,
          date: req.body.date,
          userId: req.body.userId,
          userName: req.body.userName
        }
      };

      $fh.db(options, function (err, data) {
        if (err) {
          console.error("Error " + err);
          res.json({"result": "error", "message":  err });
        } else {
          console.log(JSON.stringify(data));
          res.json({result: 'success'});
        }
      });
    }

  });

  return trips;
}

module.exports = tripsRoute;
