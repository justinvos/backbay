/*
  Project: backbay
  Author: Justin Vos
*/

var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var app = express();
var controller = require("./controller.js");
var pjson = require("./package.json");


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

/*
  ## Helper Functions
*/

function hasParameters(query, parameters) {
  for(var i = 0; i < parameters.length; i++) {
    if(query[parameters[i]] == null) {
      return false;
    }
  }
  return true;
}

/*
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
  if(hasParameters(req.query, ["_user", "token", "_store"])) {
    controller.authorise(req.query._user, req.query.token, function() {
      controller.getEntries(req.query._user, req.query._store, function(docs) {
        res.send(docs);
      });
    }, function() {
      res.send("Error: Authorisation failed");
    });
  } else {
    res.send("Error: The _user, token, or _store parameters were not given");
  }
});

// TODO: Add POST /entries request that calls controller.addEntry

app.get("/stores", function(req, res) {
  if(hasParameters(req.query, ["_owner", "token"])) {
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

app.post("/sessions", function(req, res) {
  if(hasParameters(req.body, ["email", "password"])) {
    controller.login(req.body.email, req.body.password, function(user, token) {
      res.header("Content-Type", "application/json");
      res.send(JSON.stringify({user: user, token: token}));
    }, function() {
      res.send("Error: Authentication failed");
    });
  } else {
    res.send("Error: The email or password parameters were not given");
  }
});

// TODO: Add POST /users request that calls controller.register

/*
  ## Server start code
*/

app.use(express.static('views'));

app.listen(process.env.PORT || 3000, function() {
  console.log("# " + pjson.name + " " + pjson.version + "\n");
  console.log('Web Server Port: 3000');
});
