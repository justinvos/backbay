var express = require('express');
var path = require('path');
var app = express();
var model = require("./model.js");

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get('/app', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/app.html'));
});

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

app.use(express.static('views'));

app.listen(process.env.PORT || 3000, function() {
  console.log('Example app listening on port 3000!');
});
