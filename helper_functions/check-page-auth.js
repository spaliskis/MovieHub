const jwt = require("jsonwebtoken");
const generalHelperFunctions = require("../helper_functions/generalFunctions.js");

module.exports = (req) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_KEY);
    req.userData = decoded;
    return 1;
  } catch (error) {
    return 0;
  }
};
