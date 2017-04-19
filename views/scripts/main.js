console.log("test");
//ReactDOM.render(<div>Hello World</div>, document.getElementById('container'));

function clickLogin() {
  //var email = "justinvosnz@gmail.com";
  var email = document.getElementById("emailInput").value;
  //var password = "pokemon";
  var password = document.getElementById("passwordInput").value;

  login(email, password, function(user, token) {
    console.log(user + " = " + token);
    localStorage.setItem("user", user);
    localStorage.setItem("token", token);
    window.location = "/app";
  });
}

function login(email, password, callback) {
  fetch("/sessions", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: "email=" + email + "&password=" + password
  }).then(function(response) {
    return response.json().then(function(json) {
      callback(json.user, json.token);
    });
  });
}
