const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

exports.validateToken = function (token) {
  try {
    jwt.verify(token, process.env.SECRET);
    return true;
  } catch (err) {
    return false;
  }
};

exports.checkIfUsernameTaken = async function (username) {
  let user = await User.findOne({ user_name: username });
  if (!user) {
    return false;
  }
  return true;
};
