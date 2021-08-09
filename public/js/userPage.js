document.getElementById("changeInfo").addEventListener("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    // Checks if both entered passwords match
    if(!(formData.get("password") == formData.get("rpassword"))){
        var updError = document.createElement("h6");
        updError.className = "d-inline text-center text-danger";
        updError.textContent = "Passwords don't match. Try again.";
        document.getElementById("buttons").appendChild(updError);
        return;
    }

    // Creating a JS object using posted data
    var formDataJSON = {
        email: formData.get("email"),
        username: formData.get("username"),
        profile_picture: "/images/" + formData.get("picture").name,
        password: formData.get("password")
      };

      // Posting the entered data to the /update route
      fetch("http://localhost:3000/users/update", { 
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
            console.log(data);
            document.getElementById("UpdateError").innerHTML =
              Object.values(data)[0];
          });
        }
      })
      .catch((error) => {
        console.error("Nepavyko:", error);
      });
});


document.getElementById("deactivate").addEventListener("click", async function (e) {
  e.preventDefault();

  // Deleting currently logged in user from the database by first accessing the /delete route
  fetch('http://localhost:3000/users/delete', {
  method: 'DELETE',
}).then(response => {
  if (response.status === 200) {
    window.location.href = "http://localhost:3000/";
  } else {
    response.json().then((data) => {
      console.log(data);
      document.getElementById("UpdateError").innerHTML =
        Object.values(data)[0];
    });
  }
})
.catch((error) => {
  console.error("Nepavyko:", error);
});
});

document.querySelector("#upload").onchange = function(){
  var label = document.createElement("label");
  label.textContent = this.files[0].name;
  document.querySelector(".button-wrap").appendChild(label);
  // document.querySelector("#fileLabel").textContent = this.files[0].name;
  document.querySelector("#profilePic").src = "/images/" + this.files[0].name;
}


