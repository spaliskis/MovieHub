document.getElementById("signInForm").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("siginjs");

  var formData = new FormData(this);
  var formDataJSON = {
    email: formData.get("email"),
    password: formData.get("password"),
    
  };

  fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataJSON),
  })
    .then((response) => {
      if (response.status === 200) {
        window.location.href = "http://localhost:3000/";
      } else {
        response.json().then((data) => {
          document.getElementById("LoginError").innerHTML =
            "Invalid login credentials. Try again.";
        });
      }
    })
    .catch((error) => {
      console.error("Nepavyko:", error);
    });
});
