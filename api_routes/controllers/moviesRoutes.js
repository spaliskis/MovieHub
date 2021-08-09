//to connect to the database
const pool = require("../../db");

exports.most_popular_movies = async (req, res) => {
  try {
    var filter = [req.query.from, req.query.to];
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE show_id BETWEEN 10 AND 20`
    );
    res.json(queryResponse.rows);
  } catch (error) {}
};

exports.search_movies = async (req, res) => {
  try {
    var filter = ["%" + req.query.query + "%", req.query.count];
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE title iLIKE $1 ORDER BY title ASC LIMIT 10 OFFSET $2`, filter
    );
    res.json(queryResponse.rows);
  } catch (error) {}
};

exports.categories = async (req, res) => {
  try {
    var filter = ["%" + req.query.category + "%", req.query.count];
    const queryResponse = await pool.query(
      `SELECT * FROM public.movietable WHERE listed_in iLIKE $1 ORDER BY title ASC LIMIT 10 OFFSET $2`, filter
    );
    res.json(queryResponse.rows);
  } catch (error) {}
};






