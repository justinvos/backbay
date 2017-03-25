var crypto = require('crypto');
var model = require("./model.js");

function getTimestamp() {
  return Date.now() / 1000;
}

function authenticate(email, password) {
  model.readUser(email, function(docs) {
    if(docs[0].password == md5(password + docs[0].salt)) {
      return docs[0]._id;
    } else {
      return null;
    }
  });
}

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

function generateString(len) {
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
    setLen = set.length,
    salt = '',

  for (var i = 0; i < len; i++) {
    var p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}

function generateSalt() {
  return generateString(10);
}

function generateToken() {
  return generateString(32);
}


function registerUser(email, password) {
  var salt = generateSalt();
  model.createUser(email, password, salt);
}

function login(email, password) {
  var user = authenticate(email, password);
  if(user != null) {
    var expiry = getTimestamp() + (3 * 60 * 60);
    console.log(timestamp);

    var token = generateToken();

    model.createSession(user, token, expiry);
  }
}

function validateToken(user, token) {
  model.readSessionByUserToken(user, token, function(sessions) {
    if(sessionDocs.length > 0 && sessions[0].expiry >= getTimestamp()) {
      return true;
    }
  });
  return false;
}

function getEntries(user, token, store, callback) {
  if(validateToken(user, token)) {
    model.readEntries(user, store, callback);
  }
}
