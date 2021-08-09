//to connect to the database
const pool = require("../db");
const bcrypt = require("bcrypt");

async function checkIfUsernameExists(username) {
  const userExists = await pool.query(
    `SELECT id FROM "users" WHERE username= $1`,
    [username]
  );
  if (userExists.rowCount >= 1) return 1;
  else return 0;
}

async function checkIfEmailExists(email) {
  const userExists = await pool.query(
    `SELECT id FROM "users" WHERE email= $1`,
    [email]
  );
  if (userExists.rowCount >= 1) return 1;
  else return 0;
}

async function insertUserIntoDatabase(username, email, profile_picture, password) {
  //checks if the password is not undefined or empty spaces
  if (password === undefined || !password.trim()) return 0;
  //hash password
  await bcrypt.hash(password, 10).then(function (hash) {
    password = hash;
  });

  try {
    const queryStatus = await pool.query(
      `INSERT INTO "users" (username, email, profile_picture, password) VALUES ($1, $2, $3, $4)`,
      [username, email, profile_picture, password]
    );
    return 1;
  } catch (err) {
    console.log("Error at ./helper_functions/usersFunctions.insertUserIntoDatabase", err.stack);
    return 0;
  }
}

async function alterUserData(username, email, profile_picture, password){
    //checks if the password is not undefined or empty spaces
    if (password === undefined || !password.trim()) return 0;
    //hash password
    await bcrypt.hash(password, 10).then(function (hash) {
      password = hash;
    });
  try {
    const query = await pool.query(
      'UPDATE users SET username = $1, email = $2, profile_picture = $3, password = $4',
      [username, email, profile_picture, password]
    );
    return 1;
  } catch (err) {
    console.log("Error at ./helper_functions/usersFunctions.alterUserData", err.stack);
    return 0;
  }
}

async function getUserPassword(email) {
  const pass = await pool.query(
    `SELECT password FROM "users" WHERE email= $1`,
    [email]
  );
  return pass.rows[0].password;
}

async function deleteUser(email) {
  try {
    const query = await pool.query(
      'DELETE FROM users WHERE email = $1',
      [email]
    );
    return 1;
  } catch (err) {
    console.log("Couldn't delete user: ", err.stack)
    return 0;
  }
}

async function postComment(movie_id, username, content, profile_picture, date_added, likes, rating){
  try {
    const query = await pool.query(
      `INSERT INTO "comments" (movie_id, username, content, profile_picture, date_added, likes, rating) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [movie_id, username, content, profile_picture, date_added, likes, rating]
    );
    return 1;
  } catch (error) {
    console.log("Error at ./helper_functions/usersFunctions.postComment", error.stack);
    return 0;
  }
}

async function likeComment(id, likes, user){
  try {
    console.log(user);
    // Setting the like count and concatenating usernames of users that have liked the comment
    const query = await pool.query(
      `UPDATE comments SET likes = $1, likes_users = CONCAT(likes_users, $2::text, ',') WHERE id = $3`,
      [likes, user, id]
    );
    return 1;
  } catch (error) {
    console.log("Error at ./helper_functions/usersFunctions.likeComment", error.stack);
    return 0;
  }
}

module.exports = {
  checkIfUsernameExists,
  checkIfEmailExists,
  insertUserIntoDatabase,
  getUserPassword,
  alterUserData,
  deleteUser,
  postComment,
  likeComment
};
