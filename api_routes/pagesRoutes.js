const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");

const pagesRoutesController = require("./controllers/pagesRoutes");

// Using body-parser middleware to extract the data from HTML form
//app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", pagesRoutesController.home);

// AboutUs page route
router.get("/aboutus", pagesRoutesController.aboutus);

// MostPopular page route
router.get("/mostpopular", pagesRoutesController.mostpopular);

// Movie page route
router.get("/movie/:id", pagesRoutesController.movie);

// SignIn page route
router.get("/signin", pagesRoutesController.signin);

// SignUp page route
router.get("/signup", pagesRoutesController.signup);

// User profile route
router.get("/user", pagesRoutesController.user);

// Search route
router.get("/search", pagesRoutesController.search);

// Categories routes
router.get("/comedy", pagesRoutesController.comedy);

router.get("/horror", pagesRoutesController.horror);

router.get("/drama", pagesRoutesController.drama);

router.get("/romantic", pagesRoutesController.romantic);

router.get("/fantasy", pagesRoutesController.fantasy);

router.get("/documentary", pagesRoutesController.documentary);

module.exports = router;
