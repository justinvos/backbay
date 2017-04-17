/*
  Project: backbay
  Author: Justin Vos
*/

var crypto = require('crypto');
var model = require("./model.js");

/*
  Private Functions
*/

function getTimestamp() {
  return Date.now() / 1000;
}

function authenticate(email, password, callback) {
  model.readUser(email, function(docs) {
    if(docs[0].password == md5(password + docs[0].salt)) {
      callback(docs[0]._id);
    } else {
      callback(null);
    }
  });
}

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

function generateString(len) {
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
    setLen = set.length,
    salt = '';

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

function validateToken(user, token, succcess, failure) {
  model.readSessionByUserToken(user, token, function(sessions) {
    if(sessions.length > 0 && sessions[0].expiry >= getTimestamp()) {
      succcess();
    } else {
      failure();
    }
  });
}

/*
  ## Public Functions
*/

function login(email, password, callback) {
  authenticate(email, password, function(user) {
    if(user != null) {
      var expiry = Math.round(getTimestamp()) + (3 * 60 * 60);
      console.log(expiry);

      var token = generateToken();

      model.createSession(user, token, expiry);

      callback(user, token);
    }
  });
}

function authorise(user, token, succcess, failure) {
  model.readSessionByUserToken(user, token, function(sessions) {
    if(sessions.length > 0 && sessions[0].expiry >= getTimestamp()) {
      succcess();
    } else {
      failure();
    }
  });
}

function getEntries(user, token, store, callback) {
  if(validateToken(user, token)) {
    model.readEntries(user, store, callback);
  }
}

function getStores(owner, callback) {
  model.readStores(model.ObjectId(owner), function(docs) {
    callback(docs);
  });
}

exports.login = login;
exports.authorise = authorise;
exports.getEntries = getEntries;
exports.getStores = getStores;
