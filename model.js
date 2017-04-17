/*
  Project: backbay
  Author: Justin Vos
*/

var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;

var url = 'mongodb://backbay:NIRJKVpmLlDNdi0Z@cluster0-shard-00-00-efb7y.mongodb.net:27017,cluster0-shard-00-01-efb7y.mongodb.net:27017,cluster0-shard-00-02-efb7y.mongodb.net:27017/backbay?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

// Private functions

function connect(callback) {
  MongoClient.connect(url, function(err, db) {
    callback(db);
    db.close();
  });
}

function create(collectionName, data, callback=function(docs){}) {
  connect(function(db) {
    db.collection(collectionName).insert(data, function(err, docs) {
      callback(docs.ops);
    });
  });
}

function read(collectionName, filter, callback) {
  connect(function(db) {
    var cursor = db.collection(collectionName).find(filter);

		cursor.toArray(function(err, docs) {
			callback(docs);
		});
  });
}

// Public functions

function createEntry(user, store, data) {
  data._store = store;
  create("entries", data);
}

function readEntries(user, store, callback) {
  if(hasStore(user, store)) {
    read("entries", {_user: user, _store: store}, callback);
  }
}

function createStore(owner, label) {
  create("stores", {_owner: owner, label: label});
}

function readStores(owner, callback) {
  read("stores", {_owner:owner}, callback);
}

function readStoresByLabel(owner, label, callback) {
  read("stores", {_owner: owner, label: label}, callback);
}

function hasStore(owner, store) {
  read("stores", {_id: ObjectId(store), _owner: owner}, function(docs) {
    return docs.length > 0;
  });
}

function createUser(email, password, salt) {
  create("users", {email: email, password: password, salt: salt});
}

function readUser(email, callback) {
  read("users", {email: email}, callback);
}

function createSession(user, token, expiry) {
  create("sessions", {_user: user, token: token, expiry: expiry});
}

function readSessionByUserToken(user, token, callback) {
  read("sessions", {_user: ObjectId(user), token: token}, callback);
}

exports.ObjectId = ObjectId;
exports.createEntry = createEntry;
exports.readEntries = readEntries;
exports.createStore = createStore;
exports.readStores = readStores;
exports.readStoresByLabel = readStoresByLabel;
exports.hasStore = hasStore;
exports.createUser = createUser;
exports.readUser = readUser;
exports.createSession = createSession;
exports.readSessionByUserToken = readSessionByUserToken;
