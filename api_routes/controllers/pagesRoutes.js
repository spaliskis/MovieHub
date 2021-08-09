// To connect to the database
const pool = require("../../db");
const checkPageAuth = require("../../helper_functions/check-page-auth.js");

exports.home = async (req, res) => {
  const query = await pool.query(
    `SELECT * FROM public.movietable WHERE show_id BETWEEN 1 and 9`
  );

  var images = null;
  try {
    images = [];
    for(var row of query.rows){
      var imagesarr = row.images.split(', ');
      console.log(imagesarr);
      image = imagesarr[1];
      images.push(image);
    }
    // images = images.shift();
  } catch (error) {
    console.error("Images list for this movie is empty: " + error.message);
  }
  var isImgNull= false;
  if(images == null) {
    isImgNull = true;
    console.log(isImgNull);
  }
  console.log(images);

  if (checkPageAuth(req)){   
    console.log(req.userData)
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    res.render("index", {
      css: ["style.css"],
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
      data: query.rows,
      images: images
    });
  }
  else
    res.render("index", {
      css: ["style.css"],
      data: query.rows,
      images: images
    });
};

exports.aboutus = async (req, res) => {
  if (checkPageAuth(req)){
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    res.render("aboutus", {
      css: ["style.css", "AboutUsPageStyle.css"],
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
    });
  }
  else
    res.render("aboutus", {
      css: ["style.css", "AboutUsPageStyle.css"],
    });
};

exports.mostpopular = async (req, res) => {
  const queryResponse = await pool.query(
    `SELECT * FROM public.movietable ORDER BY audrating DESC LIMIT 10`
  );
  if (checkPageAuth(req)) {
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);

    res.render("mostpopular", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["mostPopularJS.js"],
      data: queryResponse.rows,
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
    });
  } else {
    res.render("mostpopular", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["mostPopularJS.js"],
      data: queryResponse.rows,
    });
  }
};

exports.movie = async (req, res) => {
  console.log("Movie id: " + req.params.id);
  const query = await pool.query(
    `SELECT * FROM public.movietable WHERE show_id = $1`,
    [req.params.id]
  );

  const commentsQuery = await pool.query(
    `SELECT * FROM public.comments WHERE movie_id = $1 ORDER BY id`,
    [req.params.id]
  );

  

  // Calculating the rating of a movie
  var ratingSum = 0;
  var ratingCount = 0;
  var ratingAvg = 0;
  if(commentsQuery.rows.length != 0){
    commentsQuery.rows.forEach(element => {
      ratingSum += element.rating;
      ratingCount++;
    });
    ratingAvg = Math.round(ratingSum / ratingCount * 100) / 100 ;
  }
  const ratingQuery = await pool.query(
    'UPDATE movietable SET audrating = $1 WHERE show_id = $2',
      [ratingAvg, req.params.id]
  );
  

  var actors;
  try {
    actors = query.rows[0].movie_cast.split(', ');
  } catch (error) {
    console.error("Actors list for this movie is empty: " + error.message);
  }

  var images = null;
  try {
    images = query.rows[0].images.split(', ');
    images.splice(0,1);
    // images = images.shift();
  } catch (error) {
    console.error("Images list for this movie is empty: " + error.message);
  }
  var isImgNull= false;
  if(images == null) {
    isImgNull = true;
    console.log(isImgNull);
  }
  // Checking if there are any comments posted
  var areThereComments = false;
  if(commentsQuery.rows.length != 0)
    areThereComments = true;  
  
  if (checkPageAuth(req)){
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    // Creating a variable for displaying the comment div only when a user is logged in
    var loggedIn = true;
    // Checking if a user has already liked a comment
    commentsQuery.rows.forEach(element => {
      var isLiked = element.likes_users !== null && element.likes_users.includes(user);
      element.liked = isLiked;
    });
    res.render("movie", {
      css: ["movieStyle.css"],
      js: ["moviePage.js"],
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
      data: query.rows[0],
      actors: actors,
      loggedIn: loggedIn,
      comments: commentsQuery.rows,
      areThereComments: areThereComments,
      ratingAvg: ratingAvg,
      ratingCount: ratingCount,
      images: images,
      isImgNull: isImgNull
    });
  }
  else
    res.render("movie", {
      css: ["movieStyle.css"],
      js: ["moviePage.js"],
      data: query.rows[0],
      actors: actors,
      comments: commentsQuery.rows,
      areThereComments: areThereComments,
      ratingAvg: ratingAvg,
      ratingCount: ratingCount,
      images: images,
      isImgNull: isImgNull
    });
};

exports.signin = async (req, res) => {
  if (checkPageAuth(req)){
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    res.render("signin", {
      css: ["SignInPageStyle.css"],
      js: ["signinPage.js"],
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
    });
  }
  else
    res.render("signin", {
      css: ["SignInPageStyle.css"],
      js: ["signinPage.js"],
    });
};

exports.signup = (req, res) =>
  res.render("signup", {
    css: ["SignUpPageStyle.css"],
    js: ["signupPage.js"],
  });

exports.user = async (req, res) => {
  if (checkPageAuth(req)){
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    res.render("user", {
      css: ["User.css"],
      js: ["userPage.js"],
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
    });
  }
  else
    res.render("user", {
      css: ["User.css"],
    });
};

exports.search = async (req, res) => {
  if (checkPageAuth(req)) {
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE title iLIKE $1 ORDER BY title ASC`,
      ["%" + req.query.query + "%"]
    );

    res.render("search", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["searchPage.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
    });
  } else {
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE title iLIKE $1 ORDER BY title ASC`,
      ["%" + req.query.query + "%"]
    );
    res.render("search", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["searchPage.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
    });
  }
};

// Returns logged in user's profile picture's file name
async function profilePic(email){
  const queryPicture = await pool.query(
    `SELECT profile_picture FROM public.users WHERE email = $1`,
    [email]
  );
  return queryPicture.rows[0].profile_picture;
}

// Returns logged in user's username
async function username(email){
  const username = await pool.query(
    `SELECT username FROM public.users WHERE email = $1`,
    [email]
  );
  return username.rows[0].username;
}

exports.comedy = async (req, res) => {
  if (checkPageAuth(req)) {
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%comedy%' ORDER BY title ASC`
    );

    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
    });
  } else {
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%comedy%' ORDER BY title ASC`
    );
    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
    });
  }
};

exports.horror = async (req, res) => {
  if (checkPageAuth(req)) {
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%horror%' ORDER BY title ASC`
    );

    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
    });
  } else {
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%horror%' ORDER BY title ASC`
    );
    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
    });
  }
};

exports.drama = async (req, res) => {
  if (checkPageAuth(req)) {
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%drama%' ORDER BY title ASC`
    );

    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
    });
  } else {
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%drama%' ORDER BY title ASC`
    );
    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
    });
  }
};

exports.romantic = async (req, res) => {
  if (checkPageAuth(req)) {
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%romantic%' ORDER BY title ASC`
    );

    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
    });
  } else {
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%romantic%' ORDER BY title ASC`
    );
    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
    });
  }
};

exports.fantasy = async (req, res) => {
  if (checkPageAuth(req)) {
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%fantasy%' ORDER BY title ASC`
    );

    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
    });
  } else {
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%fantasy%' ORDER BY title ASC`
    );
    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
    });
  }
};

exports.documentary = async (req, res) => {
  if (checkPageAuth(req)) {
    const picture = await profilePic(req.userData.email);
    const user = await username(req.userData.email);
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%documentary%' ORDER BY title ASC`
    );

    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
      layout: "mainLoggedIn",
      profile_picture: picture,
      username: user,
    });
  } else {
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE '%documentary%' ORDER BY title ASC`
    );
    res.render("categories", {
      css: ["style.css", "MostPopularPageStyle.css"],
      js: ["categories.js"],
      data: queryResponse.rows.slice(0, 10),
      queryCount: queryResponse.rows.length,
      query: req.query.query,
    });
  }
};
