const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
const bcrypt = require("bcryptjs");

const User = Schema({
  id: {
    type: ObjectId,
  },
  user_name: {
    type: String,
    required: [true, "Please enter a user name."],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 6,
  },
  friends: [{ type: String }],
  conversations: [{ type: ObjectId }],
});

// Encrypt and hash password
User.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Retrieve user compare password
User.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", User);
