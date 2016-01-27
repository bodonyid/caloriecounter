'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var meal = require('./meal');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.listen(3000);

app.post('/meals', function (req, res) {
  meal.add(req.body, function(err, result) {
  	res.json({
    	status: 'Ok'
  	});
  });
});

app.get('/meals', function (req, res) {
  meal.getAll(function(err, meals) {
    res.json(meals);
  });
});

app.get('/meals/filter/:date', function (req, res) {
  meal.filter(req.params.date, function(err, meals) {
    res.json(meals);
  });
});


app.delete('/meals/:id', function (req, res) {
  meal.del(req.params.id, function(err, result) {
    if (err) {
      res.json({status: 'Does not exist'});
    } else {
      res.json({status: 'Ok'});
    }
  });
});
