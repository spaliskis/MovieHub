const jwt = require("jsonwebtoken");
const generalHelperFunctions = require("../helper_functions/generalFunctions.js");

module.exports = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_KEY
    );
    req.userData = decoded;
    next();
    return 1;
  } catch (error) {
    return generalHelperFunctions.sendAuthFailedError401(res);
  }
};
