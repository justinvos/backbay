var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;

var url = 'mongodb://localhost:27017/backbay';

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

function createStore(user, label) {
  create("stores", {_user: user, label: label});
}

function readStores(user, callback) {
  read("stores", {_user: user}, callback);
}

function readStoresByLabel(user, label, callback) {
  read("stores", {_user: user, label: label}, callback);
}

function hasStore(user, store) {
  read("stores", {_id: ObjectId(store), _user: user}, function(docs) {
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
  read("sessions", {_user: user, token: token}, callback);
}

exports.createEntry = createEntry;
exports.readEntries = readEntries;
exports.createStore = createStore;
exports.readStores = readStores;
exports.readStoresByLabel = readStoresByLabel;
exports.hasStore = hasStore;
exports.createUser = createUser;
exports.readUser = readUser;
