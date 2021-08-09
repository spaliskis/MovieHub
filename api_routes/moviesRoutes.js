const express = require("express");
const router = express.Router();

const moviesRoutesController = require("./controllers/moviesRoutes");

router.get("/most-popular-movies", moviesRoutesController.most_popular_movies);
router.get("/search-movies", moviesRoutesController.search_movies);
router.get("/categories", moviesRoutesController.categories);

module.exports = router;
