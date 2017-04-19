console.log("app");
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
    console.log(stores[i]);
    var storeItem = document.createElement("li");
    storeItem.appendChild(document.createTextNode(stores[i].label));
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
