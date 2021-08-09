const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "wie123",
  host: "localhost",
  port: 5432,
  database: "WIEProject",
});

module.exports = pool;
