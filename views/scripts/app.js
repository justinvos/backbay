console.log("User:" + localStorage.getItem("user"));
console.log("Token:" + localStorage.getItem("token"));

function getStores(callback) {
  fetch("/stores?_owner=" + localStorage.getItem("user") + "&token=" + localStorage.getItem("token"), {
    method: "get",
    headers: {
      Accept: "application/json"
    }
  }).then(function(response) {
    return response.json().then(function(json) {
      callback(json);
    });
  });
}

function printStores(stores) {
  var parent = document.getElementById('storeList');

  for(var i = 0; i < stores.length; ++i) {
    var storeId = document.createElement("div");
    storeId.appendChild(document.createTextNode(stores[i]["_id"]));
    storeId.className = "storeList__id";

    var storeLabel = document.createElement("div");
    storeLabel.appendChild(document.createTextNode(stores[i]["label"]));
    storeLabel.className = "storeList__label";


    var storeItem = document.createElement("li");
    storeItem.appendChild(storeId);
    storeItem.appendChild(storeLabel);
    storeItem.className = "storeList__item";
    parent.appendChild(storeItem);
  }
}

function addStore(label, callback) {
  //TODO: Add fetch call to send POST request to /stores
}

function clickAddStore() {
  console.log("clicked addStore");
  var label = document.getElementById("labelInput").value;
  addStore(label, function(res) {
    console.log(res);
  });
}

getStores(printStores);
