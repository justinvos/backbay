/*
  Project: backbay
  Author: Justin Vos
*/

var express = require('express');
var path = require('path');
var app = express();
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

app.get("/entries", function(req, res) {
  if(req.query._user != null && req.query._store != null) {
    // TODO: Check for authorisation
    console.log(controller.getEntries(req.query._user, req.query._store));
    res.send("200");
    // TODO: Send entries as response

  } else {
    res.send("Error");
  }
});

// TODO: Add POST /entries request that calls controller.addEntry

app.get("/stores", function(req, res) {
  if(req.query._owner != null && req.query.token != null) {
    controller.authorise(req.query._owner, req.query.token, function() {
      controller.getStores(req.query._owner, function(docs) {
        res.send(docs);
      });
    }, function() {
      res.send("Error: Authorisation failed");
    });
  } else {
    res.send("Error: The _owner or token parameters were not given");
  }
});

// TODO: Add POST /stores request that calls controller.addStore

// TODO: Add POST /sessions request that calls controller.login

// TODO: Add POST /users request that calls controller.register

/*
  ## Server start code
*/

app.use(express.static('views'));

app.listen(process.env.PORT || 3000, function() {
  console.log("# " + pjson.name + " " + pjson.version + "\n");
  console.log('Web Server Port: 3000');
});
