const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const validationService = require("../services/validation-service");
const userController = require("./user-controller");

// Logs User in
exports.login = async (req, res) => {
  //Validate if user exists
  let user = await User.findOne({ user_name: req.body.username });
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Email or password is incorrect." });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Email or password is incorrect." });
  }

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.SECRET);
  let resultUser = { user_name: user.user_name, id: user._id, token: token };
  res.header("auth-token", token).json(resultUser).send();
};

//Registers User
exports.register = async (req, res) => {
  return userController.postUser(req, res);
};

// Validates if user is authenticated and is using a valid token
exports.validateToken = async (req, res) => {
  let token = req.header("auth-token");
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid Token." });
  }
  let isValid = validationService.validateToken(token);
  if (isValid) {
    return res.status(StatusCodes.OK).send();
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid Token." });
  }
};
