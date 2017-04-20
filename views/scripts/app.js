console.log("Account:" + localStorage.getItem("user"));
console.log("Token:" + localStorage.getItem("token"));
document.getElementById("accountSpan").innerHTML = localStorage.getItem("user");
document.getElementById("tokenSpan").innerHTML = localStorage.getItem("token");


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
  fetch("/stores", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: "_owner=" + localStorage.getItem("user") + "&token=" + localStorage.getItem("token") + "&label=" + label
  }).then(function(response) {
    return response.json().then(function(json) {
      callback({});
    });
  });
}

function clickAddStore() {
  console.log("clicked addStore");
  var label = document.getElementById("labelInput").value;
  addStore(label, function(res) {
    console.log(res);
  });
}

getStores(printStores);
