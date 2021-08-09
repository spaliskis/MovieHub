const express = require("express");
const router = express.Router();
const app = express();
const cors = require("cors");
const path = require("path");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
require("dotenv").config(); // Gets ENV variables (PORT, JWT secret key etc.) from the .env file

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------- API Routes ----------------------------------------- //

// --------- Routes related to getting info about movies (e.g., /most-popular-movies) -- //
const movies = require("./api_routes/moviesRoutes");
app.use("/movies", movies);

// --------- Routes related to get pages using handlebars ------------------------------ //
// Handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    layoutsDir: __dirname + "/views/layouts",
    defaultLayout: "main",
  })
);
app.use(express.static("public"));
app.set("view engine", "handlebars");

const pages = require("./api_routes/pagesRoutes");
app.use("/", pages);

// --------- Routes related to user signup and signin ---------------------------------- //
const users = require("./api_routes/usersRoutes");
app.use("/users", users);

// --------- Routes for error handling and unmanaged routes ---------------------------- //
// Whenever there is no route defined this function takes care of it, creates and error and passes it
// with the next function to the error handling function below which then sends the error as a HTTP response
app.use((req, res, next) => {
  const error = new Error("URL not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// ------------------------------------- Starting the server ------------------------------------ //
app.listen(process.env.PORT, () => {
  console.log(`index.js app listening at http://localhost:${process.env.PORT}`);
});

module.exports = app;
