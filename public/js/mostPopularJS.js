async function onPageLoad() {
  //declaring the initial url
  var url = new URL("http://localhost:3000/movies/most-popular-movies");
  //declaring the url params
  var params = { from: 16, to: 17 };
  //adding those params to the url because for some reason fetch doesn't have an inbuilt params taker
  url.search = new URLSearchParams(params).toString();
  console.log("url: ", url);
  fetch(url)
    .then((response) => response.json())
    .then((movies) => showMovies(movies));
}

showMovies = (movies) => {
  const rowDiv = document.getElementsByClassName(
    "row justify-content-between"
  )[0];
  movies.forEach((movie) => {
    var newArticle = document.createElement("ARTICLE");
    newArticle.className = "card col-md-4 col-xs-6 card-color";
    rowDiv.appendChild(newArticle);

    var newImage = document.createElement("IMG");
    newImage.className = "card-img-top image";
    newImage.setAttribute("src", "../images/movie_stock.jpg");
    newImage.setAttribute("alt", "Movie Image");
    newArticle.appendChild(newImage);

    var newDiv = document.createElement("div");
    newDiv.className = "card-body";

    var cardTitle = document.createElement("h2");
    cardTitle.className = "card-title";
    cardTitle.innerText = movie.title;
    newDiv.appendChild(cardTitle);

    var cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.innerText = movie.description;
    newDiv.appendChild(cardText);

    var score = document.createElement("p");
    score.className = "score";
    score.innerText = "★★★☆☆";
    newDiv.appendChild(score);

    var cardText2 = document.createElement("p");
    cardText2.className = "card-text";
    cardText2.innerText = "Release year: " + movie.release_year;
    newDiv.appendChild(cardText2);

    var readMore = document.createElement("a");
    readMore.className = "btn btn-primary read-more-button";
    var path = "movie/" + movie.show_id
    readMore.setAttribute("href", path);
    readMore.innerText = "Read more";
    newDiv.appendChild(readMore);

    newArticle.appendChild(newDiv);
  });
};

