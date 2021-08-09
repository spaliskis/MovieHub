const current = document.querySelector('#current');
const imgs = document.querySelector('.imgs');
const img = document.querySelectorAll('.imgs img');
const opacity = 0.6;
const filter = "grayscale(100%)";
const transform = "scale(1.1)";
const border = "4px solid white"

document.getElementById("defaultOpen").click();

img[0].style.filter = filter;
img[0].style.border = border;


imgs.addEventListener('click', imgClick);

function imgClick(e) {
    img.forEach(img => (img.style.filter = "none"));
    img.forEach(img => (img.style.border = "none"));

    current.src = e.target.src;

    current.classList.add('fade-in');

    setTimeout(() => current.classList.remove('fade-in'), 1000);

    e.target.style.filter = filter;
    e.target.style.border = border;
}



function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}



try {
    var max = 1000;
    document.getElementById('symCount').innerHTML = max;
    document.querySelector('textarea').onkeyup = function() {
        document.getElementById('symCount').innerHTML = (1000 - this.value.length);
    };


    document.getElementById('starRating').addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() != 'span') return;

        if (event.target.classList.contains('upstar-rated')) {
            event.target.classList.remove('upstar-rated');
        } else {
            Array.prototype.forEach.call(document.getElementsByClassName('upstar-rated'), function(el) {
                el.classList.remove('upstar-rated');
            });
            event.target.classList.add('upstar-rated');
        }
    });


    function myFunction(x) {
        if(!(x.classList.contains("unclickable"))){
            x.classList.toggle("fa-thumbs-up");
            x.classList.toggle("fa-thumbs-down");
        }
    }


    // Comment function
    document.getElementById("commentForm").addEventListener("submit", function(e) {
        e.preventDefault();

        var formData = new FormData(this);
        // Getting the movie ID from the URL
        var movieIdArr = window.location.href.split("/");
        var movieId = movieIdArr[movieIdArr.length - 1];
        // Getting the profile picture path
        var imgPath = document.querySelector("#userPic").textContent;
        
        // Getting the rating
        var rating;
        try {
            rating = document.getElementsByClassName("upstar-rated")[0].getAttribute("title");
        } catch (error) {
            rating = 0;
        }
        // Creating a JS object using posted data
        var formDataJSON = {
            movie_id: movieId,
            content: formData.get("content"),
            username: document.querySelector("#comUser").textContent,
            profile_picture: imgPath,
            date_added: new Date().toLocaleString('en-GB'),
            likes: 0,
            rating: rating
        };

        // Posting the comment
        fetch('http://localhost:3000/users/comment', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataJSON),
            }).then((response) => {
                if (response.status === 200) {
                    location.reload();
                } else {
                    response.json().then((data) => {
                        console.log(data);
                        document.getElementById("CommentError").innerHTML =
                            Object.values(data)[0];
                    });
                }
            })
            .catch((error) => {
                console.error("Nepavyko:", error);
            });

    });

    // Like function
    var likeButtons = document.getElementsByClassName('fa-thumbs-up');
    // Creating a boolean array for checking whether if a button should like or dislike a comment
    var clicks = new Array();
    for (var index = 0; index < likeButtons.length; index++) {
        clicks.push(true);
        // Checking if a comment was already liked by the user or not
        if (likeButtons[index].classList.contains("unclickable")) continue;
        (function(index){
            likeButtons[index].addEventListener("click", function() {
                console.log(this);
                
                // Incrementing the like count
                if (clicks[index] == true) {
                    console.log(clicks[index])
                    var likeCount = parseInt(document.getElementsByClassName('likeCount')[index].textContent);
                    likeCount++;
                    document.getElementsByClassName('likeCount')[index].textContent = likeCount;
                    console.log(likeCount)
                    clicks[index] = false;
                    console.log(clicks[index])
                
                // Decrementing the like count
                } else if (clicks[index] == false) {
                    console.log(clicks[index])
                    var likeCount = parseInt(document.getElementsByClassName('likeCount')[index].textContent);
                    likeCount--;
                    document.getElementsByClassName('likeCount')[index].textContent = likeCount;
                    console.log(likeCount)
                    clicks[index] = true;
                    console.log(clicks[index])
                }

                // Posting the like count to the database
                fetch('http://localhost:3000/users/like', {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: document.querySelectorAll(".likeCount")[index].getAttribute('data-id'),
                        likes: document.getElementsByClassName('likeCount')[index].textContent,
                        user: document.querySelector("#comUser").textContent
                    }),
                }).then((response) => {
                    if (response.status === 200) {
                        // location.reload();
                        console.log("Like successfuly posted");
                    } else {
                        response.json().then((data) => {
                            console.log(data);
                            document.getElementById("CommentError").innerHTML =
                                Object.values(data)[0];
                        });
                    }
                })
                .catch((error) => {
                    console.error("Nepavyko:", error);
                });
            });
        }(index));



    }
}
 catch (error) {
    console.log("User is not logged in: " + error.message);
}

var likes = document.getElementsByClassName("likeCount");
var plus = document.getElementsByClassName("plusSign");
for (var i = 0; i < likes.length; i++) {
    if (likes[i].textContent > 0) {
        plus[i].style = "display: inline;"
    }
}

// Displaying comment's rating
var ratings = document.getElementsByClassName("rating");
for(var rating of ratings){
    var ratingNum = rating.getAttribute("rating");
    for(var i = 0; i < 5; i++){
        if(i < ratingNum)
            rating.innerHTML += "<span class='star'>★</span>";
        else
            rating.innerHTML += "<span class='star'>☆</span>"
    }
};

