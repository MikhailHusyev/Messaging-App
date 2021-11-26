const validationService = require("../services/validation-service");
const { StatusCodes } = require("http-status-codes");

// Verify JWT token
module.exports = function (req, res, next) {
  let token = req.header("auth-token");
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized Access." });
  }
  let isValid = validationService.validateToken(token);
  if (isValid) {
    req.user = token;
    next();
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized Access." });
  }
};
