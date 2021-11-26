"use strict";
const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversation-controller");

router.route("/").post(conversationController.postConversation);
router
  .route("/:conversationId")
  .get(conversationController.getConversationById);
router
  .route("/:conversationId/dateLastMessage")
  .put(conversationController.updateDateLastMessage);
router.route("/conversations").post(conversationController.getConversations);
module.exports = router;
