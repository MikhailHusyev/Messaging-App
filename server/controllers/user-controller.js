"use strict";

const User = require("../models/user-model");
const Conversation = require("../models/conversation-model");
const validationService = require("../services/validation-service");
const { StatusCodes } = require("http-status-codes");
const moongse = require("mongoose");
const ObjectId = moongse.ObjectId;

//Get user based on username
exports.getUser = async function (req, res) {
  const {
    params: { username: username },
  } = req;
  let user = await User.findOne({ user_name: username }).catch((error) => {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found." });
  }
  return res.status(StatusCodes.OK).json(user);
};

// Create a new user
exports.postUser = async function (req, res) {
  //Extract data from request body
  let userReq = new User({
    user_name: req.body.username,
    password: req.body.password,
  });

  //Validate that name doesn't exist
  let userExist = await validationService.checkIfUsernameTaken(
    req.body.username
  );
  if (userExist) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "User already exists." });
  }

  //Save user if they don't exist
  await userReq.save(function (err, task) {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
    } else {
      return res.status(StatusCodes.CREATED).json(userReq);
    }
  });
};

// Add new friends to user
exports.addFriend = async function (req, res) {
  const {
    params: { username: username },
  } = req;
  let friend = req.body.friend;
  if (friend == null || username == null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid values." });
  }
  let currentUser = await User.findOne({ user_name: username });
  let currentFriend = await User.findOne({ user_name: friend });
  if (username == friend) {
    return res.status(StatusCodes.BAD_REQUEST).json();
  }
  if (currentFriend == null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid values." });
  }
  if (currentUser.friends.includes(friend)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "You're already friends." });
  }
  try {
    await User.updateOne(
      { user_name: username },
      { $push: { friends: friend } }
    );
    return res.status(StatusCodes.OK).json();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Add a conversation under the user to recieve new messages
exports.addConversation = async function (req, res) {
  const {
    params: { username: username },
  } = req;

  let conversationId = req.body.id;
  if (conversationId == null || username == null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid values." });
  }

  let currentUser = await User.findOne({ user_name: username });
  let currentConversation = await Conversation.findById(conversationId);
  if (currentUser == null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid values." });
  }
  if (currentConversation == null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid values." });
  }
  try {
    await User.updateOne(
      { user_name: username },
      { $push: { conversations: conversationId } }
    );
    return res.status(StatusCodes.OK).json();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

exports.getFriends = async function (req, res) {
  const {
    params: { username: username },
  } = req;
  let user = await User.findOne({ user_name: username }).catch((error) => {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  });
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Friends not found." });
  }
  return res.status(StatusCodes.OK).json({ friends: user.friends });
};

exports.getConversations = async function (req, res, next) {
  const {
    params: { username: username },
  } = req;
  let conversations = await User.findOne({ user_name: username }).catch(
    (error) => {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  );
  return res
    .status(StatusCodes.OK)
    .json({ conversations: conversations.conversations });
};

exports.addUsersConversations = async function (req, res) {
  let conversationId = req.body.conversationId;
  let users = req.body.users;
  await User.updateMany(
    { user_name: { $in: users } },
    { $push: { conversations: conversationId } }
  ).catch((error) => {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  });
  return res.status(StatusCodes.OK).json();
};
