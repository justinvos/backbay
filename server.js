var express = require('express');
var path = require('path');
var app = express();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get("/store", function(req, res) {
  if(req.query._key != null) {
    res.send("200");
  } else {
    res.send("400");
  }
});

app.use(express.static('views'));

app.listen(process.env.PORT || 3000, function() {
  console.log('Example app listening on port 3000!');
});
