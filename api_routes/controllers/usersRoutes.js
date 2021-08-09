const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helperFunctions = require("../../helper_functions/usersFunctions.js");
const generalHelperFunctions = require("../../helper_functions/generalFunctions.js");
const validator = require("validator");
const checkAuth = require("../../helper_functions/check-auth.js");
const { movie } = require("./pagesRoutes.js");

exports.signup = async (req, res) => {
  try {
    const { username, email, profile_picture, password } = req.body;
    console.log(
      "POST /users/signup/ req.body (username, profile_picture, email, password): ",
      username,
      profile_picture,
      email,
      password
    );

    // Checks if email is valid
    if (!validator.isEmail(email))
      return generalHelperFunctions.sendAuthFailedError401(res);

    // Checks if user with this email or username doesn't exist already
    if (await helperFunctions.checkIfEmailExists(email))
      return res
        .status(404)
        .json({ message: "Account with such email is already registered" }); // Better pracitece is to change it to return generalHelperFunctions.sendAuthFailedError401(res);
    if (await helperFunctions.checkIfUsernameExists(username))
      return res
        .status(404)
        .json({ message: "Account with such username is already registered" }); // Better practice is to change it to return generalHelperFunctions.sendAuthFailedError401(res);

    // Insert user into the database
    if (await helperFunctions.insertUserIntoDatabase(username, email, profile_picture, password))
      return res
        .status(200)
        .json({ message: "Account successfully registered" });
    else
      return res.status(404).json({ message: "Account registration failed" });
  } catch (error) {
    console.error("Error in ./api_routes/usersRoutes.js: " + error.message);
    return res.status(404).json({ message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  
  const { email, password } = req.body;
  console.log(req.body);
  // Checks if email is valid
  if (!(await helperFunctions.checkIfEmailExists(email)))
    return generalHelperFunctions.sendAuthFailedError401(res);

  // Checks if password is valid
  await bcrypt
    .compare(password, await helperFunctions.getUserPassword(email))
    .then(function (result) {
      if (result) {
        // Create JWT token
        const token = jwt.sign(
          {
            email: email,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        // Return 200 and the JWT token
        return res
          .status(200)
          .cookie("jwt", token, {
            expires: new Date(Date.now() + 1 * 3600000),
            httpOnly: true,
          })
          .json({ success: true, token: "JWT " + token });
      } else return generalHelperFunctions.sendAuthFailedError401(res);
    });
};

exports.update = async(req, res) => {
  try {
    // Passes posted info into request's body
    const { username, email, profile_picture, password } = req.body;
    console.log(
      "UPDATE /users/update/ req.body (username, profile_picture, email, password): ",
      username,
      profile_picture,
      email,
      password
    );

    // Checks if email is valid
    if (!validator.isEmail(email))
      return generalHelperFunctions.sendAuthFailedError401(res);

    // Checks if user with this email or username doesn't exist already
    if (await helperFunctions.checkIfEmailExists(email))
      return res
        .status(404)
        .json({ message: "Account with such email is already registered" }); // Better pracitece is to change it to return generalHelperFunctions.sendAuthFailedError401(res);
    if (await helperFunctions.checkIfUsernameExists(username))
      return res
        .status(404)
        .json({ message: "Account with such username is already registered" }); // Better practice is to change it to return generalHelperFunctions.sendAuthFailedError401(res);

    // Update user data
    if (await helperFunctions.alterUserData(username, email, profile_picture, password)){
      const token = jwt.sign(
        {
          email: email,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      // Return 200 and the JWT token
      return res
      .status(200)
      .cookie("jwt", token, {
        expires: new Date(Date.now() + 1 * 3600000),
        httpOnly: true,
      })
      .json({ message: "Account successfully updated" });
    }
    else
      return res.status(404).json({ message: "Account update failed" });
  } catch (error) {
    console.error("Error in ./api_routes/usersRoutes.js: " + error.message);
    return res.status(404).json({ message: "Something went wrong" });
  }
}

exports.delete = async(req, res, next) => {  
    try {
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_KEY);
      console.log(decoded.email);
      if(await helperFunctions.deleteUser(decoded.email)){
        res.cookie('jwt', '', { maxAge: 1 });
        return res.status(200).json({ message: "Account successfully deleted" });
      }
      else{
        return res.status(404).json({ message: "Couldn't delete the user" });
      }
  } catch (error) {
    console.log(error);
  }

}

exports.logout = async (req, res) => {
  // Deletes user's jwt cookie from browser by setting it to a null string and it's duration to 1ms, thus logging out the user
  try{
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }
  catch(err){
    console.error("Something went wrong while trying to log out: " + err.message);
  }
}


exports.comment = async (req, res) => {
  try {
    const { movie_id, username, content, profile_picture, date_added, likes, rating } = req.body;
    console.log(
      "POST /users/comment/ req.body (movie_id, username, content, profile_picture, date_added, likes, rating): ",
      movie_id,
      username, 
      content, 
      profile_picture,
      date_added,
      likes,
      rating
    );

    if (await helperFunctions.postComment(movie_id, username, content, profile_picture, date_added, likes, rating))
    return res
      .status(200)
      .json({ message: "Comment posted" });
  else
    return res.status(404).json({ message: "Something went wrong while trying to post the comment" });
  } catch (error) {
    console.error(error.message);
  }
}

exports.like = async (req, res) => {
  try {
    const { id, likes, user } = req.body;
    console.log(
      "POST /users/like req.body (id, likes, user): ",
      id,
      likes,
      user
    );

    if (await helperFunctions.likeComment(id, likes, user))
    return res
      .status(200)
      .json({ message: "Comment liked" });
  else
    return res.status(404).json({ message: "Something went wrong while trying to like the comment" });
  } catch (error) {
    
  }
}
