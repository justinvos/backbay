console.log("test");
//ReactDOM.render(<div>Hello World</div>, document.getElementById('container'));

function clickLogin(callback) {
  var email = "justinvosnz@gmail.com";
  var password = "pokemon";

  fetch("/sessions", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: "email=" + email + "&password=" + password
  }).then(function(response) {
    return response.json().then(function(json) {
      callback(json);
    });
  });
}
