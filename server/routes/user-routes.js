"use strict";
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router.route("/:username/friends").get(userController.getFriends);
router.route("/:username/friends").put(userController.addFriend);
router.route("/:username/conversations").put(userController.addConversation);
router.route("/:username/conversations").get(userController.getConversations);
router
  .route("/users/conversations/multiple")
  .put(userController.addUsersConversations);
router.route("/:username").get(userController.getUser);
router.route("/").post(userController.postUser);
module.exports = router;
