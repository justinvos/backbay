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

/*
  ## Public Functions
*/

function register(email, password) {
  var salt = generateSalt();
  model.createUser(email, md5(password + salt), salt);
}

function login(email, password, success, failure) {
  authenticate(email, password, function(user) {
    if(user != null) {
      var expiry = Math.round(getTimestamp()) + (3 * 60 * 60);
      console.log(expiry);

      var token = generateToken();

      model.createSession(user, token, expiry);

      success(user, token);
    } else {
      failure();
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

function addEntry(user, store, data) {
  model.hasStore(model.ObjectId(user), model.ObjectId(store), function() {
    model.createEntry(model.ObjectId(user), model.ObjectId(store), data);
  }, function() {
  });
}

function getEntries(user, store, callback) {
  model.hasStore(model.ObjectId(user), model.ObjectId(store), function() {
    model.readEntries(model.ObjectId(user), model.ObjectId(store), callback);
  }, function() {
    callback([]);
  });
}

function addStore(owner, label) {
  model.createStore(model.ObjectId(owner), label);
}


function getStores(owner, callback) {
  model.readStores(model.ObjectId(owner), function(docs) {
    callback(docs);
  });
}

// TODO: Add register function

exports.register = register;
exports.login = login;
exports.authorise = authorise;
exports.addEntry = addEntry;
exports.getEntries = getEntries;
exports.addStore = addStore;
exports.getStores = getStores;
