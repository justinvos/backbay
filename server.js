/*
  Project: backbay
  Author: Justin Vos
*/

var express = require('express');
var path = require('path');
var app = express();
var model = require("./model.js");
var controller = require("./controller.js");
var pjson = require('./package.json');

/*
  # Routes

  ## HTML View Routes
*/

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/register.html'));
});

app.get('/app', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/app.html'));
});

/*
  ## Web API Routes
*/

app.get("/store", function(req, res) {
  if(req.query._key != null) {
    res.send("200");
  } else {
    res.send("400");
  }
  model.readStores(1, function(docs) {
    console.log(docs);
  });
});

app.get("/entries", function(req, res) {
  if(req.query._user != null && req.query._store != null) {
    console.log(controller.getEntries(req.query._user, req.query._store));
    res.send("200");
  } else {
    res.send("Error");
  }
});

app.post("/entries", function(req, res) {
  if(req.query._user != null && req.query._store != null) {

  } else {
    res.send("Error");
  }
});

app.get("/stores", function(req, res) {
  if(req.query._owner != null) {
    var owner = req.query._owner;
    model.readStores(model.ObjectId(owner), function(docs) {
      console.log(docs);
      res.send(docs);
    });
  } else {
    res.send("Error");
  }
});

app.use(express.static('views'));

app.listen(process.env.PORT || 3000, function() {
  console.log("# " + pjson.name + " " + pjson.version + "\n");
  console.log('Web Server Port: 3000');
});

/*
Token validation example

var user = "58f43a23d59454bb1d822fbf";
var token = "CutU1Fs24hzPQYUrlGKJYSZfDkn74lbT";

controller.validateToken(user, token, function() {
  console.log("logged in");
}, function() {
  console.log("failed");
});
*/
