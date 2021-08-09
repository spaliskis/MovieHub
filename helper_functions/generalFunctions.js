function sendResError500(res, err) {
  res.status(500).json({
    error: err,
  });
}

function sendAuthFailedError401(res) {
  res.status(401).json({
    message: "Auth failed",
  });
}

function sendAuthSuccessful200(res, token) {
  res.status(200).json({
    message: "Auth successful",
    token: token,
  });
}

module.exports = {
  sendResError500,
  sendAuthFailedError401,
  sendAuthSuccessful200,
};
