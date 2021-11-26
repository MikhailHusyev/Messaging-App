"use strict";
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message-controller");

router.route("/").post(messageController.postMessage);
router.route("/:conversationId").get(messageController.getByConversationId);
module.exports = router;
