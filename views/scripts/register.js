console.log("test");
//ReactDOM.render(<div>Hello World</div>, document.getElementById('container'));

function clickRegister() {
  var email = document.getElementById("emailInput").value;
  var password = document.getElementById("passwordInput").value;

  register(email, password, function() {
    window.location = "/";
  });
}

function register(email, password, callback) {
  fetch("/users", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: "email=" + email + "&password=" + password
  }).then(function(response) {
    return response.json().then(function(json) {
      callback();
    });
  });
}
