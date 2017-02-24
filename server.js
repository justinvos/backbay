var express = require('express');
var path = require('path');
var app = express();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.use(express.static('views'));

app.listen(process.env.PORT || 3000, function() {
  console.log('Example app listening on port 3000!');
});
