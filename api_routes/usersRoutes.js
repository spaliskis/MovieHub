const express = require("express");
const router = express.Router();
const checkAuth = require("../helper_functions/check-auth.js");

// To connect to the database
const pool = require("../db");

const usersRoutesController = require("./controllers/usersRoutes");

// Signup route
router.post("/signup", usersRoutesController.signup);

// Signin route
router.post("/login", usersRoutesController.login);

// Change user info route
router.post("/update", usersRoutesController.update);

// Delete user route
router.delete("/delete", usersRoutesController.delete);

// Log out route
router.get("/logout", usersRoutesController.logout);

// Comment route
router.post("/comment", usersRoutesController.comment);

// Like route
router.post("/like", usersRoutesController.like);

// Test route
router.get("/test", checkAuth, (req, res, next) => {
  res.send("auth success");
});

module.exports = router;
