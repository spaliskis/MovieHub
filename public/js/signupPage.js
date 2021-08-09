document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  var formData = new FormData(this);
  var formDataJSON = {
    username: formData.get("username"),
    email: formData.get("email"),
    profile_picture: "/images/" + formData.get("profile_picture").name,
    password: formData.get("password"),
  };


  fetch("http://localhost:3000/users/signup", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataJSON),
  })
    .then((response) => {
      if (response.status === 200) {
        document.getElementById("registerButton").remove();
        document.getElementById("hr-or").remove();
        document.getElementById(
          "AccountSuccessfullyRegisteredMessage"
        ).innerHTML = "Account successfully created. Press to signup";
        document.getElementById("AccountRegistrationError").innerHTML = "";
      } else {
        response.json().then((data) => {
          document.getElementById("AccountRegistrationError").innerHTML =
            data.message;
        });
      }
    })
    .catch((error) => {
      console.error("Nepavyko:", error);
    });
});

document.querySelector("#fileInput").onchange = function(){
  document.querySelector(".custom-file-label").textContent = this.files[0].name;
}
